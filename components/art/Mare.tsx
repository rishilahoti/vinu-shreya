import type { SVGProps } from "react";
import s from "./Mare.module.css";

type Props = SVGProps<SVGSVGElement> & { still?: boolean };

const marigold = "#E39B2D";
const sindoor = "#B8322A";
const leaf = "#3F7A4C";
const green = "#2E7D6B";
const gold = "#B8892E";
const haldi = "#E8B83A";
const mehendi = "#5E7A2E";
const rani = "#C8487A";
const ink = "#14332F";
const paper = "#F4EEE6";
// The mare's own tone steps: lit coat, shaded coat, far-side coat, far-side henna.
const coat = "#FFFCF6";
const coatShade = "#E0D0B9";
const coatFar = "#CBB69B";
const hennaFar = "#B06A1C";

// An empty square centred on a joint: with transform-box: fill-box, origin 50% 50% is that joint.
// It must hold the whole group, a moving child's own square at full swing included, or the joint drifts.
function Pivot({ x, y, r }: { x: number; y: number; r: number }) {
  return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" />;
}

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

function MangoLeaf({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0C7 6 8 15 0 24C-8 15-7 6 0 0Z" fill={leaf} />
      <path d="M0 0C7 6 8 15 0 24Z" fill={mehendi} />
    </g>
  );
}

// One slim plume of the kalangi, standing on its base, its tip bowing back.
function Strand({ a, len, fill }: { a: number; len: number; fill: string }) {
  return (
    <g transform={`translate(302 36) rotate(${a})`}>
      <path d={`M-1 0C-7 ${-len * 0.45} -5 ${-len * 0.8} -10 ${-len}C0 ${-len * 0.84} 7 ${-len * 0.45} 2 0Z`} fill={fill} />
      <circle cx={-10} cy={-len} r={3} fill={haldi} />
    </g>
  );
}

// Leg geometry (near side); the far legs reuse it, shifted and shaded.
const hindLeg =
  "M112 214C111 244 117 268 120 288C121 296 123 300 124 306L125 334C125 342 128 347 134 349L147 349C143 343 139 338 138 332L137 306C137 296 141 286 147 276C157 262 163 252 165 238Z";
const hindSock = "M124.6 324L137.6 324L138 332C139 338 143 343 147 349L134 349C128 347 125 342 125 334Z";
const hindHoof = "M132 348L146 347L151 360L130 360Z";
const foreArm = "M276 226L304 226C305 248 301 270 299 288L283 288C281 268 277 248 276 226Z";
const foreCannon = "M284 290L298 290L297 328C299 336 302 342 307 348L293 349C289 343 286 338 285 330Z";
const foreSock = "M284.6 323L297.2 323L297 328C299 336 302 342 307 348L293 349C289 343 286 338 285 330Z";
const foreHoof = "M293 348L306 347L312 360L291 360Z";

function Anklet({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={6} fill={gold} />
      {[0.15, 0.5, 0.85].map((t) => (
        <circle key={t} cx={x + w * t} cy={y + 9} r={3} fill={haldi} />
      ))}
    </g>
  );
}

const hem = Array.from({ length: 8 }, () => "a9.5 8 0 0 0 19 0").join("");

// Bandhani dots across the caparison, kept clear of the medallion.
const dots: [number, number][] = [];
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 7; col++) {
    const x = 166 + col * 18 + (row % 2) * 9;
    const y = 172 + row * 18;
    if (Math.hypot(x - 216, y - 198) > 34 && x < 276) dots.push([x, y]);
  }
}

