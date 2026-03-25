import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase, Resource } from "@/lib/supabase";

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
// Valid category slugs the AI is allowed to return
// ---------------------------------------------------------------------------
const VALID_CATEGORIES = [
  "food-assistance",
  "housing-shelter",
  "utility-bill-help",
  "transportation",
];

// ---------------------------------------------------------------------------
// Build the system prompt that turns Claude into a compassionate resource
// navigator. Current date/time is injected so it can reason about hours.
// ---------------------------------------------------------------------------
function buildSystemPrompt(
  currentTime: string,
  userLocation?: { lat: number; lon: number }
): string {
  let prompt = `You are a compassionate community resource navigator for Springfield, Missouri.
Imagine you are a kind librarian helping someone who just walked in stressed and needs guidance.

Your job is to understand what the person needs and match their request to the most relevant category of local resources.

Available categories:
- "food-assistance" — food banks, pantries, free meals, SNAP help
- "housing-shelter" — shelters, transitional housing, rent assistance, domestic violence safe houses
- "utility-bill-help" — electric, gas, water bill assistance, weatherization
- "transportation" — bus passes, ride programs, gas vouchers, car repair help

Current date and time: ${currentTime}
Use this to reason about whether services might currently be open or closed.`;

  if (userLocation) {
    prompt += `\n\nThe user's current location: latitude ${userLocation.lat}, longitude ${userLocation.lon} (Springfield, MO area).`;
  }

  prompt += `

Respond with ONLY valid JSON — no markdown, no code fences, no explanation. Use this exact structure:
{
  "matched_category": "category-slug or null if no match",
  "confidence": 0.0 to 1.0,
  "summary": "An empathetic 1-2 sentence message (under 40 words) that acknowledges what the person needs and tells them what you found. Never sound robotic.",
  "secondary_category": "category-slug or null — a second category that might also help",
  "search_keywords": ["relevant", "keywords", "for", "backup", "search"]
}

If nothing matches, set matched_category to null and include a summary suggesting they call 211 for personalized help.`;

  return prompt;
}

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
  let body: { query?: string; latitude?: number; longitude?: number };
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
    // Call Claude to classify the query and generate a summary
    const anthropic = new Anthropic();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: buildSystemPrompt(currentTime, userLocation),
      messages: [{ role: "user", content: query }],
    });

    // Extract the text response from Claude
    const textBlock = message.content.find((block) => block.type === "text");
    const rawJson = textBlock?.text ?? "";

    // Parse Claude's JSON response
    const aiResult = JSON.parse(rawJson) as {
      matched_category: string | null;
      confidence: number;
      summary: string;
      secondary_category: string | null;
      search_keywords: string[];
    };

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
    console.error("AI search failed, falling back to text search:", error);
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
