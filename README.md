# SGF AidBase

**Find Help in Springfield, MO — Tell us what you need.  We'll connect you.**

SGF AidBase is a community resource navigator that connects Springfield residents with food banks, shelters, utility assistance, and transportation help. Users describe what they need in their own words, and AI-powered matching finds the right organizations instantly.

🌐 **Live:** [sgfaidbase.org](https://sgfaidbase.org)

---

## The Problem

Springfield, MO has dozens of incredible nonprofits helping people in crisis. The problem isn't that help doesn't exist — it's that people don't know where to start looking. Information is scattered across websites, phone trees, and word of mouth. When you're stressed, hungry, or scared, you don't have time to do research.

## The Solution

SGF AidBase is a simple, accessible front door to community resources. Users can:

- **Search in plain language** — Type "I can't afford groceries" or "my family needs a place to stay tonight" and get matched to real organizations
- **Browse by category** — Four categories built around the "Four Walls" (the four things every person needs first): Food, Housing, Utilities, and Transportation
- **Get actionable info** — Every listing includes address, phone, hours, eligibility, and one-tap links to call or get directions
- **Choose their experience** — Toggle AI matching on or off based on personal preference

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js (App Router) | Server-rendered React app with API routes |
| Styling | Tailwind CSS | Responsive, mobile-first design |
| Database | Supabase (PostgreSQL) | Resource listings with full-text search |
| AI Matching | Anthropic Claude API (Sonnet) | Natural language understanding for search queries |
| Hosting | Vercel + AWS Amplify | Dual deployment for reliability |
| Domain | sgfaidbase.org | SSL via Let's Encrypt (automatic) |

## Architecture

```
User types "I need help with groceries"
         │
         ▼
   Next.js API Route (/api/search)
         │
    ┌────┴────┐
    │ AI On?  │
    ├─Yes─────┤──────► Claude API (Sonnet) ──► Structured JSON
    │         │        {category, confidence, empathetic summary}
    ├─No──────┤──────► Supabase full-text search (direct)
    └─────────┘
         │
         ▼
   Supabase PostgreSQL
   (filtered by matched category)
         │
         ▼
   Resource cards with contact info,
   one-tap call/directions
```

## Features

### MVP (Vibeathon Scope)
- [x] Natural language search with AI-powered matching
- [x] Four Walls categories: Food, Housing, Utilities, Transportation
- [x] Resource detail pages with call/map/website links
- [x] AI toggle — search with or without AI assistance
- [x] Mobile-first responsive design
- [x] Voice input via Web Speech API
- [x] Community feedback form for corrections and suggestions
- [x] Verified resource data from direct outreach to Springfield organizations
- [x] Crisis safety net — 988 and 911 prominently displayed

### Roadmap (Post-Vibeathon)
- [ ] Multilingual support (Spanish and other languages via Claude API)
- [ ] Additional categories: mental health, job training, childcare
- [ ] Admin portal for organizations to update their own listings
- [ ] PWA support (Add to Home Screen)
- [ ] Community board for mutual aid posts
- [ ] Map view of nearby resources
- [ ] SMS-based search for users without smartphones

## Project Structure

```
sgf-aidbase/
├── app/
│   ├── layout.tsx              # Root layout, header, footer, disclaimer
│   ├── page.tsx                # Homepage: search + category cards
│   ├── search/page.tsx         # AI-powered search results
│   ├── category/[slug]/page.tsx # Category browse
│   ├── resource/[id]/page.tsx  # Resource detail
│   ├── feedback/page.tsx       # Community feedback form
│   ├── about/page.tsx          # About Ctrl+Aid
│   └── api/
│       ├── search/route.ts     # AI matching endpoint
│       ├── resources/route.ts  # Resource listing endpoint
│       └── feedback/route.ts   # Feedback submission endpoint
├── components/                 # Reusable UI components
├── lib/                        # Supabase client, Claude helpers, types
├── docs/                       # Architecture & planning documents
├── public/                     # Static assets
└── README.md
```

## Methodology

This project was built during Springfield Tech Week 2026 as part of the Vibeathon, a vibe-coding hackathon powered by Codefi.

### Process
1. **Validation** — Used Traction Studio AI (by Codefi) to validate the problem statement and identify target users
2. **Architecture** — Used Claude (Anthropic) for architecture decisions, data modeling, and prompt engineering
3. **Market Research** — Visited Springfield organizations in person. Called phone numbers. Verified hours. Talked to social workers and case managers about how people find help today.
4. **Development** — Used Claude in VSCode for AI-assisted code generation from structured blueprint documents
5. **Deployment** — Dual deployment to Vercel (primary) and AWS Amplify (backup) from a single GitHub repo

### Design Principles
- **Directory, not provider** — We connect people to help. We don't diagnose, counsel, or promise outcomes.
- **Amplify, don't compete** — We drive traffic to existing organizations, not away from them.
- **AI should be invisible** — Users don't need to know AI powers the search. They just need good results.
- **Accuracy is a responsibility** — Every resource listing was verified through direct contact with the organization.
- **Choice matters** — AI matching can be toggled off for users who prefer traditional search.

## Data Sources

All resource data was collected through direct outreach to Springfield, MO organizations during market research on March 25, 2026. Information was verified by phone or in-person visit. Last verification dates are tracked per resource.

**Disclaimer:** SGF AidBase helps connect you with community resources in Springfield, MO. Always verify details directly with the organization. If you are in immediate danger, call 911. For crisis support, call or text 988.

## Running Locally

```bash
# Clone the repo
git clone https://github.com/[your-username]/sgf-aidbase.git
cd sgf-aidbase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Anthropic API keys

# Run the dev server
npm run dev

# Open http://localhost:3000
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Team

**Ctrl+Aid** — Built for Springfield Tech Week 2026 Vibeathon

> *"Springfield has the resources. Springfield has the heart. SGF AidBase just connects the two."*

## License

MIT

## Acknowledgments

- The incredible nonprofits of Springfield, MO who do the real work every day
- [Codefi](https://codefiworks.com) and [Traction Studio AI](https://tractionstudio.ai) for the validation framework
- [Anthropic](https://anthropic.com) for Claude — the AI that helped architect, build, and power this app
- [Springfield Tech Council](https://sgftech.org) for organizing Springfield Tech Week
- Everyone who took 5 minutes during market research to answer questions and share data
