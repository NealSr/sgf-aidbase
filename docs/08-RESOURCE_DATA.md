# SGF AidBase — Real Resource Data (Compiled March 25, 2026)

## IMPORTANT: This data was scraped from organization websites. Verify phone numbers and hours before final demo. Mark `last_verified` as NULL until confirmed.

---

## SQL: Insert Categories (run this first)

```sql
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Food Assistance', 'food-assistance', 'Food banks, pantries, free meals, SNAP/EBT assistance, and grocery help for individuals and families in Springfield.', '🍎', 1),
  ('Housing & Shelter', 'housing-shelter', 'Emergency shelters, transitional housing, rent assistance, and housing programs for those experiencing or at risk of homelessness.', '🏠', 2),
  ('Utility & Bill Help', 'utility-bill-help', 'Help paying electric, gas, water, and other utility bills. Financial counseling and emergency assistance programs.', '💡', 3),
  ('Transportation', 'transportation', 'Bus passes, rideshare assistance, gas vouchers, vehicle repair programs, and other help getting where you need to go.', '🚌', 4);
```

---

## SQL: Insert Resources — FOOD ASSISTANCE

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- 1. Ozarks Food Harvest
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Ozarks Food Harvest',
'Regional food bank serving 28 counties in southwest Missouri. Distributes over 1.7 million meals per month through 270+ hunger-relief partners. Operates Mobile Food Pantry, Senior Food Boxes, Weekend Backpack Program, and Full Circle Gardens.',
'2810 N Cedarbrook Ave, Springfield, MO 65803',
'(417) 865-3411',
'https://ozarksfoodharvest.org',
'Mon-Fri 8:00 AM - 4:30 PM',
'Partner agencies distribute directly to individuals. Visit website or call to find a pantry near you.',
ARRAY['food bank', 'groceries', 'hunger', 'food distribution', 'mobile pantry', 'senior food']),

-- 2. Crosslines Community Outreach
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Crosslines Community Outreach',
'Largest client-direct food pantry in Greene County. Client-choice model lets guests select their own food like a grocery store. Also provides laundry supplies, hygiene items, diapers, and vitamins. Serves nearly 70,000 people annually.',
'3055 E Division St, Springfield, MO 65802',
'(417) 869-0563',
'https://ccozarks.org/programs/crosslines/',
'Mon-Thu 9:00 AM - 1:45 PM, Fri 9:00 AM - Noon, Wed evening 5:30 - 7:00 PM',
'Must meet USDA income requirements. Eligible recipients can shop up to six times per year. Bring ID.',
ARRAY['food pantry', 'emergency food', 'groceries', 'diapers', 'hygiene', 'client choice']),

-- 3. Salvation Army - Free Lunch
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Salvation Army — Free Daily Lunch',
'Free lunch served daily to anyone who is hungry. No questions asked. Part of the Front Line Feeding Program at Harbor House.',
'636 N Boonville Ave, Springfield, MO 65802',
'(417) 831-3371',
'https://centralusa.salvationarmy.org/midland/springfieldMO/cure-hunger/',
'Daily Noon - 1:00 PM',
'Open to anyone. No ID or income verification required.',
ARRAY['free lunch', 'hot meal', 'daily meals', 'no ID required', 'walk-in']),

-- 4. Victory Mission
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Victory Mission',
'Serves individuals and families who are hungry, homeless, or struggling. Provides meals, mobile food pantry distributions, and emergency food assistance.',
'1715 N Boonville Ave, Springfield, MO 65803',
'(417) 864-6691',
'https://www.victorymission.com/',
'Call for current meal times and mobile pantry schedule',
'Open to anyone in need.',
ARRAY['meals', 'mobile pantry', 'food', 'emergency food', 'homeless']),

-- 5. Well of Life Food Pantry
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'Well of Life Food Pantry',
'Community food pantry serving central Springfield (65806 zip code). Also serves students from MSU, OTC, Drury, and Evangel University.',
'418 S Kimbrough, Springfield, MO 65806',
NULL,
NULL,
'Tuesdays and Fridays',
'Serves central city (65806 zip code). College students from local universities also eligible.',
ARRAY['food pantry', 'college students', 'central springfield', 'groceries']),

