"use client";

import { useEffect } from "react";

// Adds .is-in to every [data-reveal] once it enters the viewport. Never replays, never leaves content hidden.
// Also lists the sections scrolled well out of view in <html data-rest="…ids">, so their looping drawings pause,
// and makes in-page links scroll smoothly.
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
    // Kept on <html>, not on the sections: React owns their attributes, and one added before a section
    // hydrates is reported as a hydration mismatch.
    const resting = new Set<string>();
    const rest = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? resting.delete(e.target.id) : resting.add(e.target.id)));
        document.documentElement.dataset.rest = [...resting].join(" ");
      },
      { rootMargin: "25% 0px" },
    );
    document.querySelectorAll("main > *").forEach((el) => rest.observe(el));
    // In-page links glide to their leaf instead of jumping. Not CSS scroll-behavior: it would also
    // smooth GSAP's own snap scrolling in the ceremonies deck and make it lag.
    const glide = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const to = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!to) return;
      e.preventDefault();
      to.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.pushState(null, "", a.hash);
    };
    document.addEventListener("click", glide);
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
      document.removeEventListener("click", glide);
      window.clearTimeout(net);
    };
  }, []);
  return null;
}
