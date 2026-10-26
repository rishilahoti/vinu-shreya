// The Rambagh lawn peacock, drawn flat like a Jaipur miniature. Server-safe: CSS keyframes only.
import type { CSSProperties, SVGProps } from "react";
import s from "./Peacock.module.css";

const C = {
  blue: "#1F5E8A",
  green: "#2E7D6B",
  leaf: "#3F7A4C",
  mehendi: "#5E7A2E",
  gold: "#B8892E",
  haldi: "#E8B83A",
  sindoor: "#B8322A",
  ink: "#14332F",
  paper: "#F4EEE6",
};
const r1 = (n: number) => Math.round(n * 10) / 10;

type Props = Omit<SVGProps<SVGSVGElement>, "display"> & {
  /** Tail raised and fanned in a half circle behind the bird. */
  display?: boolean;
  /** Mirror, so the bird faces right. */
  flip?: boolean;
  /** No motion: the complete still drawing. */
  still?: boolean;
};

/** Eye-spot (ocellus) centred on 0 0, its outer end pointing up. */
function Eye({ r }: { r: number }) {
  return (
    <>
      <ellipse rx={r1(r * 0.8)} ry={r} fill={C.gold} />
      <ellipse cy={r1(r * 0.12)} rx={r1(r * 0.6)} ry={r1(r * 0.74)} fill={C.green} />
      <ellipse cy={r1(r * 0.2)} rx={r1(r * 0.42)} ry={r1(r * 0.5)} fill={C.blue} />
      <ellipse cy={r1(r * 0.26)} rx={r1(r * 0.2)} ry={r1(r * 0.25)} fill={C.ink} />
    </>
  );
}

// ---- Standing train: shingled feathers along a drooping spine, the tip lying on the grass.
const SPINE = [
  [150, 146],
  [236, 148],
  [298, 209],
  [376, 212],
];
function spineAt(t: number) {
  const [[ax, ay], [bx, by], [cx, cy], [ex, ey]] = SPINE;
  const u = 1 - t;
  const dx = 3 * u * u * (bx - ax) + 6 * u * t * (cx - bx) + 3 * t * t * (ex - cx);
  const dy = 3 * u * u * (by - ay) + 6 * u * t * (cy - by) + 3 * t * t * (ey - cy);
  const len = Math.hypot(dx, dy);
  return {
    x: u ** 3 * ax + 3 * u * u * t * bx + 3 * u * t * t * cx + t ** 3 * ex,
    y: u ** 3 * ay + 3 * u * u * t * by + 3 * u * t * t * cy + t ** 3 * ey,
    tx: dx / len,
    ty: dy / len,
    deg: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}
// widest past the middle, narrowing to a rounded tip
const halfWidth = (t: number) => 13 + 21 * Math.sin(Math.PI * t ** 1.4);

/** Band along the spine between lateral fractions a0 and a1 of the half width (-1 top edge, 1 bottom edge). */
function band(a0: number, a1: number, t1 = 1, steps = 28) {
  const side = (a: number, i: number) => {
    const t = (t1 * i) / steps;
    const p = spineAt(t);
    const w = halfWidth(t) * a;
    return `${r1(p.x - p.ty * w)} ${r1(p.y + p.tx * w)}`;
  };
  const one = Array.from({ length: steps + 1 }, (_, i) => side(a0, i));
  const two = Array.from({ length: steps + 1 }, (_, i) => side(a1, steps - i));
  return `M${one.join("L")}L${two.join("L")}Z`;
}
const TRAIN_BASE = band(-1, 1);
const TRAIN_QUILLS = [-0.74, -0.37, 0, 0.37, 0.74].map((a) => band(a - 0.03, a + 0.03, 0.96));

// Drawn from the tip back to the body, so the shorter feathers lie on top, as on the bird.
const TRAIN_FEATHERS = (() => {
  const rows = 12;
  const out: { x: number; y: number; rot: number; r: number; fill: string }[] = [];
  for (let i = rows - 1; i >= 0; i--) {
    const t = 0.1 + (0.9 * i) / (rows - 1);
    const p = spineAt(t);
    const w = halfWidth(t);
    const across = i === rows - 1 ? [0] : i % 2 ? [-0.64, 0, 0.64] : [-0.34, 0.34];
    for (const a of across) {
      out.push({
        x: r1(p.x - p.ty * w * a),
        y: r1(p.y + p.tx * w * a),
        rot: r1(p.deg + 90),
        r: r1(4.6 + 7 * t),
        fill: i % 2 ? C.green : C.leaf,
      });
    }
  }
  return out;
})();

/** Teardrop feather: round end on 0 0 (radius rf), quill running down to 0 L. */
const feather = (rf: number) => {
  const L = r1(rf * 2.7);
  return `M0 ${L}C${r1(-rf * 0.35)} ${r1(L * 0.55)} ${r1(-rf * 1.05)} ${r1(rf * 0.6)} ${-rf} 0A${rf} ${rf} 0 0 1 ${rf} 0C${r1(rf * 1.05)} ${r1(rf * 0.6)} ${r1(rf * 0.35)} ${r1(L * 0.55)} 0 ${L}Z`;
};

function Train() {
  return (
    <g>
      <path d={TRAIN_BASE} fill={C.leaf} />
      {TRAIN_QUILLS.map((d) => (
        <path key={d} d={d} fill={C.gold} />
      ))}
      {TRAIN_FEATHERS.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
          <path d={feather(r1(f.r * 1.3))} fill={f.fill} />
          <Eye r={f.r} />
        </g>
      ))}
    </g>
  );
}

