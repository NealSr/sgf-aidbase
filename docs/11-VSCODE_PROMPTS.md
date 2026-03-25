# SGF AidBase — VSCode Claude Prompts

## How to Use This File
Copy each prompt below into your Claude Code session in VSCode, one at a time, in order.
Wait for each one to finish before pasting the next.
Review the generated code, test locally with `npm run dev`, then move on.

---

## PROMPT 0: Project Context (paste this FIRST in every new Claude Code session)

```
I'm building SGF AidBase — a community resource navigator for Springfield, MO. It's a Next.js app (App Router, TypeScript, Tailwind CSS) with Supabase (PostgreSQL) as the database and the Anthropic Claude API for AI-powered search matching.

The app helps people find food banks, shelters, utility assistance, and transportation help by typing what they need in plain English.

Key architecture:
- Next.js 14+ with App Router (app/ directory)
- Tailwind CSS for styling
- Supabase JS client for database queries
- Anthropic Claude API (Sonnet model) for natural language search matching
- Deployed on Vercel at sgfaidbase.org

Database tables:
- categories (id, name, slug, description, icon, display_order)
- resources (id, category_id, name, description, address, city, state, zip, phone, website, email, hours, eligibility, languages, tags, is_active, last_verified, notes, latitude, longitude)
- feedback (id, message, email, page_url, created_at)

Environment variables are in .env.local:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- ANTHROPIC_API_KEY
- ADMIN_PASSWORD

Design direction: Warm, trustworthy, accessible. Earth tones — forest green accents, cream/warm backgrounds. Rounded corners, soft shadows. Mobile-first. WCAG AA accessible. This app is for people in crisis — keep it simple and calming.

The existing homepage has a search bar, example query chips, and four category cards (Food Help, Housing & Shelter, Utility & Bills, Transportation) in a 2x2 grid. There's already a basic layout with header and footer. The tagline is "Find Help in Springfield, MO — Connecting people with the resources they need."

Please read the /docs folder in this project for detailed architecture, data model, and UI specifications before making changes.
```

---

## PROMPT 1: Supabase Client Setup

```
Create the Supabase client library file at lib/supabase.ts.

It should:
- Import createClient from @supabase/supabase-js
- Create and export a supabase client using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from environment variables
- Also create and export TypeScript types for our database tables:

Category type: id (string), name (string), slug (string), description (string), icon (string), display_order (number)

Resource type: id (string), category_id (string), name (string), description (string), address (string), city (string), state (string), zip (string | null), phone (string | null), website (string | null), email (string | null), hours (string | null), eligibility (string | null), languages (string | null), tags (string[] | null), is_active (boolean), last_verified (string | null), notes (string | null), latitude (number | null), longitude (number | null), created_at (string), updated_at (string)

Also export a Feedback type: id (string), message (string), email (string | null), page_url (string | null), created_at (string)

Install @supabase/supabase-js if not already installed.
```

---

## PROMPT 2: Homepage — Wire Up Real Data

```
Update the existing homepage (app/page.tsx) to fetch real categories from Supabase and display them in the category cards.

Requirements:
- Use the Supabase client from lib/supabase.ts
- Fetch categories ordered by display_order
- Replace any hardcoded category data with the real database results
- Each category card should link to /category/[slug]
- The search form should submit to /search?q=[encoded query]
- The example query chips ("I need food for my family", "Help paying my electric bill", "I need a safe place to sleep tonight") should be clickable and auto-fill the search bar then submit
- Add a fourth example chip: "I need help getting across town"
- Keep the existing warm color scheme and layout
- Make sure it works on mobile (cards stack vertically)
- This should be a server component that fetches data at render time

Keep the existing design aesthetic — don't change the colors or overall feel. Just wire it up to real data.
```

---

## PROMPT 3: Category Browse Page

