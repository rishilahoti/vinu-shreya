"use client";

import { useCallback, useImperativeHandle, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type Ref } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { wedding, type Photo } from "@/lib/content";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Mandala, PATTERNS, archPath } from "@/components/motifs";

const HEADING = "Meet the bride and groom";
const HEADING_HI = "वर और वधू";
const ROLE_HI = { groom: "दूल्हा", bride: "दुल्हन" } as const;
const STORY_HEADING = "Our story so far";
const STORY_HI = "हमारी कहानी";
const STORY_HINT = "Swipe through the moments that brought us here.";
const PREV_LABEL = "Previous photo";
const NEXT_LABEL = "Next photo";

// Jharokha geometry. The frame is a 360x540 viewBox; the photo window inside it is 300x400 (3:4) at (30, 70).
const LOBES = 5;
const RISE = 0.7;
const WIN_PATH = archPath(0, 0, 300, 400, LOBES, RISE);
const pct = (v: number, of: number) => `${Math.round((v / of) * 1e5) / 1e3}%`;
const WINDOW_BOX: CSSProperties = { left: pct(30, 360), top: pct(70, 540), width: pct(300, 360), height: pct(400, 540) };

// Arch-shaped masks (scale with the element). Door masks are the left / right halves of the same arch.
function archMask(viewBox: string): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' preserveAspectRatio='none'><path d='${WIN_PATH}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return { maskImage: url, WebkitMaskImage: url, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" };
}
const MASK_WINDOW = archMask("0 0 300 400");
const MASK_DOOR_L = archMask("0 0 150 400");
const MASK_DOOR_R = archMask("150 0 150 400");

const r2 = (n: number) => Math.round(n * 100) / 100;
// Jali sunburst carved across both shutters, fanning up from the meeting point of the doors.
const DOOR_RAYS = Array.from({ length: 11 }, (_, i) => {
  const a = Math.PI + (Math.PI * (i + 1)) / 12;
  return `M${r2(150 + 34 * Math.cos(a))} ${r2(196 + 34 * Math.sin(a))}L${r2(150 + 120 * Math.cos(a))} ${r2(196 + 120 * Math.sin(a))}`;
}).join("");

/** Both wooden shutters drawn as one 300x400 panel; each door shows its own half. */
function DoorArt({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden className={className}>
      <rect width={300} height={400} className="fill-plum" />
      <rect width={300} height={400} className="fill-rani" opacity={0.2} />
      <g fill="none" strokeWidth={1.3} strokeLinecap="round" className="stroke-marigold" opacity={0.9}>
        <path d={archPath(12, 14, 276, 374, LOBES, RISE)} />
        <path d={DOOR_RAYS} opacity={0.6} />
        <path d="M116 196A34 34 0 0 1 184 196" />
        <path d="M144 18V388M156 18V388" />
        <circle cx={80} cy={246} r={24} />
        <circle cx={220} cy={246} r={24} />
        <circle cx={80} cy={246} r={13} strokeDasharray="2 4" />
        <circle cx={220} cy={246} r={13} strokeDasharray="2 4" />
        <rect x={26} y={292} width={106} height={84} rx={3} />
        <rect x={168} y={292} width={106} height={84} rx={3} />
        <path d="M79 302L118 334L79 366L40 334ZM221 302L260 334L221 366L182 334Z" />
        <circle cx={136} cy={262} r={6} strokeWidth={1.8} />
        <circle cx={164} cy={262} r={6} strokeWidth={1.8} />
      </g>
      <rect x={148} width={4} height={400} className="fill-night-deep" opacity={0.85} />
      <g className="fill-marigold" opacity={0.75}>
        <circle cx={80} cy={246} r={3.5} />
        <circle cx={220} cy={246} r={3.5} />
        {Array.from({ length: 17 }, (_, i) => (
          <circle key={i} cx={22 + i * 16} cy={386} r={1.8} />
        ))}
      </g>
    </svg>
  );
}

const GLINTS: [number, number, number][] = [
  [40, 112, 2.4], [320, 112, 2.4], [180, 15, 1.8], [7, 266, 1.6], [353, 266, 1.6],
  [180, 497, 2], [70, 530, 1.8], [180, 530, 1.8], [290, 530, 1.8],
];

