# Changelog

## 2026-03-26

- Hardened the `/api/search` timeout path so OpenAI requests now use a real SDK-level timeout, the route declares `maxDuration`, and the UI aborts superseded requests instead of leaving stale searches running.
- Extended the rotating loading copy on search so the waiting state cycles through a larger set of status messages.
- Raised the default OpenAI request timeout to `20000ms` and added `OPENAI_TIMEOUT_MS` to `.env.example` so the timeout can be tuned without code changes.
- Blueprint docs to update: `01-ARCHITECTURE.md` for the search timeout/fallback behavior and `12-TEST_PLAN.md` for timeout and aborted-request coverage.