// ---- Display fan: seven bundles of feathers, each drawn pointing up from the tail base at 0 0.
const R = 156;
const polar = (rad: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [r1(rad * Math.sin(a)), r1(-rad * Math.cos(a))];
};
const sector = (rad: number, half: number) => {
  const [x1, y1] = polar(rad, -half);
  const [x2, y2] = polar(rad, half);
  return `M0 0L${x1} ${y1}A${rad} ${rad} 0 0 1 ${x2} ${y2}Z`;
};
const RINGS = [
  { at: 0.27, r: 6, rays: [0] },
  { at: 0.49, r: 8.5, rays: [-6.5, 6.5] },
  { at: 0.73, r: 10.5, rays: [0] },
  { at: 1, r: 12.5, rays: [-6.5, 6.5] },
];
const BUNDLES = [-78, -52, -26, 0, 26, 52, 78];

function Bundle() {
  return (
    <>
      <path d={sector(R + 2, 14)} fill={C.mehendi} />
      {[-6.5, 6.5].map((a) => {
        const [x, y] = polar(R, a);
        return <circle key={a} cx={x} cy={y} r={20} fill={C.mehendi} />;
      })}
      <path d={sector(R - 8, 14)} fill={C.green} />
      {[-6.5, 6.5].map((a) => {
        const [x, y] = polar(R, a);
        return <circle key={a} cx={x} cy={y} r={16.5} fill={C.green} />;
      })}
      {/* quills */}
      {[
        [-6.5, R - 12],
        [0, R * 0.73 - 10],
        [6.5, R - 12],
      ].map(([a, len]) => (
        <path key={a} transform={`rotate(${a})`} d={`M-1.7 -30L-0.9 ${-r1(len)}H0.9L1.7 -30Z`} fill={C.gold} />
      ))}
      {RINGS.map((ring) =>
        ring.rays.map((a) => (
          <g key={`${ring.at}${a}`} transform={`rotate(${a}) translate(0 ${-r1(R * ring.at)})`}>
            <Eye r={ring.r} />
          </g>
        )),
      )}
    </>
  );
}

// ---- The bird, standing, facing left (shared by both variants).
const WING_BARS = [
  [114, 134.4, 147],
  [125, 133.5, 152.3],
  [136, 134.6, 155.4],
  [147, 137.7, 156.7],
  [158, 142.4, 156.5],
  [168, 148.4, 154.8],
];
const BACK_SCALES = [
  [112, 119],
  [124, 117],
  [136, 119],
  [148, 123],
  [159, 129],
  [118, 125],
  [130, 125],
  [142, 128],
  [168, 137],
];

