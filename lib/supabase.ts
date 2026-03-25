import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
};

export type Resource = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  eligibility: string | null;
  languages: string | null;
  tags: string[] | null;
  is_active: boolean;
  last_verified: string | null;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type Feedback = {
  id: string;
  message: string;
  email: string | null;
  page_url: string | null;
  created_at: string;
};
