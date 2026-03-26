import { NextRequest, NextResponse } from "next/server";
import { supabase, Resource } from "@/lib/supabase";
import { OPENAI_TIMEOUT_MS } from "@/lib/ai-config";
import { classifySearchQuery, VALID_CATEGORIES } from "@/lib/ai";
import { CRISIS_RESPONSE, detectCrisis } from "@/lib/crisis";

const AI_TIMEOUT_MS = OPENAI_TIMEOUT_MS;
// Keep this literal. Next.js / Vercel route segment config must be statically
// analyzable, so this value cannot be imported or derived from OPENAI_TIMEOUT_MS.
export const maxDuration = 25;

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
  const requestId = crypto.randomUUID();
  const requestStartedAt = Date.now();

  // Rate limiting by IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    console.warn("[api.search] Rate limited request", { requestId, ip });
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
    console.warn("[api.search] Missing query", { requestId });
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  console.info("[api.search] Request received", {
    requestId,
    queryLength: query.length,
    useAI: body.useAI !== false,
    hasLocation: body.latitude != null && body.longitude != null,
  });

  // Crisis detection — respond immediately without calling the AI
  if (detectCrisis(query)) {
    console.info("[api.search] Crisis query detected", { requestId });
    return NextResponse.json(CRISIS_RESPONSE);
  }

  // Direct Supabase text search when AI is toggled off
  if (body.useAI === false) {
    const resources = await fallbackSearch(query);
    console.info("[api.search] Plain search completed", {
      requestId,
      durationMs: Date.now() - requestStartedAt,
      resultCount: resources.length,
    });
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
      classifySearchQuery(query, currentTime, userLocation, requestId),
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
      console.warn("[api.search] AI search timed out, using fallback search", {
        requestId,
        durationMs: Date.now() - requestStartedAt,
      });
    } else {
      console.error("[api.search] AI search failed, falling back to text search", {
        requestId,
        durationMs: Date.now() - requestStartedAt,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    const resources = await fallbackSearch(query);

    console.info("[api.search] Fallback search completed", {
      requestId,
      durationMs: Date.now() - requestStartedAt,
      resultCount: resources.length,
    });

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
