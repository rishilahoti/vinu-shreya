// A small flock of rose-ringed parakeets crossing the sky. Server-safe: CSS keyframes only.
import type { SVGProps } from "react";
import s from "./Birds.module.css";

const C = {
  green: "#2E7D6B",
  leaf: "#3F7A4C",
  mehendi: "#5E7A2E",
  blue: "#1F5E8A",
  ink: "#14332F",
  sindoor: "#B8322A",
  paper: "#F4EEE6",
};
const r1 = (n: number) => Math.round(n * 100) / 100;

type Props = SVGProps<SVGSVGElement> & {
  /** Birds in the flock (3–7). */
  count?: number;
  /** Peacock-green parakeets, or ink silhouettes. */
  tone?: "green" | "ink";
  /** No motion: the complete still drawing. */
  still?: boolean;
};

// x, y offset from the flock centre, scale (smaller reads as further away)
const FLOCK = [
  [0, 0, 1],
  [-34, 14, 0.86],
  [32, -14, 0.92],
  [-66, 30, 0.74],
  [62, 6, 0.8],
  [-18, -26, 0.7],
  [90, -22, 0.66],
];

export default function Birds({ count = 5, tone = "green", still, ...props }: Props) {
  const n = Math.max(3, Math.min(7, Math.round(count)));
  const green = tone === "green";
  const body = green ? C.green : C.ink;
  const a = (cls: string) => (still ? undefined : cls);
  return (
    <svg viewBox="0 0 320 140" aria-hidden {...props}>
      <g className={a(s.drift)}>
        <g className={a(s.rise)}>
          {FLOCK.slice(0, n).map(([x, y, k], i) => {
            const flap = 2.4 + (i % 3) * 0.3;
            const lag = -((i * 0.37) % 1) * flap;
            return (
              <g key={i} transform={`translate(${150 + x} ${70 + y}) scale(${k})`}>
                <g className={a(s.bob)} style={{ animationDelay: `${-i * 0.7}s`, animationDuration: `${2.8 + (i % 2) * 0.6}s` }}>
                  {/* far wing, a beat behind the near one */}
                  <g className={a(s.wing)} style={{ animationDuration: `${flap}s`, animationDelay: `${r1(lag + 0.08)}s` }}>
                    <path d="M12 -6C12.6 -12 10.4 -17.6 4.4 -22C4.6 -15 4 -10.4 2 -6Z" fill={green ? C.mehendi : C.ink} />
                  </g>
                  {/* long graduated tail, blue-green on the parakeet */}
                  <path d="M-5 -2.4L-31 4L-30.2 5.6L-5 2.6Z" fill={green ? C.blue : C.ink} />
                  {/* plump body, round head */}
                  <path d="M17.4 -4.4C17.4 -8.8 14 -10.4 11 -10C6.4 -9.2 2 -6 -6 -3L-8 -1.6V2.6C0 3.8 8.4 2.8 13 0.8C16 -0.4 17.4 -2.2 17.4 -4.4Z" fill={body} />
                  {green && (
                    <>
                      {/* the rose ring and the eye */}
                      <path d="M10.6 -9.8C8.8 -6.6 8.6 -2.6 10.4 0.9L9 1.2C7 -2.4 7.2 -6.6 9.2 -10Z" fill={C.ink} />
                      <circle cx={13.8} cy={-5.6} r={1} fill={C.paper} />
                    </>
                  )}
                  {/* hooked red beak */}
                  <path d="M16.6 -6.4C20 -6.4 21.4 -4 20.2 -1.2C19.2 -2.6 18 -3.2 16.6 -3Z" fill={C.sindoor} />
                  <g className={a(s.wing)} style={{ animationDuration: `${flap}s`, animationDelay: `${r1(lag)}s` }}>
                    <path d="M8 -5C6 -12 0 -18 -12 -23C-8 -15 -5 -9 -5 -4Z" fill={green ? C.leaf : C.ink} />
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
