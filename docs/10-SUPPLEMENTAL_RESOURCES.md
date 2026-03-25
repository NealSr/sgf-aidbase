# SGF AidBase — Supplemental Resources from Library Directory
# Source: "Where to get help in Springfield" — Springfield Public Library
# Last updated by library: 11/01/2025 (per footer on each page)

## KEY CORRECTIONS TO EXISTING DATA

1. **Crosslines** — Corrected address: 3055 E Division St (we had this right), Hours confirmed: Mon-Thu 9:00 AM-1:30 PM, Wed 5:30-7 PM, Fri 9:00 AM-12:00 PM. NOTE: Greene County Residence Only.
2. **Salvation Army Food Pantry** — Has SEPARATE pantry hours from the free lunch: Wed 9:30-11:30 AM, Fri 1:00-2:30 PM. Has eligibility requirements. We should list the pantry AND the free lunch as separate resources.
3. **Victory Mission** — Confirmed address: 1715 N Boonville Ave. Emergency + Transitional shelter. 12-18 month commitment for transitional. Must provide ID, SSN. Free and paid options.
4. **Safe to Sleep** — It's WOMEN only. Hours: Daily 3:30-7:30 PM. Contact One Door during office hours Mon-Fri 8 AM-4:30 PM. After hours: call 417-893-xxxx.
5. **Well of Life** — Confirmed: 418 S Kimbrough Ave. Tue and Fri. Zip 65806. Need photo ID, social security card.
6. **Help Give Hope** — Library lists phone as 417-209-2027 (we had 417-209-7027 from web). VERIFY which is correct.
7. **Veterans Coming Home** — 806 N Jefferson Ave. SEASONAL: Nov 15, 2025 - March 31, 2026. Hours: Mon-Fri 7 AM-3:30 PM, Sat-Sun 9 AM-3:30 PM. Day shelter with boots, clothes, shower. Must have ID.

## SQL: New High-Value Resources — FOOD (MEALS)

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- Connecting Grounds (multi-service — food, hygiene, day shelter)
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Connecting Grounds',
'Drop-in day shelter offering meals, snacks, clothing, hygiene services, laundry, and medical support. One of Springfield''s most accessible multi-service centers for people experiencing homelessness.',
'1000 W Chestnut Expy, Springfield, MO 65802',
'(417) 771-5397',
'https://theconnectinggrounds.com',
'Mon 12:00-4:00 PM, Tue & Thu 8:00 AM-4:00 PM, Sat 8:00 AM-12:00 PM',
'No barriers. Open to anyone in need.',
ARRAY['day shelter', 'meals', 'snacks', 'clothing', 'hygiene', 'laundry', 'medical', 'no ID required']),

-- Parkview Christian Church Meal Programs
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Parkview Christian Church — Meal Programs',
'Serves three meals on Wednesdays: breakfast, lunch, and dinner. One of the few locations in Springfield offering multiple daily meals.',
'1362 S Campbell Ave, Springfield, MO 65807',
'(417) 862-8281',
NULL,
'Wed Breakfast 7:00-8:15 AM, Lunch 11:00 AM-1:00 PM, Dinner 5:15 PM',
'Open to anyone.',
ARRAY['free meals', 'breakfast', 'lunch', 'dinner', 'wednesday', 'hot meal']),

-- Drew Lewis Foundation / Fairbanks Community Hub
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Drew Lewis Foundation — Fairbanks Community Hub',
'Weekly community dinner on Thursdays. Part of a broader community hub offering neighborhood services and programs.',
'1126 N Broadway Ave, Springfield, MO',
'(417) 200-2223',
'https://drewlewis.org/',
'Community Dinner: Thursdays 5:00-6:00 PM',
'Open to anyone in the community.',
ARRAY['community dinner', 'thursday', 'free meal', 'neighborhood']),

-- Grace United Methodist Church
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Grace United Methodist Church — Evening Meals',
'Serves evening meals three nights a week. Located near downtown Springfield.',
'600 S Jefferson Ave, Springfield, MO 65806',
'(417) 869-0765',
NULL,
'Mon-Wed 4:30-5:30 PM',
'Open to anyone.',
ARRAY['free meals', 'dinner', 'evening', 'downtown']),

