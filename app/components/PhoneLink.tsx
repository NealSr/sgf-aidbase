"use client";

import { useState } from "react";

/**
 * Smart phone link: tap-to-call on mobile, click-to-copy on desktop.
 * Detects touch devices via navigator.maxTouchPoints. Renders as a standard
 * tel: link so mobile users get native call behavior without JS.
 */
export default function PhoneLink({
  phone,
  className = "underline",
  style,
  children,
}: {
  phone: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  function handleClick(e: React.MouseEvent) {
    // Touch devices (phones/tablets) — let the tel: link do its thing
    const isTouch =
      typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Desktop — prevent the tel: link and copy to clipboard instead
    e.preventDefault();
    navigator.clipboard.writeText(phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <span className="relative inline-flex items-center gap-1">
      <a
        href={`tel:${phone}`}
        onClick={handleClick}
        className={className}
        style={style}
        title="Click to copy"
      >
        {children ?? phone}
      </a>
      {copied && (
        <span
          className="absolute left-full ml-1.5 whitespace-nowrap text-xs font-medium
                     px-1.5 py-0.5 rounded-md animate-pulse"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          📋 Copied!
        </span>
      )}
    </span>
  );
}