```
Create app/category/[slug]/page.tsx — a page that shows all resources in a specific category.

Requirements:
- This is a dynamic route using the slug parameter
- Fetch the category by slug from Supabase
- Fetch all active resources where category_id matches, ordered by name
- Show the category name and description at the top
- Show a count: "Showing X resources"
- Display each resource as a card with:
  - Resource name (bold, larger)
  - Address with a 📍 icon
  - Phone with a 📞 icon (make it a clickable tel: link)
  - Hours with a 🕐 icon
  - A "View Details →" link to /resource/[id]
- Include the search bar at the top so users can search from any page
- Add a "← Back to all categories" link
- If the category doesn't exist, show a 404-style message
- Mobile responsive — cards stack on narrow screens
- Match the existing warm color palette (forest green, cream, warm grays)
```

---

## PROMPT 4: Resource Detail Page

```
Create app/resource/[id]/page.tsx — a detailed view of a single resource.

Requirements:
- Fetch the resource by ID from Supabase, including its category info
- Show the full resource details in a clean, card-based layout:
  - Resource name as the page heading
  - Category name as a badge/pill beneath the title
  - Description (full text)
  - Contact info section:
    - Address with "Open in Maps →" link (href to Google Maps directions URL, with walking mode: https://www.google.com/maps/dir/?api=1&destination=ADDRESS&travelmode=walking)
    - Phone with "Call Now →" link (tel: protocol)
    - Website with "Visit Website →" link (opens in new tab)
    - Email with "Send Email →" link (mailto: protocol)
  - Hours section
  - Eligibility section (who qualifies)
  - Languages spoken
  - "Last verified" date if available, or "Not yet verified — please confirm details with the organization directly" if null
- Add a "← Back to results" link that uses browser history (router.back())
- Add a "Was this helpful?" section at the bottom with thumbs up/down buttons (can log to console for MVP)
- Include the disclaimer: "Always verify details directly with the organization. If you are in immediate danger, call 911. For crisis support, call or text 988."
- Mobile responsive
- Match existing color palette
```

---

## PROMPT 5: Search Results Page with Distance Labels

```
Create app/search/page.tsx — the search results page that shows when users submit a query.

Requirements:
- Read the query from the URL search params (?q=...)
- Show the search bar at the top with the query pre-filled
- Show a loading state while fetching results: "Finding resources for you..."
- Call our API endpoint POST /api/search with the query and optionally the user's location
- Get the user's location using the browser Geolocation API (navigator.geolocation.getCurrentPosition). If they decline, proceed without location.
- Display the AI-generated summary in a highlighted card at the top (different background color, slightly emphasized)
- Below the summary, show resource cards (same style as category browse page)
- For each resource card, if the user shared their location AND the resource has lat/lon, calculate the distance using the Haversine formula and show a distance label:
  - Under 0.5 miles: "🚶 Walking distance (~10 min)"
  - 0.5 - 1 mile: "🚶 Walkable (~15-20 min)"
  - 1 - 3 miles: "🚌 May need a bus or ride"
  - 3+ miles: "🚗 You'll likely need transportation"
- Sort results by distance (nearest first) when location is available
- If there's a secondary_category in the AI response, show a section: "You might also need help with: [category name]" with a link
- If no results: show "We couldn't find an exact match. You can browse all categories below, or call 211 for personalized help."
- Include a "Not what you're looking for? Browse all categories" link at the bottom
- This must be a client component (uses browser APIs and state)
- Match existing color palette

For the Haversine formula, create a utility function in lib/distance.ts:
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number
Returns distance in miles.

Also create lib/location.ts with:
export function getDistanceLabel(miles: number): { label: string, emoji: string }
Returns the walking context label and emoji.
```

---

## PROMPT 6: Claude API Search Endpoint

