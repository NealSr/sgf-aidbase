"use client";

import { getHoursStatus } from "@/lib/hours";

/**
 * Shows a green/red dot next to hours text when we can confidently
 * determine open/closed. Shows nothing for ambiguous hours.
 */
export default function HoursIndicator({ hours }: { hours: string }) {
  const status = getHoursStatus(hours);

  if (status === "unknown") return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium ml-2"
      style={{
        color: status === "open" ? "#2D6A4F" : "#B33A3A",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: status === "open" ? "#2D6A4F" : "#B33A3A",
          display: "inline-block",
        }}
      />
      {status === "open" ? "Open now" : "Closed"}
    </span>
  );
}
