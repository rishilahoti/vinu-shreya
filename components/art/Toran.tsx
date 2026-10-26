// Door toran: a band of mango leaves, marigold swags, and strands ending in bells and leaves.
// Server-safe: CSS keyframes only. Spans its width.
import type { SVGProps } from "react";
import s from "./Toran.module.css";

const C = {
  marigold: "#E39B2D",
  haldi: "#E8B83A",
  sindoor: "#B8322A",
  rani: "#C8487A",
  leaf: "#3F7A4C",
  mehendi: "#5E7A2E",
  gold: "#B8892E",
  ink: "#14332F",
};
const r1 = (n: number) => Math.round(n * 10) / 10;

type Props = SVGProps<SVGSVGElement> & {
  /** Number of marigold swags across (1–12). */
  swags?: number;
  /** No motion: the complete still drawing. */
  still?: boolean;
};

/** Ruffled rosette: n rounded petals around radius r, centred on 0 0. */
function scallop(r: number, n: number, depth = 0.22, turn = 0) {
  const rv = r * (1 - depth);
  const rc = 2 * r - rv * Math.cos(Math.PI / n);
  const pt = (rad: number, a: number) => `${r1(rad * Math.cos(a))} ${r1(rad * Math.sin(a))}`;
  let d = `M${pt(rv, turn)}`;
  for (let i = 0; i < n; i++) {
    const a0 = turn + (2 * Math.PI * i) / n;
    d += `Q${pt(rc, a0 + Math.PI / n)} ${pt(rv, a0 + (2 * Math.PI) / n)}`;
  }
  return `${d}Z`;
}

const U = 200; // one swag, in viewBox units
const PAD = 16;
const H = 124;
const SAG = 50;
const FLOWERS = 21;
// Fixed ids: every Toran shares the same flower drawings, so a repeat on the page is harmless.
const ID = { orange: "toran-mg", yellow: "toran-my", rose: "toran-rose", leaf: "toran-leaf" };

export default function Toran({ swags = 4, still, ...props }: Props) {
  const n = Math.max(1, Math.min(12, Math.round(swags)));
  const W = n * U;
  const leaves = Math.floor((W + 2 * PAD - 8) / 12);
  return (
    <svg viewBox={`${-PAD} 0 ${W + 2 * PAD} ${H}`} aria-hidden {...props}>
      <defs>
        <g id={ID.orange}>
          <path d={scallop(8, 11)} fill={C.marigold} />
          <path d={scallop(5.4, 9, 0.26, 0.3)} fill={C.haldi} />
          <path d={scallop(2.8, 7, 0.3)} fill={C.marigold} />
        </g>
        <g id={ID.yellow}>
          <path d={scallop(8, 11, 0.22, 0.2)} fill={C.haldi} />
          <path d={scallop(5.4, 9, 0.26)} fill={C.marigold} />
          <circle r={2.2} fill={C.haldi} />
        </g>
        <g id={ID.rose}>
          <path d={scallop(10, 8, 0.2)} fill={C.rani} />
          <path d={scallop(6.4, 6, 0.24, 0.4)} fill={C.sindoor} />
          <circle r={2.6} fill={C.haldi} />
        </g>
        <g id={ID.leaf}>
          <path d="M0 0C6 6 6.6 18 0 30C-6.6 18 -6 6 0 0Z" fill={C.leaf} />
          <path d="M0 2L0.9 16L0 27L-0.9 16Z" fill={C.mehendi} />
        </g>
      </defs>

      {/* bandhanwar: mango leaves hung from the band, behind the swags */}
      {Array.from({ length: leaves }, (_, i) => (
        <path
          key={i}
          d="M0 0C6.2 6.6 6.8 20 0.8 33C-5.4 22 -5.8 7 0 0Z"
          transform={`translate(${-PAD + 8 + i * 12} 5) rotate(${[-7, 4, -2, 8, -4][i % 5]})`}
          fill={i % 2 ? C.mehendi : C.leaf}
        />
      ))}

      {/* marigold swags */}
      {Array.from({ length: n }, (_, j) => {
        const dur = 5.2 + (j % 3) * 0.7;
        return (
          <g
            key={j}
            className={still ? undefined : s.swag}
            style={{ animationDuration: `${dur}s`, animationDelay: `${-r1((j * 1.3) % dur)}s` }}
          >
            {Array.from({ length: FLOWERS }, (_, i) => {
              const t = (i + 0.5) / FLOWERS;
              const k = i % 2 ? 0.9 : 1.04;
              return (
                <use
                  key={i}
                  href={`#${i % 3 === 1 ? ID.yellow : ID.orange}`}
                  transform={`translate(${r1(j * U + t * U)} ${r1(9 + SAG * 4 * t * (1 - t))}) scale(${k})`}
                />
              );
            })}
          </g>
        );
      })}

      {/* the band, with a scalloped lower edge and gota dots */}
      <rect x={-PAD} y={0} width={W + 2 * PAD} height={8} fill={C.sindoor} />
      {Array.from({ length: Math.floor((W + 2 * PAD) / 9) + 1 }, (_, i) => (
        <g key={i}>
          <circle cx={-PAD + 4.5 + i * 9} cy={8} r={3} fill={C.sindoor} />
          <circle cx={-PAD + 4.5 + i * 9} cy={3.6} r={1.3} fill={C.haldi} />
        </g>
      ))}

      {/* strands from each junction, each swaying from its knot */}
      {Array.from({ length: n + 1 }, (_, j) => {
        const dur = [3.4, 4.2, 3.8, 4.6, 3.6][j % 5];
        return (
          <g key={j} transform={`translate(${j * U} 8)`}>
            <g
              className={still ? undefined : s.strand}
              style={{ animationDuration: `${dur}s`, animationDelay: `${-r1(((j * 0.618) % 1) * dur * 2)}s` }}
            >
              <rect x={-1.1} y={0} width={2.2} height={12} fill={C.sindoor} />
              {[16, 29, 42, 55, 68].map((y, i) => (
                <use key={y} href={`#${(i + j) % 2 ? ID.yellow : ID.orange}`} transform={`translate(0 ${y}) scale(0.84)`} />
              ))}
              <circle cy={78} r={3} fill={C.rani} />
              {j % 2 ? (
                <use href={`#${ID.leaf}`} transform="translate(0 80)" />
              ) : (
                <g transform="translate(0 81)">
                  <circle cy={18.2} r={2.6} fill={C.gold} />
                  <path d="M0 0C3.6 0 5 2.6 5.2 6C5.4 10 6.4 12.6 8.4 14.4V15.8Q0 18 -8.4 15.8V14.4C-6.4 12.6 -5.4 10 -5.2 6C-5 2.6 -3.6 0 0 0Z" fill={C.gold} />
                  <path d="M-2 1.2C-3.3 3 -3.4 9 -6.3 14.6L-3.4 16.4C-2.2 11 -1.6 5 -0.4 0.6Z" fill={C.haldi} />
                  <path d="M-5.6 8.6Q0 10 5.6 8.6L6 10.6Q0 12.2 -6 10.6Z" fill={C.ink} />
                </g>
              )}
            </g>
          </g>
        );
      })}

      {/* rosettes over the knots */}
      {Array.from({ length: n + 1 }, (_, j) => (
        <use key={j} href={`#${ID.rose}`} transform={`translate(${j * U} 8)`} />
      ))}
    </svg>
  );
}