```
Create app/api/search/route.ts — the API endpoint for AI-powered search.

Requirements:
- Accept POST requests with JSON body: { query: string, latitude?: number, longitude?: number }
- Validate that query is not empty
- Install and import the @anthropic-ai/sdk package
- Call the Anthropic Claude API using the claude-sonnet-4-20250514 model
- System prompt should instruct Claude to:
  - Act as a compassionate community resource navigator for Springfield, MO
  - Match the user's query to one of these categories: "food-assistance", "housing-shelter", "utility-bill-help", "transportation"
  - Consider the current date/time (pass it dynamically) when reasoning about hours
  - Consider the user's location if provided
  - Return ONLY valid JSON with this structure:
    {
      "matched_category": "slug or null",
      "confidence": 0.0-1.0,
      "summary": "empathetic 1-2 sentence message under 40 words",
      "secondary_category": "slug or null",
      "search_keywords": ["array", "of", "keywords"]
    }
  - If no category matches, set matched_category to null and suggest calling 211
  - Never sound robotic — imagine a kind librarian helping someone who just walked in stressed
- After getting Claude's response, parse the JSON
- If a category matched, query Supabase for all active resources in that category
- Return the combined response: AI summary + resources array
- If Claude API fails or returns invalid JSON, fall back to Supabase full-text search
- Add basic rate limiting: check a simple in-memory counter, max 10 requests per minute per IP

IMPORTANT: The Anthropic API key is in process.env.ANTHROPIC_API_KEY (NOT prefixed with NEXT_PUBLIC_). This is a server-side only route.

Install @anthropic-ai/sdk if not already installed.
```

---

## PROMPT 7: About Page

```
Create app/about/page.tsx — the about page for SGF AidBase.

Content:
- Heading: "About SGF AidBase"
- Section: "What is SGF AidBase?"
  - "SGF AidBase is a free community resource navigator for Springfield, MO. People describe what they need in their own words, and the app connects them with local organizations that can help — instantly."
  - "We built this around the Four Walls — the four things every person needs before anything else: food, shelter, utilities, and transportation."

- Section: "How it works"
  - "Type what you need in the search bar. Our AI understands your words and matches you with the right category of help. Every listing includes the address, phone number, hours, and eligibility — everything you need to take the next step."
  - "You can also browse by category or turn off AI matching and search directly."

- Section: "Who built this?"
  - "SGF AidBase was built by Ctrl+Aid+Shift during Springfield Tech Week 2026."
  - "We used Traction Studio AI by Codefi to validate the problem, Claude by Anthropic to architect and build the solution, and feedback from Springfield librarians and community organizations to make sure we got it right."

- Section: "Credits & Acknowledgments"
  - "This tool is powered by the incredible network of nonprofits in Springfield who do the real work every day. We just help people find them."
  - "Special thanks to the Springfield-Greene County Library District for research assistance."
  - Show logos/links for: Codefi, Anthropic, Springfield Tech Council

- Section: "Data Accuracy"
  - "Every resource listing was sourced from organization websites, the Springfield Public Library's resource directory, and direct outreach. We take accuracy seriously — but information changes. Always verify details directly with the organization."
  - "Found an error? Submit a correction on our feedback page." (link to /feedback)

- Section: "Crisis Resources"
  - "If you are in immediate danger, call 911."
  - "Suicide & Crisis Lifeline: call or text 988"
  - "National Domestic Violence Hotline: 1-800-799-7233"
  - "Child Abuse & Neglect: 1-800-392-3738"
  - "211 Missouri: dial 211 for statewide assistance"

- Match existing warm color palette, clean layout, mobile responsive
```

---

## PROMPT 8: Feedback Page

