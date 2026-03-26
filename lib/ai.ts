import OpenAI from "openai";
import { OPENAI_TIMEOUT_MS } from "@/lib/ai-config";

export const VALID_CATEGORIES = [
  "food-assistance",
  "housing-shelter",
  "utility-bill-help",
  "transportation",
] as const;

export type ValidCategory = (typeof VALID_CATEGORIES)[number];

export type SearchAiResult = {
  matched_category: ValidCategory | null;
  confidence: number;
  summary: string;
  secondary_category: ValidCategory | null;
  search_keywords: string[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: OPENAI_TIMEOUT_MS,
  maxRetries: 0,
});

function buildSystemPrompt(
  currentTime: string,
  userLocation?: { lat: number; lon: number }
): string {
  let prompt = `You are a compassionate community resource navigator for Springfield, Missouri.
Imagine you are a kind librarian helping someone who just walked in stressed and needs guidance.

Your job is to understand what the person needs and match their request to the most relevant category of local resources.

Available categories:
- "food-assistance" - food banks, pantries, free meals, SNAP help
- "housing-shelter" - shelters, transitional housing, rent assistance, domestic violence safe houses
- "utility-bill-help" - electric, gas, water bill assistance, weatherization
- "transportation" - bus passes, ride programs, gas vouchers, car repair help

Current date and time: ${currentTime}
Use this to reason about whether services might currently be open or closed.`;

  if (userLocation) {
    prompt += `\n\nThe user's current location: latitude ${userLocation.lat}, longitude ${userLocation.lon} (Springfield, MO area).`;
  }

  prompt += `

Return structured JSON matching the supplied schema.

Rules:
- Match based on intent, not just keywords.
- Keep the summary empathetic, direct, and under 40 words.
- If nothing matches, set matched_category to null and suggest calling 211.
- Only use the allowed category slugs.
- Do not mention specific programs, benefits, or organizations unless the user explicitly mentioned them first.
- Do not promise services that may not appear in the results.
- Keep the summary category-level and resource-neutral.`;

  return prompt;
}

function isValidCategory(value: unknown): value is ValidCategory | null {
  return value === null || VALID_CATEGORIES.includes(value as ValidCategory);
}

function isSearchAiResult(value: unknown): value is SearchAiResult {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return (
    isValidCategory(candidate.matched_category) &&
    typeof candidate.confidence === "number" &&
    typeof candidate.summary === "string" &&
    isValidCategory(candidate.secondary_category) &&
    Array.isArray(candidate.search_keywords) &&
    candidate.search_keywords.every((keyword) => typeof keyword === "string")
  );
}

export async function classifySearchQuery(
  query: string,
  currentTime: string,
  userLocation?: { lat: number; lon: number },
  requestId?: string
): Promise<SearchAiResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const startedAt = Date.now();

  console.info("[ai.search] OpenAI request starting", {
    requestId,
    model,
    queryLength: query.length,
    hasLocation: Boolean(userLocation),
    timeoutMs: OPENAI_TIMEOUT_MS,
  });

  try {
    const response = await openai.responses.create({
      model,
      instructions: buildSystemPrompt(currentTime, userLocation),
      input: `A person in Springfield, MO is looking for help. They said: "${query}"\n\nMatch them to the best community resource category and provide a compassionate response.`,
      text: {
        format: {
          type: "json_schema",
          name: "aidbase_search_match",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              matched_category: {
                type: ["string", "null"],
                enum: [...VALID_CATEGORIES, null],
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
              },
              summary: {
                type: "string",
              },
              secondary_category: {
                type: ["string", "null"],
                enum: [...VALID_CATEGORIES, null],
              },
              search_keywords: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "matched_category",
              "confidence",
              "summary",
              "secondary_category",
              "search_keywords",
            ],
          },
        },
      },
    });

    const rawJson = response.output_text;
    if (!rawJson) {
      throw new Error("OpenAI returned an empty response");
    }

    const parsed = JSON.parse(rawJson) as unknown;
    if (!isSearchAiResult(parsed)) {
      throw new Error("OpenAI returned an invalid search payload");
    }

    console.info("[ai.search] OpenAI request completed", {
      requestId,
      durationMs: Date.now() - startedAt,
      matchedCategory: parsed.matched_category,
      secondaryCategory: parsed.secondary_category,
      confidence: parsed.confidence,
    });

    return parsed;
  } catch (error) {
    console.error("[ai.search] OpenAI request failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      model,
    });
    throw error;
  }
}
