// Rajasthani SVG motif kit, drawn in code. Server-safe (no hooks), so any section can use it.
import type { SVGProps } from "react";

type Svg = SVGProps<SVGSVGElement>;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Cusped (multifoil) Rajput arch opening inside the rect (x, y, w, h).
 * Two-centred pointed arch with `lobes` scallops per side. Returns a closed path `d`.
 */
export function archPath(x: number, y: number, w: number, h: number, lobes = 5, rise = 0.8) {
  const R = w * rise;
  const half = w / 2;
  const apex = Math.sqrt(R * R - (R - half) ** 2); // height of the arch above the spring line
  const phiApex = Math.acos((half - R) / R);
  const left = Array.from({ length: lobes + 1 }, (_, i) => {
    const phi = Math.PI - (Math.PI - phiApex) * (i / lobes);
    return [R + R * Math.cos(phi), apex - R * Math.sin(phi)];
  });
  const right = [...left].reverse().map(([px, py]) => [w - px, py]);
  let d = `M${r2(x)} ${r2(y + h)} L${r2(x)} ${r2(y + apex)}`;
  for (const pts of [left, right]) {
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      const rad = r2(Math.hypot(bx - ax, by - ay) * 0.6);
      d += ` A${rad} ${rad} 0 0 1 ${r2(x + bx)} ${r2(y + by)}`;
    }
  }
  return `${d} L${r2(x + w)} ${r2(y + h)} Z`;
}

/** Wall with a cusped arch cut out of it. Fill = wall colour. */
export function ArchFrame({ inset = 0.12, lobes = 6, ...props }: Svg & { inset?: number; lobes?: number }) {
  const W = 400;
  const H = 800;
  const ix = W * inset;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden {...props}>
      <path fillRule="evenodd" d={`M0 0H${W}V${H}H0Z ${archPath(ix, H * 0.1, W - ix * 2, H * 0.9 + 1, lobes)}`} />
    </svg>
  );
}

/** Teardrop petal from radius r0 out to r1, pointing up (rotate it into place). */
function petal(r0: number, r1: number, w: number) {
  const span = r1 - r0;
  return `M0 ${-r0} C${w} ${-(r0 + span * 0.3)} ${w * 0.55} ${-(r1 - span * 0.12)} 0 ${-r1} C${-w * 0.55} ${-(r1 - span * 0.12)} ${-w} ${-(r0 + span * 0.3)} 0 ${-r0}Z`;
}

type Ring = { count: number; r0: number; r1: number; w: number; offset?: number };
const MANDALA: Ring[] = [
  { count: 8, r0: 10, r1: 30, w: 9 },
  { count: 16, r0: 32, r1: 52, w: 7, offset: 11.25 },
  { count: 24, r0: 56, r1: 74, w: 5 },
  { count: 32, r0: 78, r1: 94, w: 3.5, offset: 5.625 },
];

/** Line-art mandala, strokes only. Solid strokes have class "mandala-line" (for DrawSVG); dotted rings "mandala-dots". */
export function Mandala({ rings = MANDALA, ...props }: Svg & { rings?: Ring[] }) {
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth={0.8} aria-hidden {...props}>
      <circle className="mandala-line" r={6} />
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.count }, (_, i) => (
            <path
              key={i}
              className="mandala-line"
              d={petal(ring.r0, ring.r1, ring.w)}
              transform={`rotate(${r2((360 / ring.count) * i + (ring.offset ?? 0))})`}
            />
          ))}
          <circle className="mandala-dots" r={ring.r1 + 2} strokeDasharray="1 3" />
        </g>
      ))}
    </svg>
  );
}

/** Jaipur patang (fighter kite) with its little tail and a loose string. */
export function Kite({ body = "#E04A7E", top = "#F2A83B", ...props }: Svg & { body?: string; top?: string }) {
  return (
    <svg viewBox="0 0 60 120" aria-hidden {...props}>
      <path d="M30 62Q40 92 24 118" fill="none" stroke="#F7EBD3" strokeOpacity={0.35} strokeWidth={0.8} />
      <path d="M30 2L56 34L30 66L4 34Z" fill={body} />
      <path d="M30 2L56 34H4Z" fill={top} />
      <path d="M30 2V66M4 34Q30 20 56 34" fill="none" stroke="#0B0D27" strokeOpacity={0.3} strokeWidth={1} />
      <path d="M30 64L21 76H39Z" fill={top} />
    </svg>
  );
}

