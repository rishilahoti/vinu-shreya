// Falling marigold and rose petals: an overlay for any positioned parent. Server-safe and seeded, so
// server and client render the same markup. One animated node per petal (≤ 24), motion in Petals.module.css.
import type { CSSProperties, HTMLAttributes } from "react";
import s from "./Petals.module.css";
const mod = (n: string): string => s[n];

const INK = "#14332F";
const PAPER = "#F4EEE6";

// 20 × 20 shapes, stalk end at the bottom. Marigold: a frilled wedge. Rose: a broad, lopsided cupped petal
// (no notch: a notched petal reads as a heart).
const MARIGOLD = "M10 19.5C6.2 16.5 2.2 11 2.4 6.4Q3.6 3.3 6 4.9Q7.4 1.6 10 3.6Q12.6 1.6 14 4.9Q16.4 3.3 17.6 6.4C17.8 11 13.8 16.5 10 19.5Z";
const MARIGOLD_IN = "M10 19.5C8.2 16 7 12 7.4 8.2L10 6.4L12.6 8.2C13 12 11.8 16 10 19.5Z";
const ROSE = "M10 19.5C4.5 18 1.8 12.5 2.6 7.6C3.4 3.4 7.2 1.6 11 2.2C15.4 2.9 18.2 6.4 17.6 10.6C17 15 14 18.6 10 19.5Z";
const ROSE_IN = "M10 19.5C5.6 17.2 4 12.4 4.8 8.4C6.6 11.8 7.8 15.4 10 19.5Z";

const COLORS = ["#E39B2D", "#E8B83A", "#E39B2D", "#C8487A", "#B8322A"];

// mulberry32: tiny deterministic PRNG.
function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type PetalsProps = HTMLAttributes<HTMLDivElement> & {
  /** How many petals (capped at 24). */
  count?: number;
  /** Petal colours, picked at random per petal. */
  colors?: string[];
  /** Change for a different arrangement. */
  seed?: number;
  still?: boolean;
};

/** Absolutely fills its nearest positioned ancestor; pointer-events none. */
export default function Petals({ count = 16, colors = COLORS, seed = 1902, still, className, ...props }: PetalsProps) {
  const r = rng(seed);
  const n = Math.min(count, 24);
  const f = (v: number, d = 2) => v.toFixed(d);
  const petals = Array.from({ length: n }, (_, i) => {
    const dur = 8 + r() * 8;
    const sdur = 2.8 + r() * 2.4;
    const rose = r() < 0.4;
    const style = {
      "--x": `${f(((i + 0.15 + r() * 0.7) / n) * 100)}%`, // one petal per column strip: no clumps
      "--y": f(4 + r() * 88, 1),
      "--w": `${f(rose ? 12 + r() * 9 : 10 + r() * 8, 1)}px`,
      "--r": `${f(r() * 360, 0)}deg`,
      "--spin": `${f((50 + r() * 70) * (r() < 0.5 ? -1 : 1), 0)}deg`,
      "--a": `${f(10 + r() * 16, 1)}px`,
      "--dur": `${f(dur)}s`,
      "--delay": `${f(-r() * dur)}s`,
      "--sdur": `${f(sdur)}s`,
      "--sdelay": `${f(-r() * sdur)}s`,
    } as CSSProperties;
    return { rose, fill: colors[Math.floor(r() * colors.length)], style };
  });
  return (
    <div aria-hidden className={className ? `${mod("petalsField")} ${className}` : mod("petalsField")} {...props}>
      {petals.map((p, i) => (
        <svg key={i} viewBox="0 0 20 20" className={still ? mod("petalsPetal") : `${mod("petalsPetal")} ${mod("petalsFall")}`} style={p.style}>
          <path d={p.rose ? ROSE : MARIGOLD} fill={p.fill} />
          <path d={p.rose ? ROSE_IN : MARIGOLD_IN} fill={p.rose ? PAPER : INK} fillOpacity={p.rose ? 0.3 : 0.16} />
        </svg>
      ))}
    </div>
  );
}
