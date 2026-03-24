# SGF AidBase — AI Matching Prompt Engineering

## Overview
When a user types a natural language query, we send it to the Claude API (Sonnet model) along with our category definitions. Claude returns a structured JSON response telling us which category matches and providing an empathetic summary.

## The System Prompt (stored in your API route)

```
You are a compassionate community resource navigator for Springfield, Missouri. Your job is to understand what someone needs help with and match them to the right category of community resources.

You must respond ONLY with valid JSON. No markdown, no explanation, no preamble.

Available categories:
1. "food-assistance" — Food banks, pantries, free meals, SNAP/EBT assistance, grocery help
2. "housing-shelter" — Emergency shelters, transitional housing, rent assistance, housing programs, homelessness services
3. "utility-bill-help" — Electric, gas, water bill assistance, financial counseling, emergency bill payment programs
4. "transportation" — Bus passes, rideshare credits, gas vouchers, vehicle repair assistance, getting to appointments

Respond with this exact JSON structure:
{
  "matched_category": "slug of the best matching category, or null if no match",
  "confidence": 0.0 to 1.0,
  "summary": "A brief, warm, empathetic 1-2 sentence message acknowledging what the person needs and letting them know you found resources that might help. Speak directly to them. Be human.",
  "secondary_category": "slug of a secondary category if relevant, or null",
  "search_keywords": ["array", "of", "keywords", "extracted", "from", "query"]
}

Rules:
- Match based on INTENT, not just keywords. "My kids are hungry" = food-assistance. "I got an eviction notice" = housing-shelter. "They're going to shut off my lights" = utility-bill-help.
- If the query is ambiguous or could match multiple categories, pick the most likely one as matched_category and put the other as secondary_category.
- If the query doesn't match ANY category, set matched_category to null and provide a helpful summary that suggests calling 211 for broader assistance.
- The summary should NEVER sound robotic or clinical. Imagine you're a kind librarian helping someone who just walked in looking stressed.
- Keep the summary under 40 words.
- Always respond in English.
```

## The User Message (constructed in your API route)

```
A person in Springfield, MO is looking for help. They said: "{USER_QUERY_HERE}"

Match them to the best community resource category and provide a compassionate response.
```

## Example Interactions

### Input: "I can't afford groceries this week"
```json
{
  "matched_category": "food-assistance",
  "confidence": 0.97,
  "summary": "It sounds like you need help getting food for your family. Here are organizations in Springfield that can help with groceries and meals.",
  "secondary_category": null,
  "search_keywords": ["groceries", "food", "afford"]
}
```

### Input: "my family needs a place to stay tonight"
```json
{
  "matched_category": "housing-shelter",
  "confidence": 0.99,
  "summary": "I understand you need a safe place to stay tonight. Here are shelters and housing resources in Springfield that may have availability.",
  "secondary_category": null,
  "search_keywords": ["shelter", "housing", "tonight", "family"]
}
```

### Input: "they're going to cut off my electricity and I don't know what to do"
```json
{
  "matched_category": "utility-bill-help",
  "confidence": 0.98,
  "summary": "That sounds really stressful. There are programs in Springfield that can help with utility bills before disconnection. Let's find them.",
  "secondary_category": null,
  "search_keywords": ["electricity", "utility", "cut off", "bill"]
}
```

### Input: "I lost my job and I'm about to be homeless and I can't feed my kids"
```json
{
  "matched_category": "food-assistance",
  "confidence": 0.75,
  "summary": "I'm sorry you're going through this. You may need help with food and housing. Here are food resources to start, and we also have housing assistance available.",
  "secondary_category": "housing-shelter",
  "search_keywords": ["job loss", "homeless", "food", "kids", "hungry"]
}
```

### Input: "where can I get a haircut"
```json
{
  "matched_category": null,
  "confidence": 0.0,
  "summary": "We don't have that type of resource listed yet, but you can call 211 for help finding services in Springfield. We currently cover food assistance, housing, and utility bill help.",
  "secondary_category": null,
  "search_keywords": ["haircut"]
}
```

## Implementation Code (Next.js API Route)

```typescript
// app/api/search/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `[Insert the system prompt from above]`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter what you need help with." },
        { status: 400 }
      );
    }

    // Rate limiting check would go here

    // Call Claude API for smart matching
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `A person in Springfield, MO is looking for help. They said: "${query}"\n\nMatch them to the best community resource category and provide a compassionate response.`,
        },
      ],
    });

    // Parse Claude's response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    let aiResult;

    try {
      aiResult = JSON.parse(responseText);
    } catch {
      // If Claude's response isn't valid JSON, fall back to full-text search
      console.error("Failed to parse AI response, falling back to search");
      return fallbackSearch(query);
    }

    // Fetch resources from Supabase based on matched category
    if (aiResult.matched_category) {
      const { data: resources, error } = await supabase
        .from("resources")
        .select("*, categories(*)")
        .eq("categories.slug", aiResult.matched_category)
        .eq("is_active", true)
        .order("name");

      return NextResponse.json({
        query,
        ai_summary: aiResult.summary,
        matched_category: aiResult.matched_category,
        secondary_category: aiResult.secondary_category,
        confidence: aiResult.confidence,
        resources: resources || [],
      });
    }

    // No category match
    return NextResponse.json({
      query,
      ai_summary: aiResult.summary,
      matched_category: null,
      resources: [],
    });
  } catch (error) {
    console.error("Search API error:", error);
    // Fall back to basic search on any error
    return fallbackSearch(request);
  }
}

async function fallbackSearch(query: string) {
  // Use Supabase full-text search as fallback
  const { data: resources } = await supabase
    .from("resources")
    .select("*, categories(*)")
    .textSearch("name", query, { type: "websearch" })
    .eq("is_active", true);

  return NextResponse.json({
    query,
    ai_summary:
      "Here are some resources that might help. You can also call 211 for personalized assistance.",
    matched_category: null,
    resources: resources || [],
  });
}
```

## Cost Estimate
- Sonnet model: ~$3 per million input tokens, ~$15 per million output tokens
- Each query: ~200 input tokens (system + user), ~80 output tokens (JSON response)
- Cost per query: ~$0.0018
- 100 queries/month: ~$0.18
- 1,000 queries/month: ~$1.80
- **For the vibeathon demo: essentially free**

## Fallback Strategy
1. If Claude API returns invalid JSON → fall back to Supabase full-text search
2. If Claude API times out (>5 seconds) → fall back to Supabase full-text search
3. If Claude API returns an error → fall back to Supabase full-text search
4. Always show results, even if they're from the fallback — never show the user an error page
