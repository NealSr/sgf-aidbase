import Link from "next/link";

/**
 * Shared site header — sticky, appears on every page via root layout.
 * Contains the SGF AidBase wordmark and nav links.
 */
export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
      style={{
        borderColor: "var(--divider)",
        background: "var(--card-bg)",
      }}
    >
      {/* Wordmark / logo — links to homepage */}
      <Link href="/" className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label="SGF AidBase logo">
          🤝
        </span>
        <span className="text-xl font-semibold tracking-tight">
          SGF AidBase
        </span>
      </Link>

      {/* Navigation — small enough to show both links on mobile */}
      <nav className="flex gap-1">
        <Link
          href="/about"
          className="nav-link text-sm font-medium px-3 py-2 rounded-lg"
        >
          About
        </Link>
        <Link
          href="/feedback"
          className="nav-link text-sm font-medium px-3 py-2 rounded-lg"
        >
          Feedback
        </Link>
      </nav>
    </header>
  );
}