/** Carved marigold line-art around the window: cusped arch, bangaldar canopy, kalash, pillars, ledge and brackets. */
function JharokhaFrame({ glint }: { glint: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 360 540"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-marigold"
    >
      <path className="frame-line" d={archPath(30, 70, 300, 400, LOBES, RISE)} />
      <path className="frame-line" d={archPath(16, 50, 328, 432, LOBES, RISE)} />
      <path className="frame-dots" d={archPath(23, 60, 314, 416, LOBES, RISE)} strokeWidth={2.4} strokeDasharray="0 8" opacity={0.7} />
      <path className="frame-line" d="M4 54Q180 -8 356 54" />
      <path className="frame-line" d="M16 60Q180 6 344 60" />
      <path className="frame-line" d="M180 11V3" />
      <circle className="frame-line" cx={180} cy={15} r={4} />
      <path className="frame-line" d="M7 62V488M353 62V488" />
      <path className="frame-line" d="M7 258L11 266L7 274L3 266ZM353 258L357 266L353 274L349 266Z" />
      <circle className="frame-line" cx={40} cy={112} r={9} />
      <circle className="frame-line" cx={320} cy={112} r={9} />
      <path className="frame-line" d="M2 492H358M12 502H348" />
      {[70, 180, 290].map((x) => (
        <path key={x} className="frame-line" d={`M${x - 12} 502C${x - 12} 520 ${x - 4} 528 ${x} 534C${x + 4} 528 ${x + 12} 520 ${x + 12} 502`} />
      ))}
      {/* Shisha mirror-work: brightens as the card tilts. */}
      <motion.g stroke="none" className="fill-ivory" style={{ opacity: glint }}>
        {GLINTS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </motion.g>
    </svg>
  );
}

type Person = typeof wedding.groom;
const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

function Portrait({ person, role, className = "" }: { person: Person; role: keyof typeof ROLE_HI; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const shineX = useTransform(sx, [-0.5, 0.5], ["-22%", "22%"]);
  const shine = useTransform(() => Math.min(1, (Math.abs(sx.get()) + Math.abs(sy.get())) * 2.4));
  const glint = useTransform(() => 0.3 + 0.7 * shine.get());
  const pressed = useRef(false);

  const track = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const release = () => {
    pressed.current = false;
    px.set(0);
    py.set(0);
  };

  return (
    <article data-portrait className={`w-full max-w-[19rem] lg:max-w-[22rem] ${className}`}>
      {/* Mouse tilts on hover; touch tilts while pressed and springs back on release. Vertical scroll stays native. */}
      <div
        className="relative touch-pan-y select-none [-webkit-touch-callout:none]"
        onPointerDown={(e) => {
          if (reduce || e.pointerType === "mouse") return;
          pressed.current = true;
          track(e);
        }}
        onPointerMove={(e) => {
          if (!reduce && (e.pointerType === "mouse" || pressed.current)) track(e);
        }}
        onPointerUp={(e) => e.pointerType !== "mouse" && release()}
        onPointerCancel={release}
        onPointerLeave={release}
      >
        <div aria-hidden className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(224,74,126,0.22),transparent)]" />
        <motion.div data-card className="relative aspect-[2/3]" style={{ rotateX, rotateY, transformPerspective: 900 }}>
          <div className="absolute" style={WINDOW_BOX}>
            <div className="absolute inset-0 overflow-hidden bg-night-deep" style={MASK_WINDOW}>
              <div data-photo className="absolute inset-0">
                <Image
                  src={person.photo.src}
                  alt={person.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 340px, 300px"
                  draggable={false}
                  className="object-cover"
                />
              </div>
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night-deep/55 via-transparent to-transparent" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -inset-x-1/2"
                style={{
                  x: shineX,
                  opacity: shine,
                  backgroundImage: "linear-gradient(105deg, transparent 38%, rgba(247,235,211,0.34) 48%, rgba(242,168,59,0.2) 53%, transparent 62%)",
                }}
              />
            </div>
          </div>
          <JharokhaFrame glint={glint} />
          {/* Shutters: hidden by default, shown and swung open by GSAP only when motion is allowed. */}
          <div aria-hidden className="absolute perspective-[520px]" style={WINDOW_BOX}>
            <div data-door="l" className="invisible absolute inset-y-0 left-0 w-1/2 origin-left overflow-hidden backface-hidden" style={MASK_DOOR_L}>
              <DoorArt className="absolute inset-y-0 left-0 h-full w-[200%]" />
            </div>
            <div data-door="r" className="invisible absolute inset-y-0 right-0 w-1/2 origin-right overflow-hidden backface-hidden" style={MASK_DOOR_R}>
              <DoorArt className="absolute inset-y-0 right-0 h-full w-[200%]" />
            </div>
          </div>
        </motion.div>
      </div>
      <div data-caption className="mt-8 text-center">
        <p lang="hi" className="font-display text-xl text-marigold">
          {ROLE_HI[role]}
        </p>
        <h3 className="mt-1 font-display text-5xl leading-none text-ivory md:text-6xl">{person.name}</h3>
        <p className="mt-2 text-lg text-ivory/75">{person.fullName}</p>
        <p className="mx-auto mt-4 max-w-[19rem] text-base leading-relaxed text-ivory/85 md:text-[1.0625rem]">{person.bio}</p>
      </div>
    </article>
  );
}

type FlingHandle = { fling: (dir: number) => void };

// Resting pose for each depth in the stack. Deeper cards are hidden.
const POSES = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 10, y: 14, rotate: 5, scale: 0.95 },
  { x: -12, y: 26, rotate: -6, scale: 0.9 },
  { x: 4, y: 36, rotate: 3, scale: 0.86 },
];
const FLICK_DISTANCE = 90;
const FLICK_VELOCITY = 450;

