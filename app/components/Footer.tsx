import Link from "next/link";

/**
 * Shared site footer — appears on every page via root layout.
 * Contains credits, nav links, crisis info, and data sourcing note.
 */
export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-6"
      style={{
        borderColor: "var(--divider)",
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Credits */}
        <p className="text-sm mb-2">
          Built with <span style={{ color: "var(--accent)" }}>♥</span> by
          Ctrl+Aid for Springfield
        </p>

        {/* Nav links */}
        <div className="flex justify-center gap-4 mb-3">
          <Link
            href="/about"
            className="nav-link text-xs font-medium"
          >
            About
          </Link>
          <Link
            href="/feedback"
            className="nav-link text-xs font-medium"
          >
            Feedback
          </Link>
          <a
            href="https://github.com/NealSr/sgf-aidbase"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-xs font-medium"
          >
            GitHub
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-xs mb-2" style={{ color: "var(--muted-light)" }}>
          SGF AidBase helps connect you with community resources. Always verify
          details directly with the organization.
        </p>

        {/* Crisis line */}
        <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
          In crisis? Call or text{" "}
          <a href="tel:988" className="underline" style={{ color: "var(--accent)" }}>
            988
          </a>{" "}
          · Call{" "}
          <a href="tel:911" className="underline" style={{ color: "var(--accent)" }}>
            911
          </a>{" "}
          for emergencies
        </p>

        {/* Data sourcing */}
        <p className="text-xs" style={{ color: "var(--muted-light)" }}>
          Data last sourced: March 2026
        </p>
      </div>
    </footer>
  );
}
