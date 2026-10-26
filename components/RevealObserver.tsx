"use client";

import { useEffect } from "react";

// Adds .is-in to every [data-reveal] once it enters the viewport. Never replays, never leaves content hidden.
// Also marks sections scrolled well out of view with data-rest, so their looping drawings pause.
export default function RevealObserver() {
  useEffect(() => {
    document.documentElement.dataset.io = "1"; // tells the inline fallback in layout.tsx that the bundle ran
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
    const rest = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-rest", !e.isIntersecting)),
      { rootMargin: "25% 0px" },
    );
    document.querySelectorAll("main > *").forEach((el) => rest.observe(el));
    // Safety net: anything on screen that the observer missed is shown anyway.
    const net = window.setTimeout(() => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);
    return () => {
      io.disconnect();
      rest.disconnect();
      window.clearTimeout(net);
    };
  }, []);
  return null;
}
