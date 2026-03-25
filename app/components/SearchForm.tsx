"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EXAMPLE_QUERIES = [
  "I need food for my family",
  "Help paying my electric bill",
  "I need a safe place to sleep tonight",
  "I need help getting across town",
];

export default function SearchForm({
  initialQuery = "",
  showChips = true,
}: {
  initialQuery?: string;
  showChips?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  // Lazy init from localStorage — avoids setState-in-effect lint error
  const [useAI, setUseAI] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("sgf-ai-search") !== "off";
  });

  function toggleAI() {
    const next = !useAI;
    setUseAI(next);
    localStorage.setItem("sgf-ai-search", next ? "on" : "off");
  }

  function buildSearchUrl(q: string) {
    const params = new URLSearchParams({ q });
    if (!useAI) params.set("ai", "0");
    return `/search?${params.toString()}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(buildSearchUrl(query.trim()));
    }
  }

  function handleChipClick(example: string) {
    setQuery(example);
    router.push(buildSearchUrl(example));
  }

  return (
    <>
      {/* Search box */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl p-6 mb-8 border"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <label
          htmlFor="search-input"
          className="block text-sm font-medium mb-3"
          style={{ color: "var(--muted)" }}
        >
          What do you need help with?
        </label>
        <div className="flex gap-2">
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="flex-1 px-4 py-3 rounded-xl border text-base outline-none transition-colors"
            style={{
              background: "var(--search-bg)",
              borderColor: "var(--search-border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-white font-medium text-base transition-colors"
            style={{ background: "var(--accent)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Search
          </button>
        </div>

        {/* AI toggle — subtle power-user control */}
        <button
          type="button"
          onClick={toggleAI}
          className="mt-2 text-xs flex items-center gap-1.5 no-print"
          style={{ color: "var(--muted-light)" }}
          title="Search without AI assistance"
        >
          {useAI ? "🤖 AI Search: On" : "🔍 AI Search: Off"}
        </button>
      </form>

      {/* Example query chips */}
      {showChips && <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-xl">
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => handleChipClick(example)}
            className="text-sm px-3 py-1.5 rounded-full border cursor-pointer transition-colors"
            style={{
              color: "var(--muted)",
              borderColor: "var(--card-border)",
              background: "var(--warm-bg)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            &ldquo;{example}&rdquo;
          </button>
        ))}
      </div>}
    </>
  );
}
