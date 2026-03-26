import { NextRequest, NextResponse } from "next/server";
import { supabase, Resource } from "@/lib/supabase";
import { classifySearchQuery, VALID_CATEGORIES } from "@/lib/ai";

const AI_TIMEOUT_MS = 10_000;

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 10 requests per minute per IP.
// Resets automatically — entries older than 60s are cleaned on each request.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Drop entries outside the 60-second window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitMap.set(ip, recent);

  return recent.length > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// Crisis keyword detection — checked BEFORE calling Claude to respond instantly
// and avoid spending API tokens. Phrases are lowercased for case-insensitive
// matching. Covers suicidal ideation, self-harm, domestic violence, and abuse.
// ---------------------------------------------------------------------------
const CRISIS_PHRASES = [
  // Suicidal ideation
  "kill myself",
  "want to die",
  "suicide",
  "suicidal",
  "end my life",
  "end it all",
  "don't want to live",
  "dont want to live",
  "no reason to live",
  "rather be dead",
  "better off dead",
  "wish i was dead",
  "wish i were dead",
  "take my own life",
  "thinking about ending",
  "planning to end",
  "going to end it",
  // Self-harm
  "hurt myself",
  "self harm",
  "self-harm",
  "cutting myself",
  "harming myself",
  // Abuse and violence
  "being abused",
  "being beaten",
  "domestic violence",
  "partner is hurting me",
  "husband is hitting",
  "wife is hitting",
  "someone is hurting me",
  "afraid for my life",
  "he hit me",
  "she hit me",
  "threatened to kill",
  // Give up / hopelessness
  "give up on life",
  "can't go on",
  "cant go on",
  "no way out",
  "i can't take it anymore",
  "i cant take it anymore",
  "nobody cares",
  "no one cares",
  "what's the point",
  "whats the point",
  // Child safety
  "child abuse",
  "hurting my child",
  "hurting a child",
];

/** Check whether a query contains crisis language (case-insensitive) */
function detectCrisis(query: string): boolean {
  const lower = query.toLowerCase();
  return CRISIS_PHRASES.some((phrase) => lower.includes(phrase));
}

/** Static crisis response — no DB query or API call needed */
const CRISIS_RESPONSE = {
  crisis: true,
  summary:
    "If you're in crisis or having thoughts of suicide, please reach out — you're not alone. Help is available right now.",
  resources: [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "Call or text 988, available 24/7",
    },
    {
      name: "Crisis Text Line",
      phone: null,
      description: "Text HOME to 741741",
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "24/7 confidential support",
    },
    {
      name: "Emergency Services",
      phone: "911",
      description: "If you are in immediate danger",
    },
  ],
};

// ---------------------------------------------------------------------------
// Fallback: if the AI fails, do a basic text search across all resources
// ---------------------------------------------------------------------------
async function fallbackSearch(query: string): Promise<Resource[]> {
  // Search resource names and descriptions for any matching keywords
  const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (!data) return [];

  // Simple client-side keyword matching as a fallback
  return (data as Resource[]).filter((r) => {
    const text = `${r.name} ${r.description} ${r.tags?.join(" ") ?? ""}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}

// ---------------------------------------------------------------------------
// POST /api/search — AI-powered resource search
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  // Parse and validate request body
  let body: { query?: string; latitude?: number; longitude?: number; useAI?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  // Crisis detection — respond immediately without calling the AI
  if (detectCrisis(query)) {
    return NextResponse.json(CRISIS_RESPONSE);
  }

  // Direct Supabase text search when AI is toggled off
  if (body.useAI === false) {
    const resources = await fallbackSearch(query);
    return NextResponse.json({
      summary: null,
      resources,
      secondary_category: null,
      confidence: 0,
    });
  }

  // Build location context if the user shared their position
  const userLocation =
    body.latitude != null && body.longitude != null
      ? { lat: body.latitude, lon: body.longitude }
      : undefined;

  // Current time for hours reasoning (Central Time for Springfield, MO)
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  try {
    const aiResult = await Promise.race([
      classifySearchQuery(query, currentTime, userLocation),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI search timed out")), AI_TIMEOUT_MS)
      ),
    ]);

    // Fetch resources from the matched category
    let resources: Resource[] = [];
    let secondaryCategoryInfo: { name: string; slug: string } | null = null;

    if (
      aiResult.matched_category &&
      VALID_CATEGORIES.includes(aiResult.matched_category)
    ) {
      // Look up the category to get its ID
      const { data: category } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", aiResult.matched_category)
        .single();

      if (category) {
        const { data: resourceData } = await supabase
          .from("resources")
          .select("*")
          .eq("category_id", category.id)
          .eq("is_active", true)
          .order("name");

        resources = (resourceData as Resource[]) ?? [];
      }
    }

    // Look up secondary category info if one was suggested
    if (
      aiResult.secondary_category &&
      VALID_CATEGORIES.includes(aiResult.secondary_category)
    ) {
      const { data: secCat } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("slug", aiResult.secondary_category)
        .single();

      if (secCat) {
        secondaryCategoryInfo = secCat as { name: string; slug: string };
      }
    }

    return NextResponse.json({
      summary: aiResult.summary,
      resources,
      secondary_category: secondaryCategoryInfo,
      confidence: aiResult.confidence,
    });
  } catch (error) {
    // AI failed — fall back to keyword search across all resources
    if (error instanceof Error && error.message === "AI search timed out") {
      console.warn("AI search timed out, using fallback search");
    } else {
      console.error("AI search failed, falling back to text search:", error);
    }
    const resources = await fallbackSearch(query);

    return NextResponse.json({
      summary:
        resources.length > 0
          ? "Here are some resources that might help. You can also call 211 for personalized assistance."
          : "We couldn't find an exact match. Try browsing by category, or call 211 for personalized help.",
      resources,
      secondary_category: null,
      confidence: 0,
    });
  }
}
