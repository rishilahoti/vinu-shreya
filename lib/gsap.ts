"use client";

// Single place where GSAP plugins are registered. Import gsap/ScrollTrigger from here, not from "gsap".
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
// Mobile address-bar show/hide resizes the viewport; don't recalc every trigger for it.
ScrollTrigger.config({ ignoreMobileResize: true });

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollTrigger, useGSAP };
