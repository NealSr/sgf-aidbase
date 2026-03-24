# SGF AidBase — Project Overview

## The Elevator Pitch
SGF AidBase is a community resource navigator for Springfield, Missouri. People in need type what they're struggling with in plain English — "I can't afford groceries" or "my family needs a place to stay tonight" — and the app instantly connects them with local organizations that can help. No jargon, no phone trees, no guessing who to call.

## Team
- **Team Name:** Ctrl+Aid
- **Competition:** Springfield, MO Vibeathon (Springfield Tech Week, March 2026)
- **Sponsor:** vibeathon.us Powered by Codefi
- **Problem Category:** Bring Your Own Startup Idea — MVP in under a week

## Core Philosophy
- We are a **directory**, not a provider. We connect people to help. We don't diagnose, counsel, or promise outcomes.
- We **amplify** existing organizations (Community Foundation of the Ozarks, Solidarity Network, 211, United Way) — we don't compete with them.
- We keep it **simple**. A person in crisis doesn't need a feature-rich app. They need an answer.
- AI is **invisible**. The user doesn't need to know or care that AI powers the matching. They just get great results.

## MVP Scope — The Four Walls
The "Four Walls" are the four things every person needs before anything else. Our categories map directly to them.

1. **Food Assistance** — food banks, pantries, free meal programs, SNAP assistance
2. **Housing / Shelter** — emergency shelters, transitional housing, rent assistance programs
3. **Utility / Bill Help** — electric/gas bill assistance, water bill help, financial counseling
4. **Transportation** — free bus passes, rideshare credits, vehicle assistance, gas vouchers

The architecture supports adding more categories later, but for Thursday's demo: four. Focused. Polished. Purposeful.

## Key Design Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | Best AI-codegen support, SSR for SEO, single codebase |
| Database | Supabase (hosted PostgreSQL) | Free tier, spreadsheet-like editor, full-text search, REST API auto-generated |
| AI Matching | Claude API (smart) with category-click bypass | Demo-winning feature; skip API for obvious direct category clicks |
| Hosting (Primary) | Vercel | Made for Next.js, fastest path to live URL |
| Hosting (Backup) | AWS Amplify | Learning opportunity, same GitHub repo, fallback option |
| User-Generated Content | None for MVP | Read-only for end users eliminates spam/moderation concerns |
| Authentication | None for MVP | Public directory — no login required to search |

## Disclaimer (shown in app footer)
> "SGF AidBase helps connect you with community resources in Springfield, MO. Always verify details directly with the organization. If you are in immediate danger, call 911. For crisis support, call or text 988."

## Files in This Blueprint
- `01-ARCHITECTURE.md` — Technical architecture, data flow, deployment
- `02-DATA_MODEL.md` — Supabase schema and seed data
- `03-UI_SCREENS.md` — Every screen described for AI code generation
- `04-AI_MATCHING_PROMPT.md` — Claude API prompt engineering for smart search
- `05-MARKET_RESEARCH.md` — Tuesday's fieldwork plan and interview questions
- `06-TIMELINE.md` — Hour-by-hour build plan Tue–Thu
- `07-DEMO_SCRIPT.md` — 5-minute demo video plan
