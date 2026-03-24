# SGF AidBase — UI Screens & Components

## Design Direction
- **Tone:** Warm, trustworthy, accessible. This is for someone in a stressful moment — not a tech demo.
- **Aesthetic:** Clean and modern but NOT cold. Rounded corners. Soft shadows. Approachable colors.
- **Palette:** Earth tones with a hopeful accent. Think warm greens, soft blues, cream backgrounds. Avoid clinical white or corporate blue.
- **Typography:** Friendly, readable sans-serif. Large touch targets. Minimum 16px body text.
- **Accessibility:** WCAG AA minimum. High contrast. Screen reader friendly. Works on mobile-first.
- **Responsive:** Mobile-first design. Many users in need access the web via phone.

## Screen 1: Homepage

### Layout
```
┌─────────────────────────────────────────┐
│  [Logo] SGF AidBase        [About]      │
├─────────────────────────────────────────┤
│                                         │
│     Find Help in Springfield, MO        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  What do you need help with?    │    │
│  │  [________________________] 🔍  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Examples: "I need food for my family"  │
│  "Help paying my electric bill"         │
│  "I need a safe place to sleep tonight" │
│                                         │
│  ── or browse by category ──            │
│                                         │
│  ┌──────────┐ ┌──────────┐              │
│  │  🍎      │ │  🏠      │              │
│  │  Food    │ │ Housing  │              │
│  │  Help    │ │ & Shelter│              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │  💡      │ │  🚌      │              │
│  │ Utility  │ │Transport-│              │
│  │ & Bills  │ │  ation   │              │
│  └──────────┘ └──────────┘              │
│                                         │
├─────────────────────────────────────────┤
│  Disclaimer · Built with ♥ by Ctrl+Aid │
│  Crisis? Call 988 or 911                │
└─────────────────────────────────────────┘
```

### Behavior
- Search bar is the dominant element — it's the first thing users see
- Placeholder text rotates through examples to show users what to type
- Clicking a category card goes directly to `/category/[slug]` (no AI query needed)
- Submitting a search query goes to `/search?q=[encoded query]`
- Mobile: category cards stack vertically, search bar is full-width

### AI Code Generation Prompt
```
Build a Next.js homepage component using Tailwind CSS. The page should have:
- A warm, welcoming hero section with the heading "Find Help in Springfield, MO"
- A prominent search bar with placeholder "What do you need help with?" and a search icon button
- Below the search bar, show 3 example queries in muted text that users can click to auto-fill
- Below that, a "or browse by category" divider
- Four category cards in a 2x2 grid (stacking on mobile): Food Assistance (🍎), Housing & Shelter (🏠), Utility & Bill Help (💡), Transportation (🚌)
- Each card is clickable and routes to /category/[slug]
- Submitting the search form routes to /search?q=[query]
- Warm color palette: cream/off-white background, forest green accents, warm gray text
- Rounded corners on all cards and inputs, soft shadows
- Mobile-first responsive design
- Include a footer with disclaimer text and crisis hotline numbers
```

## Screen 2: Search Results

### Layout
```
┌─────────────────────────────────────────┐
│  [Logo] SGF AidBase        [About]      │
├─────────────────────────────────────────┤
│  [_____________ Search again ________]  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 💬 "It sounds like you need     │    │
│  │ help with utility bills. Here   │    │
│  │ are organizations in Springfield│    │
│  │ that may be able to help."      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Showing 4 results for "Utility &       │
│  Bill Help"                             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Community Partnership - LIHEA   │    │
│  │ 📍 330 N Jefferson Ave          │    │
│  │ 📞 (417) 888-2020              │    │
│  │ 🕐 Mon-Fri 8AM-5PM            │    │
│  │ [View Details →]                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Next Resource...                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ── Not what you're looking for? ──     │
│  Browse all categories                  │
│                                         │
├─────────────────────────────────────────┤
│  Disclaimer · Crisis? Call 988 or 911   │
└─────────────────────────────────────────┘
```

