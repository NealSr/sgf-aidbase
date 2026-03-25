import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, Resource, Category } from "@/lib/supabase";
import BackButton from "./BackButton";
import FeedbackButtons from "./FeedbackButtons";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (!resource) {
    notFound();
  }

  const item = resource as Resource;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", item.category_id)
    .single();

  const cat = category as Category | null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${item.address}, ${item.city}, ${item.state} ${item.zip ?? ""}`
  )}&travelmode=walking`;

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="flex items-center px-6 py-4 border-b"
        style={{
          borderColor: "var(--divider)",
          background: "var(--card-bg)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="SGF AidBase logo">
            🤝
          </span>
          <span className="text-xl font-semibold tracking-tight">
            SGF AidBase
          </span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Back link */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Title & category badge */}
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {item.name}
          </h1>
          {cat && (
            <span
              className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
              }}
            >
              {cat.icon} {cat.name}
            </span>
          )}

          {/* Description */}
          {item.description && (
            <div
              className="rounded-2xl border p-5 mb-4"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--muted-light)" }}
              >
                About
              </h2>
              <p className="text-base" style={{ color: "var(--foreground)" }}>
                {item.description}
              </p>
            </div>
          )}

          {/* Contact info */}
          <div
            className="rounded-2xl border p-5 mb-4"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wide mb-3"
              style={{ color: "var(--muted-light)" }}
            >
              Contact
            </h2>
            <div className="flex flex-col gap-3">
              {item.address && (
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">📍</span>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.address}, {item.city}, {item.state} {item.zip}
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Open in Maps →
                    </a>
                  </div>
                </div>
              )}

              {item.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">📞</span>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.phone}
                    </p>
                    <a
                      href={`tel:${item.phone}`}
                      className="text-sm font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Call Now →
                    </a>
                  </div>
                </div>
              )}

              {item.website && (
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">🌐</span>
                  <div>
                    <p
                      className="text-sm break-all"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.website}
                    </p>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Visit Website →
                    </a>
                  </div>
                </div>
              )}

              {item.email && (
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">✉️</span>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.email}
                    </p>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-sm font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Send Email →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          {item.hours && (
            <div
              className="rounded-2xl border p-5 mb-4"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--muted-light)" }}
              >
                Hours
              </h2>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {item.hours}
              </p>
            </div>
          )}

          {/* Eligibility */}
          {item.eligibility && (
            <div
              className="rounded-2xl border p-5 mb-4"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--muted-light)" }}
              >
                Who Qualifies
              </h2>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {item.eligibility}
              </p>
            </div>
          )}

          {/* Languages */}
          {item.languages && (
            <div
              className="rounded-2xl border p-5 mb-4"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--muted-light)" }}
              >
                Languages
              </h2>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {item.languages}
              </p>
            </div>
          )}

          {/* Verification status */}
          <div
            className="rounded-2xl border p-5 mb-4"
            style={{
              background: "var(--warm-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {item.last_verified
                ? `Last verified: ${new Date(item.last_verified).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : "Not yet verified — please confirm details with the organization directly"}
            </p>
          </div>

          {/* Feedback */}
          <div className="mb-4">
            <FeedbackButtons />
          </div>

          {/* Disclaimer */}
          <p
            className="text-xs text-center px-4"
            style={{ color: "var(--muted-light)" }}
          >
            Always verify details directly with the organization. If you are in
            immediate danger, call <strong>911</strong>. For crisis support, call
            or text <strong>988</strong>.
          </p>
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
