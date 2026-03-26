export const OPENAI_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS ?? 20_000);

// Next.js route segment config must stay statically analyzable for Vercel.
export const SEARCH_ROUTE_MAX_DURATION_SECONDS = 25;
