"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Sparkle } from "@phosphor-icons/react";
import { wedding } from "@/lib/content";
import { gsap, SplitText, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { Diya, Skyline, Toran, archPath } from "@/components/motifs";
import styles from "./Countdown.module.css";

const LEAD = "Until the first ceremony begins";
const DONE = "The celebrations have begun";
const HINT = "Tap the sky to light a phuljhadi";
const CLOSING = "See you in";
const surname = (full: string) => full.split(" ").pop();
const FOOTER = `Made with love by the ${surname(wedding.groom.fullName)} and ${surname(wedding.bride.fullName)} families`;
const UNITS = ["Days", "Hours", "Minutes", "Seconds"];
const TARGET = Date.parse(wedding.startsAt); // a fixed string, so this is the same on server and client
const EASE = [0.16, 1, 0.3, 1] as const;

// Shisha tile: cusped jharokha arch with a stitched inner line and a mirror at the crown (90 x 120 box).
const TILE = archPath(3, 3, 84, 114, 4, 0.62);
const TILE_IN = archPath(10, 12, 70, 99, 4, 0.62);
const GLINT = "M45 20.5L46.2 24.8L50.5 26L46.2 27.2L45 31.5L43.8 27.2L39.5 26L43.8 24.8Z";

// Mobile shows one copy of each wide motif; md two, lg three, so they never balloon on desktop.
const COPIES = ["", "hidden md:block", "hidden lg:block"];

// x/y are resting spots in % (also the static layout under reduced motion), s = width px, d = rise seconds.
const LANTERNS = [
  { x: 10, y: 34, s: 22, d: 30, dl: -6, dx: 18 },
  { x: 24, y: 58, s: 14, d: 38, dl: -21, dx: -12 },
  { x: 38, y: 20, s: 17, d: 34, dl: -12, dx: 10 },
  { x: 57, y: 44, s: 26, d: 27, dl: -17, dx: -18 },
  { x: 71, y: 16, s: 13, d: 42, dl: -30, dx: 8 },
  { x: 84, y: 38, s: 20, d: 32, dl: -3, dx: -10 },
  { x: 90, y: 62, s: 12, d: 44, dl: -26, dx: -6 },
  { x: 47, y: 68, s: 15, d: 36, dl: -9, dx: 12 },
];

const STARS = [
  [8, 14], [19, 31], [33, 9], [46, 24], [61, 12], [74, 29], [88, 8],
  [93, 36], [14, 48], [52, 40], [81, 50], [27, 58], [67, 56], [40, 70],
]
  .map(([x, y], i) => {
    const r = i % 3 ? 1.2 : 2;
    return `radial-gradient(${r}px ${r}px at ${x}% ${y}%, rgba(247,235,211,${i % 2 ? 0.55 : 0.9}), transparent)`;
  })
  .join(",");

// Phuljhadi sparks: mostly marigold and ivory, a little ember orange.
const SPARK_COLORS = ["242,168,59", "242,168,59", "247,235,211", "255,241,201", "229,119,30"];
const MAX_SPARKS = 320;
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; w: number; c: string; crackle: boolean; g: number };

