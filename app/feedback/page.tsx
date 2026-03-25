"use client";

import Link from "next/link";
import { useState } from "react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Hidden field — bots fill it, humans don't
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          email: email || null,
          page_url: document.referrer || window.location.href,
          website: honeypot, // Honeypot — API silently rejects if filled
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
        setMessage("");
        setEmail("");
      }
    } catch {
      setError("Unable to submit feedback. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-xl">
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Help Us Stay Accurate
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--muted)" }}>
          Found incorrect information? Have a suggestion? Let us know.
        </p>

        {/* Success message */}
        {submitted ? (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{
              background: "var(--accent-light)",
              borderColor: "var(--accent)",
            }}
          >
            <p
              className="text-base font-medium mb-2"
              style={{ color: "var(--accent)" }}
            >
              Thank you!
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              Your feedback has been received and will be reviewed by the SGF
              AidBase team.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-medium underline"
              style={{ color: "var(--accent)" }}
            >
              Submit another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border p-6"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            {/* Message field */}
            <label
              htmlFor="feedback-message"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Your feedback
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what needs to be updated or what we're missing..."
              required
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none resize-y mb-4"
              style={{
                background: "var(--search-bg)",
                borderColor: "var(--search-border)",
                color: "var(--foreground)",
              }}
            />

            {/* Email field (optional) */}
            <label
              htmlFor="feedback-email"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Email{" "}
              <span style={{ color: "var(--muted-light)" }}>(optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (optional — only if you want a response)"
              className="w-full px-4 py-3 rounded-xl border text-base outline-none mb-4"
              style={{
                background: "var(--search-bg)",
                borderColor: "var(--search-border)",
                color: "var(--foreground)",
              }}
            />

            {/* Honeypot — hidden from real users, bots auto-fill it */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            />

            {/* Error message */}
            {error && (
              <p className="text-sm mb-4" style={{ color: "#c0392b" }}>
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3 rounded-xl text-white font-medium text-base transition-colors"
              style={{
                background: submitting
                  ? "var(--muted-light)"
                  : "var(--accent)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="nav-link text-sm font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
