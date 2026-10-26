// Brass temple bell (ghanti) on a chain. Server-safe: CSS keyframes only.
import type { SVGProps } from "react";
import s from "./Bell.module.css";

const C = { gold: "#B8892E", haldi: "#E8B83A", ink: "#14332F" };

type Props = SVGProps<SVGSVGElement> & {
  /** Chain length in links (1–12). */
  length?: number;
  /** Phase offset in seconds, so neighbouring bells do not swing in unison. */
  phase?: number;
  /** No motion: the complete still drawing. */
  still?: boolean;
};

/** Flat ring (filled, with a hole) as an even-odd path. */
const ring = (cx: number, cy: number, rx: number, ry: number, t: number) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z` +
  `M${cx - rx + t} ${cy}a${rx - t} ${ry - t} 0 1 0 ${2 * (rx - t)} 0a${rx - t} ${ry - t} 0 1 0 ${-2 * (rx - t)} 0Z`;

const BEADS = [15, 20, 25, 30, 35];

export default function Bell({ length = 4, phase = 0, still, ...props }: Props) {
  const n = Math.max(1, Math.min(12, Math.round(length)));
  const PITCH = 9;
  const top = n * PITCH + 11; // where the dome starts
  const H = top + 51;
  const dur = 2.8 + n * 0.12; // a longer chain swings slower, like a pendulum
  return (
    <svg viewBox={`0 0 50 ${H}`} overflow="visible" aria-hidden {...props}>
      <g
        className={still ? undefined : s.swing}
        style={{ animationDuration: `${dur}s`, animationDelay: `${-phase}s` }}
      >
        {/* hook, then links alternating face-on and edge-on */}
        <path d={ring(25, 3.2, 3.2, 3.2, 1.6)} fillRule="evenodd" fill={C.gold} />
        {Array.from({ length: n }, (_, i) =>
          i % 2 ? (
            <rect key={i} x={23.8} y={5 + i * PITCH} width={2.4} height={11} rx={1.2} fill={C.gold} />
          ) : (
            <path key={i} d={ring(25, 10.5 + i * PITCH, 3.8, 5.5, 1.8)} fillRule="evenodd" fill={C.haldi} />
          ),
        )}
        <g transform={`translate(0 ${top})`}>
          {/* crown ring and knob */}
          <path d={ring(25, -4, 3.4, 3, 1.6)} fillRule="evenodd" fill={C.gold} />
          <ellipse cx={25} cy={0.6} rx={6} ry={2.4} fill={C.gold} />
          {/* the open mouth, then the clapper hanging inside it */}
          <ellipse cx={25} cy={39.4} rx={19.6} ry={3.8} fill={C.ink} />
          <g
            className={still ? undefined : s.clapper}
            style={{ animationDuration: `${dur}s`, animationDelay: `${0.5 - phase - 2 * dur}s` }}
          >
            <rect x={23.9} y={12} width={2.2} height={33} fill={C.gold} />
            <circle cx={25} cy={46} r={4.2} fill={C.gold} />
            <circle cx={23.6} cy={44.8} r={1.4} fill={C.haldi} />
          </g>
          {/* body: shaded brass, a lit face, two engraved bands, a bright lip */}
          <path
            d="M25 0C32 0 36 4 36.5 10C37 21 39.5 30 46 36L46 38.5Q25 43 4 38.5L4 36C10.5 30 13 21 13.5 10C14 4 18 0 25 0Z"
            fill={C.gold}
          />
          <path
            d="M18 3.2C16.5 5 15.8 8 15.6 11C15.2 22 12.8 30 7.5 36.8L7.5 38.2Q12 39.3 16.6 39.9C18 31 19.8 20 20.6 10.5C20.9 7.5 21.6 5 23 3C21 2.6 19.4 2.7 18 3.2Z"
            fill={C.haldi}
          />
          <path d="M13.6 9Q25 11.4 36.4 9L36.5 11Q25 13.4 13.5 11Z" fill={C.ink} />
          <path d="M12.9 23.6Q25 26.6 37.1 23.6L39 29.6Q25 33 11 29.6Z" fill={C.ink} />
          {BEADS.map((x) => (
            <circle key={x} cx={x} cy={Math.round((26.4 + 2.4 * (1 - ((x - 25) / 14) ** 2)) * 10) / 10} r={1.15} fill={C.haldi} />
          ))}
          <path d="M4 36Q25 40.6 46 36L46 38.5Q25 43 4 38.5Z" fill={C.haldi} />
        </g>
      </g>
    </svg>
  );
}
