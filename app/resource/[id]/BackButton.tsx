"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="nav-link text-sm font-medium inline-flex items-center gap-1"
      type="button"
    >
      ← Back to results
    </button>
  );
}