### Behavior
- AI-generated summary appears in a highlighted card at the top (the empathetic response)
- Resource cards show key info at a glance: name, address, phone, hours
- "View Details" links to the full resource page
- Search bar persists at top so users can refine their query
- If no results match, show: "We couldn't find an exact match, but here are all our categories. You can also call 211 for personalized help."
- Loading state: show a gentle spinner with "Finding resources for you..."

## Screen 3: Category Browse

### Layout
Same as Search Results, but without the AI summary card. Just a clean list of all resources in that category with the category name as a heading.

### Behavior
- URL: `/category/food-assistance`
- No Claude API call needed — direct Supabase query
- Shows category description at the top
- Resources sorted by name (alphabetical) or by last_verified date

## Screen 4: Resource Detail

### Layout
```
┌─────────────────────────────────────────┐
│  [Logo] SGF AidBase        [About]      │
├─────────────────────────────────────────┤
│  ← Back to results                      │
│                                         │
│  Ozarks Food Harvest                    │
│  Category: Food Assistance              │
│                                         │
│  📝 Regional food bank serving 270+     │
│     hunger-relief partners...           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 📍 2810 N Cedarbrook Ave       │    │
│  │    Springfield, MO 65803       │    │
│  │    [Open in Maps →]            │    │
│  │                                │    │
│  │ 📞 (417) 865-3411             │    │
│  │    [Call Now →]                │    │
│  │                                │    │
│  │ 🌐 ozarksfoodharvest.org      │    │
│  │    [Visit Website →]          │    │
│  │                                │    │
│  │ 🕐 Mon-Fri 8:00 AM - 4:30 PM │    │
│  │                                │    │
│  │ ✅ Who can use this:           │    │
│  │    Partner agencies distribute │    │
│  │    to individuals...          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Last verified: March 25, 2026          │
│                                         │
│  ── Was this helpful? ──                │
│  [👍 Yes]  [👎 Not quite]              │
│                                         │
├─────────────────────────────────────────┤
│  Disclaimer · Crisis? Call 988 or 911   │
└─────────────────────────────────────────┘
```

### Behavior
- "Call Now" link uses `tel:` protocol — one tap to call on mobile
- "Open in Maps" links to Google Maps with the address
- "Visit Website" opens in new tab
- Thumbs up/down is a future feature (for MVP, can be non-functional or log to console)
- "Back to results" uses browser history or returns to the category page
- "Last verified" date builds trust

## Screen 5: About Page

### Content
- **What is SGF AidBase?** — Brief description of the app and its purpose
- **Who built this?** — "Built by Ctrl+Aid during Springfield Tech Week 2026"
- **Credits** — "This tool is powered by the incredible network of nonprofits in Springfield who do the real work. We just help people find them."
- **Tools Used** — "Built with Traction Studio AI, Claude by Anthropic, Next.js, and Supabase"
- **Disclaimer** — Full disclaimer text
- **Contact / Feedback** — Email address for corrections or new resource submissions

## Component Library

### SearchBar
- Input field with placeholder text
- Submit button with search icon
- Optional: animated placeholder cycling through example queries
- Handles form submission and routing to /search

### CategoryCard
- Icon (emoji), title, brief description
- Hover effect (slight lift/shadow)
- Click routes to /category/[slug]
- Responsive: 3-column on desktop, single column on mobile

### ResourceCard
- Organization name (bold)
- Address with map icon
- Phone with phone icon
- Hours with clock icon
- "View Details →" link
- Subtle left border color matching category

### Header
- SGF AidBase logo/wordmark (left)
- "About" link (right)
- Sticky on scroll
- Simple, doesn't compete with content

### Footer
- Disclaimer text
- Crisis hotline: "In crisis? Call 988 or 911"
- "Built with ♥ by Ctrl+Aid for Springfield"
- Links to About page
