"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { supabase, Resource, Category } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distance";
import { getDistanceLabel } from "@/lib/location";
import PhoneLink from "@/app/components/PhoneLink";

/** Resource enriched with distance and category info for display */
type NearbyResource = Resource & {
  distance: number;
  distanceLabel: { label: string; emoji: string };
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
};

/** Max results shown — top 10 nearest across all categories */
const MAX_RESULTS = 10;

function NearbyResults() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");
  const hasLocation = !isNaN(lat) && !isNaN(lon);

  const [loading, setLoading] = useState(hasLocation);
  const [resources, setResources] = useState<NearbyResource[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasLocation || hasFetched.current) return;
    hasFetched.current = true;

    async function fetchNearby() {
      // Fetch all active resources and categories in parallel
      const [resResult, catResult] = await Promise.all([
        supabase
          .from("resources")
          .select("*")
          .eq("is_active", true)
          .not("latitude", "is", null)
          .not("longitude", "is", null),
        supabase.from("categories").select("*"),
      ]);

      const allResources = (resResult.data as Resource[]) ?? [];
      const categories = (catResult.data as Category[]) ?? [];

      // Build a lookup map for category info
      const catMap = new Map(categories.map((c) => [c.id, c]));

      // Calculate distance for each resource, sort, take top 10
      const nearby: NearbyResource[] = allResources
        .map((r) => {
          const dist = calculateDistance(lat, lon, r.latitude!, r.longitude!);
          const cat = catMap.get(r.category_id);
          return {
            ...r,
            distance: dist,
            distanceLabel: getDistanceLabel(dist),
            categoryName: cat?.name ?? "Other",
            categorySlug: cat?.slug ?? "",
            categoryIcon: cat?.icon ?? "📌",
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, MAX_RESULTS);

      setResources(nearby);
      setLoading(false);
    }

    fetchNearby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No location params — the user navigated here directly
  if (!hasLocation) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <p className="text-base mb-4" style={{ color: "var(--foreground)" }}>
          We need your location to find nearby resources.
        </p>
        <Link
          href="/"
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          ← Go home and try &ldquo;Resources near me&rdquo;
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: "var(--foreground)" }}
        >
          Resources closest to you
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Top {MAX_RESULTS} nearest across all categories
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p
              className="text-lg animate-pulse"
              style={{ color: "var(--muted)" }}
            >
              Finding resources near you...
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && resources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-base mb-4" style={{ color: "var(--foreground)" }}>
              No resources with location data found.
            </p>
            <Link
              href="/"
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Browse all categories →
            </Link>
          </div>
        )}

        {/* Resource cards */}
        {!loading && resources.length > 0 && (
          <>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--muted-light)" }}
            >
              Showing {resources.length} resource
              {resources.length !== 1 ? "s" : ""} · Sorted by nearest
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border p-5"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  {/* Category badge */}
                  <Link
                    href={`/category/${resource.categorySlug}`}
                    className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2"
                    style={{
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                    }}
                  >
                    {resource.categoryIcon} {resource.categoryName}
                  </Link>

                  <h2
                    className="text-lg font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {resource.name}
                  </h2>

                  {/* Distance label */}
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: "var(--accent)" }}
                  >
                    {resource.distanceLabel.emoji}{" "}
                    {resource.distanceLabel.label}
                  </p>

                  <div className="flex flex-col gap-1.5 mb-4">
                    {resource.address && (
                      <p
                        className="text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        📍 {resource.address}, {resource.city},{" "}
                        {resource.state} {resource.zip}
                      </p>
                    )}
                    {resource.phone && (
                      <p className="text-sm">
                        <span style={{ color: "var(--muted)" }}>📞 </span>
                        <PhoneLink
                          phone={resource.phone}
                          style={{ color: "var(--accent)" }}
                        />
                      </p>
                    )}
                    {resource.hours && (
                      <p
                        className="text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        🕐 {resource.hours}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/resource/${resource.id}`}
                    className="nav-link text-sm font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Browse all link */}
        {!loading && (
          <div className="text-center mt-2 mb-4">
            <Link href="/" className="nav-link text-sm font-medium">
              ← Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NearbyPage() {
  return (
    <Suspense>
      <NearbyResults />
    </Suspense>
  );
}