function Bird({ still }: { still?: boolean }) {
  return (
    <>
      {/* far leg, then near leg */}
      <path d="M124 172H130L128.6 225H124.4Z" fill={C.gold} />
      <path d="M126.4 222.6L111 228.4L111.8 230.6L122.4 227.8L117 232L118.8 233.4L127.6 228.4L136 231.8L137 229.6L130 225.4Z" fill={C.gold} />
      <path d="M105.6 172H112.6L111.2 228H106.8Z" fill={C.gold} />
      <path d="M108 225L91 231.5L92 234L104 231.2L98.5 235.5L100.4 237L110 231.6L119 235.5L120 233.4L112 228Z" fill={C.gold} />

      {/* neck, head and crest bob together from the base of the neck */}
      <g className={still ? undefined : s.neck}>
        {/* invisible frame centred on the neck base (94 130): its fill-box centre is the pivot */}
        <rect x={-36} y={0} width={260} height={260} fill="none" />
        <path d="M53 56C56 68 59 80 60 92C61 106 60 120 64 138L124 138V122C108 116 94 108 84 98C74 86 69 72 69 44Z" fill={C.blue} />
        <g transform="translate(61 38) rotate(10)">
          <g className={still ? undefined : s.crest}>
            {[-16, -5, 5, 16].map((a) => {
              const L = Math.abs(a) > 10 ? 19 : 23;
              return (
                <g key={a} transform={`rotate(${a})`}>
                  <path d={`M-1.4 0L-0.8 ${-L}H0.8L1.4 0Z`} fill={C.blue} />
                  <ellipse cy={-L} rx={3.4} ry={4.6} fill={C.blue} />
                  <ellipse cy={-L + 0.8} rx={1.7} ry={2.6} fill={C.green} />
                </g>
              );
            })}
          </g>
        </g>
        <path d="M48 50C48 41 55 37 62 37C70 37 74 43 73 50C72 57 65 60 58 59C52 58 48 55 48 50Z" fill={C.blue} />
        {/* beak */}
        <path d="M50 46C44 45.6 39.6 47.6 36.4 51C41 51.6 46 52.4 51 52.6Z" fill={C.gold} />
        {/* white face stripes and the eye */}
        <path d="M51 44.6C55 41.6 61 40.6 67 41.8C62.4 43.8 56.4 44.8 51 46.2Z" fill={C.paper} />
        <path d="M52 52C57 54.4 63 53.8 68 50C65 55.6 57.6 57 52 54.4Z" fill={C.paper} />
        <circle cx={57.4} cy={48.6} r={2.5} fill={C.ink} />
      </g>

      {/* body: blue breast, scaled green back, barred wing, rufous primaries */}
      <path d="M62 134C54 156 76 182 112 182C140 184 166 172 178 154C176 134 152 112 118 112C94 112 70 118 62 134Z" fill={C.blue} />
      <path d="M98 122C122 108 160 118 180 152C156 148 124 142 98 122Z" fill={C.green} />
      {BACK_SCALES.map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x - 3.6} ${y}A3.6 3.6 0 0 0 ${x + 3.6} ${y}Z`} fill={C.leaf} />
      ))}
      <path d="M160 158C170 159 178 162 186 168C176 169 168 166 158 163Z" fill={C.sindoor} />
      <path d="M100 138C118 126 150 130 178 154C160 162 124 164 100 138Z" fill={C.gold} />
      {WING_BARS.map(([x, t, b]) => (
        <path key={x} d={`M${x} ${t}Q${x + 2.2} ${(t + b) / 2} ${x - 4} ${b}Q${x - 2.2} ${(t + b) / 2} ${x} ${t}Z`} fill={C.ink} />
      ))}
    </>
  );
}

export default function Peacock({ display = false, flip = false, still, ...props }: Props) {
  const W = 400;
  const H = display ? 292 : 240;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden {...props}>
      <g className={flip ? s.flip : undefined} transform={flip ? `matrix(-1 0 0 1 ${W} 0)` : undefined}>
        {display ? (
          <>
            {BUNDLES.map((deg, i) => (
              <g key={deg} transform={`translate(200 196) rotate(${deg})`}>
                <g
                  className={still ? undefined : s.fan}
                  style={{ "--spread": `${deg / 26}deg`, animationDelay: `${r1(Math.abs(i - 3) * 0.16 - 2)}s` } as CSSProperties}
                >
                  <Bundle />
                </g>
              </g>
            ))}
            <g transform="translate(36 52)">
              <Bird still={still} />
            </g>
          </>
        ) : (
          <>
            <Train />
            <Bird still={still} />
          </>
        )}
      </g>
    </svg>
  );
}
