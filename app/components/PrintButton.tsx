"use client";

/** Subtle print button — hidden from printed output via .no-print class */
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      type="button"
      className="no-print text-sm inline-flex items-center gap-1"
      style={{ color: "var(--muted-light)" }}
    >
      🖨️ Print this page
    </button>
  );
}
