"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SearchForm from "@/app/components/SearchForm";
import { Resource } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distance";
import { getDistanceLabel } from "@/lib/location";

type SearchResult = {
  summary: string;
  resources: Resource[];
  secondary_category?: { name: string; slug: string } | null;
};

type ResourceWithDistance = Resource & {
  distance?: number;
  distanceLabel?: { label: string; emoji: string };
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Request user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => {
          // User declined or error — proceed without location
        }
      );
    }
  }, []);

  // Fetch search results when query changes
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        latitude: userLocation?.lat,
        longitude: userLocation?.lon,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setResult(null);
        setLoading(false);
      });
  }, [query, userLocation]);

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
    <div
      className="flex flex-col min-h-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="flex items-center px-6 py-4 border-b"
        style={{
          borderColor: "var(--divider)",
          background: "var(--card-bg)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="SGF AidBase logo">
            🤝
          </span>
          <span className="text-xl font-semibold tracking-tight">
            SGF AidBase
          </span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
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

          {/* No results */}
          {!loading && query && result && resourcesWithDistance.length === 0 && (
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

          {/* Results */}
          {!loading && result && resourcesWithDistance.length > 0 && (
            <>
              {/* AI Summary */}
              {result.summary && (
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
                          <a
                            href={`tel:${resource.phone}`}
                            className="underline"
                            style={{ color: "var(--accent)" }}
                          >
                            {resource.phone}
                          </a>
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
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-6 text-center"
        style={{
          borderColor: "var(--divider)",
          background: "var(--footer-bg)",
          color: "var(--footer-text)",
        }}
      >
        <p className="text-sm mb-1">
          Built with <span style={{ color: "var(--accent)" }}>♥</span> by
          Ctrl+Aid
        </p>
        <p className="text-xs" style={{ color: "var(--muted-light)" }}>
          This is not a crisis service. If you are in danger, call{" "}
          <strong>911</strong>. For mental health crisis, call{" "}
          <strong>988</strong>.
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--muted-light)" }}>
          Information provided is for reference only and may not be current.
        </p>
      </footer>
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
