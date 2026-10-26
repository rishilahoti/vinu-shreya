import type { CSSProperties, SVGProps } from "react";
import s from "./SacredFire.module.css";

type Props = SVGProps<SVGSVGElement> & { still?: boolean };

const marigold = "#E39B2D";
const sindoor = "#B8322A";
const leaf = "#3F7A4C";
const haldi = "#E8B83A";
const ink = "#14332F";
const paper = "#F4EEE6";
// Geru clay in flat tone steps: the lit top of each step, the plastered face, brick, mortar.
const clayLit = "#CF5B3F";
const brick = "#A3402A";
const mortar = "#7A2B1F";
const wood = "#6B3A1E";

// An empty square centred on a flame's root: with transform-box: fill-box, origin 50% 50% is that root.
function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" />;
}

// A flame tongue: narrow at the root, full in the belly, its tip hooked towards `lean`.
function flame(cx: number, by: number, w: number, h: number, lean: number) {
  const p = (x: number, y: number) => `${(cx + x).toFixed(1)} ${(by - y).toFixed(1)}`;
  return `M${p(-w * 0.32, 0)}C${p(-w * 0.62, h * 0.22)} ${p(-w * 0.52, h * 0.55)} ${p(-w * 0.14 + lean * 0.4, h * 0.74)}C${p(lean * 0.5, h * 0.86)} ${p(lean * 0.75, h * 0.93)} ${p(lean, h)}C${p(lean * 0.3 + w * 0.16, h * 0.86)} ${p(w * 0.3, h * 0.72)} ${p(w * 0.44, h * 0.48)}C${p(w * 0.56, h * 0.26)} ${p(w * 0.46, h * 0.06)} ${p(w * 0.32, 0)}Z`;
}

// [centre, width, height, lean, colour, keyframes, duration s, delay s]
const flames: [number, number, number, number, string, "a" | "b" | "c", number, number][] = [
  [112, 58, 100, -18, sindoor, "b", 2.7, -0.4],
  [190, 62, 112, 18, sindoor, "c", 3.1, -1.7],
  [131, 46, 128, 12, sindoor, "a", 2.9, -2.4],
  [170, 48, 134, -14, sindoor, "b", 3.3, -1.1],
  [150, 96, 158, -8, sindoor, "a", 3.6, -0.9],
  [118, 38, 66, -12, marigold, "c", 2.5, -1.2],
  [184, 42, 78, 14, marigold, "a", 2.9, -0.2],
  [150, 74, 120, 8, marigold, "b", 2.6, -2.1],
  [143, 40, 76, -8, haldi, "a", 2.4, -1.5],
  [160, 30, 54, 9, haldi, "c", 2.8, -0.6],
];

// [x, y, r, colour, drift px, duration s, delay s]
const embers: [number, number, number, string, number, number, number][] = [
  [126, 58, 3.2, haldi, -10, 3.6, -0.3],
  [152, 30, 2.6, marigold, 6, 4.4, -2.6],
  [178, 48, 3, haldi, 12, 3.2, -1.4],
  [138, 86, 2.6, marigold, -6, 4, -3.1],
  [196, 92, 2.8, haldi, 8, 3.8, -0.9],
  [104, 100, 2.6, haldi, -12, 4.8, -2],
  [166, 70, 3.4, marigold, 4, 3.4, -1.9],
];

function Marigold({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={+(x + Math.cos(a) * r * 0.72).toFixed(2)} cy={+(y + Math.sin(a) * r * 0.72).toFixed(2)} r={r * 0.4} fill={marigold} />;
      })}
      <circle cx={x} cy={y} r={r * 0.78} fill={marigold} />
      <circle cx={x} cy={y} r={r * 0.5} fill={haldi} />
      <circle cx={x} cy={y} r={r * 0.2} fill={sindoor} />
    </g>
  );
}

// Brick courses for the middle step, cut to its face.
const bricks: [number, number, number][] = [];
for (let row = 0; row < 3; row++) {
  for (let x = 58 - (row % 2) * 13; x < 242; x += 26.5) {
    const x0 = Math.max(x, 59);
    const x1 = Math.min(x + 24, 241);
    if (x1 - x0 > 4) bricks.push([x0, 221.5 + row * 10.5, x1 - x0]);
  }
}

