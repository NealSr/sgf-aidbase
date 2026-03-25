"use client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--divider)", background: "var(--card-bg)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="SGF AidBase logo">🤝</span>
          <span className="text-xl font-semibold tracking-tight">SGF AidBase</span>
        </div>
        <nav>
          <a
            href="#"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            About
          </a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--foreground)" }}>
            Find Help in Springfield, MO
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Connecting people with the resources they need
          </p>
        </div>

        {/* Search box */}
        <div
          className="w-full max-w-xl rounded-2xl p-6 mb-8 border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <label
            className="block text-sm font-medium mb-3"
            style={{ color: "var(--muted)" }}
          >
            What do you need help with?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Describe what you're looking for..."
              className="flex-1 px-4 py-3 rounded-xl border text-base outline-none transition-colors"
              style={{
                background: "var(--search-bg)",
                borderColor: "var(--search-border)",
                color: "var(--foreground)",
              }}
              readOnly
            />
            <button
              className="px-5 py-3 rounded-xl text-white font-medium text-base transition-colors cursor-default"
              style={{ background: "var(--accent)" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-xl">
          {[
            "I need food for my family",
            "Help paying my electric bill",
            "I need a safe place to sleep tonight",
          ].map((example) => (
            <span
              key={example}
              className="text-sm px-3 py-1.5 rounded-full border cursor-default"
              style={{
                color: "var(--muted)",
                borderColor: "var(--card-border)",
                background: "var(--warm-bg)",
              }}
            >
              &ldquo;{example}&rdquo;
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 w-full max-w-md">
          <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
          <span className="text-sm whitespace-nowrap" style={{ color: "var(--muted-light)" }}>
            or browse by category
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl w-full">
          {[
            { icon: "🍎", label: "Food Help" },
            { icon: "🏠", label: "Housing & Shelter" },
            { icon: "💡", label: "Utility & Bills" },
            { icon: "🚌", label: "Transportation" },
          ].map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center justify-center rounded-2xl border p-6 cursor-default transition-colors"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-light)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.background = "var(--card-bg)";
              }}
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-center">{cat.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-6 text-center"
        style={{ borderColor: "var(--divider)", background: "var(--footer-bg)", color: "var(--footer-text)" }}
      >
        <p className="text-sm mb-1">
          Built with <span style={{ color: "var(--accent)" }}>♥</span> by Ctrl+Aid
        </p>
        <p className="text-xs" style={{ color: "var(--muted-light)" }}>
          This is not a crisis service. If you are in danger, call <strong>911</strong>. For mental health crisis, call <strong>988</strong>.
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--muted-light)" }}>
          Information provided is for reference only and may not be current.
        </p>
      </footer>
    </div>
  );
}
