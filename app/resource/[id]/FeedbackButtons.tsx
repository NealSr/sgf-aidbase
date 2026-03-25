"use client";

import { useState } from "react";

export default function FeedbackButtons() {
  const [selected, setSelected] = useState<"up" | "down" | null>(null);

  function handleFeedback(type: "up" | "down") {
    setSelected(type);
    console.log(`User feedback: thumbs ${type}`);
  }

  return (
    <div
      className="rounded-2xl border p-5 text-center"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <p
        className="text-sm font-medium mb-3"
        style={{ color: "var(--foreground)" }}
      >
        Was this helpful?
      </p>
      {selected ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Thanks for your feedback!
        </p>
      ) : (
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleFeedback("up")}
            className="text-2xl px-4 py-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              borderColor: "var(--card-border)",
              background: "var(--warm-bg)",
            }}
            aria-label="Thumbs up"
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => handleFeedback("down")}
            className="text-2xl px-4 py-2 rounded-xl border transition-colors cursor-pointer"
            style={{
              borderColor: "var(--card-border)",
              background: "var(--warm-bg)",
            }}
            aria-label="Thumbs down"
          >
            👎
          </button>
        </div>
      )}
    </div>
  );
}
