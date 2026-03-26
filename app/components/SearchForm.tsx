"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useSyncExternalStore, useEffect } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Speech-to-text state
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 112);
    textarea.style.height = `${nextHeight}px`;
  }, []);

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

  function handleQueryChange(value: string) {
    setQuery(value);
    if (submitError) setSubmitError(null);
    resizeTextarea();
  }

  useEffect(() => {
    resizeTextarea();
  }, [query, resizeTextarea]);

  return (
    <>
      {/* Search box */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl p-4 sm:p-6 mb-8 border"
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <textarea
            ref={textareaRef}
            id="search-input"
            required
            value={query}
            onChange={(e) => {
              handleQueryChange(e.target.value);
            }}
            rows={2}
            placeholder="Describe what you're looking for..."
            className="min-h-[88px] w-full flex-1 resize-none px-4 py-3 rounded-xl border text-base outline-none transition-colors sm:min-h-[56px]"
            style={{
              background: "var(--search-bg)",
              borderColor: "var(--search-border)",
              color: "var(--foreground)",
              maxHeight: "112px",
            }}
          />
          <div className="flex gap-2 sm:w-auto">
            {/* Mic button — only rendered if browser supports Web Speech API */}
            {hasSpeechSupport && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className="min-h-[52px] w-14 rounded-xl border text-base transition-colors no-print sm:w-[56px]"
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
              className="min-h-[52px] flex-1 px-5 py-3 rounded-xl text-white font-medium text-base transition-colors sm:flex-none"
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
