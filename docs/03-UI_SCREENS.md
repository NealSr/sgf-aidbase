# SGF AidBase — UI Screens & Components

## Design Direction
- **Tone:** Warm, trustworthy, accessible. For someone in a stressful moment.
- **Palette:** Earth tones — forest green accents (#2D6A4F), cream backgrounds, warm grays. Dark mode supported.
- **Typography:** Friendly sans-serif. Large touch targets. Minimum 16px body text.
- **Accessibility:** WCAG AA minimum. High contrast. Screen reader friendly. Mobile-first.
- **Responsive:** Mobile-first design. Many users in need access the web via phone.
- **Key principle:** This is for people in crisis. Simple, calming, fast.

## Screen 1: Homepage (app/page.tsx)

```
┌─────────────────────────────────────────┐
│  [Logo] SGF AidBase        [About] [FB] │
├─────────────────────────────────────────┤
│     Find Help in Springfield, MO        │
│  Connecting people with the resources   │
│            they need                    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ What do you need help with?     │    │
│  │ [________________________] 🔍   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  "I need food for my family"            │
│  "Help paying my electric bill"         │
│  "I need a safe place to sleep tonight" │
│  "I need help getting across town"      │
│                                         │
│  ── or browse by category ──            │
│                                         │
│  ┌──────────┐ ┌──────────┐             │
│  │ 🍎 Food  │ │ 🏠 Housing│            │
│  └──────────┘ └──────────┘             │
│  ┌──────────┐ ┌──────────┐             │
│  │ 💡 Bills │ │ 🚌 Transit│            │
│  └──────────┘ └──────────┘             │
├─────────────────────────────────────────┤
│  Disclaimer · 988 · 911 · Ctrl+Aid+Shift│
└─────────────────────────────────────────┘
```

- Server component fetching categories from Supabase
- Example chips are clickable → auto-fill search and submit
- Category cards link to /category/[slug]
- Search submits to /search?q=[query]

## Screen 2: Search Results (app/search/page.tsx)

```
┌─────────────────────────────────────────┐
│  [Search bar with query pre-filled]     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 💬 "It sounds like you need     │    │
│  │ help with utility bills..."     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Community Partnership - LIHEA   │    │
│  │ 📍 330 N Jefferson Ave          │    │
│  │ 📞 (417) 888-2020              │    │
│  │ 🕐 Mon-Fri 8AM-5PM            │    │
│  │ 🚶 0.8 mi · Walkable (~15 min)│    │
│  │ [View Details →]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ OACAC - LIHEAP                  │    │
│  │ 📍 215 S Barnes Ave            │    │
│  │ 🚌 2.1 mi · May need a bus     │    │
│  │ [View Details →]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  You might also need: Housing →         │
│  Browse all categories                  │
└─────────────────────────────────────────┘
```

- Client component (uses browser Geolocation API)
- Calls POST /api/search with query + optional lat/lon
- AI summary in highlighted card at top
- Distance labels on each resource card (Haversine calculation)
- Results sorted nearest first when location available
- Secondary category suggestion if the AI returns one
- Fallback message if no results match

### Distance Labels
| Distance | Display |
|---|---|
| < 0.5 mi | 🚶 Walking distance (~10 min) |
| 0.5-1 mi | 🚶 Walkable (~15-20 min) |
| 1-3 mi | 🚌 May need a bus or ride |
| 3+ mi | 🚗 You'll likely need transportation |
| No location | (no distance shown, no penalty) |

## Screen 3: Category Browse (app/category/[slug]/page.tsx)

Same card layout as search results but without AI summary card. Direct Supabase query, no OpenAI API call. Shows category description at top, resource count, and all resources in that category. Distance labels shown if user has shared location.

## Screen 4: Resource Detail (app/resource/[id]/page.tsx)

```
┌─────────────────────────────────────────┐
│  ← Back to results                      │
│                                         │
│  Ozarks Food Harvest                    │
│  [Food Assistance] badge                │
│                                         │
│  Description text...                    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 📍 2810 N Cedarbrook Ave       │    │
│  │    [Get Walking Directions →]   │    │
│  │ 📞 (417) 865-3411  [Call →]    │    │
│  │ 🌐 ozarksfoodharvest.org [→]   │    │
│  │ 🕐 Mon-Fri 8:00 AM - 4:30 PM  │    │
│  │ ✅ Eligibility: ...            │    │
│  │ 🗣 Languages: English          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Last verified: March 25, 2026          │
│  (or: "Not yet verified — please       │
│   confirm details directly")            │
│                                         │
│  [👍 Helpful] [👎 Not quite]           │
│                                         │
│  Disclaimer text                        │
└─────────────────────────────────────────┘
```

- "Get Walking Directions" opens Google Maps with `travelmode=walking`
- "Call" uses `tel:` protocol (one tap on mobile)
- Last verified date shown; if null, honesty note displayed
- Thumbs up/down logs to console for MVP

## Screen 5: About Page (app/about/page.tsx)

Sections: What is SGF AidBase, How it works, Who built this (Ctrl+Aid+Shift, Traction Studio, Claude, Supabase), Credits (library, organizations), Data accuracy note + link to feedback, Crisis resources (988, 911, DV hotline, 211).

## Screen 6: Feedback Page (app/feedback/page.tsx)

Simple form: message textarea (required), email (optional), honeypot hidden field. Submit inserts to Supabase feedback table. Success message: "Thank you! Your feedback has been received and will be reviewed by the SGF AidBase team."

## Screen 7: Admin Page (app/admin/page.tsx)

Password prompt on load (checks against ADMIN_PASSWORD env var). Once authenticated: resource list with edit buttons, "Add New Resource" form, "Set as Verified Today" button per resource. Not linked in main nav. Functional, not pretty.

## Shared Components

- **SearchBar** — input + submit, optional pre-filled query
- **CategoryCard** — emoji icon, title, clickable, links to /category/[slug]
- **ResourceCard** — name, address, phone, hours, distance label, "View Details" link
- **Header** — logo left, About + Feedback links right, sticky
- **Footer** — disclaimer, crisis lines, "Built with ♥ by Ctrl+Aid+Shift", data source date
- **LoadingSpinner** — "Finding resources for you..."
