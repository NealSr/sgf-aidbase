# SGF AidBase — Data Model (Supabase / PostgreSQL)

## Tables

### categories
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| name | text | Display name (e.g., "Food Assistance") |
| slug | text (unique) | URL-safe name (e.g., "food-assistance") |
| description | text | What this category covers |
| icon | text | Emoji or icon identifier for display |
| display_order | integer | Sort order on homepage |
| created_at | timestamptz | Auto-generated |

### resources
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| category_id | uuid (FK → categories.id) | Which category this belongs to |
| name | text | Organization name |
| description | text | What they offer, who they serve |
| address | text | Physical address |
| city | text | Default: "Springfield" |
| state | text | Default: "MO" |
| zip | text | Zip code |
| phone | text | Contact phone number |
| website | text (nullable) | Organization website URL |
| email | text (nullable) | Contact email |
| hours | text (nullable) | Operating hours (free text for MVP) |
| eligibility | text (nullable) | Who qualifies for this resource |
| languages | text (nullable) | Languages spoken/supported |
| tags | text[] (nullable) | Searchable keywords (e.g., ["groceries", "snap", "ebt"]) |
| is_active | boolean | Whether to show this resource (default: true) |
| last_verified | date (nullable) | When info was last confirmed accurate |
| notes | text (nullable) | Additional info or special instructions |
| latitude | float (nullable) | For future map integration |
| longitude | float (nullable) | For future map integration |
| created_at | timestamptz | Auto-generated |
| updated_at | timestamptz | Auto-generated |

## SQL Schema (Run in Supabase SQL Editor)

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📋',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Springfield',
  state TEXT NOT NULL DEFAULT 'MO',
  zip TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  hours TEXT,
  eligibility TEXT,
  languages TEXT DEFAULT 'English',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_verified DATE,
  notes TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index on resources
CREATE INDEX idx_resources_search ON resources
  USING GIN (to_tsvector('english', name || ' ' || description || ' ' || COALESCE(eligibility, '')));

-- Index for category lookups
CREATE INDEX idx_resources_category ON resources(category_id);

-- Index for active resources only
CREATE INDEX idx_resources_active ON resources(is_active) WHERE is_active = true;

-- Row Level Security: public read-only
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Resources are publicly readable"
  ON resources FOR SELECT
  USING (is_active = true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## Seed Data — Categories

```sql
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Food Assistance', 'food-assistance', 'Food banks, pantries, free meals, SNAP/EBT assistance, and grocery help for individuals and families in Springfield.', '🍎', 1),
  ('Housing & Shelter', 'housing-shelter', 'Emergency shelters, transitional housing, rent assistance, and housing programs for those experiencing or at risk of homelessness.', '🏠', 2),
  ('Utility & Bill Help', 'utility-bill-help', 'Help paying electric, gas, water, and other utility bills. Financial counseling and emergency assistance programs.', '💡', 3),
  ('Transportation', 'transportation', 'Bus passes, rideshare assistance, gas vouchers, vehicle repair programs, and other help getting where you need to go.', '🚌', 4);
```

## Seed Data — Example Resources (To be replaced with REAL data from market research)

```sql
-- Food Assistance examples
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES
  ((SELECT id FROM categories WHERE slug = 'food-assistance'),
   'Ozarks Food Harvest',
   'Regional food bank serving 270+ hunger-relief partners across 28 counties. Distributes food to pantries, shelters, and meal programs throughout the Ozarks.',
   '2810 N Cedarbrook Ave, Springfield, MO 65803',
   '(417) 865-3411',
   'https://ozarksfoodharvest.org',
   'Mon-Fri 8:00 AM - 4:30 PM',
   'Partner agencies distribute to individuals. Contact for agency locations near you.',
   ARRAY['food bank', 'groceries', 'hunger', 'food distribution']),

  ((SELECT id FROM categories WHERE slug = 'food-assistance'),
   'Crosslines Food Pantry',
   'Provides emergency food boxes to families and individuals in need. Also offers clothing assistance and holiday food programs.',
   '615 N Glenstone Ave, Springfield, MO 65802',
   '(417) 866-8008',
   NULL,
   'Mon-Thu 9:00 AM - 2:00 PM',
   'Springfield residents. Bring photo ID and proof of address. Can visit once per month.',
   ARRAY['food pantry', 'emergency food', 'groceries', 'clothing']);

-- Housing & Shelter examples
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES
  ((SELECT id FROM categories WHERE slug = 'housing-shelter'),
   'Safe to Sleep',
   'Low-barrier emergency shelter providing a safe place to sleep for individuals experiencing homelessness. No ID required.',
   'Address varies by season — call for current location',
   '(417) 862-8890',
   NULL,
   'Nightly, doors open at 7:00 PM',
   'Adults 18+. No ID required. No sobriety requirement.',
   ARRAY['emergency shelter', 'homeless', 'overnight', 'low barrier']);

-- Utility & Bill Help examples
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES
  ((SELECT id FROM categories WHERE slug = 'utility-bill-help'),
   'Community Partnership of the Ozarks - LIHEA',
   'Low Income Home Energy Assistance Program helps eligible households pay heating and cooling bills. Funded by the state of Missouri.',
   '330 N Jefferson Ave, Springfield, MO 65806',
   '(417) 888-2020',
   'https://cpozarks.org',
   'Mon-Fri 8:00 AM - 5:00 PM',
   'Must meet federal income guidelines. Bring ID, Social Security cards for household, proof of income, and most recent utility bill.',
   ARRAY['electric bill', 'gas bill', 'heating', 'cooling', 'LIHEA', 'utility assistance']);

-- Transportation examples
INSERT INTO resources (category_id, name, description, address, phone, website, hours, eligibility, tags) VALUES
  ((SELECT id FROM categories WHERE slug = 'transportation'),
   'City Utilities Transit (CU Transit)',
   'Springfield public bus system. Reduced fare programs available for seniors, people with disabilities, and Medicare recipients.',
   '301 E Central St, Springfield, MO 65802',
   '(417) 831-8782',
   'https://www.cityutilities.net/transit',
   'Routes vary — check website for schedules',
   'Reduced fare requires application. Regular fare is $1.50 per ride.',
   ARRAY['bus', 'public transit', 'bus pass', 'reduced fare', 'transportation']);
```

## Feedback Table (for user-submitted corrections and suggestions)

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  email TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS read policy — feedback is private, only visible in Supabase dashboard
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);
```

## Notes for Data Entry
- During market research Tuesday, collect REAL data to replace/supplement these examples
- Use the Supabase dashboard table editor for quick manual entry (works like a spreadsheet)
- Verify hours, phone numbers, and addresses — accuracy is everything for this app
- The `tags` array is critical for search quality — add every synonym a user might type
- Set `last_verified` to today's date when you confirm info is current
