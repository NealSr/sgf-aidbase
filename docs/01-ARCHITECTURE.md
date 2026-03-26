# SGF AidBase — Architecture

This project was shaped with both Claude and OpenAI tools. Claude contributed to early setup and planning artifacts, while OpenAI powers the live search flow and later implementation refinements.

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    USER'S BROWSER                    │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Search   │  │  Category    │  │   Resource     │  │
│  │  Bar      │  │  Browse      │  │   Detail View  │  │
│  └─────┬────┘  └──────┬───────┘  └───────────────┘  │
│        │               │                             │
│  ┌─────┴───────────────┴──────────────────────────┐  │
│  │  Browser Geolocation API (optional)            │  │
│  │  → Haversine distance calc → walking labels    │  │
│  └────────────────────────────────────────────────┘  │
└────────┼───────────────┼─────────────────────────────┘
         │               │
         ▼               ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS APP (Vercel / Amplify)          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              API Routes (/api/*)              │   │
│  │                                               │   │
│  │  /api/search    — AI-powered query matching   │   │
│  │                   + location + hours awareness │   │
│  │  /api/resources — CRUD for resource listings  │   │
│  │  /api/feedback  — Community feedback intake    │   │
│  └──────────┬──────────────────┬─────────────────┘   │
│             │                  │                      │
└─────────────┼──────────────────┼─────────────────────┘
              │                  │
              ▼                  ▼
┌──────────────────┐   ┌──────────────────┐
│    OpenAI API    │   │    Supabase      │
│  (structured AI) │   │  (PostgreSQL)    │
│                  │   │                  │
│  Smart matching  │   │  Resources table │
│  Hours reasoning │   │  Categories table│
│  Location-aware  │   │  Feedback table  │
│  ranking         │   │  Full-text search│
└──────────────────┘   └──────────────────┘
```

## Data Flow: User Searches "I need food"

1. User types query into search bar on homepage
2. Browser requests geolocation permission (optional)
3. Frontend sends POST to `/api/search` with `{ query, latitude?, longitude? }`
4. API route checks: is this a direct category click or a natural language query?
   - **Direct category click** → Query Supabase directly, skip OpenAI API
   - **Natural language query** → Continue to step 5
5. API route sends query to the OpenAI API with:
   - The user's query
   - Current date/time (for hours reasoning)
   - User's lat/lon if provided (for proximity awareness)
   - Category definitions
   - Instructions to return structured JSON with empathetic summary
6. OpenAI responds with structured JSON containing the matched category and summary
7. API route queries Supabase for all active resources in matched category
8. Results returned to frontend with lat/lon per resource
9. Frontend calculates distance (Haversine) and adds walking context labels
10. Results sorted by nearest first, displayed with distance labels

## Distance Labels (Tier 2)
| Distance | Label | Emoji |
|---|---|---|
| < 0.5 mi | Walking distance (~10 min) | 🚶 |
| 0.5 - 1 mi | Walkable (~15-20 min) | 🚶 |
| 1 - 3 mi | May need a bus or ride | 🚌 |
| 3+ mi | You'll likely need transportation | 🚗 |

## Hours Reasoning
Hours are stored as free text in the database (e.g., "Mon-Thu 9:00 AM - 1:30 PM"). Instead of parsing these into structured time ranges, the current date/time is passed to OpenAI at query time. The model reads the hours text and reasons about what's currently open, noting when closed resources will open next. This avoids complex time parsing while delivering good-enough results for MVP.

## Tech Stack
| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | Server-rendered React with API routes |
| Styling | Tailwind CSS | Mobile-first responsive design |
| Language | TypeScript | Type safety across the codebase |
| Database | Supabase (PostgreSQL, us-east-2 Ohio) | Resource data, full-text search, feedback |
| AI Matching | OpenAI API | Natural language query understanding |
| Geocoding | OpenStreetMap Nominatim | One-time batch script to populate lat/lon |
| Distance | Haversine formula (client-side JS) | Calculate user-to-resource distance |
| Hosting Primary | Vercel | Auto-deploy from GitHub, SSL, CDN |
| Hosting Backup | AWS Amplify | Same repo, fallback deployment |
| DNS | Cloudflare | DNS management for sgfaidbase.org |
| SSL | Let's Encrypt (auto via Vercel) | HTTPS by default |

## Project Structure

```
sgf-aidbase/
├── CLAUDE.md                   # Project context file retained for tool compatibility and project history
├── app/
│   ├── layout.tsx              # Root layout — header, footer, meta tags
│   ├── page.tsx                # Homepage: hero + search bar + category cards
│   ├── search/
│   │   └── page.tsx            # AI-powered search results with distance labels
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx        # Category browse page
│   ├── resource/
│   │   └── [id]/
│   │       └── page.tsx        # Resource detail page with call/map/directions
│   ├── about/
│   │   └── page.tsx            # About page — credits, methodology, crisis lines
│   ├── feedback/
│   │   └── page.tsx            # Community feedback form
│   ├── admin/
│   │   └── page.tsx            # Password-protected admin for resource CRUD
│   └── api/
│       ├── search/
│       │   └── route.ts        # AI-powered search endpoint
│       ├── resources/
│       │   └── route.ts        # Resource listing endpoint
│       └── feedback/
│           └── route.ts        # Feedback submission endpoint
├── components/
│   ├── SearchBar.tsx
│   ├── CategoryCard.tsx
│   ├── ResourceCard.tsx        # Includes distance label display
│   ├── ResourceDetail.tsx
│   ├── Header.tsx
│   ├── Footer.tsx              # Includes disclaimer + crisis numbers
│   └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts             # Supabase client + TypeScript types
│   ├── ai.ts                   # OpenAI helper functions
│   ├── distance.ts             # Haversine formula + distance labels
│   ├── location.ts             # Browser geolocation wrapper
│   └── types.ts                # Shared type definitions
├── scripts/
│   └── geocode-resources.mjs   # One-time Nominatim geocoding script
├── docs/                       # Blueprint documentation (for AI judge + humans)
├── public/                     # Static assets (currently empty; app icon lives in /app)
├── .env.local                  # Environment variables (not committed)
├── .env.example                # Template showing required env vars
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-proj-...       # Server-side only — NEVER NEXT_PUBLIC_
OPENAI_MODEL=gpt-5-nano
OPENAI_TIMEOUT_MS=20000
ADMIN_PASSWORD=...               # For /admin page
```

## Security Considerations
- OpenAI API key is server-side only (never prefixed with NEXT_PUBLIC_)
- Supabase Row Level Security: public read-only on resources/categories, insert-only on feedback
- No user authentication for public features = no user data to protect
- Rate limiting on /api/search (10 req/min per IP) to prevent abuse
- Honeypot field on feedback form for spam prevention (no CAPTCHA — don't block people in crisis)
- Input sanitization on search queries before passing to OpenAI
- Admin page uses simple password check (env var), not persistent auth

## Fallback Strategy
1. OpenAI invalid JSON → fall back to Supabase full-text search
2. OpenAI timeout (>20s by default, configurable via env) → fall back to Supabase full-text search
3. OpenAI error → fall back to Supabase full-text search
4. User declines geolocation → show results without distance, no penalty
5. Vercel down → switch demo URL to Amplify deployment
6. Always show results — never show the user an error page
