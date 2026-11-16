"use client";

// Lenis gives wheel and trackpad scrolling a weighted glide. Touch keeps the phone's own momentum
// (Lenis default): faking it on iOS lags the finger and fights the address bar.
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

/** Scroll to an element (or "#id") through Lenis when it runs, natively otherwise. */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target.startsWith("#") ? target : `#${target}`) : target;
  if (el == null) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else if (typeof el === "number") window.scrollTo({ top: el, behavior: "smooth" });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function SmoothScroll({ held }: { held: boolean }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // lerp below the 0.1 default = more friction: the page keeps gliding a beat after the wheel stops.
    const l = (lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, autoRaf: true, anchors: { duration: 1.4 } }));
    return () => {
      l.destroy();
      lenis = null;
    };
  }, []);

  // Parked while the entry gate covers the page.
  useEffect(() => {
    if (held) lenis?.stop();
    else lenis?.start();
  }, [held]);

  return null;
}
