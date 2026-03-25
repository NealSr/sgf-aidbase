# SGF AidBase — Test Plan

## Manual Smoke Test Checklist
Run through this end-to-end before every deploy. Takes ~10 minutes.

### Homepage (/)
- [ ] Page loads without errors
- [ ] All 4 category cards display with correct icons and names
- [ ] Search bar is visible and accepts text input
- [ ] Mic button (🎤) is visible next to search input (Chrome/Edge)
- [ ] AI toggle is visible below the search bar
- [ ] Clicking a category card navigates to /category/[slug]
- [ ] Clicking an example chip fills the search bar and submits to /search
- [ ] All 4 example chips work
- [ ] "Resources near me" button is visible below the search bar
- [ ] Footer displays disclaimer and crisis numbers (988, 911)
- [ ] Header links work (About, Feedback)

### Homepage — Nearby Resources
- [ ] "Resources near me" button is visible below the search bar
- [ ] Clicking it requests geolocation permission
- [ ] While locating, button shows pulsing "Finding your location..." state
- [ ] If location is shared, navigates to /nearby?lat=...&lon=...
- [ ] If location is denied, shows friendly message with "Try again" option

### Category Browse (/category/[slug])
- [ ] /category/food-assistance loads and shows resources
- [ ] /category/housing-shelter loads and shows resources
- [ ] /category/utility-bill-help loads and shows resources
- [ ] /category/transportation loads and shows resources
- [ ] Resource count is displayed ("Showing X resources")
- [ ] Each resource card shows: name, address, phone, hours
- [ ] Phone numbers are clickable tel: links
- [ ] "View Details →" links navigate to /resource/[id]
- [ ] "← Back to all categories" link works
- [ ] /category/nonexistent-slug shows a 404 or friendly error
- [ ] Print button is visible; clicking it opens browser print dialog
- [ ] Hours indicator: resources with parseable hours show green "Open now" or red "Closed" dot
- [ ] Hours indicator: resources with complex hours (e.g., "Call for info") show no indicator

### Resource Detail (/resource/[id])
- [ ] Page loads with full resource info
- [ ] Category badge/pill is displayed
- [ ] Address is shown with "Get Walking Directions →" link
- [ ] Directions link opens Google Maps with travelmode=walking
- [ ] Phone is shown with "Call Now →" link (tel: protocol)
- [ ] Website link opens in new tab (if resource has one)
- [ ] Hours are displayed with open/closed indicator (when parseable)
- [ ] Eligibility section is displayed (if resource has one)
- [ ] "Last verified" date shown OR "Not yet verified" message
- [ ] "← Back" link works (browser history)
- [ ] Disclaimer is visible
- [ ] Share button is visible in the top action bar
- [ ] Print button is visible in the top action bar
- [ ] Print button opens browser print dialog

### AI Search (/search?q=...)
- [ ] Typing "I need food" and submitting shows food resources
- [ ] AI summary card appears at the top with empathetic message
- [ ] Resource cards display below the summary
- [ ] If location is shared: distance labels appear on cards
- [ ] Distance labels use correct thresholds (walking/bus/car)
- [ ] Results are sorted nearest-first when location is available
- [ ] If location is declined: results show without distance, no errors
- [ ] Secondary category suggestion appears when relevant
- [ ] Searching for something unrelated (e.g., "haircut") shows graceful no-match message
- [ ] Empty search shows validation message
- [ ] Loading state ("Finding resources for you...") appears while fetching
- [ ] Hours indicator shows on resource cards with parseable hours

### AI Search — Category-Specific Queries
- [ ] "I'm hungry" → matches Food Assistance
- [ ] "I need a place to sleep" → matches Housing & Shelter
- [ ] "help with electric bill" → matches Utility & Bill Help
- [ ] "I need a bus pass" → matches Transportation
- [ ] "my kids haven't eaten and I'm about to be evicted" → matches one, suggests the other

