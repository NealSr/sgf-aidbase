# SGF AidBase — Project Overview

## The Elevator Pitch
SGF AidBase is a community resource navigator for Springfield, Missouri. People in need type what they're struggling with in plain English — "I can't afford groceries" or "my family needs a place to stay tonight" — and the app instantly connects them with local organizations that can help. No jargon, no phone trees, no guessing who to call.

## Team
- **Team Name:** Ctrl+Aid+Shift (solo — one human + AI collaboration)
- **Team Members:** Neal Richardson Sr + AI collaboration using both Claude and OpenAI tools
- **Competition:** Springfield, MO Vibeathon (Springfield Tech Week, March 2026)
- **Sponsor:** vibeathon.us Powered by Codefi
- **Problem Category:** Bring Your Own Startup Idea — MVP in under a week
- **Domain:** sgfaidbase.org

## Core Philosophy
- We are a **directory**, not a provider. We connect people to help. We don't diagnose, counsel, or promise outcomes.
- We **amplify** existing organizations — we don't compete with them.
- We keep it **simple**. A person in crisis doesn't need a feature-rich app. They need an answer.
- AI is **invisible** — and **optional**. Users can toggle AI matching off and use traditional search.
- **Accuracy is a responsibility.** Every listing was sourced from organization websites, the Springfield Public Library's resource directory, and direct outreach.
- **Proximity matters.** Springfield is the 13th most dangerous city for pedestrian fatalities in the US. Showing the closest resource first isn't just convenience — it's safety.

## MVP Scope — The Four Walls
The "Four Walls" are the four things every person needs before anything else. Our categories map directly to them.
1. **Food Assistance** — food banks, pantries, free meal programs, community fridges, Meals on Wheels
2. **Housing / Shelter** — emergency shelters, transitional housing, rent assistance, DV shelters, cold weather shelters
3. **Utility / Bill Help** — electric/gas bill assistance, rent help, free phone/internet programs
4. **Transportation** — bus passes, gas vouchers, car donation programs, safe parking

36 verified resources across all four categories.
The architecture supports adding more categories later, but for Thursday's demo: four. Focused. Polished. Purposeful.

## Key Design Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router, TypeScript, Tailwind CSS) | Best AI-codegen support, SSR for SEO, single codebase |
| Database | Supabase (PostgreSQL, us-east-2) | Free tier, table editor, full-text search, REST API |
| AI Matching | OpenAI API with category-click bypass | Skip API for direct category clicks |
| AI Hours Reasoning | OpenAI reads hours text + current time at query | Avoids complex time parsing |
| Location | Tier 2 — distance + walking context labels | Haversine formula, browser geolocation |
| Geocoding | OpenStreetMap Nominatim batch script | Free, one-time run |
| Hosting | Vercel (sgfaidbase.org) + AWS Amplify | Primary deployment plus additional hosted path |
| Admin | Password-protected internal page | Supports directory maintenance |
| Spam Prevention | Honeypot + rate limiting (no CAPTCHA) | Don't block people in crisis |

Both Claude and OpenAI tools were used during the project: Claude helped with early setup and planning artifacts, and OpenAI powers the live AI search experience while also supporting later implementation refinements.

## Market Research Validation
- Interviewed reference desk librarian Lisa at Springfield-Greene County Library
- Top 3 confirmed needs: Shelter/Housing, Food, Transportation
- Biggest frustration: **Inconsistency** — resources change, info goes stale
- Key insight: Must be user-friendly, walking-friendly, current
- Received 11-page resource directory (last updated Nov 2025)

## Disclaimer (shown in app footer)
> "SGF AidBase helps connect you with community resources in Springfield, MO. Always verify details directly with the organization. If you are in immediate danger, call 911. For crisis support, call or text 988."

## Files in This Blueprint
- `01-ARCHITECTURE.md` — Technical architecture, data flow, deployment
- `02-DATA_MODEL.md` — Supabase schema and seed data
- `03-UI_SCREENS.md` — Every screen with behavior specs
- `04-AI_MATCHING_PROMPT.md` — OpenAI prompt with location + hours awareness
- `05-MARKET_RESEARCH.md` — Research plan and interview questions
- `06-TIMELINE.md` — Revised build timeline
- `07-DEMO_SCRIPT.md` — 5-minute demo video plan
- `08-RESOURCE_DATA.md` — SQL for 20 core resources
- `09-CONTACT_CHECKLIST.md` — Verification checklist
- `10-SUPPLEMENTAL_RESOURCES.md` — 16 additional resources from library directory
- `11-VSCODE_PROMPTS.md` — Structured prompts for Claude Code
