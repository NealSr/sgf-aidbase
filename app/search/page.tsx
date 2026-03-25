"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import SearchForm from "@/app/components/SearchForm";
import { Resource } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distance";
import { getDistanceLabel } from "@/lib/location";
import PhoneLink from "@/app/components/PhoneLink";
import HoursIndicator from "@/app/components/HoursIndicator";

/** Crisis resource returned when crisis language is detected */
type CrisisResource = {
  name: string;
  phone: string | null;
  description: string;
};

type SearchResult = {
  summary: string;
  resources: Resource[];
  secondary_category?: { name: string; slug: string } | null;
  crisis?: boolean;
  /** Only present when crisis is true — flat list of hotlines */
  crisisResources?: CrisisResource[];
};

type ResourceWithDistance = Resource & {
  distance?: number;
  distanceLabel?: { label: string; emoji: string };
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const useAI = searchParams.get("ai") !== "0";

  // Only show loading state if there's a query to search for
  const [loading, setLoading] = useState(!!query);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Track whether initial fetch has fired to avoid duplicate calls
  const hasFetched = useRef(false);

  /** POST to /api/search and update state with results */
  function fetchResults(
    q: string,
    loc: { lat: number; lon: number } | null
  ) {
    setLoading(true);
    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        latitude: loc?.lat,
        longitude: loc?.lon,
        useAI,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // When crisis is detected, the API returns crisis resources in
        // the `resources` field. Remap so the UI can distinguish them.
        if (data.crisis) {
          setResult({
            summary: data.summary,
            resources: [],
            crisis: true,
            crisisResources: data.resources,
          });
        } else {
          setResult(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setResult(null);
        setLoading(false);
      });
  }

  // On mount: request geolocation, then fetch results.
  // If geolocation resolves, re-fetch with location for distance sorting.
  useEffect(() => {
    if (!query) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setUserLocation(loc);
          // Re-fetch with location so results include distance data
          fetchResults(query, loc);
        },
        () => {
          // User declined — fetch without location
          if (!hasFetched.current) {
            hasFetched.current = true;
            fetchResults(query, null);
          }
        }
      );
    }

    // Fire initial fetch immediately (geolocation callback may be slow)
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchResults(query, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add distance info and sort by nearest
  const resourcesWithDistance: ResourceWithDistance[] = (
    result?.resources ?? []
  )
    .map((r) => {
      if (
        userLocation &&
        r.latitude != null &&
        r.longitude != null
      ) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          r.latitude,
          r.longitude
        );
        return {
          ...r,
          distance,
          distanceLabel: getDistanceLabel(distance),
        };
      }
      return r;
    })
    .sort((a, b) => {
      const da = (a as ResourceWithDistance).distance;
      const db = (b as ResourceWithDistance).distance;
      if (da != null && db != null) return da - db;
      if (da != null) return -1;
      if (db != null) return 1;
      return 0;
    });

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <SearchForm initialQuery={query} showChips={false} />

      <div className="w-full max-w-2xl">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-16">
              <p
                className="text-lg animate-pulse"
                style={{ color: "var(--muted)" }}
              >
                Finding resources for you...
              </p>
            </div>
          )}

          {/* No query */}
          {!loading && !query && (
            <div className="text-center py-16">
              <p className="text-base" style={{ color: "var(--muted)" }}>
                Enter a search query to find resources.
              </p>
            </div>
          )}

          {/* Crisis response — warm, calming card with tap-to-call buttons */}
          {!loading && result?.crisis && result.crisisResources && (
            <div className="mb-8">
              {/* Empathetic summary */}
              <div
                className="rounded-2xl border p-6 mb-4"
                style={{
                  background: "var(--accent-light)",
                  borderColor: "var(--accent)",
                }}
              >
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  You matter. Help is available.
                </p>
                <p
                  className="text-base"
                  style={{ color: "var(--foreground)" }}
                >
                  {result.summary}
                </p>
              </div>

              {/* Crisis resource cards with large tap-to-call buttons */}
              <div className="flex flex-col gap-3">
                {result.crisisResources.map((cr) => (
                  <div
                    key={cr.name}
                    className="rounded-2xl border p-5"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <h2
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {cr.name}
                    </h2>
                    <p
                      className="text-sm mb-3"
                      style={{ color: "var(--muted)" }}
                    >
                      {cr.description}
                    </p>
                    {cr.phone && (
                      <a
                        href={`tel:${cr.phone}`}
                        className="inline-block text-center font-semibold rounded-xl px-6 py-3 w-full sm:w-auto"
                        style={{
                          background: "var(--accent)",
                          color: "#fff",
                        }}
                        aria-label={`Call ${cr.name} at ${cr.phone}`}
                      >
                        📞 Call {cr.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query && result && !result.crisis && resourcesWithDistance.length === 0 && (
            <div className="text-center py-16">
              <p
                className="text-base mb-4"
                style={{ color: "var(--foreground)" }}
              >
                We couldn&apos;t find an exact match.
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                You can browse all categories below, or call{" "}
                <a
                  href="tel:211"
                  className="underline font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  211
                </a>{" "}
                for personalized help.
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

          {/* Results (normal, non-crisis) */}
          {!loading && result && !result.crisis && resourcesWithDistance.length > 0 && (
            <>
              {/* AI Summary (only when AI is on) */}
              {useAI && result.summary && (
                <div
                  className="rounded-2xl border p-5 mb-6"
                  style={{
                    background: "var(--accent-light)",
                    borderColor: "var(--accent)",
                  }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    Based on your search
                  </p>
                  <p
                    className="text-base"
                    style={{ color: "var(--foreground)" }}
                  >
                    {result.summary}
                  </p>
                </div>
              )}

              {/* Plain text header when AI is off */}
              {!useAI && (
                <p
                  className="text-base font-medium mb-4"
                  style={{ color: "var(--foreground)" }}
                >
                  Showing results for: &ldquo;{query}&rdquo;
                </p>
              )}

              {/* Resource count */}
              <p
                className="text-sm mb-4"
                style={{ color: "var(--muted-light)" }}
              >
                Showing {resourcesWithDistance.length} resource
                {resourcesWithDistance.length !== 1 ? "s" : ""}
                {userLocation ? " · Sorted by nearest" : ""}
              </p>

              {/* Resource cards */}
              <div className="flex flex-col gap-4 mb-8">
                {resourcesWithDistance.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-2xl border p-5"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <h2
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {resource.name}
                    </h2>

                    {/* Distance label */}
                    {resource.distanceLabel && (
                      <p
                        className="text-sm font-medium mb-3"
                        style={{ color: "var(--accent)" }}
                      >
                        {resource.distanceLabel.emoji}{" "}
                        {resource.distanceLabel.label}
                      </p>
                    )}

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
                          <HoursIndicator hours={resource.hours} />
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

              {/* Secondary category suggestion */}
              {result.secondary_category && (
                <div
                  className="rounded-2xl border p-5 mb-6"
                  style={{
                    background: "var(--warm-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    You might also need help with:{" "}
                    <Link
                      href={`/category/${result.secondary_category.slug}`}
                      className="font-medium underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {result.secondary_category.name}
                    </Link>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Browse all link */}
          {!loading && (
            <div className="text-center mt-6 mb-4">
              <Link
                href="/"
                className="nav-link text-sm font-medium"
              >
                Not what you&apos;re looking for? Browse all categories
              </Link>
            </div>
          )}
        </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