/** The baraat ghodi: a white Marwari mare in a sindoor and gold caparison, kalangi on her head, a toran on her neck. */
export default function Mare({ still = false, ...rest }: Props) {
  const m = (c: string) => (still ? undefined : s[c]);
  return (
    <svg viewBox="0 -36 420 404" aria-hidden="true" focusable="false" {...rest}>
      {/* far legs */}
      <g transform="translate(24 -3)">
        <path d={hindLeg} fill={coatFar} />
        <path d={hindSock} fill={hennaFar} />
        <path d={hindHoof} fill={ink} />
      </g>
      <g transform="translate(-24 -3)">
        <path d={foreArm} fill={coatFar} />
        <ellipse cx={291} cy={291} rx={9.5} ry={10} fill={coatFar} />
        <path d={foreCannon} fill={coatFar} />
        <path d={foreSock} fill={hennaFar} />
        <path d={foreHoof} fill={ink} />
      </g>

      {/* body, with the hindquarter shaded */}
      <path
        d="M128 150C150 138 190 146 215 150C235 153 250 141 264 140L302 172C318 192 318 226 302 240C272 254 190 254 160 247C140 244 125 236 118 228C100 214 96 176 108 158C113 152 120 150 128 150Z"
        fill={coat}
      />
      <path d="M106 160C98 176 97 200 104 214C109 223 117 230 126 235L129 231C120 224 113 216 110 206C106 192 106 176 110 162Z" fill={coatShade} />

      {/* tail, swishing from the dock: a white root bound in gold, then hennaed locks */}
      <g className={m("mareTail")}>
        <Pivot x={112} y={156} r={190} />
        <path d="M118 151C106 150 98 158 95 170C92 178 92 184 92 190L104 190C104 180 106 172 110 166C112 162 116 160 120 159Z" fill={coat} />
        <g className={m("mareTailTip")}>
          <Pivot x={98} y={194} r={130} />
          <path d="M90 192C80 222 76 270 84 312C89 296 93 280 96 262C98 282 102 298 109 310C111 276 107 230 106 192Z" fill={marigold} />
          <path d="M96 196C93 230 94 270 99 298C102 270 103 232 102 196Z" fill={sindoor} />
          <path d="M89 210C85 236 84 262 86 286C89 264 90 238 93 212Z" fill={haldi} />
        </g>
        <path d="M90 186L106 186L106 195L90 195Z" fill={gold} />
        <circle cx={98} cy={190.5} r={2.6} fill={rani} />
      </g>

      {/* neck and head, nodding from the base of the neck */}
      <g className={m("mareNod")}>
        <Pivot x={280} y={200} r={240} />
        <path d="M244 166C246 112 278 62 314 48L320 66C312 82 306 98 305 112C304 142 310 168 308 196C307 208 304 218 300 226L262 226Z" fill={coat} />
        <path d="M305 112C304 142 310 168 308 196C302 172 298 142 305 112Z" fill={coatShade} />
        {/* kalangi behind the ears: plumes in a gold cup, swaying from the jewel */}
        <g className={m("marePlume")}>
          <Pivot x={302} y={48} r={78} />
          <Strand a={-40} len={40} fill={sindoor} />
          <Strand a={-22} len={54} fill={rani} />
          <Strand a={-6} len={62} fill={marigold} />
          <Strand a={10} len={46} fill={rani} />
          <path d="M297 49L299 34L305 34L307 49Z" fill={gold} />
          <circle cx={302} cy={48} r={6} fill={gold} />
          <circle cx={302} cy={48} r={2.6} fill={rani} />
        </g>
        {/* Marwari ears, curving in until the tips meet */}
        <path d="M302 54C296 40 302 26 318 20C312 30 310 42 312 54Z" fill={coatShade} />
        <path d="M316 52C316 40 320 30 316 20C328 26 334 40 328 54Z" fill={coat} />
        <path d="M319 49C319 40 322 32 319 25C327 31 330 41 326 50Z" fill={coatFar} />
        {/* head */}
        <path
          d="M312 46C326 44 338 50 344 62L364 110C368 120 366 130 358 133C352 135 346 133 342 128C336 120 328 114 320 110C308 104 300 92 301 78C302 64 306 50 312 46Z"
          fill={coat}
        />
        <circle cx={317} cy={90} r={17} fill={coat} />
        <path d="M301 92C304 106 318 112 332 110L334 115C318 120 302 112 299 98Z" fill={coatShade} />
        <ellipse cx={357} cy={124} rx={9.5} ry={9} transform="rotate(25 357 124)" fill={coatShade} />
        <ellipse cx={358} cy={116} rx={3.4} ry={2} transform="rotate(65 358 116)" fill={ink} />
        <path d="M345 130C350 129 355 130 359 132L358 134.5C354 133 350 132 346 133Z" fill={ink} />
        {/* mane, braided with gold */}
        <path
          d="M240 168C242 112 276 60 312 44L316 54C298 62 284 78 276 94Q274 105 267 101Q266 116 259 113Q258 128 252 126Q252 142 246 141Q247 158 242 166Z"
          fill={ink}
        />
        <path d="M314 50C324 52 330 58 332 65C324 63 317 58 314 50Z" fill={ink} />
        {[
          [250, 136],
          [258, 110],
          [272, 86],
          [292, 64],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={2.8} fill={haldi} />
        ))}
        {/* eye */}
        <ellipse cx={328} cy={71} rx={6} ry={3.6} transform="rotate(30 328 71)" fill={ink} />
        <circle cx={330} cy={69.4} r={1.4} fill={paper} />
        {/* bridle */}
        <g fill="none" stroke={gold} strokeLinecap="round">
          <path d="M306 56C312 80 326 104 346 126" strokeWidth={5} />
          <path d="M308 58L338 56" strokeWidth={5} />
          <path d="M338 114L362 104" strokeWidth={5} />
          <path d="M306 58C298 74 298 92 304 104" strokeWidth={4} />
        </g>
        <path d="M336 60C344 68 350 80 352 94C345 88 339 76 336 60Z" fill={gold} />
        <circle cx={346} cy={80} r={3} fill={rani} />
        <circle cx={346} cy={126} r={5.5} fill={gold} />
        <circle cx={346} cy={126} r={2.2} fill={ink} />
        <circle cx={308} cy={58} r={4.2} fill={rani} />
        <circle cx={339} cy={113} r={4.2} fill={rani} />

        {/* the toran on her neck: a gold band hung with marigolds and mango leaves */}
        <path d="M268 90Q286 112 306 124" fill="none" stroke={gold} strokeWidth={7} strokeLinecap="round" />
        {[
          [273.4, 96.4, "m", -0.3],
          [282.8, 106, "l", -1.4],
          [292.2, 114.4, "m", -2.1],
          [302.1, 121.5, "l", -0.9],
        ].map(([x, y, kind, delay]) => (
          <g key={x} className={m("marePendant")} style={{ animationDelay: `${delay}s` }}>
            <Pivot x={x as number} y={y as number} r={28} />
            {kind === "m" ? (
              <Marigold x={x as number} y={(y as number) + 11} r={8} />
            ) : (
              <MangoLeaf x={x as number} y={(y as number) + 1} />
            )}
          </g>
        ))}
        {[278, 288, 298].map((x, i) => (
          <circle key={x} cx={x} cy={[102.4, 110.6, 118.4][i]} r={2.2} fill={sindoor} />
        ))}

      </g>

      {/* near legs: the hind one stands, the fore one prances */}
      <path d={hindLeg} fill={coat} />
      <path d={hindSock} fill={marigold} />
      <Anklet x={123} y={318} w={16} />
      <path d={hindHoof} fill={ink} />

      <g className={m("mareForeUpper")}>
        <Pivot x={289} y={234} r={175} />
        <path d={foreArm} fill={coat} />
        <ellipse cx={291} cy={291} rx={9.5} ry={10} fill={coat} />
        <g className={m("mareForeLower")}>
          <Pivot x={291} y={291} r={80} />
          <path d={foreCannon} fill={coat} />
          <path d={foreSock} fill={marigold} />
          <Anklet x={283} y={317} w={16} />
          <path d={foreHoof} fill={ink} />
        </g>
      </g>

      {/* caparison: gold ground and scalloped hem, sindoor field, bandhani dots, a marigold medallion */}
      <path
        d={`M266 150C248 140 232 142 216 148C198 154 176 146 152 146C146 180 142 228 140 262${hem}L292 258C300 230 300 200 290 172C284 160 276 152 266 150Z`}
        fill={gold}
      />
      <path d="M262 156C246 148 232 150 216 154C198 160 178 154 160 154C155 184 152 220 150.5 246L283 246C289 224 289 200 281 178C276 166 270 160 262 156Z" fill={sindoor} />
      <path d="M151 238L285 238L284.4 246L150.5 246Z" fill={green} />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={149.5 + i * 19} cy={258} r={2.6} fill={sindoor} />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 159 + i * 19;
        return <path key={i} d={`M${x} 261C${x + 4} 265 ${x + 4} 271 ${x} 276C${x - 4} 271 ${x - 4} 265 ${x} 261Z`} fill={haldi} />;
      })}
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.8} fill={paper} />
      ))}
      <circle cx={216} cy={198} r={25} fill={gold} />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={216} cy={181} rx={6.5} ry={10} fill={rani} transform={`rotate(${i * 45} 216 198)`} />
      ))}
      <circle cx={216} cy={198} r={11} fill={marigold} />
      <circle cx={216} cy={198} r={6.5} fill={haldi} />
      <circle cx={216} cy={198} r={2.6} fill={ink} />

      {/* the empty saddle: the groom is never drawn */}
      <path d="M200 151C202 139 240 135 250 146L248 152C232 148 216 150 202 155Z" fill={rani} />
      <path d="M201 145C214 139 236 138 248 143L249 147C236 142 214 143 201 149Z" fill={gold} />
    </svg>
  );
}
