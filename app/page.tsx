import Link from "next/link";
import { supabase, Category } from "@/lib/supabase";
import SearchForm from "./components/SearchForm";

export default async function Home() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{
          borderColor: "var(--divider)",
          background: "var(--card-bg)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="SGF AidBase logo">
            🤝
          </span>
          <span className="text-xl font-semibold tracking-tight">
            SGF AidBase
          </span>
        </div>
        <nav>
          <a
            href="#"
            className="nav-link text-sm font-medium px-4 py-2 rounded-lg"
          >
            About
          </a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--foreground)" }}
          >
            Find Help in Springfield, MO
          </h1>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Connecting people with the resources they need
          </p>
        </div>

        <SearchForm />

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 w-full max-w-md">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--divider)" }}
          />
          <span
            className="text-sm whitespace-nowrap"
            style={{ color: "var(--muted-light)" }}
          >
            or browse by category
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--divider)" }}
          />
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-xl w-full">
          {(categories as Category[] | null)?.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="category-card flex flex-col items-center justify-center rounded-2xl border p-6"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-6 text-center"
        style={{
          borderColor: "var(--divider)",
          background: "var(--footer-bg)",
          color: "var(--footer-text)",
        }}
      >
        <p className="text-sm mb-1">
          Built with <span style={{ color: "var(--accent)" }}>♥</span> by
          Ctrl+Aid
        </p>
        <p className="text-xs" style={{ color: "var(--muted-light)" }}>
          This is not a crisis service. If you are in danger, call{" "}
          <strong>911</strong>. For mental health crisis, call{" "}
          <strong>988</strong>.
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--muted-light)" }}>
          Information provided is for reference only and may not be current.
        </p>
      </footer>
    </div>
  );
}