export default function Countdown() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const burst = useRef<(x: number, y: number) => void>(() => {});
  const gid = useId().replace(/[^\w-]/g, "");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const near = q(".cd-near")[0] as HTMLElement;
        // Skylines rise into place over the last stretch of the page; near moves more than far.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: () => `bottom-=${Math.round(near.offsetHeight * 1.6)} bottom`,
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(q(".cd-far"), { yPercent: 18 }, { yPercent: 0, ease: "none" }, 0)
          .fromTo(near, { yPercent: 45 }, { yPercent: 0, ease: "none" }, 0);
        gsap.fromTo(
          q(".cd-lanterns"),
          { y: 0 },
          { y: -90, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
        gsap.from(q(".cd-tile"), {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q(".cd-tiles")[0], start: "top 85%", once: true },
        });
        SplitText.create(title.current, {
          type: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 70,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.035,
              scrollTrigger: { trigger: title.current, start: "top 85%", once: true },
            }),
        });
      });
    },
    { scope: root },
  );

  // Phuljhadi: canvas overlay, rAF runs only while sparks are alive.
  useEffect(() => {
    const section = root.current;
    const cvs = canvas.current;
    const ctx = cvs?.getContext("2d");
    if (!section || !cvs || !ctx) return;
    const reduced = window.matchMedia(REDUCED);
    const sparks: Spark[] = [];
    let raf = 0;
    let last = 0;
    let w = 0;
    let h = 0;

    const emit = (x: number, y: number, n: number, min: number, max: number, life: number, crackle: boolean) => {
      for (let i = 0; i < n && sparks.length < MAX_SPARKS; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = min + Math.random() * (max - min);
        const l = life * (0.6 + Math.random() * 0.6);
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: l,
          max: l,
          w: 0.8 + Math.random() * 1.4,
          c: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
          crackle: crackle && Math.random() < 0.3,
          g: 1,
        });
      }
    };

    const frame = (t: number) => {
      const dt = Math.max(0, Math.min((t - last) / 1000, 0.05));
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life -= dt;
        if (p.life <= 0) {
          sparks[i] = sparks[sparks.length - 1];
          sparks.pop();
          continue;
        }
        const drag = 1 - 2.4 * dt;
        p.vx *= drag;
        p.vy = p.vy * drag + 540 * p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.crackle && p.life < p.max * 0.55) {
          p.crackle = false;
          emit(p.x, p.y, 3, 60, 160, 0.35, false);
        }
        ctx.strokeStyle = `rgba(${p.c},${(p.life / p.max).toFixed(3)})`;
        ctx.lineWidth = p.w;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 0.04 - 0.01, p.y - p.vy * 0.04);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      raf = sparks.length ? requestAnimationFrame(frame) : 0;
    };

    burst.current = (x, y) => {
      if (reduced.matches) return;
      if (section.clientWidth !== w || section.clientHeight !== h) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = section.clientWidth;
        h = section.clientHeight;
        cvs.width = Math.round(w * dpr);
        cvs.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = "round";
        ctx.globalCompositeOperation = "lighter";
      }
      emit(x, y, 42, 140, 520, 0.9, true);
      // Bright core flash at the touch point.
      if (sparks.length < MAX_SPARKS) sparks.push({ x, y, vx: 0, vy: 0, life: 0.22, max: 0.22, w: 18, c: "255,241,201", crackle: false, g: 0 });
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) return;
      const r = section.getBoundingClientRect();
      burst.current(e.clientX - r.left, e.clientY - r.top);
    };
    section.addEventListener("click", onClick);
    return () => {
      section.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="countdown" ref={root} className="relative min-h-[100dvh] overflow-hidden bg-linear-to-b from-night-deep via-night to-plum">
      <svg aria-hidden className="absolute size-0">
        <defs>
          <linearGradient id={`${gid}-paper`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c2502a" />
            <stop offset="1" stopColor="#f7c65c" />
          </linearGradient>
          <radialGradient id={`${gid}-glow`}>
            <stop offset="0" stopColor="#f2a83b" stopOpacity=".45" />
            <stop offset="1" stopColor="#f2a83b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7ebd3" stopOpacity=".16" />
            <stop offset=".45" stopColor="#12153a" stopOpacity=".6" />
            <stop offset="1" stopColor="#0b0d27" stopOpacity=".85" />
          </linearGradient>
        </defs>
      </svg>

      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: STARS }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(224,74,126,0.3),transparent)]" />

      <div aria-hidden className="cd-lanterns absolute inset-0">
        {LANTERNS.map((l) => (
          <div
            key={l.x}
            className={`absolute ${styles.lantern}`}
            style={{ left: `${l.x}%`, top: `${l.y}%`, width: l.s, "--dur": `${l.d}s`, "--delay": `${l.dl}s`, "--dx": `${l.dx}px` } as CSSProperties}
          >
            <svg viewBox="0 0 24 34" className="w-full overflow-visible" style={{ opacity: 0.55 + l.s / 60 }}>
              <circle cx="12" cy="20" r="16" fill={`url(#${gid}-glow)`} />
              <path d="M4 6C4 3 8 2 12 2S20 3 20 6L17 26H7Z" fill={`url(#${gid}-paper)`} />
              <path d="M7 26H17" stroke="#7a2a1a" strokeOpacity=".5" />
              <ellipse cx="12" cy="22.5" rx="2.6" ry="3.4" fill="#fff1c9" />
            </svg>
          </div>
        ))}
      </div>

      <div aria-hidden className="cd-far absolute inset-x-0 bottom-0 flex items-end text-[#2a1544]">
        {COPIES.map((c) => (
          <Skyline key={c} variant="far" windows={false} className={`aspect-[400/220] w-full shrink-0 -scale-x-100 md:w-1/2 lg:w-1/3 ${c}`} />
        ))}
      </div>
      <div aria-hidden className="cd-near absolute inset-x-0 bottom-0 flex items-end text-night-deep">
        {COPIES.map((c) => (
          <Skyline key={c} variant="near" className={`aspect-[400/220] w-full shrink-0 md:w-1/2 lg:w-1/3 ${c}`} />
        ))}
      </div>
      <div aria-hidden className={`absolute inset-x-0 top-0 grid md:grid-cols-2 lg:grid-cols-3 toran-sway`}>
        {COPIES.map((c) => (
          <Toran key={c} className={`h-auto w-full ${c}`} />
        ))}
      </div>

      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-5 pb-[50vw] pt-[32vw] text-center md:pb-[26vw] md:pt-[17vw] lg:pb-[17vw] lg:pt-[11vw]">
        <p className="text-ivory/80">{LEAD}</p>
        <MotionConfig reducedMotion="user">
          <Clock gid={gid} />
        </MotionConfig>

        <h2 ref={title} className="mt-14 font-display text-[clamp(2.75rem,11vw,5.5rem)] leading-[1.05]">
          {CLOSING} <span className="text-marigold">{wedding.city}</span>
        </h2>
        <Diya className="mt-4 w-9" />
        <p className="mt-3 font-display text-2xl">
          {wedding.groom.name} & {wedding.bride.name}
        </p>
        <p className="mt-1 text-ivory/80">{wedding.dateLabel}</p>

        <button
          type="button"
          onClick={(e) => {
            const s = root.current?.getBoundingClientRect();
            if (!s) return;
            const b = e.currentTarget.getBoundingClientRect();
            burst.current(b.left + b.width / 2 - s.left, b.top - s.top - 28);
          }}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/25 px-5 text-sm text-ivory/85 transition-[transform,background-color] duration-150 active:scale-[0.97] motion-reduce:hidden [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ivory/10"
        >
          <Sparkle weight="duotone" aria-hidden className="size-4 text-marigold" />
          {HINT}
        </button>
      </div>

      <p className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-xs text-ivory/75">{FOOTER}</p>
    </section>
  );
}

