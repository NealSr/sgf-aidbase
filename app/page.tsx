import Link from "next/link";
import { supabase, Category } from "@/lib/supabase";
import SearchForm from "./components/SearchForm";

export default async function Home() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-16">
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
    </div>
  );
}
