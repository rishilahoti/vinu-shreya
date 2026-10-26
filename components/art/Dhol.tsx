import type { SVGProps } from "react";
import s from "./Dhol.module.css";

type Props = SVGProps<SVGSVGElement> & { still?: boolean };

const marigold = "#E39B2D";
const sindoor = "#B8322A";
const green = "#2E7D6B";
const gold = "#B8892E";
const haldi = "#E8B83A";
const rani = "#C8487A";
const ink = "#14332F";
const paper = "#F4EEE6";
const shellLit = "#CF5B3F";
const shellShade = "#86271F";
const skin = "#EFE3CC";

// An empty square centred on a joint: with transform-box: fill-box, origin 50% 50% is that joint.
function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" />;
}

// The rope laced in a zigzag between the two hoops, as seen across the front of the shell.
const cy = 138;
const left = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 0.5) / 6) * Math.PI;
  return [+(72 + 17 * Math.sin(t)).toFixed(2), +(cy - 46 * Math.cos(t)).toFixed(2)];
});
const right = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 1) / 6) * Math.PI;
  return [225, +(cy - 46 * Math.cos(t)).toFixed(2)];
});
const rope = left.flatMap((p, k) => (k < 5 ? [p, right[k]] : [p])).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
// Tension rings where each pair of ropes meets near the right hoop.
const rings = right.slice(0, 5).map(([rx, ry], k) => {
  const [ax, ay] = left[k];
  const [bx, by] = left[k + 1];
  const x = 198;
  const y1 = ay + ((ry - ay) * (x - ax)) / (rx - ax);
  const y2 = ry + ((by - ry) * (rx - x)) / (rx - bx);
  return [x, (y1 + y2) / 2, Math.abs(y2 - y1) + 7];
});

function Phundna({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 1.5} y={y} width={3} height={9} fill={gold} />
      <circle cx={x} cy={y + 15} r={7} fill={rani} />
      <path d={`M${x - 7} ${y + 17}L${x + 7} ${y + 17}L${x + 5} ${y + 34}L${x} ${y + 30}L${x - 5} ${y + 34}Z`} fill={marigold} />
    </g>
  );
}

/** The baraat dhol on its strap, with the curved dagga and the thin thilli striking in turn. */
export default function Dhol({ still = false, ...rest }: Props) {
  const m = (c: string) => (still ? undefined : s[c]);
  return (
    <svg viewBox="0 0 280 230" aria-hidden="true" focusable="false" {...rest}>
      {/* the drum swells a little on every stroke */}
      <g className={m("dholDrum")}>
        <Pivot x={150} y={cy} r={130} />
        {/* strap */}
        <path d="M84 96C92 14 208 14 218 96" fill="none" stroke={green} strokeWidth={11} />
        <path d="M84 96C92 14 208 14 218 96" fill="none" stroke={haldi} strokeWidth={5.5} strokeLinecap="round" strokeDasharray="0 13" />
        {/* far hoop, shell and its tone steps */}
        <ellipse cx={226} cy={cy} rx={12} ry={49} fill={gold} />
        <path d="M72 90C120 82 180 82 226 90L226 186C180 194 120 194 72 186Z" fill={sindoor} />
        <path d="M72 90C120 82 180 82 226 90L226 101C180 93 120 93 72 101Z" fill={shellLit} />
        <path d="M72 168C120 176 180 176 226 168L226 186C180 194 120 194 72 186Z" fill={shellShade} />
        {/* rope */}
        <polyline points={rope} fill="none" stroke={haldi} strokeWidth={5.5} strokeLinejoin="round" strokeLinecap="round" />
        {rings.map(([x, y, h], k) => (
          <rect key={k} x={x - 4.5} y={y - h / 2} width={9} height={h} fill={gold} />
        ))}
        {/* near hoop and the bass head */}
        <ellipse cx={72} cy={cy} rx={19} ry={50} fill={gold} />
        <ellipse cx={71} cy={cy} rx={13} ry={44} fill={skin} />
        <ellipse cx={71} cy={cy} rx={6} ry={21} fill={paper} />
        {left.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={3.4} fill={haldi} />
        ))}
        <Phundna x={72} y={186} />
        <Phundna x={226} y={184} />
      </g>

      {/* dagga: the bent bass stick, struck on the near head */}
      <g className={m("dholDagga")}>
        <Pivot x={30} y={54} r={110} />
        <path d="M30 50C36 80 44 104 58 118C62 122 64 127 64 133" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
        <path d="M30 48L34 70" stroke={rani} strokeWidth={12} strokeLinecap="round" />
      </g>
      {/* thilli: the thin cane, struck on the far head */}
      <g className={m("dholThilli")}>
        <Pivot x={264} y={48} r={100} />
        <path d="M264 46C257 74 247 102 238 126" fill="none" stroke={gold} strokeWidth={5.5} strokeLinecap="round" />
        <path d="M265 44L261 62" stroke={rani} strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
}
