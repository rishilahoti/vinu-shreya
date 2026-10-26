// Jaipur patang (fighter kite) on its manjha, drawn flat. Server-safe; motion is CSS in Kite.module.css.
import type { CSSProperties, SVGProps } from "react";
import s from "./Kite.module.css";
const mod = (n: string): string => s[n];

type Svg = SVGProps<SVGSVGElement>;
const INK = "#14332F";
const r2 = (n: number) => Math.round(n * 100) / 100;

/** The kite around its bridle knot (0, 2), spine vertical. 60 wide, 75 tall with the tail. */
function Patang({ body, top, still }: { body: string; top: string; still?: boolean }) {
  return (
    <g className={still ? undefined : mod("kiteTilt")}>
      {/* fishtail paper tail glued under the bottom tip */}
      <path className={still ? undefined : mod("kiteTail")} d="M0 28 L-7.5 45 L0 40 L7.5 45 Z" fill={top} />
      {/* the paper, bottom edges slightly drawn in */}
      <path d="M0 -30 L30 -4 Q14 12 0 32 Q-14 12 -30 -4 Z" fill={body} />
      {/* cap above the bow */}
      <path d="M0 -30 L30 -4 Q0 -36 -30 -4 Z" fill={top} />
      {/* corner patches where the bow is tied */}
      <path d="M-30 -4 L-23 -10 L-24.6 1.6 Z M30 -4 L23 -10 L24.6 1.6 Z" fill={top} />
      {/* tip patch */}
      <path d="M-8.08 21 Q-3.96 26.34 0 32 Q3.96 26.34 8.08 21 Z" fill={top} />
      {/* chaand: the moon roundel */}
      <circle cy={5} r={8.5} fill={top} />
      <circle cy={5} r={4} fill={body} />
      {/* bamboo spine and bow seen through the paper */}
      <rect x={-1.1} y={-30} width={2.2} height={62} fill={INK} fillOpacity={0.3} />
      <path d="M-30 -4 Q0 -36 30 -4 Q0 -32.5 -30 -4 Z" fill={INK} fillOpacity={0.3} />
      {/* kanna knot */}
      <circle cy={2} r={1.7} fill={INK} />
    </g>
  );
}

type Flying = {
  x: number;
  y: number;
  k: number;
  rot: number;
  /** Where the string leaves the picture: keep it below and outside the kite, it is the sway pivot. */
  end: [number, number];
  body: string;
  top: string;
  string: string;
  still?: boolean;
  style?: CSSProperties;
};

function FlyingKite({ x, y, k, rot, end: [ex, ey], body, top, string, still, style }: Flying) {
  const a = (rot * Math.PI) / 180;
  const bx = r2(x - 2 * k * Math.sin(a));
  const by = r2(y + 2 * k * Math.cos(a));
  const right = ex > bx;
  const cls = still ? undefined : right ? `${mod("kiteSway")} ${mod("kiteFromRight")}` : mod("kiteSway");
  return (
    <g className={cls} style={style}>
      {/* steep under the kite, flattening towards the roof it is flown from */}
      <path
        d={`M${bx} ${by} C${bx} ${by + 50} ${ex + (right ? -40 : 40)} ${ey - 30} ${ex} ${ey}`}
        fill="none"
        stroke={string}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
        <Patang body={body} top={top} still={still} />
      </g>
    </g>
  );
}

type KiteProps = Svg & {
  /** Paper colour. */
  body?: string;
  /** Cap, roundel, patches and tail. */
  top?: string;
  /** String colour; follows the text colour by default so it reads on paper and on the peacock field. */
  string?: string;
  still?: boolean;
};

/** One kite with its string trailing off the bottom left. Scale by width (30–140px). */
export default function Kite({ body = "#B8322A", top = "#E39B2D", string = "currentColor", still, ...props }: KiteProps) {
  return (
    <svg viewBox="0 0 100 170" aria-hidden {...props}>
      <FlyingKite x={60} y={40} k={1} rot={-10} end={[-6, 178]} body={body} top={top} string={string} still={still} />
    </svg>
  );
}

const vars = (sway: number, tilt: number, d: number) =>
  ({ "--sway": `${sway}s`, "--tilt": `${tilt}s`, "--d": `${d}s` }) as CSSProperties;

/** Three kites at three depths for the top of a sky; two of the strings cross (a pench). Wide strip, 640 × 220. */
export function KiteSky({ string = "currentColor", still, ...props }: Svg & { string?: string; still?: boolean }) {
  return (
    <svg viewBox="0 0 640 220" aria-hidden {...props}>
      <FlyingKite x={590} y={30} k={0.42} rot={-6} end={[660, 228]} body="#C8487A" top="#2E7D6B" string={string} still={still} style={vars(7.6, 4.4, -3.1)} />
      <FlyingKite x={430} y={56} k={0.78} rot={9} end={[140, 232]} body="#1F5E8A" top="#E8B83A" string={string} still={still} style={vars(5.8, 3.3, -1.7)} />
      <FlyingKite x={128} y={72} k={1.3} rot={-12} end={[430, 232]} body="#B8322A" top="#E39B2D" string={string} still={still} style={vars(6.8, 3.9, -0.4)} />
    </svg>
  );
}
