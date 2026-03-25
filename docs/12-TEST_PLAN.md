# SGF AidBase — Test Plan

## Manual Smoke Test Checklist
Run through this end-to-end before every deploy. Takes ~10 minutes.

### Homepage (/)
- [ ] Page loads without errors
- [ ] All 4 category cards display with correct icons and names
- [ ] Search bar is visible and accepts text input
- [ ] Clicking a category card navigates to /category/[slug]
- [ ] Clicking an example chip fills the search bar and submits to /search
- [ ] All 4 example chips work
- [ ] Footer displays disclaimer and crisis numbers (988, 911)
- [ ] Header links work (About, Feedback)

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

### Resource Detail (/resource/[id])
- [ ] Page loads with full resource info
- [ ] Category badge/pill is displayed
- [ ] Address is shown with "Get Walking Directions →" link
- [ ] Directions link opens Google Maps with travelmode=walking
- [ ] Phone is shown with "Call Now →" link (tel: protocol)
- [ ] Website link opens in new tab (if resource has one)
- [ ] Hours are displayed
- [ ] Eligibility section is displayed (if resource has one)
- [ ] "Last verified" date shown OR "Not yet verified" message
- [ ] "← Back" link works (browser history)
- [ ] Disclaimer is visible

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

### AI Search — Category-Specific Queries
- [ ] "I'm hungry" → matches Food Assistance
- [ ] "I need a place to sleep" → matches Housing & Shelter
- [ ] "help with electric bill" → matches Utility & Bill Help
- [ ] "I need a bus pass" → matches Transportation
- [ ] "my kids haven't eaten and I'm about to be evicted" → matches one, suggests the other

### About Page (/about)
- [ ] Page loads with all sections
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
- [ ] Dark mode looks correct (if supported)
- [ ] No console errors on any page
- [ ] 404 page works for invalid URLs

---

## Mobile Test Checklist (when you find your phone)
- [ ] Homepage: search bar is full-width, category cards stack vertically
- [ ] Category page: resource cards are full-width
- [ ] Resource detail: "Call Now" tap initiates a phone call
- [ ] Resource detail: "Get Walking Directions" opens Maps app
- [ ] Search: location permission prompt appears
- [ ] Search: distance labels show correctly
- [ ] Text is readable without zooming (min 16px)
- [ ] Touch targets are large enough (min 44px)
- [ ] No horizontal scrolling on any page

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