/** Clay diya. The flame group has class "diya-flame" so CSS can flicker it. */
export function Diya(props: Svg) {
  return (
    <svg viewBox="0 0 60 52" aria-hidden {...props}>
      <g className="diya-flame">
        <ellipse cx={30} cy={18} rx={11} ry={14} fill="#F2A83B" opacity={0.25} />
        <path d="M30 3C36 13 38 19 30 26C22 19 24 13 30 3Z" fill="#F2A83B" />
        <path d="M30 11C33 16 33 20 30 24C27 20 27 16 30 11Z" fill="#FFF1C9" />
      </g>
      <path d="M5 28H55C53 41 43 48 30 48C17 48 7 41 5 28Z" fill="#A8482A" />
      <path d="M5 28H55" stroke="#F2A83B" strokeWidth={2} strokeLinecap="round" />
      <path d="M14 36H46" stroke="#F7EBD3" strokeOpacity={0.35} strokeDasharray="2 4" strokeLinecap="round" />
    </svg>
  );
}

const MARIGOLD = ["#F2A83B", "#E5771E", "#F2A83B", "#F7C65C"];

/** Toran: marigold swags with hanging strands ending in mango leaves. Spans its width. */
export function Toran({ swags = 4, ...props }: Svg & { swags?: number }) {
  const W = 400;
  const step = W / swags;
  const flowers: [number, number, string][] = [];
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      flowers.push([s * step + step * t, 5 + 30 * 4 * t * (1 - t), MARIGOLD[(s + i) % 4]]);
    }
  }
  return (
    <svg viewBox={`0 0 ${W} 110`} aria-hidden {...props}>
      {Array.from({ length: swags + 1 }, (_, s) => (
        <g key={s} className="toran-strand" style={{ transformOrigin: `${s * step}px 5px` }}>
          {Array.from({ length: 6 }, (_, k) => (
            <circle key={k} cx={s * step} cy={14 + k * 11} r={5} fill={MARIGOLD[(k + s) % 4]} />
          ))}
          <path
            d={`M${s * step} 76C${s * step + 6} 84 ${s * step + 6} 94 ${s * step} 104C${s * step - 6} 94 ${s * step - 6} 84 ${s * step} 76Z`}
            fill="#3E8E5A"
          />
        </g>
      ))}
      {flowers.map(([cx, cy, fill], i) => (
        <g key={i}>
          <circle cx={r2(cx)} cy={r2(cy)} r={6} fill={fill} />
          <circle cx={r2(cx)} cy={r2(cy)} r={2.2} fill="#B8521A" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
}

/** Chhatri (domed pavilion) silhouette with open arches between pillars. */
function chhatri(x: number, base: number, w: number) {
  const h = w * 1.6;
  const plinth = base - h * 0.08;
  const pillarTop = plinth - h * 0.32;
  const eave = pillarTop - h * 0.06;
  const domeTop = eave - h * 0.42;
  const p = w * 0.09;
  const gap = (w - p * 3) / 2;
  let d = `M${x - w * 0.06} ${base}H${x + w * 1.06}V${plinth}H${x - w * 0.06}Z`;
  for (let i = 0; i < 3; i++) d += `M${x + i * (p + gap)} ${plinth}h${p}V${pillarTop}h${-p}Z`;
  d += `M${x - w * 0.14} ${pillarTop}H${x + w * 1.14}L${x + w * 1.04} ${eave}H${x - w * 0.04}Z`;
  d += `M${x + w * 0.1} ${eave}C${x + w * 0.02} ${eave - h * 0.3} ${x + w * 0.4} ${domeTop + h * 0.06} ${x + w * 0.5} ${domeTop}`;
  d += `C${x + w * 0.6} ${domeTop + h * 0.06} ${x + w * 0.98} ${eave - h * 0.3} ${x + w * 0.9} ${eave}Z`;
  d += `M${x + w * 0.48} ${domeTop + 1}h${w * 0.04}v${-h * 0.14}h${-w * 0.04}Z`;
  return d;
}

/** Fort wall with merlons (kangura) along the top. */
function wall(x: number, top: number, w: number, base: number) {
  const m = 9;
  let d = `M${x} ${base}V${top}`;
  for (let cx = x; cx < x + w - 0.1; cx += m * 2) {
    const e = Math.min(cx + m, x + w);
    d += `H${cx}V${top - 7}Q${cx + m / 2} ${top - 12} ${e} ${top - 7}V${top}`;
  }
  return `${d}H${x + w}V${base}Z`;
}

type Piece =
  | { k: "wall"; x: number; top: number; w: number }
  | { k: "tower"; x: number; top: number; w: number }
  | { k: "chhatri"; x: number; base: number; w: number };

const SKYLINES: Record<"far" | "near", Piece[]> = {
  far: [
    { k: "wall", x: 0, top: 150, w: 400 },
    { k: "tower", x: 40, top: 110, w: 46 },
    { k: "chhatri", x: 47, base: 110, w: 32 },
    { k: "tower", x: 150, top: 92, w: 100 },
    { k: "chhatri", x: 160, base: 92, w: 34 },
    { k: "chhatri", x: 206, base: 92, w: 34 },
    { k: "chhatri", x: 178, base: 60, w: 44 },
    { k: "tower", x: 318, top: 118, w: 44 },
    { k: "chhatri", x: 324, base: 118, w: 32 },
  ],
  near: [
    { k: "tower", x: -10, top: 60, w: 92 },
    { k: "chhatri", x: 4, base: 60, w: 62 },
    { k: "wall", x: 80, top: 168, w: 240 },
    { k: "tower", x: 318, top: 74, w: 92 },
    { k: "chhatri", x: 334, base: 74, w: 62 },
  ],
};

/** Palace skyline silhouette, 400×220 viewBox anchored to the bottom. Windows glow marigold. */
export function Skyline({ variant = "far", windows = true, ...props }: Svg & { variant?: "far" | "near"; windows?: boolean }) {
  const B = 220;
  const pieces = SKYLINES[variant];
  const d = pieces
    .map((p) => (p.k === "chhatri" ? chhatri(p.x, p.base, p.w) : p.k === "wall" ? wall(p.x, p.top, p.w, B) : `M${p.x} ${B}V${p.top}H${p.x + p.w}V${B}Z`))
    .join("");
  const lit = windows
    ? pieces
        .filter((p): p is Extract<Piece, { k: "tower" }> => p.k === "tower")
        .flatMap((t, ti) =>
          Array.from({ length: Math.floor(t.w / 22) * 2 }, (_, i) => {
            const cols = Math.floor(t.w / 22);
            return { x: t.x + 9 + (i % cols) * 22, y: t.top + 20 + Math.floor(i / cols) * 30, key: `${ti}-${i}` };
          }),
        )
    : [];
  return (
    <svg viewBox={`0 0 400 ${B}`} preserveAspectRatio="xMidYMax slice" aria-hidden {...props}>
      <path d={d} fill="currentColor" />
      {lit.map((w) => (
        <path key={w.key} className="skyline-window" d={`M${w.x} ${w.y + 12}V${w.y + 4}Q${w.x + 4} ${w.y - 2} ${w.x + 8} ${w.y + 4}V${w.y + 12}Z`} fill="#F2A83B" />
      ))}
    </svg>
  );
}

/** Tileable backgrounds. Use as `style={{ backgroundImage: PATTERNS.bandhani }}`. */
export const PATTERNS = {
  // Bandhani tie-dye: clusters of dots.
  bandhani: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cg fill='%23F2A83B' fill-opacity='.22'%3E%3Ccircle cx='7' cy='7' r='1.6'/%3E%3Ccircle cx='11' cy='7' r='1.6'/%3E%3Ccircle cx='9' cy='10.5' r='1.6'/%3E%3Ccircle cx='21' cy='21' r='1.6'/%3E%3Ccircle cx='25' cy='21' r='1.6'/%3E%3Ccircle cx='23' cy='24.5' r='1.6'/%3E%3C/g%3E%3C/svg%3E")`,
  // Leheriya: diagonal waves.
  leheriya: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M-10 30Q0 20 10 30T30 30T50 30M-10 10Q0 0 10 10T30 10T50 10' fill='none' stroke='%23E04A7E' stroke-opacity='.18' stroke-width='3'/%3E%3C/svg%3E")`,
};
