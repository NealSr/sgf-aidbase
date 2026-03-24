# SGF AidBase — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    USER'S BROWSER                    │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Search   │  │  Category    │  │   Resource     │  │
│  │  Bar      │  │  Browse      │  │   Detail View  │  │
│  └─────┬────┘  └──────┬───────┘  └───────────────┘  │
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
│  │  /api/resources — CRUD for resource listings  │   │
│  │  /api/categories — Category metadata          │   │
│  └──────────┬──────────────────┬─────────────────┘   │
│             │                  │                      │
└─────────────┼──────────────────┼─────────────────────┘
              │                  │
              ▼                  ▼
┌──────────────────┐   ┌──────────────────┐
│  Anthropic API   │   │    Supabase      │
│  (Claude Sonnet) │   │  (PostgreSQL)    │
│                  │   │                  │
│  Smart matching  │   │  Resources table │
│  & ranking       │   │  Categories table│
│                  │   │  Full-text search│
└──────────────────┘   └──────────────────┘
```

## Data Flow: User Searches "I can't pay my electric bill"

1. User types query into search bar on homepage
2. Frontend sends POST to `/api/search` with `{ query: "I can't pay my electric bill" }`
3. API route checks: is this a direct category click or a natural language query?
   - **Direct category click** → Query Supabase directly, skip Claude API (saves cost + latency)
   - **Natural language query** → Continue to step 4
4. API route sends query to Claude API (Sonnet model for speed + cost efficiency) with:
   - The user's query
   - A list of all categories and their descriptions
   - Instructions to return: matched category, confidence score, and a short empathetic summary
5. Claude responds with structured JSON: `{ category: "utility_bill_help", confidence: 0.95, summary: "It sounds like you need help with utility bills. Here are organizations in Springfield that can help." }`
6. API route queries Supabase for all resources in the matched category
7. Results returned to frontend with the AI-generated summary at the top
8. User sees: empathetic summary + list of organizations with name, address, phone, hours, description

## Tech Stack Details

### Frontend
- **Next.js 14+** with App Router
- **Tailwind CSS** for styling (fast to prototype, AI generates good Tailwind)
- **React** components for search bar, resource cards, category grid
- **No component library** — keep it lightweight, custom-styled

### Backend (Next.js API Routes)
- `/api/search` — POST — accepts natural language query, returns matched resources
- `/api/resources` — GET — returns resources filtered by category
- `/api/resources/[id]` — GET — returns single resource detail
- *Future: admin routes for CRUD, but for MVP, data entry happens in Supabase dashboard*

### Database (Supabase)
- Hosted PostgreSQL with auto-generated REST API
- Supabase JS client for querying from Next.js API routes
- Full-text search enabled on resource name + description fields
- Dashboard UI used for manual data entry during the hackathon

### AI Layer (Anthropic Claude API)
- Model: `claude-sonnet-4-20250514` (fast, cheap, plenty smart for matching)
- Called from Next.js API route (server-side only — API key never exposed to browser)
- Structured JSON output for reliable parsing
- Fallback: if Claude API fails or times out, fall back to keyword-based Supabase full-text search

### Deployment
- **Primary: Vercel** — connect GitHub repo, auto-deploy on push
- **Backup: AWS Amplify** — connect same GitHub repo, separate deployment
- **Domain:** TBD (e.g., sgfaidbase.com or sgfaidbase.vercel.app for MVP)
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key
  - `ANTHROPIC_API_KEY` — Claude API key (server-side only, NEVER in NEXT_PUBLIC_)

## Project Structure

```
sgf-aidbase/
├── app/
│   ├── layout.tsx              # Root layout with header, footer, disclaimer
│   ├── page.tsx                # Homepage: hero + search bar + category cards
│   ├── search/
│   │   └── page.tsx            # Search results page
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx        # Category browse page
│   ├── resource/
│   │   └── [id]/
│   │       └── page.tsx        # Individual resource detail page
│   ├── about/
│   │   └── page.tsx            # About page (team, mission, credits)
│   └── api/
│       ├── search/
│       │   └── route.ts        # AI-powered search endpoint
│       └── resources/
│           └── route.ts        # Resource listing endpoint
├── components/
│   ├── SearchBar.tsx           # Main search input with submit
│   ├── CategoryCard.tsx        # Clickable category tile
│   ├── ResourceCard.tsx        # Resource listing card
│   ├── ResourceDetail.tsx      # Full resource info display
│   ├── Header.tsx              # App header with logo
│   ├── Footer.tsx              # Footer with disclaimer + credits
│   └── LoadingSpinner.tsx      # Loading state component
├── lib/
│   ├── supabase.ts             # Supabase client initialization
│   ├── anthropic.ts            # Claude API helper functions
│   └── types.ts                # TypeScript type definitions
├── public/
│   ├── logo.svg                # SGF AidBase logo
│   └── og-image.png            # Social share image
├── .env.local                  # Environment variables (not committed)
├── tailwind.config.ts          # Tailwind configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Security Considerations
- Anthropic API key is server-side only (never prefixed with NEXT_PUBLIC_)
- Supabase Row Level Security (RLS) enabled: public read-only, no public writes
- No user authentication for MVP = no user data to protect
- Rate limiting on /api/search to prevent abuse (Next.js middleware or Vercel's built-in)
- Input sanitization on search queries before passing to Claude API
