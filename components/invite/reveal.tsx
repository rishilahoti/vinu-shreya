"use client";

// The page's two scroll moves, shared by every section:
//  - Reveal / RevealGroup + RevealItem: content rises out of a soft blur once, as it enters.
//  - Parallax: a layer drifts against the scroll, smoothed by a spring so it trails the page a little.
// Reduced motion keeps the fade and drops the travel and the blur.
import { useRef, useSyncExternalStore, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

const RM = "(prefers-reduced-motion: reduce)";
const onRM = (cb: () => void) => {
  const m = matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
/** Reduced-motion preference that hydrates as false (like the server render), then updates. Motion's
 *  useReducedMotion reads it on the first client render, so SSR and client markup differ and React keeps the stale blur. */
export const useReduce = () => useSyncExternalStore(onRM, () => matchMedia(RM).matches, () => false);

// The hidden state is the same either way (server and client must match); reduced motion only drops the travel and blur on the way in.
const item = (reduce: boolean, y: number, blur: number): Variants => ({
  hidden: { opacity: 0, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` },
  shown: {
    opacity: 1,
    transform: "translateY(0px)",
    filter: "blur(0px)",
    transition: reduce ? { duration: 0.4, transform: { duration: 0 }, filter: { duration: 0 } } : { duration: 0.9, ease: EASE_OUT },
  },
});

type Props = { children: ReactNode; className?: string; style?: CSSProperties; y?: number; blur?: number; delay?: number; as?: "div" | "span" | "li" };

/** One block that rises out of a blur when it scrolls in. */
export function Reveal({ children, className, style, y = 28, blur = 10, delay = 0, as = "div" }: Props) {
  const reduce = useReduce();
  const M = motion[as];
  return (
    <M className={className} style={style} variants={item(reduce, y, blur)} initial="hidden" whileInView="shown" viewport={VIEW} transition={{ delay }}>
      {children}
    </M>
  );
}

/** A group whose RevealItem children come in one after another (70ms apart). */
export function RevealGroup({ children, className, style, stagger = 0.07, delay = 0 }: { children: ReactNode; className?: string; style?: CSSProperties; stagger?: number; delay?: number }) {
  return (
    <motion.div className={className} style={style} initial="hidden" whileInView="shown" viewport={VIEW} variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, style, y = 24, blur = 8, as = "div" }: Omit<Props, "delay">) {
  const reduce = useReduce();
  const M = motion[as];
  return (
    <M className={className} style={style} variants={item(reduce, y, blur)}>
      {children}
    </M>
  );
}

/**
 * Drifts its children by `speed` px over the time the wrapper crosses the screen
 * (positive = moves up slower than the page, like something further away).
 * Wrap pictures, glows and ornaments; leave running text still.
 */
export function Parallax({ children, className, style, speed = 60, scale = 1 }: { children: ReactNode; className?: string; style?: CSSProperties; speed?: number; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const transform = useTransform(p, (v) => `translate3d(0, ${((0.5 - v) * 2 * speed).toFixed(2)}px, 0) scale(${scale})`);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, transform: reduce ? "none" : transform, willChange: reduce ? "auto" : "transform" }}>
      {children}
    </motion.div>
  );
}