function DeckCard({ photo, depth, n, onSent, ref }: { photo: Photo; depth: number; n: number; onSent: () => void; ref?: Ref<FlingHandle> }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const tilt = useTransform(x, [-220, 220], [-14, 14]);
  const busy = useRef(false);
  const isTop = depth === 0;
  const pose = POSES[Math.min(depth, POSES.length - 1)];

  // Throw the card off to one side, move it to the back of the stack, then let it slide home underneath.
  const fling = useCallback(
    async (dir: number) => {
      if (busy.current) return;
      busy.current = true;
      if (!reduce) await animate(x, dir * 440, { duration: 0.3, ease: [0.32, 0.72, 0, 1] });
      onSent();
      await animate(x, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 30 });
      busy.current = false;
    },
    [onSent, reduce, x],
  );
  useImperativeHandle(ref, () => ({ fling }), [fling]);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const fast = Math.abs(velocity.x) > FLICK_VELOCITY;
    if (fast || Math.abs(offset.x) > FLICK_DISTANCE) fling(Math.sign(fast ? velocity.x : offset.x));
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 34 });
  };

  return (
    <motion.div
      aria-hidden={!isTop}
      className="absolute inset-0"
      style={{ zIndex: n - depth }}
      initial={false}
      animate={{ ...pose, opacity: depth < POSES.length ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <motion.div
        className={`relative h-full w-full overflow-hidden rounded-t-full rounded-b-2xl border border-marigold/40 bg-night-deep shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)] ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ x, rotate: tilt }}
        drag={isTop ? "x" : false}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 304px, 264px" draggable={false} className="pointer-events-none object-cover" />
        <div aria-hidden className="absolute inset-2 rounded-t-full rounded-b-xl border border-ivory/25" />
      </motion.div>
    </motion.div>
  );
}

const pillBtn =
  "grid size-12 place-items-center rounded-full border border-marigold/40 text-ivory transition-transform duration-150 active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-marigold [@media(hover:hover)_and_(pointer:fine)]:hover:text-marigold";

function StoryDeck({ moments }: { moments: Photo[] }) {
  const [top, setTop] = useState(0);
  const n = moments.length;
  const topCard = useRef<FlingHandle>(null);
  const next = useCallback(() => setTop((t) => (t + 1) % n), [n]);
  const prev = () => setTop((t) => (t - 1 + n) % n);
  const sendTop = () => topCard.current?.fling(-1);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") sendTop();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="pb-10">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={STORY_HEADING}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="relative mx-auto aspect-[3/4] w-full max-w-[16.5rem] rounded-t-full rounded-b-2xl md:max-w-[19rem]"
        >
          {moments.map((m, i) => {
            const depth = (i - top + n) % n;
            return <DeckCard key={i} ref={depth === 0 ? topCard : null} photo={m} depth={depth} n={n} onSent={next} />;
          })}
        </div>
      </div>
      <p aria-live="polite" className="mx-auto min-h-[3.5rem] max-w-[19rem] text-center text-lg leading-snug text-ivory/85">
        {moments[top]?.alt}
      </p>
      <div className="mt-4 flex items-center justify-center gap-5">
        <button type="button" aria-label={PREV_LABEL} onClick={prev} className={pillBtn}>
          <ArrowLeftIcon size={22} weight="light" />
        </button>
        <div aria-hidden className="flex gap-2">
          {moments.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full bg-marigold transition-[transform,opacity] duration-300 ${i === top ? "scale-150 opacity-100" : "opacity-35"}`}
            />
          ))}
        </div>
        <button type="button" aria-label={NEXT_LABEL} onClick={sendTop} className={pillBtn}>
          <ArrowRightIcon size={22} weight="light" />
        </button>
      </div>
    </MotionConfig>
  );
}

