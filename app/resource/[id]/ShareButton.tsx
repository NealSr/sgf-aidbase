"use client";

import { useState } from "react";
import { Resource } from "@/lib/supabase";

/**
 * Share button using Web Share API on mobile, clipboard fallback on desktop.
 * Styled to match the subtle BackButton / PrintButton level of prominence.
 */
export default function ShareButton({ resource }: { resource: Resource }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText = [resource.name, resource.address, resource.phone]
      .filter(Boolean)
      .join(" — ");

    // Web Share API — available on most mobile browsers
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: resource.name,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to clipboard
      }
    }

    // Clipboard fallback for desktop browsers
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — nothing we can do
    }
  }

  return (
    <div className="relative no-print">
      <button
        onClick={handleShare}
        className="nav-link text-sm font-medium inline-flex items-center gap-1"
        type="button"
        aria-label={`Share ${resource.name}`}
      >
        📤 Share
      </button>

      {/* "Link copied!" toast — fades in/out over 2 seconds */}
      {copied && (
        <span
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap
                     text-xs font-medium px-2 py-1 rounded-lg animate-pulse"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          Link copied!
        </span>
      )}
    </div>
  );
}