-- Dream Center (expanded from what we had)
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Springfield Dream Center',
'Community dinners, senior food box distribution, diaper distribution, and emergency supplies. Multi-service center supporting families and individuals.',
'829 W Atlantic St, Springfield, MO 65803',
'(417) 720-1065',
NULL,
'Mon-Fri 10:00 AM-5:00 PM. Community dinner 1st Tue of month 5:45-6:45 PM. Senior boxes 1st/2nd Mon 1:00-3:00 PM. Diapers Wed & Thu 10:00 AM-12:00 PM.',
'Varies by program. Senior boxes: 60+, income qualified.',
ARRAY['community dinner', 'senior food', 'diapers', 'emergency supplies', 'dream center']),

-- Meals on Wheels via SeniorAge
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Meals on Wheels — SeniorAge Area Agency on Aging',
'Home-delivered meals for seniors. Can also assist with caregiver support, safety equipment, and tax preparation. Multiple delivery routes through Cox Health and SeniorAge.',
'1735 S Fort Ave, Springfield, MO 65807',
'(417) 862-0762',
NULL,
'Call for delivery schedule and enrollment.',
'Seniors. Call for income and age eligibility.',
ARRAY['meals on wheels', 'seniors', 'home delivery', 'elderly', 'caregiver support']);
```

## SQL: New High-Value Resources — FOOD (PANTRIES)

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- Grand Oak Baptist Mission Center
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Grand Oak Baptist Mission Center',
'Food distribution center operating three mornings and afternoons per week. Serves Greene County residents.',
'2045 W Grand St, Springfield, MO 65802',
'(417) 862-4816',
NULL,
'Tue-Thu 8:00 AM-10:30 AM and 1:00-3:00 PM',
'Must bring ID, proof of address, and Social Security cards for each family member. Greene County residents.',
ARRAY['food pantry', 'groceries', 'food distribution']),

-- Salvation Army Food Pantry (separate from free lunch)
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Salvation Army — Food Pantry',
'Grocery pick-up pantry with eligibility requirements. Separate from the daily free lunch program. Also offers clothing vouchers, hygiene kits, and bus passes.',
'1707 W Chestnut Expy, Springfield, MO 65802',
'(417) 862-5509',
'https://centralusa.salvationarmy.org/midland/springfieldMO/',
'Wed 9:30-11:30 AM, Fri 1:00-2:30 PM',
'Greene or Christian County residents. Must meet eligibility requirements. Valid ID required.',
ARRAY['food pantry', 'groceries', 'clothing', 'hygiene', 'bus passes']),

-- Community Fridges (unique resource!)
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Springfield Community Fridges',
'Free community refrigerators stocked with fresh produce and food. Take what you need, leave what you can. Multiple locations including Library Station and Midtown Library. Available during library hours.',
'Library Station: 2535 N Kansas Expy / Midtown Library: 397 E Central St, Springfield, MO',
NULL,
NULL,
'Available during library hours of operation.',
'No barriers. No ID required. Take what you need.',
ARRAY['community fridge', 'free food', 'fresh produce', 'no barriers', 'library']);
```

## SQL: New High-Value Resources — SHELTER

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- Harmony House (Domestic Violence)
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Harmony House — Domestic Violence Shelter',
'Emergency shelter for survivors of domestic violence. 24-hour crisis hotline available. Confidential location.',
'Confidential Location, Springfield, MO',
'(417) 864-7233',
NULL,
'24/7 crisis line. Office hours Mon-Fri 8:30 AM-4:00 PM.',
'Survivors of domestic violence. Confidential intake.',
ARRAY['domestic violence', 'crisis shelter', 'women', 'confidential', '24 hour hotline', 'DV']),

-- Cold Weather Shelters (seasonal — critical!)
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Crisis Cold Weather Shelters (Seasonal)',
'Emergency warming shelters that operate from November 1 through March 31 when temperatures drop. Shelter open/closed status is determined daily by 4:00 PM. Call 417-290-3110 after 4:00 PM to learn status. CPO website also has shelter bed availability.',
'Various locations — call for assigned shelter',
'(417) 290-3110',
'https://cpozarks.org',
'Seasonal: Nov 1 - Mar 31. Status determined daily by 4:00 PM based on National Weather Service forecasts.',
'Open to anyone in need of emergency warming shelter.',
ARRAY['cold weather', 'warming shelter', 'seasonal', 'emergency', 'winter', 'overnight']),

-- LifeHouse Crisis Maternity Home
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'LifeHouse Crisis Maternity Home',
'Housing for pregnant women. Provides a safe, supportive environment for mothers and their young children during pregnancy and beyond.',
'424 E Monastery St, Springfield, MO',
'(417) 720-4213',
'https://lifehouse417.org/',
'Contact for intake information.',
'Pregnant women. Contact for eligibility details.',
ARRAY['maternity', 'pregnant', 'women', 'mothers', 'crisis housing']),