### Crisis Language Detection
- [ ] Searching "I want to kill myself" shows crisis response (not regular results)
- [ ] Crisis card shows "You matter. Help is available." heading
- [ ] 988 Suicide & Crisis Lifeline card with tap-to-call button
- [ ] Crisis Text Line card (text HOME to 741741)
- [ ] National Domestic Violence Hotline card with tap-to-call
- [ ] Emergency Services (911) card with tap-to-call
- [ ] No AI summary card or regular resource cards are shown
- [ ] Searching "domestic violence" triggers crisis response
- [ ] Searching "I'm being abused" triggers crisis response
- [ ] Crisis detection works with AI toggle off (still triggers)
- [ ] Non-crisis queries (e.g., "food bank") do NOT trigger crisis response

### AI Search Toggle
- [ ] Toggle is visible below the search bar: "🤖 AI Search: On"
- [ ] Clicking toggle switches to "🔍 AI Search: Off"
- [ ] With AI on: search shows AI summary card and category-matched results
- [ ] With AI off: search shows "Showing results for: [query]" header instead of AI summary
- [ ] With AI off: results come from keyword matching (faster, no Claude API call)
- [ ] Toggle state persists after page refresh (localStorage)
- [ ] URL includes `ai=0` parameter when AI is off

### Speech-to-Text (Mic Button)
- [ ] Mic button (🎤) is visible between the search input and Search button
- [ ] Clicking mic requests microphone permission
- [ ] While listening: button turns red with pulsing indicator
- [ ] Speaking a query fills the search input with transcript
- [ ] Search auto-submits after speech is recognized
- [ ] Clicking mic again while listening stops it
- [ ] Denying mic permission shows "Microphone access is needed for voice search."
- [ ] On browsers without Web Speech API (e.g., Firefox): mic button is hidden entirely
- [ ] Voice search respects current AI toggle state

### Nearby Resources (/nearby)
- [ ] Page loads with lat/lon query parameters
- [ ] Shows "Resources closest to you" heading
- [ ] Up to 10 resource cards displayed, sorted by distance
- [ ] Each card shows: category badge, resource name, distance label, address, phone, hours
- [ ] Distance labels use walking/bus/car thresholds
- [ ] Hours indicator shows on cards with parseable hours
- [ ] "Back to home" link works
- [ ] Navigating to /nearby without lat/lon shows friendly message with link home

### Share Button (Resource Detail)
- [ ] Share button visible in top action bar on /resource/[id]
- [ ] On mobile (Web Share API supported): opens native share sheet
- [ ] On desktop: copies link to clipboard and shows "Link copied!" toast
- [ ] Toast disappears after ~2 seconds

### Phone Number Interaction
- [ ] On mobile: tapping a phone number initiates a phone call (tel: link)
- [ ] On desktop: clicking a phone number copies it to clipboard
- [ ] Desktop click shows "📋 Copied!" toast near the phone number
- [ ] Toast disappears after ~2 seconds
- [ ] Crisis hotline numbers (988, 911, DV hotline) always dial — never copy

### Print View
- [ ] Clicking print button on category page opens browser print dialog
- [ ] Clicking print button on resource detail page opens print dialog
- [ ] In print preview: header, footer, buttons, search form are hidden
- [ ] In print preview: background is white, text is black
- [ ] In print preview: link URLs are shown after link text
- [ ] In print preview: "sgfaidbase.org" appears as a page footer
- [ ] Print buttons themselves are hidden in print output

### Open/Closed Hours Indicator
- [ ] Resources with "24/7" hours show 🟢 "Open now" always
- [ ] Resources with "Mon-Fri 9:00 AM - 5:00 PM" show correct status based on current day/time
- [ ] Resources with "Daily Noon - 1:00 PM" show correct status
- [ ] Resources with complex hours (seasonal, "call for info", multiple schedules) show no indicator
- [ ] Indicator appears on: category browse, search results, nearby, and resource detail pages
- [ ] Time evaluation uses America/Chicago timezone (Springfield, MO)

