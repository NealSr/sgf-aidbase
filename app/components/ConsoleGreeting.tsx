"use client";

import { useEffect } from "react";

/** Logs a styled greeting to the browser console on first page load */
export default function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%c🤝 SGF AidBase — Ctrl+Aid+Shift",
      "font-size: 20px; font-weight: bold; color: #2D6A4F;"
    );
    console.log(
      "%cBuilt for Springfield. Powered by empathy and AI.",
      "font-size: 14px; color: #52796F;"
    );
    console.log(
      "%cWant to help? sgfaidbase.org/feedback",
      "font-size: 12px; color: #888;"
    );
  }, []);

  return null;
}
