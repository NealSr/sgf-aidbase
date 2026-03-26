# Changelog

## 2026-03-26

- Hardened the `/api/search` timeout path so OpenAI requests now use a real SDK-level timeout, the route declares `maxDuration`, and the UI aborts superseded requests instead of leaving stale searches running.
- Blueprint docs to update: `01-ARCHITECTURE.md` for the search timeout/fallback behavior and `12-TEST_PLAN.md` for timeout and aborted-request coverage.