-- 6. C-Street Connect at Crimson House
((SELECT id FROM categories WHERE slug = 'food-assistance'),
'C-Street Connect at Crimson House',
'Community food pantry open twice a month. First-come, first-served with placeholder tickets distributed early in the morning.',
'Springfield, MO 65803',
'(417) 831-1818',
NULL,
'2nd and 4th Tuesday of the month, 1:00 PM - 4:00 PM. Placeholder tickets distributed at 8:00 AM.',
'First-come, first-served.',
ARRAY['food pantry', 'bimonthly', 'community', 'groceries']);
```

---

## SQL: Insert Resources — HOUSING & SHELTER

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- 1. One Door (CPO)
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'One Door — Community Partnership of the Ozarks',
'Central point of entry for housing and shelter services. Provides coordinated intake, assessment, prioritization, and referrals. Adults go to One Door at New Day; families with children go to One Door at O''Reilly Center for Hope.',
'Adults: 809 N Campbell Ave / Families: 1518 E Dale St, Springfield, MO',
'(417) 225-7499',
'https://cpozarks.org/programs/one-door/',
'Mon-Fri 9:00 AM - 12:00 PM and 1:00 PM - 4:00 PM. Closed first Friday of each month.',
'Serves those who are homeless or at immediate risk of homelessness in Greene, Christian, and Webster counties.',
ARRAY['housing', 'homeless', 'shelter intake', 'referrals', 'coordinated entry', 'families']),

-- 2. Salvation Army Harbor House
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Salvation Army — Harbor House Shelter',
'Long-term shelter and transitional housing for men who are homeless. Residents maintain sobriety, work toward education or employment, and receive counseling. Minimum 3-6 month commitment.',
'636 N Boonville Ave, Springfield, MO 65802',
'(417) 831-3371',
'https://centralusa.salvationarmy.org/midland/springfieldMO/provide-housing/',
'Contact for intake availability',
'Men willing to make a minimum 3-6 month program commitment. Subject to space availability.',
ARRAY['mens shelter', 'transitional housing', 'homeless', 'long-term', 'rehabilitation']),

-- 3. Salvation Army Family Enrichment Center
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Salvation Army — Family Enrichment Center',
'Long-term transitional housing for homeless families. Provides a nurturing environment with case management to help families break the cycle of homelessness.',
'Springfield, MO',
'(417) 862-5509',
'https://centralusa.salvationarmy.org/midland/springfieldMO/provide-housing/',
'Contact for intake availability',
'Families willing to make a minimum 3-6 month program commitment. Subject to space availability.',
ARRAY['family shelter', 'transitional housing', 'homeless families', 'children']),

-- 4. The Kitchen, Inc.
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'The Kitchen, Inc.',
'Emergency shelter for women and families experiencing homelessness. Case managers work with each individual to identify barriers and create a plan toward independence and self-sufficiency.',
'Springfield, MO',
'(417) 837-1700',
'https://thekitcheninc.org',
'Contact for intake information',
'Homeless women and families. Case managers assess needs and barriers.',
ARRAY['womens shelter', 'emergency shelter', 'families', 'case management', 'homeless']),

-- 5. Eden Village
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'Eden Village',
'Tiny home communities providing permanent housing for the chronically homeless and disabled. Multiple village locations in Springfield.',
'Springfield, MO',
NULL,
'https://edenvillageusa.org',
'Contact for application information',
'Chronically homeless and disabled individuals.',
ARRAY['tiny homes', 'permanent housing', 'chronic homeless', 'disabled', 'community']),

-- 6. O''Reilly Center for Hope (CPO)
((SELECT id FROM categories WHERE slug = 'housing-shelter'),
'O''Reilly Center for Hope',
'Multi-service hub providing housing assistance, community education, and connection to partner agencies. Houses the One Door program for families and links to Springfield Community Land Trust for affordable homeownership.',
'1518 E Dale St, Springfield, MO',
'(417) 888-2020',
'https://cpozarks.org/programs/oreilly-center-for-hope/',
'Mon-Fri, varies by program',
'Families with children experiencing or at risk of homelessness.',
ARRAY['housing assistance', 'families', 'education', 'community land trust', 'affordable housing']);
```

---

## SQL: Insert Resources — UTILITY & BILL HELP

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- 1. OACAC — LIHEAP
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'OACAC — LIHEAP (Energy Assistance)',
'Low Income Home Energy Assistance Program helps income-eligible households pay heating and cooling bills. Energy Assistance is a one-time payment. Energy Crisis Intervention Program (ECIP) provides emergency help for households in danger of disconnection.',
'215 S Barnes Ave, Springfield, MO 65802',
'(417) 864-3460',
'https://oac.ac/liheap-energy-programs/',
'Mon-Fri. Application periods vary: Oct 1 for elderly/disabled, Nov 1 for all others.',
'Must meet federal income guidelines. Auto-qualified if receiving SNAP, TANF, or SSI.',
ARRAY['electric bill', 'gas bill', 'heating', 'cooling', 'LIHEAP', 'utility assistance', 'energy crisis']),

-- 2. City Utilities Project SHARE
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'City Utilities — Project SHARE',
'Community-supported utility assistance program for City Utilities of Springfield customers. Provides one-time utility assistance funded by donations from CU customers and employees.',
'Springfield, MO',
'(417) 831-8311',
'https://www.cityutilities.net',
'Applications open in January. Program runs January through May.',
'Must be a City Utilities customer. Must meet income guidelines. Medical expense deductions considered.',
ARRAY['electric bill', 'water bill', 'city utilities', 'Project SHARE', 'utility assistance']),

