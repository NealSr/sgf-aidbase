# SGF AidBase — Market Research Plan (Tuesday)

## Goals for Tuesday
1. **Validate the problem** — Confirm that people struggle to find community resources in Springfield
2. **Collect real resource data** — Get accurate names, addresses, phone numbers, hours for all 3 categories
3. **Get user feedback** — Show the concept to potential users and organizations, note their reactions
4. **Build relationships** — Let orgs know what you're building; turn skeptics into supporters

## Who to Talk To

### Tier 1: Organizations (The Supply Side)
These are the people who HAVE resources. They'll give you data AND validate the problem.

**Food Assistance:**
- Ozarks Food Harvest — (417) 865-3411
- Crosslines — (417) 866-8008
- Salvation Army Springfield — (417) 862-5509
- Catholic Charities of Southern MO — (417) 866-0841
- Victory Mission — (417) 864-6691

**Housing & Shelter:**
- Safe to Sleep — (417) 862-8890
- The Kitchen, Inc. — (417) 837-1700
- Habitat for Humanity Springfield — (417) 829-4001
- Community Partnership of the Ozarks — (417) 888-2020
- One Door — (417) 225-7499

**Utility & Bill Help:**
- Community Action Agency of Greene County
- Salvation Army (also does utility assistance)
- Community Foundation of the Ozarks — (417) 864-6199
- LIHEA program via CPO

### Tier 2: People in Need (The Demand Side)
These are harder to reach directly, but you can find them through:
- Waiting rooms at the organizations above (ask permission first)
- Public library — people use library computers to search for help
- Laundromats, bus stops, community centers
- Social workers, case managers (they're the ones currently doing the "navigation" manually)

### Tier 3: Adjacent Professionals
- Social workers at CoxHealth or Mercy
- 211 operators (call 211 and ask about their most common requests)
- School counselors (they refer families to resources constantly)
- Church outreach coordinators

## Interview Questions

### For Organizations
1. "We're building a free app that helps Springfield residents find community resources by typing what they need in plain language. The app would list your organization's name, address, phone, hours, and what you offer. Would you want to be included?"
2. "What are the most common questions people ask when they first contact you?"
3. "How do people currently find out about your services?" (Follow-up: "Is that working well?")
4. "What's the biggest barrier for people who need your help but don't reach out?"
5. "Is there anything we should know about your eligibility requirements or how to describe your services accurately?"
6. "Are there other organizations you frequently refer people to that we should include?"
7. "Can I verify your current hours, phone number, and address?" (BRING A NOTEPAD)

### For People Seeking Help
1. "If you needed help finding food, housing, or bill assistance in Springfield, where would you start looking?"
2. "Have you ever struggled to find the right organization for help? What was that like?"
3. "If there was an app where you could just type 'I need help with groceries' and get a list of places, would you use it?"
4. "What would make you trust an app like that?" (Follow-up: accuracy? Reviews? Simplicity?)
5. "Do you usually search for help on your phone or a computer?"

### For Social Workers / Case Managers
1. "How much of your time is spent connecting people with the right resource?"
2. "Do you have a go-to list or document you use for referrals? What format is it in?"
3. "What categories of need come up most frequently?"
4. "If there was a public-facing resource directory that was always up-to-date, would that change your workflow?"

## What to Bring
- [ ] Phone (for recording with permission, or just taking notes)
- [ ] Notebook and pen (old school backup)
- [ ] A 30-second verbal pitch rehearsed: "Hi, I'm [Name] from Ctrl+Aid+Shift. We're building a free app for Springfield Tech Week that helps people find community resources like food banks, shelters, and utility assistance — just by typing what they need. I'm doing some research today to make sure we get it right. Do you have 5 minutes?"
- [ ] Business card or a QR code linking to... something (even a simple landing page)
- [ ] Screenshot/mockup of the app concept on your phone (we can generate this tonight)

## Data Collection Spreadsheet
For each resource you discover, capture:
| Field | Example |
|---|---|
| Organization Name | Ozarks Food Harvest |
| Category | Food Assistance |
| Description | Regional food bank... |
| Address | 2810 N Cedarbrook Ave |
| Phone | (417) 865-3411 |
| Website | ozarksfoodharvest.org |
| Hours | Mon-Fri 8AM-4:30PM |
| Eligibility | Partner agencies distribute... |
| Tags/Keywords | food bank, groceries, hunger |
| Notes | Also does holiday programs |
| Verified Date | 3/25/2026 |

**Pro tip:** Create a Google Sheet or Airtable for this and fill it in real-time on your phone. You can import it into Supabase later.

## Schedule Suggestion for Tuesday

| Time | Activity |
|---|---|
| 8:00 AM | Wake up. Coffee. Review these questions. |
| 8:30 AM | Run through Traction Studio AI Wave 1 (if not done last night) |
| 9:00 AM | Start calling organizations from Tier 1 list |
| 10:00 AM | Visit 2-3 organizations in person (bring the list) |
| 12:00 PM | Lunch. Review notes. Enter data into spreadsheet. |
| 1:00 PM | Visit 2-3 more orgs. Try to catch social workers or case managers. |
| 3:00 PM | Call 211. Ask them about top requests and pain points. |
| 4:00 PM | Head home. Compile all data. |
| 5:00 PM | Apply feedback to the app. Enter real data into Supabase. |
| 6:00 PM | Evening coding session — iterate on UI/features based on feedback |
| 10:00 PM+ | Night owl mode — keep building |

## Key Feedback to Listen For
- "Oh, we already have something like that" → Ask what it is and how it's different
- "That would be amazing, we get calls all the time from people who don't know where to go" → GOLD. Write this down. Quote it in your demo.
- "I'm not sure I'd want us listed" → Respect it. Ask why. Maybe they're overwhelmed. Note it and move on.
- "You should also include [X category]" → Write it down for post-MVP roadmap. Mention in demo.
- "The hardest part is keeping info up-to-date" → This is a known challenge. Note it. Consider a "suggest an update" feature later.
