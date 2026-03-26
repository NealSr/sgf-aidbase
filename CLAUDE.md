@AGENTS.md

# SGF AidBase — Claude Code Project Context

This file keeps its historical name for tool compatibility and project archaeology. The project itself credits both Claude and OpenAI: Claude helped with early setup and planning artifacts, and OpenAI powers the current AI search flow while also supporting later implementation refinements.

I'm building SGF AidBase — a community resource navigator for Springfield, MO. It's a Next.js app (App Router, TypeScript, Tailwind CSS) with Supabase (PostgreSQL) as the database and the OpenAI API for AI-powered search matching.

The app helps people find food banks, shelters, utility assistance, and transportation help by typing what they need in plain text or using speech to text.

## Key Architecture
- Next.js 14+ with App Router (app/ directory)
- Tailwind CSS for styling
- Supabase JS client for database queries
- OpenAI API for natural language search matching
- Deployed on Vercel at sgfaidbase.org

## Database Tables (Supabase PostgreSQL, us-east-2)
- **categories** (id, name, slug, description, icon, display_order)
- **resources** (id, category_id, name, description, address, city, state, zip, phone, website, email, hours, eligibility, languages, tags, is_active, last_verified, notes, latitude, longitude)
- **feedback** (id, message, email, page_url, created_at)

Currently: 4 categories, 36 resources, most with lat/lon geocoded.

## Environment Variables (.env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- OPENAI_API_KEY (server-side only — NEVER NEXT_PUBLIC_)
- OPENAI_MODEL
- OPENAI_TIMEOUT_MS
- ADMIN_PASSWORD (for /admin page)

## Design Direction
Warm, trustworthy, accessible. Earth tones — forest green accents (#2D6A4F), cream/warm backgrounds. Rounded corners, soft shadows. Mobile-first. WCAG AA accessible. This app is for people in crisis — keep it simple and calming.  Support dark and light modes.  Support high contrast if it makes sense to.  Be screen-reader compliant.

## Key Features
- AI-powered natural language search with category-click bypass
- Location-aware distance labels (Tier 2): walking context like "0.8 mi · Walkable (~15 min)"
- OpenAI reasons about hours at query time (current time injected into prompt)
- Admin page (password-protected) for resource CRUD
- Feedback page for community corrections (honeypot spam prevention)
- Results sorted by nearest first when user shares location
- "Get Walking Directions" links (Google Maps, walking mode)
- Crisis numbers (988, 911) in footer on every page

## Important Context
- Team: Ctrl+Aid+Shift (solo — one human (Neal Richardson Sr) + AI collaboration using both Claude and OpenAI tools)
- Competition: Springfield MO Vibeathon, Springfield Tech Week March 2026
- Market research validated by Springfield Public Library reference desk and a few other community members.
- 36 resources verified from org websites + library's 11-page directory
- Springfield is the 13th most dangerous US city for pedestrian fatalities — proximity matters

## Reference Docs
Read /docs for detailed architecture, data model, UI specs, and AI prompt engineering.

## Modifications and Decisions during implementation
- When making changes that affect the architecture, data model, API routes, or UI screens, note the change in /docs/CHANGELOG.md and flag which blueprint doc (01-07) needs updating.

## Interaction Style & Ground Rules
- **Keep it simple and modern.** Generate clean, readable code. No over-engineering. This app is for people in crisis — simplicity IS the feature.
- **Lean toward learning.** Add brief comments explaining WHY, not just WHAT. The developer (me) is a devops engineer, not a frontend dev — help me understand React/Next.js patterns as we go.
- **Focus on impact over features.** If a feature doesn't directly help someone find a resource faster, it can wait.
- **Don't loop forever.** If you hit a wall or a complex bug, describe the problem and suggest options instead of burning tokens on speculative fixes. Ask me for guidance.
- **Mobile-first always.** Every component should work on a cheap Android phone with a small screen. That's our primary user.
- **Be concise in code comments, verbose in commit messages.** The AI judge reads both.
- **When in doubt, ship the simpler version.** We can iterate. A working simple feature beats a broken complex one.
- **Run `npx next lint` before declaring a task complete.** Fix any errors. Warnings are okay for now.