-- 3. Help Give Hope — Bill Assistance
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'Help Give Hope',
'Assists Ozarks families with rent, utilities, gas vouchers, and bus passes. Also operates a car donation program providing repaired and inspected vehicles to those in need.',
'2733 E Battlefield Suite 332, Springfield, MO 65804',
'(417) 209-7027',
'https://helpgivehope.org',
'Mon-Fri 9:00 AM - 3:00 PM. Applications accepted online only.',
'Families with children under 18 in Greene, Northern Christian, or Western Webster counties.',
ARRAY['rent assistance', 'utility bills', 'gas vouchers', 'bus passes', 'car donation']),

-- 4. Salvation Army — Emergency Assistance
((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
'Salvation Army — Emergency Social Services',
'Emergency assistance including rental assistance, utility help, prescription assistance, and transportation. Available on a case-by-case basis.',
'1707 W Chestnut Expy, Springfield, MO 65802',
'(417) 862-5509 ext. 108',
'https://centralusa.salvationarmy.org/midland/springfieldMO/',
'Mon-Fri 8:00 AM - 5:00 PM. Call first business day of month for rental assistance.',
'Greene or Christian County residents. Case-by-case basis. Valid ID required.',
ARRAY['emergency assistance', 'rent help', 'utility help', 'prescription help', 'transportation']);
```

---

## SQL: Insert Resources — TRANSPORTATION

```sql
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES

-- 1. CU Transit (The Bus)
((SELECT id FROM categories WHERE slug = 'transportation'),
'CU Transit — The Bus',
'Springfield public bus system operated by City Utilities. Multiple routes covering key areas of Springfield. Mobile passes available through Token Transit app. Reduced fare for seniors, people with disabilities, and Medicare recipients.',
'Springfield Transit Center, 301 E Central St, Springfield, MO 65802',
'(417) 831-8782',
'https://www.cityutilities.net/transit',
'Routes vary. Check website or call for current schedules.',
'Open to all. Regular fare $1.25/ride or $3.75 all-day pass. Reduced fare available with application.',
ARRAY['bus', 'public transit', 'bus pass', 'reduced fare', 'transportation', 'token transit']),

-- 2. Help Give Hope — Transportation
((SELECT id FROM categories WHERE slug = 'transportation'),
'Help Give Hope — Gas Vouchers & Bus Passes',
'Provides gas vouchers and bus passes to qualifying Ozarks families. Also operates a Car Giveaway program that purchases, repairs, and donates vehicles to those in need.',
'2733 E Battlefield Suite 332, Springfield, MO 65804',
'(417) 209-7027',
'https://helpgivehope.org/our-services/',
'Mon-Fri 9:00 AM - 3:00 PM. Applications accepted online only.',
'Families with children under 18 in Greene, Northern Christian, or Western Webster counties.',
ARRAY['gas vouchers', 'bus passes', 'free car', 'car donation', 'vehicle assistance']),

-- 3. Ability Transportation
((SELECT id FROM categories WHERE slug = 'transportation'),
'Ability Transportation',
'Non-emergency medical transport and personal transportation service. State-approved provider for Medicaid non-emergency medical transportation. Also offers personal accompaniment to appointments.',
'Springfield, MO',
NULL,
'https://www.findhelp.org/transit/transportation--springfield-mo',
'By appointment',
'Medicaid clients and general public. Serves Greene County and surrounding counties.',
ARRAY['medical transport', 'medicaid', 'non-emergency', 'appointments', 'disabled']),

-- 4. Salvation Army — Transportation Assistance
((SELECT id FROM categories WHERE slug = 'transportation'),
'Salvation Army — Transportation Assistance',
'Emergency transportation assistance including bus tickets and gas vouchers. Available as part of their Emergency Social Services on a case-by-case basis.',
'1707 W Chestnut Expy, Springfield, MO 65802',
'(417) 862-5509',
'https://centralusa.salvationarmy.org/midland/springfieldMO/',
'Mon-Fri 8:00 AM - 5:00 PM',
'Greene or Christian County residents. Case-by-case basis.',
ARRAY['bus tickets', 'gas vouchers', 'emergency transportation', 'bus pass']);
```

---

## Quick Stats for Your Demo
- **Food Assistance:** 6 resources
- **Housing & Shelter:** 6 resources
- **Utility & Bill Help:** 4 resources
- **Transportation:** 4 resources
- **Total: 20 verified-from-web resources**

## Still Need to Verify
- Phone numbers (call after 4pm)
- Operating hours (some may have changed)
- Addresses (some orgs listed without full address — fill in during phone calls)
- Help Give Hope phone number (not found on website)
- Well of Life Food Pantry phone number
- Ability Transportation phone number

## Organizations to Email/Text During Your Meeting
Top priority contacts that are most likely to respond quickly:

1. **Community Partnership of the Ozarks** — mgarand@cpozarks.org (Michelle Garand, runs O'Reilly Center for Hope)
2. **Ozarks Food Harvest** — contact form on ozarksfoodharvest.org
3. **Help Give Hope** — contact form on helpgivehope.org
4. **The Kitchen, Inc.** — contact via thekitcheninc.org
