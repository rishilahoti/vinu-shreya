import type { SVGProps } from "react";
import s from "./Elephant.module.css";

type Props = SVGProps<SVGSVGElement> & { still?: boolean; flip?: boolean };

const marigold = "#E39B2D";
const sindoor = "#B8322A";
const blue = "#1F5E8A";
const gold = "#B8892E";
const haldi = "#E8B83A";
const rani = "#C8487A";
const ink = "#14332F";
const paper = "#F4EEE6";
// Slate hide in three flat tone steps, and ivory for the tusk and toenails.
const hide = "#6E7275";
const hideLit = "#7D8184";
const hideShade = "#575B5E";
const ivory = "#FBF5EA";
const nail = "#D8CCB8";

// An empty square centred on a joint: with transform-box: fill-box, origin 50% 50% is that joint.
// It must hold the whole group, a moving child's own square at full swing included, or the joint drifts.
function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" />;
}

function Flower({ x, y, r, petal = marigold, heart = rani }: { x: number; y: number; r: number; petal?: string; heart?: string }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={x} cy={y - r * 0.62} rx={r * 0.4} ry={r * 0.6} fill={petal} transform={`rotate(${i * 72} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={r * 0.36} fill={heart} />
    </g>
  );
}

function Leg({ d, x, fill, flower }: { d: string; x: number; fill: string; flower: boolean }) {
  return (
    <g>
      <path d={d} fill={fill} />
      {flower && <Flower x={x + 22} y={286} r={10} />}
      {flower &&
        [0, 1, 2, 3].map((i) => <circle key={i} cx={x + 8 + i * 9.5} cy={304} r={2.6} fill={gold} />)}
      <rect x={x - 1} y={312} width={48} height={7} fill={gold} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={x + 4 + i * 10} cy={323} r={3.6} fill={haldi} />
      ))}
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={x + 7 + i * 13} cy={343} rx={5.5} ry={4} fill={nail} />
      ))}
    </g>
  );
}

const frontLeg = "M160 222L206 222L204 330C204 338 206 344 208 347L157 347C159 340 160 334 160 326Z";
const hindLeg = "M334 214C346 212 372 214 384 226L380 330C380 338 382 344 384 347L333 347C336 340 337 334 337 326Z";

const hem = Array.from({ length: 10 }, () => "a9.4 8 0 0 1 -18.8 0").join("");

// One trunk segment: a joint disc at its top, tapering to the next joint.
function Segment({ x, y, r, x2, y2, r2 }: { x: number; y: number; r: number; x2: number; y2: number; r2: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={hide} />
      <path d={`M${x - r} ${y}L${x + r} ${y}L${x2 + r2} ${y2}L${x2 - r2} ${y2}Z`} fill={hide} />
    </>
  );
}

/** A Jaipur festival elephant: painted trunk and face, a peacock-blue jhool, belled anklets. Faces left; `flip` faces right. */
export default function Elephant({ still = false, flip = false, ...rest }: Props) {
  const m = (c: string) => (still ? undefined : s[c]);
  return (
    <svg viewBox="0 0 460 360" aria-hidden="true" focusable="false" {...rest}>
      <g transform={flip ? "matrix(-1 0 0 1 460 0)" : undefined}>
        {/* tail, flicking from the rump */}
        <g className={m("eleTail")}>
          <Pivot x={396} y={148} r={120} />
          <path d="M394 144C404 170 409 196 411 226L403 228C401 200 397 174 387 152Z" fill={hideShade} />
          <path d="M402 226C412 231 417 246 413 262L408 254L404 265L400 254L395 261C393 246 396 233 402 226Z" fill={ink} />
          <rect x={401} y={222} width={11} height={7} fill={gold} transform="rotate(-4 406 225)" />
        </g>

        {/* far legs */}
        <g transform="translate(46 -4)">
          <Leg d={frontLeg} x={158} fill={hideShade} flower={false} />
        </g>
        <g transform="translate(-34 -4)">
          <Leg d={hindLeg} x={336} fill={hideShade} flower={false} />
        </g>

        {/* body */}
        <path d="M150 140C160 96 214 70 270 72C330 74 382 98 398 150C408 182 404 226 388 250C330 262 230 262 170 256C152 230 146 180 150 140Z" fill={hide} />
        <path d="M176 246C240 254 330 254 386 242L384 252C330 262 236 262 172 256Z" fill={hideShade} />

        {/* near legs */}
        <Leg d={frontLeg} x={158} fill={hide} flower />
        <Leg d={hindLeg} x={336} fill={hide} flower />

        {/* jhool: gold ground and scalloped hem, peacock-blue field, sindoor band, marigold medallions */}
        <path d={`M204 98C230 80 252 70 272 70C328 72 378 94 396 140L394 224${hem}L206 226C200 190 200 140 204 98Z`} fill={gold} />
        <path d="M214 104C236 88 254 80 272 80C324 82 368 102 384 142L384 212L216 214C210 180 210 140 214 104Z" fill={blue} />
        <path d="M216 202L384 202L384 212L216 214Z" fill={sindoor} />
        {/* mirror work stitched along the band */}
        {Array.from({ length: 11 }, (_, i) => (
          <circle key={i} cx={226 + i * 15} cy={207.5} r={2.6} fill={paper} />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={384.6 - i * 18.8} cy={220} r={2.6} fill={sindoor} />
        ))}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 375.2 - i * 18.8;
          return <path key={i} d={`M${x} 223C${x + 4} 228 ${x + 4} 234 ${x} 239C${x - 4} 234 ${x - 4} 228 ${x} 223Z`} fill={haldi} />;
        })}
        {[
          [262, 150],
          [338, 150],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={24} fill={gold} />
            <Flower x={x} y={y} r={20} petal={marigold} heart={sindoor} />
            <circle cx={x} cy={y} r={3} fill={haldi} />
          </g>
        ))}
        {[
          [300, 112],
          [300, 186],
          [226, 182],
          [372, 182],
          [236, 120],
          [300, 150],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            {[0, 90, 180, 270].map((a) => (
              <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 5} cy={y + Math.sin((a * Math.PI) / 180) * 5} r={2.4} fill={paper} />
            ))}
          </g>
        ))}

        {/* bell on its chain at the chest */}
        <path d="M168 196C162 210 156 220 152 228" fill="none" stroke={gold} strokeWidth={4} />
        <path d="M139 248C139 236 144 228 152 228C160 228 165 236 165 248L169 254L135 254Z" fill={gold} />
        <path d="M143 244L161 244L162 248L142 248Z" fill={sindoor} />
        <circle cx={152} cy={258} r={4} fill={haldi} />

        {/* head, the jaw in shade */}
        <path d="M190 120C186 88 172 64 146 60C136 56 120 56 110 62C92 70 76 88 72 108C70 128 74 150 82 168L100 196L150 200C170 186 192 160 190 120Z" fill={hide} />
        <path d="M104 190C122 194 140 192 156 184C172 174 184 156 189 132C190 160 172 186 150 200L100 196Z" fill={hideShade} />

        {/* trunk, curling from the head joint by joint */}
        <g className={m("eleTrunk1")}>
          <Pivot x={102} y={176} r={260} />
          <Segment x={102} y={176} r={22} x2={96} y2={222} r2={16} />
          <circle cx={90} cy={204} r={3} fill={rani} />
          <circle cx={92} cy={214} r={2.6} fill={gold} />
          <g className={m("eleTrunk2")}>
            <Pivot x={96} y={222} r={172} />
            <Segment x={96} y={222} r={16} x2={90} y2={258} r2={13} />
            <Flower x={93.5} y={238} r={10} />
            <circle cx={93.5} cy={238} r={2} fill={haldi} />
            <circle cx={91} cy={253} r={2.8} fill={gold} />
            <g className={m("eleTrunk3")}>
              <Pivot x={90} y={258} r={100} />
              <Segment x={90} y={258} r={13} x2={84} y2={286} r2={10.5} />
              <circle cx={87} cy={272} r={2.4} fill={marigold} />
              <path d="M81 265Q89 268 97 265L97 268.5Q89 271.5 81 268.5Z" fill={hideShade} />
              <path d="M79 276Q87 279 95 276L95 279.5Q87 282.5 79 279.5Z" fill={hideShade} />
              <g className={m("eleTrunk4")}>
                <Pivot x={84} y={286} r={50} />
                <circle cx={84} cy={286} r={10.5} fill={hide} />
                <path d="M73.5 286L94.5 286C96 300 92 312 82 318C74 322 64 320 59 311C66 311 71 307 73 300Z" fill={hide} />
                <path d="M77 294Q84 297 91 294L91 297.5Q84 300.5 77 297.5Z" fill={hideShade} />
                <path d="M59 311C64 320 74 322 82 318L79 323C70 326 62 322 59 311Z" fill={hideShade} />
                <circle cx={84} cy={306} r={2.8} fill={rani} />
              </g>
            </g>
          </g>
        </g>
        {/* tusk with gold caps, over the trunk */}
        <path d="M124 180C114 200 98 212 76 216C88 206 102 194 110 176Z" fill={ivory} />
        <path d="M106 188L117 194L114 200L102 193Z" fill={gold} />
        <path d="M84 211L76 216L86 216Z" fill={gold} />

        {/* face paint: a lotus on the brow, dots round the eye, a buta on the cheek */}
        <Flower x={124} y={96} r={14} petal={marigold} heart={rani} />
        <circle cx={124} cy={96} r={2.8} fill={haldi} />
        {Array.from({ length: 7 }, (_, i) => {
          const a = Math.PI * (1.05 + i * 0.15);
          return <circle key={i} cx={124 + Math.cos(a) * 26} cy={96 + Math.sin(a) * 26} r={2.6} fill={gold} />;
        })}
        <path d="M136 136C148 132 158 142 156 154C154 166 146 172 138 179C142 170 142 164 136 162C126 160 122 152 126 144C128 140 132 137 136 136Z" fill={rani} />
        <circle cx={139} cy={149} r={4} fill={haldi} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={[132, 146, 160, 162][i]} cy={[128, 128, 140, 156][i]} r={2.4} fill={gold} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={100 + i * 9} cy={162 + i * 2} r={2.6} fill={gold} />
        ))}
        {/* eye */}
        <path d="M100 128C104 122 114 121 120 126C114 129 106 131 100 128Z" fill={hideShade} />
        <ellipse cx={110} cy={124} rx={5.6} ry={3.4} fill={ink} />
        <circle cx={108.6} cy={122.8} r={1.4} fill={paper} />

        {/* ear, flapping from where it meets the head */}
        <g className={m("eleEar")}>
          <Pivot x={154} y={134} r={100} />
          <path d="M150 90C178 82 208 96 216 124C224 152 212 180 192 198C182 208 174 216 168 226C161 208 156 190 154 170C152 148 150 120 150 90Z" fill={hideLit} />
          <path d="M160 102C182 98 200 110 205 128C210 148 202 170 188 184C181 192 176 198 172 206C168 192 165 178 164 162C162 142 160 122 160 102Z" fill={hide} />
          <path d="M150 90C178 82 208 96 216 124L207 124C200 104 178 94 152 99Z" fill={hideShade} />
          <Flower x={184} y={142} r={13} petal={rani} heart={haldi} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={[174, 196, 208, 208, 198, 184][i]} cy={[96, 104, 122, 150, 176, 196][i]} r={2.8} fill={gold} />
          ))}
        </g>
      </g>
    </svg>
  );
}
