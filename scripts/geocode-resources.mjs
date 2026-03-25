// scripts/geocode-resources.mjs
// Run with: node scripts/geocode-resources.mjs
// Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Rate-limited fetch (Nominatim requires 1 req/sec and a User-Agent)
async function geocodeAddress(address) {
  const query = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "SGFAidBase/1.0 (sgfaidbase.org - vibeathon project)",
    },
  });

  const data = await res.json();

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display: data[0].display_name,
    };
  }
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🗺️  SGF AidBase Geocoder — Populating lat/lon for resources\n");

  // Fetch all resources missing lat/lon
  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, name, address, city, state, latitude, longitude")
    .is("latitude", null);

  if (error) {
    console.error("❌ Failed to fetch resources:", error.message);
    process.exit(1);
  }

  console.log(`Found ${resources.length} resources without coordinates.\n`);

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const resource of resources) {
    // Skip resources with vague addresses
    const skipPatterns = [
      "confidential",
      "various locations",
      "apply online",
      "call for",
    ];
    const addressLower = resource.address.toLowerCase();
    if (skipPatterns.some((p) => addressLower.includes(p))) {
      console.log(`⏭️  Skipping "${resource.name}" — address is not specific`);
      failed++;
      failures.push({ name: resource.name, reason: "Non-specific address" });
      continue;
    }

    // Build full address string
    const fullAddress = `${resource.address}, ${resource.city || "Springfield"}, ${resource.state || "MO"}`;
    console.log(`📍 Geocoding: ${resource.name}`);
    console.log(`   Address: ${fullAddress}`);

    const result = await geocodeAddress(fullAddress);

    if (result) {
      // Update Supabase
      const { error: updateError } = await supabase
        .from("resources")
        .update({ latitude: result.lat, longitude: result.lon })
        .eq("id", resource.id);

      if (updateError) {
        console.log(`   ❌ DB update failed: ${updateError.message}`);
        failed++;
        failures.push({ name: resource.name, reason: updateError.message });
      } else {
        console.log(`   ✅ ${result.lat}, ${result.lon}`);
        success++;
      }
    } else {
      console.log(`   ❌ No results found`);
      failed++;
      failures.push({ name: resource.name, reason: "No geocoding results" });
    }

    // Respect Nominatim rate limit
    await sleep(1100);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Geocoded: ${success}`);
  console.log(`❌ Failed: ${failed}`);

  if (failures.length > 0) {
    console.log(`\nFailed resources (enter manually):`);
    failures.forEach((f) => console.log(`   - ${f.name}: ${f.reason}`));
    console.log(
      `\nTip: For failed resources, search the address in Google Maps,`
    );
    console.log(
      `right-click → "What's here?" → copy the coordinates → update in Supabase.`
    );
  }

  console.log(`\n🏁 Done! Check your Supabase resources table for lat/lon.`);
}

main().catch(console.error);
