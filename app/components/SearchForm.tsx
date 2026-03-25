"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EXAMPLE_QUERIES = [
  "I need food for my family",
  "Help paying my electric bill",
  "I need a safe place to sleep tonight",
  "I need help getting across town",
];

export default function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleChipClick(example: string) {
    setQuery(example);
    router.push(`/search?q=${encodeURIComponent(example)}`);
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
      </form>

      {/* Example query chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-xl">
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
      </div>
    </>
  );
}