export default function Meet() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);

        const heading = q("[data-meet-heading]")[0];
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: heading, start: "top 85%" } }),
        });
        gsap.from(q("[data-meet-sub]"), { y: 16, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 85%" } });

        // Slow mandala drift behind the portraits.
        gsap.to(q("[data-meet-mandala]"), {
          rotation: 60,
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });

        q("[data-portrait]").forEach((el) => {
          const p = gsap.utils.selector(el);
          const card = p("[data-card]")[0];
          gsap.set(p("[data-door]"), { autoAlpha: 1 });
          // Frame carves itself in, then the shutters swing out toward the viewer. Scrubbed, no pin.
          gsap
            .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: card, start: "top 85%", end: "center 45%", scrub: 0.6 } })
            .from(p(".frame-line"), { drawSVG: 0, duration: 0.6, stagger: 0.02 }, 0)
            .from(p(".frame-dots"), { autoAlpha: 0, duration: 0.3 }, 0.3)
            .to(p('[data-door="l"]'), { rotateY: -105, duration: 1 }, 0.25)
            .to(p('[data-door="r"]'), { rotateY: 105, duration: 1 }, 0.25);
          // Inner parallax: the photo drifts inside its window.
          gsap.fromTo(
            p("[data-photo]"),
            { yPercent: -6, scale: 1.15 },
            { yPercent: 6, scale: 1.15, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
          );
          gsap.from(p("[data-caption] > *"), {
            y: 28,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: p("[data-caption]")[0], start: "top 90%" },
          });
        });

        gsap.from(q("[data-story-reveal]"), {
          y: 48,
          opacity: 0, // opacity, not autoAlpha: keeps the deck focusable before it reveals
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-story]")[0], start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="meet"
      ref={root}
      className="relative min-h-[100dvh] overflow-x-clip bg-linear-to-b from-night via-plum/40 to-night-deep px-5 py-24 md:px-10 md:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
          style={{ backgroundImage: PATTERNS.bandhani }}
        />
        <div className="absolute inset-x-0 top-56 flex justify-center md:top-40">
          <Mandala data-meet-mandala className="w-[44rem] max-w-none shrink-0 text-marigold opacity-[0.07] md:w-[64rem]" />
        </div>
      </div>

      <header className="relative mx-auto max-w-3xl text-center">
        <p lang="hi" data-meet-sub className="font-display text-2xl text-marigold">
          {HEADING_HI}
        </p>
        <h2 data-meet-heading className="mt-2 font-display text-[2.75rem] leading-[1.15] text-ivory md:text-7xl">
          {HEADING}
        </h2>
      </header>

      <div className="relative mx-auto mt-16 grid max-w-5xl justify-items-center gap-10 md:mt-24 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8">
        <Portrait person={wedding.groom} role="groom" />
        <div aria-hidden className="font-display text-6xl leading-none text-marigold/80 md:self-center">
          &amp;
        </div>
        <Portrait person={wedding.bride} role="bride" className="md:mt-36" />
      </div>

      <div data-story className="relative mx-auto mt-32 grid max-w-5xl items-center gap-12 md:mt-44 md:grid-cols-[1fr_auto] md:gap-20">
        <div data-story-reveal className="text-center md:text-left">
          <p lang="hi" className="font-display text-xl text-marigold">
            {STORY_HI}
          </p>
          <h3 className="mt-1 font-display text-4xl leading-tight text-ivory md:text-5xl">{STORY_HEADING}</h3>
          <p className="mx-auto mt-3 max-w-xs text-ivory/75 md:mx-0">{STORY_HINT}</p>
        </div>
        <div data-story-reveal>
          <StoryDeck moments={wedding.moments} />
        </div>
      </div>
    </section>
  );
}
