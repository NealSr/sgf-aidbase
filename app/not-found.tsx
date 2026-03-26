import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div
        className="w-full max-w-xl rounded-2xl border p-8"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <p
          className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: "var(--muted-light)" }}
        >
          Page Not Found
        </p>
        <h1
          className="text-3xl font-bold tracking-tight mb-3"
          style={{ color: "var(--foreground)" }}
        >
          We couldn&apos;t find that page.
        </h1>
        <p className="text-base mb-6" style={{ color: "var(--muted)" }}>
          Head back home to search for help or browse Springfield resources by category.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl px-5 py-3 text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