```
Create app/feedback/page.tsx — a simple feedback form for corrections and suggestions.

Requirements:
- Heading: "Help Us Stay Accurate"
- Subheading: "Found incorrect information? Have a suggestion? Let us know."
- Simple form with:
  - Message (textarea, required, placeholder: "Tell us what needs to be updated or what we're missing...")
  - Email (input, optional, placeholder: "Your email (optional — only if you want a response)")
  - Submit button
- On submit:
  - POST to /api/feedback
  - Include the current page URL in the submission (document.referrer or window.location)
  - Show a success message: "Thank you! Your feedback has been received and will be reviewed by the SGF AidBase team."
  - Clear the form after successful submission
- Create the API route at app/api/feedback/route.ts:
  - Accept POST with { message, email, page_url }
  - Insert into the feedback table in Supabase
  - Return 200 on success
  - Basic validation: message must not be empty, max 2000 characters
  - Honeypot field for spam prevention: add a hidden input field named "website" — if it has a value, silently reject (bots fill hidden fields, humans don't)
- Match existing color palette
- Mobile responsive
```

---

## PROMPT 9: Layout Updates — Header, Footer, Crisis Banner

```
Update the root layout (app/layout.tsx) and any shared components to include:

1. Header:
   - SGF AidBase wordmark/logo on the left
   - Navigation links on the right: "About" and "Feedback"
   - Sticky on scroll
   - Simple, doesn't compete with content
   - Mobile: hamburger menu or just show both links (they're small enough)

2. Footer:
   - "Built with ♥ by Ctrl+Aid+Shift for Springfield"
   - Links to: About, Feedback, GitHub repo (https://github.com/NealSr/sgf-aidbase)
   - Disclaimer: "SGF AidBase helps connect you with community resources. Always verify details directly with the organization."
   - Crisis line: "In crisis? Call or text 988 · Call 911 for emergencies"
   - "Data last sourced: March 2026"
   - Keep it compact, not overwhelming

3. Add meta tags to the layout:
   - title: "SGF AidBase — Find Help in Springfield, MO"
   - description: "Community resource navigator for Springfield, Missouri. Find food banks, shelters, utility assistance, and transportation help."
   - Open Graph tags for social sharing (og:title, og:description, og:image if available)

Keep the existing warm color palette. Make sure header and footer look good in both light and dark mode.
```

---

## PROMPT 10: Simple Admin Page (Password Protected)

```
Create app/admin/page.tsx — a simple admin interface for adding and editing resources.

Requirements:
- On page load, show a password prompt (simple input field, not real auth)
- Hardcode the password check against an environment variable: ADMIN_PASSWORD (add this to .env.local)
- Once authenticated (store in React state, not persistent — refreshing logs out):
  - Show a list of all resources from Supabase with name, category, and last_verified date
  - "Add New Resource" button that opens a form
  - Each resource has an "Edit" button
  - The form includes ALL resource fields: name, category (dropdown from categories table), description, address, phone, website, email, hours, eligibility, languages, tags (comma-separated input), notes, latitude, longitude
  - Submit button that does an INSERT (new) or UPDATE (edit) via Supabase client
  - After saving, show a success message and refresh the list
  - A "Set as Verified Today" button on each resource that updates last_verified to today's date
- This doesn't need to be pretty — functional is fine. It's an admin tool, not a user-facing page.
- Don't include this page in the main navigation
- Basic Tailwind styling, responsive enough to use on a laptop
```

---

## RUNNING ORDER

1. Paste PROMPT 0 (context) — do this first in every new session
2. PROMPT 1 (Supabase client) — foundational, everything depends on this
3. PROMPT 2 (Homepage wired up) — get real data on the home page
4. PROMPT 3 (Category browse) — click a category, see resources
5. PROMPT 4 (Resource detail) — click a resource, see full details
6. PROMPT 5 (Search results) — the star of the show, with distance labels
7. PROMPT 6 (Claude API endpoint) — powers the search page
8. Test the full flow: homepage → search → results → detail
9. PROMPT 7 (About page) — credits and context
10. PROMPT 8 (Feedback page) — community corrections
11. PROMPT 9 (Layout polish) — header, footer, meta tags
12. PROMPT 10 (Admin page) — data management for the demo
13. Git push → test on sgfaidbase.org → celebrate 🎉
