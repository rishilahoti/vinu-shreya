// Rani-pink lotus on its pad, drawn flat in layered petals. Server-safe; motion is CSS in Lotus.module.css.
import type { SVGProps } from "react";
import s from "./Lotus.module.css";
const mod = (n: string): string => s[n];

type Svg = SVGProps<SVGSVGElement>;
const RANI = "#C8487A";
const INK = "#14332F";
const PAPER = "#F4EEE6";
const LEAF = "#3F7A4C";
const MEHENDI = "#5E7A2E";
const HALDI = "#E8B83A";
const MARIGOLD = "#E39B2D";
const r2 = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

// A petal standing on its base at (0, 0), tip at (0, -L). Symmetric, so its box centre-bottom is the base.
const petalD = (L: number, w: number) => {
  const p = (x: number, y: number) => `${r2(x * w)} ${r2(-y * L)}`;
  return `M0 0C${p(0.9, 0.08)} ${p(1.15, 0.45)} ${p(0.55, 0.78)}Q${p(0.2, 0.94)} ${p(0, 1)}Q${p(-0.2, 0.94)} ${p(-0.55, 0.78)}C${p(-1.15, 0.45)} ${p(-0.9, 0.08)} 0 0Z`;
};
// The coloured tip shares the petal's top outline exactly.
const tipD = (L: number, w: number) => {
  const p = (x: number, y: number) => `${r2(x * w)} ${r2(-y * L)}`;
  return `M${p(-0.55, 0.78)}Q${p(0, 0.66)} ${p(0.55, 0.78)}Q${p(0.2, 0.94)} ${p(0, 1)}Q${p(-0.2, 0.94)} ${p(-0.55, 0.78)}Z`;
};
// Right half of the petal, a flat shade step for the cupped side away from the light.
const halfD = (L: number, w: number) => {
  const p = (x: number, y: number) => `${r2(x * w)} ${r2(-y * L)}`;
  return `M0 0C${p(0.9, 0.08)} ${p(1.15, 0.45)} ${p(0.55, 0.78)}Q${p(0.2, 0.94)} ${p(0, 1)}Z`;
};
const veinD = (L: number) => `M-1 ${r2(-L * 0.1)}L0 ${r2(-L * 0.74)}L1 ${r2(-L * 0.1)}Z`;

type Tone = "lit" | "mid";
function Petal({ L, w, tone }: { L: number; w: number; tone: Tone }) {
  const d = petalD(L, w);
  const tip = tipD(L, w);
  return (
    <>
      <path d={d} fill={RANI} />
      {tone === "lit" && <path d={d} fill={PAPER} fillOpacity={0.5} />}
      <path d={halfD(L, w)} fill={tone === "lit" ? RANI : INK} fillOpacity={tone === "lit" ? 0.28 : 0.14} />
      <path d={tip} fill={RANI} />
      {tone === "mid" && <path d={tip} fill={INK} fillOpacity={0.24} />}
      <path d={veinD(L)} fill={tone === "lit" ? RANI : INK} fillOpacity={tone === "lit" ? 0.55 : 0.2} />
    </>
  );
}

// Flower base. Each entry: base offset, angle, length, half-width, tone, moving class.
const BX = 100;
const BY = 112;
type Spec = [dx: number, dy: number, deg: number, L: number, w: number, tone: Tone, cls?: string];
const BACK: Spec[] = [
  [-4, 0, -30, 50, 13, "mid"],
  [4, 0, 30, 50, 13, "mid"],
  [0, 0, 0, 58, 14, "mid"],
];
// Two petals in a V frame the stamens; the outer and lowest pairs are the ones that open.
const FRONT: Spec[] = [
  [-3, 0, -19, 54, 14, "lit", "lotusMidL"],
  [3, 0, 19, 54, 14, "lit", "lotusMidR"],
  [-5, 1, -50, 48, 14, "lit", "lotusOuterL"],
  [5, 1, 50, 48, 14, "lit", "lotusOuterR"],
  [-7, 3, -82, 34, 11, "lit", "lotusLowL"],
  [7, 3, 82, 34, 11, "lit", "lotusLowR"],
  [0, 3, 0, 30, 12, "lit"],
];

// Stamens: a crown of haldi filaments with marigold anthers round the seed head, seen in the V.
const SX = 100;
const SY = 88;
const STAMENS = Array.from({ length: 13 }, (_, i) => {
  const a = rad(-66 + i * 11);
  const len = 19 + (i % 2) * 4;
  const tx = r2(SX + Math.sin(a) * len);
  const ty = r2(SY - Math.cos(a) * len);
  const ox = r2(Math.cos(a) * 1.2);
  const oy = r2(Math.sin(a) * 1.2);
  return { d: `M${SX - ox} ${SY - oy}L${r2(tx - ox)} ${r2(ty - oy)}L${r2(tx + ox)} ${r2(ty + oy)}L${SX + ox} ${SY + oy}Z`, tx, ty };
});