function Clock({ gid }: { gid: string }) {
  // null until mounted: the prerendered HTML shows "--" and never reads the clock.
  const [secs, setSecs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setSecs(Math.max(0, Math.floor((TARGET - Date.now()) / 1000)));
    tick();
    // 250ms keeps the seconds digit honest; React skips the render when the value hasn't changed.
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  if (secs === 0) return <p className="cd-tiles mt-5 font-display text-[clamp(2rem,8vw,3.5rem)] leading-tight text-marigold">{DONE}</p>;

  const parts = secs === null ? null : [Math.floor(secs / 86400), Math.floor(secs / 3600) % 24, Math.floor(secs / 60) % 60, secs % 60];
  return (
    <div role="timer" aria-label={LEAD} className="cd-tiles mt-5 grid w-full max-w-[26rem] grid-cols-4 gap-2.5 md:max-w-xl md:gap-4">
      {UNITS.map((unit, i) => {
        const value = parts ? String(parts[i]).padStart(2, "0") : "--";
        return (
          <div key={unit} className="cd-tile relative aspect-[3/4]">
            <svg viewBox="0 0 90 120" aria-hidden className="absolute inset-0 size-full">
              <path d={TILE} fill={`url(#${gid}-glass)`} stroke="#f2a83b" strokeOpacity=".6" strokeWidth="1.5" />
              <path d={TILE_IN} fill="none" stroke="#f7ebd3" strokeOpacity=".28" strokeDasharray="1.5 3" />
              <circle cx="45" cy="26" r="6.5" fill="#f7ebd3" fillOpacity=".16" stroke="#f2a83b" strokeOpacity=".7" />
              <circle cx="45" cy="26" r="9.5" fill="none" stroke="#e04a7e" strokeOpacity=".6" strokeDasharray="1 2.2" />
              <path d={GLINT} fill="#fff1c9" className={styles.glint} style={{ animationDelay: `${i * 1.3}s` }} />
            </svg>
            <div className="relative flex h-full flex-col items-center justify-end pb-[12%]">
              <Digits value={value} />
              <span aria-hidden className="mt-1 text-xs text-ivory/80 md:text-sm">
                {unit}
              </span>
              <span className="sr-only">
                {value} {unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Digits({ value }: { value: string }) {
  const chars = value.split("");
  return (
    <span aria-hidden className="flex font-display text-[clamp(1.6rem,8vw,3rem)] leading-none text-ivory">
      {chars.map((c, i) => (
        // Keyed from the right so the units column survives 100 -> 99.
        <span key={chars.length - i} className="relative h-[1.15em] w-[0.64em] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={c}
              className="block text-center leading-[1.15em]"
              initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {c}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
