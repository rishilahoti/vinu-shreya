// Clay diya with a painted band and a live flame, drawn flat. Server-safe; motion is CSS in Diya.module.css.
import type { CSSProperties, SVGProps } from "react";
import s from "./Diya.module.css";
const mod = (n: string): string => s[n];

type Svg = SVGProps<SVGSVGElement>;
const CLAY = "#A8482A";
const INK = "#14332F";
const PAPER = "#F4EEE6";
const MARIGOLD = "#E39B2D";
const HALDI = "#E8B83A";
const GOLD = "#B8892E";
const r2 = (n: number) => Math.round(n * 100) / 100;

// Painted band along the belly of the bowl: points on one cubic.
const BAND = [
  [18, 86],
  [30, 99],
  [70, 100],
  [85, 86],
];
const onBand = (t: number, dy = 0) => {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [r2(w.reduce((a, k, i) => a + k * BAND[i][0], 0)), r2(w.reduce((a, k, i) => a + k * BAND[i][1], 0) + dy)];
};
const DOTS = Array.from({ length: 9 }, (_, i) => onBand(0.06 + i * 0.11));
const DROPS = Array.from({ length: 7 }, (_, i) => onBand(0.115 + i * 0.11, 4));

// Rim: an oval (centre 50 76, 36 × 9.5) pinched into a short spout whose tip is (98, 66).
const RIM = "M98 66Q88 68.6 81.18 71.25A36 9.5 0 1 0 81.18 80.75Q90 76 98 66Z";
const BODY = "M14 76C14 95 30 106 50 106C68 106 80 98 86 86Q92 74 98 66Q90 76 81.18 80.75A36 9.5 0 0 1 14 76Z";
const FOOT = "M37 103L63 103L67 112Q50 115.5 33 112Z";

/** One lamp in a 130 × 124 box; the flame stands on the spout tip at (98.5, 64.6). */
function Lamp({ still, style }: { still?: boolean; style?: CSSProperties }) {
  const c = (n: string) => (still ? undefined : mod(n));
  return (
    <g style={style}>
      {/* the light it throws: flat rings, no blur */}
      <g className={c("diyaGlow")}>
        <circle cx={99} cy={44} r={26} fill={HALDI} fillOpacity={0.14} />
        <circle cx={99} cy={44} r={17} fill={HALDI} fillOpacity={0.2} />
      </g>
      {/* foot ring */}
      <path d={FOOT} fill={CLAY} />
      <path d={FOOT} fill={INK} fillOpacity={0.32} />
      {/* round bowl with its spout */}
      <path d={BODY} fill={CLAY} />
      {/* shaded side, away from the flame */}
      <path d="M14 76C14 95 30 106 50 106C36 102 22 93 18.8 80.75Z" fill={INK} fillOpacity={0.26} />
      {/* painted band: dots and hanging drops */}
      {DOTS.map(([x, y]) => (
        <circle key={`d${x}`} cx={x} cy={y} r={1.9} fill={PAPER} />
      ))}
      {DROPS.map(([x, y]) => (
        <path key={`p${x}`} d={`M${x} ${y - 3}c1.9 1.8 2.5 3.2 2.5 4.2a2.5 2.5 0 0 1-5 0c0-1 .6-2.4 2.5-4.2z`} fill={HALDI} />
      ))}
      {/* the opening: inner wall in shadow, then the oil */}
      <path d={RIM} fill={CLAY} />
      <path d={RIM} fill={INK} fillOpacity={0.45} />
      <ellipse cx={52} cy={79.4} rx={24} ry={4.6} fill={GOLD} />
      {/* lit lip of the rim */}
      <path d="M14 76A36 9.5 0 0 0 81.18 80.75Q90 76 98 66L97.4 69Q91 78.6 81.18 82A36 12 0 0 1 14 76Z" fill={PAPER} fillOpacity={0.24} />
      {/* cotton wick lying in the spout, charred at the end */}
      <path d="M86 72Q92.5 69 97.6 65L99 67Q94 70.8 87.4 74Z" fill={PAPER} />
      <circle cx={98.4} cy={65.8} r={1.7} fill={INK} />
      {/* flame: marigold, haldi, paper core; every layer pivots on the wick */}
      <g transform="translate(98.5 64.6)">
        <g className={c("diyaFlame")}>
          <path d="M0 0 C-8 0 -9 -8 -6.5 -15.5 C-4.4 -22 -0.5 -31 1.2 -40 C4 -31 8.2 -23 9 -14.5 C9.6 -6.5 6.5 0 0 0 Z" fill={MARIGOLD} />
          <path d="M0 -0.5 C-5.6 -0.5 -6.3 -6 -4.5 -11.5 C-3 -16 -0.6 -21.5 0.6 -27 C2.8 -21 5.8 -16.5 6.3 -10.5 C6.7 -5 4.6 -0.5 0 -0.5 Z" fill={HALDI} />
          <path className={c("diyaCore")} d="M0 -1 C-3.2 -1 -3.7 -4.4 -2.6 -7.6 C-1.8 -10 -0.4 -12.6 0.3 -15.5 C1.6 -12.4 3.4 -10 3.6 -6.8 C3.8 -3.4 2.6 -1 0 -1 Z" fill={PAPER} />
          <ellipse cy={-1.4} rx={1.5} ry={1.9} fill={INK} />
        </g>
      </g>
    </g>
  );
}

type DiyaProps = Svg & { still?: boolean };

/** A single diya. Scale by width (40–160px). */
export default function Diya({ still, ...props }: DiyaProps) {
  return (
    <svg viewBox="0 0 130 124" aria-hidden {...props}>
      <Lamp still={still} />
    </svg>
  );
}

/** `count` diyas in a row, each flame on its own beat. Scale by width; each lamp takes 130 units of it. */
export function DiyaRow({ count = 5, still, ...props }: DiyaProps & { count?: number }) {
  return (
    <svg viewBox={`0 0 ${count * 130} 124`} aria-hidden {...props}>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * 130} 0)`}>
          {/* golden-ratio offsets: no two neighbours flicker together */}
          <Lamp still={still} style={{ "--d": `${-r2(((i * 0.618) % 1) * 4.6)}s` } as CSSProperties} />
        </g>
      ))}
    </svg>
  );
}