-- Veterans Coming Home (seasonal shelter)
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Veterans Coming Home',
'Seasonal day shelter for veterans offering boots, clothing, showers, and a safe daytime space. Operates during winter months.',
'806 N Jefferson Ave, Springfield, MO',
'(417) 866-3363',
NULL,
'Nov 15 - Mar 31. Mon-Fri 7:00 AM-3:30 PM, Sat-Sun 9:00 AM-3:30 PM. Open until 3:30 PM on shelter nights.',
'Veterans. Must have ID.',
ARRAY['veterans', 'day shelter', 'seasonal', 'winter', 'clothing', 'shower']);
```

## SQL: New High-Value Resources — UTILITY & BILL HELP

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- OACAC Housing Assistance (rent help)
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'OACAC — Housing & Rent Assistance',
'Assists low-income residents with monthly rental payments to maintain access to safe, affordable housing. Separate from LIHEAP energy assistance.',
'215 S Barnes Ave, Springfield, MO 65802',
'(417) 862-2880',
'https://oac.ac/housing-assistance/',
'Mon-Fri 8:00 AM-5:00 PM',
'Low-income residents. Contact for income guidelines.',
ARRAY['rent assistance', 'housing', 'rental payment', 'low income']),

-- Lifeline Program (Government Phone & Internet)
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'Lifeline Program — Free Phone & Internet',
'Federal program providing discounted phone and internet service to qualifying low-income households. Essential for staying connected to employers, services, and family.',
'Apply online',
NULL,
'https://lifelinesupport.org',
'Apply online anytime.',
'Must meet federal income guidelines or participate in qualifying assistance programs (SNAP, Medicaid, SSI, etc.).',
ARRAY['free phone', 'internet', 'lifeline', 'obama phone', 'connectivity', 'low income']);
```

## SQL: New High-Value Resources — TRANSPORTATION

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- Safe Parking Lot Program
((SELECT id FROM categories WHERE slug = 'transportation'),
'Safe Parking Lot Program',
'Provides a safe, monitored place for individuals living in their vehicles to park overnight. Register in advance.',
'The Venues, 2616 E Battlefield Rd, Springfield, MO',
'(417) 887-8932',
NULL,
'Register by calling. Check in at parking location by 7:00 PM.',
'Individuals living in their vehicles.',
ARRAY['safe parking', 'car living', 'overnight parking', 'vehicle', 'homeless']);
```

## RESOURCES NOTED BUT NOT IN OUR FOUR WALLS CATEGORIES
These would be great for future expansion — mention in demo roadmap:

**Mental Health (future category):**
- Burrell Behavioral Health: 417-761-5000, 24-hour hotline: 1-800-494-7355 or 988
- NAMI Springfield: 417-864-7198
- National Suicide Prevention: 988

**Health / Medical (future category):**
- Jordan Valley Community Health Center: 440 E Tampa St, 417-831-0150 (multiple locations)
- MSU Care (free healthcare for uninsured): 840 E Cherry St, 417-837-2270
- Cox Care Mobile: ages 2-18 years

**Domestic Violence (future category or sub-category):**
- Harmony House: 417-864-7233 (included above under shelter)
- National DV Hotline: 1-800-799-7233
- Victims Center: 815 W Tampa St, 417-863-7273

**Teens / Youth (future category):**
- Empowering Youth: 417-861-4244, teen emergency shelter
- Ashley House: ages 18-21, aging out of foster care
- KVC Missouri: 24/7 hotline 1-844-424-3577

**Employment (future category):**
- Missouri Job Center: 1450 N Campbell Ave, Mon-Fri 8:30 AM-4:30 PM

**Substance Abuse (future category):**
- Alcoholics Anonymous: 417-823-7125 (24 hour helpline)
- Celebrate Recovery: multiple locations

**Key Hotlines to display in app footer or crisis section:**
- 988 Suicide & Crisis Lifeline
- 211 Missouri Assistance
- National DV Hotline: 1-800-799-7233
- Child Abuse & Neglect: 1-800-392-3738
- Crime Stoppers: 417-869-8477

## SUMMARY
- **New food resources:** 9 (meals + pantries + community fridge)
- **New shelter resources:** 4 (including DV shelter and cold weather shelters)
- **New utility/bill resources:** 2 (rent help + Lifeline phone/internet)
- **New transportation:** 1 (safe parking)
- **Corrections to existing data:** 7 items flagged above
- **Future categories identified:** 6+ (mental health, medical, DV, teens, employment, substance abuse)
- **Total resources after adding these: ~36**