/** The havan kund for the pheras: a stepped geru-clay altar painted with white mandana, a three-colour fire, rising sparks. */
export default function SacredFire({ still = false, ...rest }: Props) {
  const m = (c: string) => (still ? undefined : s[c]);
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" focusable="false" {...rest}>
      {/* bottom step: plaster with mandana flowers */}
      <path d="M44 248L256 248L270 256L30 256Z" fill={clayLit} />
      <rect x={30} y={256} width={240} height={32} fill={sindoor} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 46 + i * 26;
        return (
          <g key={i} fill={paper}>
            <path d={`M${x} 263L${x + 6} 272L${x} 281L${x - 6} 272Z`} />
            <circle cx={x - 11} cy={272} r={1.8} />
            <circle cx={x + 11} cy={272} r={1.8} />
          </g>
        );
      })}

      {/* middle step: brick */}
      <path d="M70 213L230 213L242 220L58 220Z" fill={clayLit} />
      <rect x={58} y={220} width={184} height={32} fill={mortar} />
      {bricks.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={9} fill={brick} />
      ))}

      {/* top step: the rim of the kund and its pit, with the sticks of mango wood */}
      <path d="M96 177L204 177L214 184L86 184Z" fill={clayLit} />
      <path d="M106 179L194 179L199 183L101 183Z" fill={ink} />

      {/* the fire: each colour its own shape, each flickering from its root */}
      {flames.map(([cx, w, h, lean, fill, k, dur, delay], i) => (
        <g
          key={i}
          className={m(`fire${k.toUpperCase()}`)}
          style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
        >
          <Pivot x={cx} y={186} r={h + 10} />
          <path d={flame(cx, 186, w, h, lean)} fill={fill} />
        </g>
      ))}

      <path d="M112 186L176 170L180 176L116 192Z" fill={wood} />
      <path d="M188 186L124 170L120 176L184 192Z" fill={wood} />
      <circle cx={178} cy={173} r={3.4} fill={haldi} />
      <circle cx={122} cy={173} r={3.4} fill={marigold} />

      {/* the rim's face: plaster, kangura triangles, dot flowers */}
      <rect x={86} y={184} width={128} height={32} fill={sindoor} />
      {Array.from({ length: 10 }, (_, i) => {
        const x = 86 + i * 12.8;
        return <path key={i} d={`M${x} 184L${x + 12.8} 184L${x + 6.4} 191Z`} fill={paper} />;
      })}
      {[110, 150, 190].map((x) => (
        <g key={x} fill={paper}>
          <circle cx={x} cy={203} r={2.6} />
          {[0, 90, 180, 270].map((a) => (
            <circle key={a} cx={+(x + Math.cos((a * Math.PI) / 180) * 6).toFixed(2)} cy={+(203 + Math.sin((a * Math.PI) / 180) * 6).toFixed(2)} r={2} />
          ))}
        </g>
      ))}
      {[130, 170].map((x) => (
        <path key={x} d={`M${x} 199L${x + 4} 203L${x} 207L${x - 4} 203Z`} fill={haldi} />
      ))}

      {/* marigolds and mango leaves laid at the corners */}
      <path d="M36 252C42 240 54 238 62 242C54 248 46 252 36 252Z" fill={leaf} />
      <path d="M264 252C258 240 246 238 238 242C246 248 254 252 264 252Z" fill={leaf} />
      <Marigold x={46} y={249} r={9} />
      <Marigold x={254} y={249} r={9} />
      <Marigold x={76} y={214} r={7} />
      <Marigold x={224} y={214} r={7} />

      {/* sparks rising out of the fire */}
      {embers.map(([x, y, r, fill, dx, dur, delay], i) => (
        <circle
          key={i}
          className={m("fireEmber")}
          cx={x}
          cy={y}
          r={r}
          fill={fill}
          style={{ "--dx": `${dx}px`, animationDuration: `${dur}s`, animationDelay: `${delay}s` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
