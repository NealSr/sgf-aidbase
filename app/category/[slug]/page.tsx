import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, Category, Resource } from "@/lib/supabase";
import SearchForm from "@/app/components/SearchForm";
import PrintButton from "@/app/components/PrintButton";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  const cat = category as Category;

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("category_id", cat.id)
    .eq("is_active", true)
    .order("name");

  const items = (resources as Resource[] | null) ?? [];

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <SearchForm />

      {/* Back link */}
      <div className="w-full max-w-2xl mb-6">
        <Link
          href="/"
          className="nav-link text-sm font-medium inline-flex items-center gap-1"
        >
          ← Back to all categories
        </Link>
      </div>

      {/* Category header */}
      <div className="w-full max-w-2xl mb-6">
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {cat.icon} {cat.name}
        </h1>
        {cat.description && (
          <p className="text-base mb-3" style={{ color: "var(--muted)" }}>
            {cat.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--muted-light)" }}>
            Showing {items.length} resource{items.length !== 1 ? "s" : ""}
          </p>
          <PrintButton />
        </div>
      </div>

      {/* Resource cards */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {items.map((resource) => (
          <div
            key={resource.id}
            className="rounded-2xl border p-5"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              {resource.name}
            </h2>

            <div className="flex flex-col gap-1.5 mb-4">
              {resource.address && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  📍 {resource.address}, {resource.city}, {resource.state}{" "}
                  {resource.zip}
                </p>
              )}
              {resource.phone && (
                <p className="text-sm">
                  <span style={{ color: "var(--muted)" }}>📞 </span>
                  <a
                    href={`tel:${resource.phone}`}
                    className="underline"
                    style={{ color: "var(--accent)" }}
                  >
                    {resource.phone}
                  </a>
                </p>
              )}
              {resource.hours && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  🕐 {resource.hours}
                </p>
              )}
            </div>

            <Link
              href={`/resource/${resource.id}`}
              className="nav-link text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              View Details →
            </Link>
          </div>
        ))}

        {items.length === 0 && (
          <p
            className="text-center py-10 text-base"
            style={{ color: "var(--muted)" }}
          >
            No resources found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
