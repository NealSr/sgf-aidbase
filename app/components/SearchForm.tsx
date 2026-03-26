"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useSyncExternalStore } from "react";

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
  const [useAIOverride, setUseAIOverride] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Speech-to-text state
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const useAI =
    useAIOverride ?? (isClient ? localStorage.getItem("sgf-ai-search") !== "off" : true);
  const hasSpeechSupport =
    isClient &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Auto-submit: navigate to search with the given text
  const navigateToSearch = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setSubmitError(null);
      setIsSubmitting(true);
      setQuery(trimmed);
      const params = new URLSearchParams({ q: trimmed });
      if (!useAI) params.set("ai", "0");
      router.push(`/search?${params.toString()}`);
    },
    [useAI, router]
  );

  function startListening() {
    setMicError(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      navigateToSearch(transcript);
    };

    recognition.onerror = (event: { error: string }) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setMicError("Microphone access is needed for voice search.");
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleAI() {
    const next = !useAI;
    setUseAIOverride(next);
    localStorage.setItem("sgf-ai-search", next ? "on" : "off");
  }

  function buildSearchUrl(q: string) {
    const params = new URLSearchParams({ q });
    if (!useAI) params.set("ai", "0");
    return `/search?${params.toString()}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setSubmitError("Please describe what you need help with.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    router.push(buildSearchUrl(trimmed));
  }

  function handleChipClick(example: string) {
    setSubmitError(null);
    setIsSubmitting(true);
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
          What do you need help with? <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="search-input"
            type="text"
            required
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (submitError) setSubmitError(null);
            }}
            placeholder="Describe what you're looking for..."
            className="flex-1 px-4 py-3 rounded-xl border text-base outline-none transition-colors"
            style={{
              background: "var(--search-bg)",
              borderColor: "var(--search-border)",
              color: "var(--foreground)",
            }}
          />
          {/* Mic button — only rendered if browser supports Web Speech API */}
          {hasSpeechSupport && (
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              className="px-3 py-3 rounded-xl border text-base transition-colors no-print"
              style={{
                borderColor: listening ? "#B33A3A" : "var(--search-border)",
                background: listening ? "#B33A3A" : "var(--search-bg)",
                color: listening ? "#fff" : "var(--muted)",
              }}
              title={listening ? "Stop listening" : "Voice search"}
              aria-label={listening ? "Stop listening" : "Voice search"}
            >
              {listening ? (
                <span className="animate-pulse">⏺</span>
              ) : (
                "🎤"
              )}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 rounded-xl text-white font-medium text-base transition-colors"
            style={{
              background: isSubmitting ? "var(--accent-hover)" : "var(--accent)",
              opacity: isSubmitting ? 0.92 : 1,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            {isSubmitting ? "Searching..." : "Search"}
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

        {/* Mic permission error */}
        {micError && (
          <p className="mt-2 text-xs" style={{ color: "#B33A3A" }}>
            {micError}
          </p>
        )}
        {submitError && (
          <p className="mt-2 text-sm" style={{ color: "#B33A3A" }}>
            {submitError}
          </p>
        )}
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