### Easter Eggs
- [ ] View page source: HTML comment visible near `<html>` tag ("Built with ❤️ and ☕ at 3am...")
- [ ] Open browser console: three styled log lines appear (team name, tagline, feedback link)
- [ ] Console greeting only logs once per page load (not on every navigation)

### About Page (/about)
- [ ] Page loads with all sections
- [ ] "Who built this?" section says "Ctrl+Aid+Shift" (not "Ctrl+Aid")
- [ ] Crisis resources section shows 988, 911, DV hotline, 211
- [ ] Link to feedback page works

### Feedback Page (/feedback)
- [ ] Form displays with message textarea and optional email
- [ ] Submitting with a message shows success confirmation
- [ ] Submitting with empty message shows validation error
- [ ] Success message: "Thank you! Your feedback has been received..."
- [ ] Check Supabase feedback table — new row appears
- [ ] Honeypot test: if you manually fill the hidden "website" field, submission is silently rejected

### Admin Page (/admin)
- [ ] Page shows password prompt on load
- [ ] Wrong password is rejected
- [ ] Correct password shows resource list
- [ ] "Add New Resource" form works and inserts into Supabase
- [ ] "Edit" on existing resource pre-fills the form
- [ ] "Set as Verified Today" updates the last_verified date
- [ ] Page is NOT linked in the main navigation

### Cross-Cutting
- [ ] All pages have consistent header and footer
- [ ] Footer says "Ctrl+Aid+Shift for Springfield"
- [ ] Dark mode looks correct (if supported)
- [ ] No console errors on any page (except the intentional easter egg logs)
- [ ] 404 page works for invalid URLs

---

## Mobile Test Checklist
- [ ] Homepage: search bar is full-width, category cards stack vertically
- [ ] Homepage: mic button is visible and works (Chrome/Edge on Android)
- [ ] Homepage: "Resources near me" button works with GPS
- [ ] Category page: resource cards are full-width
- [ ] Resource detail: tapping phone number initiates a call
- [ ] Resource detail: "Get Walking Directions" opens Maps app
- [ ] Resource detail: Share button opens native share sheet
- [ ] Search: location permission prompt appears
- [ ] Search: distance labels show correctly
- [ ] Search: crisis response cards have large tap-to-call buttons
- [ ] Nearby: cards show with distance labels and category badges
- [ ] Text is readable without zooming (min 16px)
- [ ] Touch targets are large enough (min 44px)
- [ ] No horizontal scrolling on any page
- [ ] AI toggle is tappable and persists across sessions

---

## Automated Testing (Post-Vibeathon)

For a 72-hour hackathon, manual testing is fine. But for the AI judge and future development, here's what you'd add:

### Quick Wins (< 1 hour to set up)
**Playwright** — end-to-end browser testing for Next.js
```bash
npm install -D @playwright/test
npx playwright install
```

Example test:
```typescript
// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads with 4 categories', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Find Help in Springfield')).toBeVisible();
  const cards = page.locator('[data-testid="category-card"]');
  await expect(cards).toHaveCount(4);
});

test('search navigates to results', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder*="Describe"]', 'I need food');
  await page.click('button:has-text("Search")');
  await expect(page).toHaveURL(/\/search\?q=/);
});

test('category page shows resources', async ({ page }) => {
  await page.goto('/category/food-assistance');
  await expect(page.getByText('Food Assistance')).toBeVisible();
  await expect(page.getByText('Showing')).toBeVisible();
});
```

### Also Worth Adding Later
- **Jest + React Testing Library** — unit tests for components
- **API route tests** — test /api/search with mock Claude responses
- **Lighthouse CI** — automated accessibility and performance audits
- **Supabase type generation** — `npx supabase gen types` for type-safe queries

### For the AI Judge
If you want brownie points without writing full tests, add this to your README:
```markdown
## Testing
Manual test plan available in `/docs/12-TEST_PLAN.md`.
Automated testing planned with Playwright for post-MVP.
```
That signals you're thinking about quality even under time pressure.
