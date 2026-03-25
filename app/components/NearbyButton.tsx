"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * "Resources near me" button. Requests geolocation, then navigates to /nearby
 * with lat/lon as query params. Shows loading and error states inline.
 */
export default function NearbyButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "denied">("idle");

  function handleClick() {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        router.push(`/nearby?lat=${latitude}&lon=${longitude}`);
      },
      () => {
        // User denied or browser blocked location access
        setStatus("denied");
      }
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-8 w-full max-w-xl">
      {status === "idle" && (
        <button
          type="button"
          onClick={handleClick}
          className="text-sm font-medium px-5 py-2.5 rounded-xl border transition-colors"
          style={{
            color: "var(--accent)",
            borderColor: "var(--accent)",
            background: "transparent",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--accent-light)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          📍 Resources near me
        </button>
      )}

      {status === "loading" && (
        <p
          className="text-sm animate-pulse py-2.5"
          style={{ color: "var(--muted)" }}
        >
          📍 Finding resources near you...
        </p>
      )}

      {status === "denied" && (
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
            We need your location to find nearby resources. You can also browse
            by category or search above.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-xs font-medium"
            style={{ color: "var(--accent)" }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