// Lily pad: an ellipse with the radial notch cut out of it.
const padD = (cx: number, cy: number, rx: number, ry: number, from: number, to: number) => {
  const pt = (deg: number) => `${r2(cx + rx * Math.cos(rad(deg)))} ${r2(cy + ry * Math.sin(rad(deg)))}`;
  return `M${cx} ${cy}L${pt(to)}A${rx} ${ry} 0 1 1 ${pt(from)}Z`;
};
const VEINS = [150, 128, 112, 100, 64, 48, 32].map((deg) => {
  const pt = (d: number, k: number) => `${r2(100 + 86 * k * Math.cos(rad(d)))} ${r2(122 + 16 * k * Math.sin(rad(d)))}`;
  return `M100 122L${pt(deg - 1.6, 0.92)}L${pt(deg + 1.6, 0.92)}Z`;
});

function Pads() {
  return (
    <>
      {/* second pad, further back */}
      <ellipse cx={170} cy={110.2} rx={23} ry={5} fill={LEAF} />
      <ellipse cx={170} cy={110.2} rx={23} ry={5} fill={INK} fillOpacity={0.35} />
      <ellipse cx={170} cy={108} rx={23} ry={5} fill={LEAF} />
      {/* main pad: rim, then the lit top, then veins */}
      <path d={padD(100, 125.5, 86, 16, 70, 86)} fill={LEAF} />
      <path d={padD(100, 125.5, 86, 16, 70, 86)} fill={INK} fillOpacity={0.35} />
      <path d={padD(100, 122, 86, 16, 70, 86)} fill={LEAF} />
      {VEINS.map((d) => (
        <path key={d} d={d} fill={MEHENDI} />
      ))}
      {/* a bead of water */}
      <circle cx={146} cy={128} r={2.2} fill={PAPER} fillOpacity={0.85} />
    </>
  );
}

type LotusProps = Svg & {
  /** Leave unset for the breathing loop. true/false sets the state; toggling it opens or closes once. */
  open?: boolean;
  still?: boolean;
};

/** Lotus on its lily pads with a bud beside it. Scale by width (60–240px). */
export default function Lotus({ open, still, className, ...props }: LotusProps) {
  const c = (n: string) => (still ? undefined : mod(n));
  const root = still ? undefined : open === undefined ? mod("lotusLoop") : open ? undefined : mod("lotusShut");
  const place = ([dx, dy, deg, L, w, tone, cls]: Spec) => (
    <g key={`${dx}${deg}`} transform={`translate(${BX + dx} ${BY + dy}) rotate(${deg})`}>
      <g className={cls && !still ? `${mod("lotusPetal")} ${mod(cls)}` : undefined}>
        <Petal L={L} w={w} tone={tone} />
      </g>
    </g>
  );
  return (
    <svg viewBox="0 40 200 110" aria-hidden className={[root, className].filter(Boolean).join(" ") || undefined} {...props}>
      <g className={c("lotusFloat")}>
        {/* bud on its stalk, rising from behind the pad; sways from the waterline */}
        <g className={c("lotusBud")}>
          <path d="M45 128 Q40 102 33.6 80 L36.6 79.4 Q43.6 102 49 128 Z" fill={MEHENDI} />
          <g transform="translate(35 81) rotate(-10)">
            <Petal L={30} w={10} tone="mid" />
            <path d={petalD(11, 6)} transform="rotate(-38)" fill={LEAF} />
            <path d={petalD(11, 6)} transform="rotate(38)" fill={LEAF} />
          </g>
        </g>
        <Pads />
        {BACK.map(place)}
        {STAMENS.map(({ d }) => (
          <path key={d} d={d} fill={HALDI} />
        ))}
        {STAMENS.map(({ tx, ty }) => (
          <circle key={`${tx}${ty}`} cx={tx} cy={ty} r={2} fill={MARIGOLD} />
        ))}
        {/* seed head */}
        <path d="M89 86 L111 86 L106 97 L94 97 Z" fill={MEHENDI} />
        <ellipse cx={100} cy={86} rx={11} ry={3} fill={HALDI} />
        {FRONT.map(place)}
      </g>
    </svg>
  );
}

/** Small static lotus for a section mark (24–40px). */
export function LotusMark(props: Svg) {
  const at = (deg: number, L: number, w: number, tone: Tone) => (
    <g transform={`translate(20 30) rotate(${deg})`}>
      <Petal L={L} w={w} tone={tone} />
    </g>
  );
  return (
    <svg viewBox="0 0 40 40" aria-hidden {...props}>
      <ellipse cx={20} cy={33} rx={15} ry={3.2} fill={LEAF} />
      {at(-68, 13, 5.5, "mid")}
      {at(68, 13, 5.5, "mid")}
      {at(-32, 17, 6, "mid")}
      {at(32, 17, 6, "mid")}
      {at(0, 21, 7, "lit")}
    </svg>
  );
}
