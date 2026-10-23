"use client";

import { useRef, type SVGProps } from "react";
import {
  FireIcon,
  FlowerLotusIcon,
  HandHeartIcon,
  HorseIcon,
  MapPinIcon,
  MusicNotesIcon,
  SunIcon,
  type Icon,
} from "@phosphor-icons/react";
import { wedding, type EventIcon, type WeddingEvent } from "@/lib/content";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { Diya, Mandala, PATTERNS, archPath } from "@/components/motifs";

const HEADING = "Two days, one sacred thread";
const HEADING_HI = "दो दिन, एक पवित्र धागा";
const INTRO = "Every ceremony is a knot on the same red and gold thread. Follow the diya down, it knows the way.";
const CLOSING_HI = "सात फेरे, सात वचन";
const CLOSING = "Seven rounds, seven promises.";
const DAY_COPY = {
  1: { title: "Day one", hindi: "पहला दिन" },
  2: { title: "Day two", hindi: "दूसरा दिन" },
} as const;

const ICONS: Record<EventIcon, Icon> = {
  sun: SunIcon,
  hand: HandHeartIcon,
  music: MusicNotesIcon,
  horse: HorseIcon,
  flower: FlowerLotusIcon,
  fire: FireIcon,
};

const CARD_NICHE = archPath(2, 2, 52, 70, 4);
const END_NICHE = archPath(4, 4, 88, 122, 5);
const PETAL = "M0 -5.5C3.4 -8.5 3.6 -13.5 0 -18C-3.6 -13.5 -3.4 -8.5 0 -5.5Z";
// The clip rises from the sill; its huge top radii clamp into the same arch as the card itself.
const CLIP_HIDE = "inset(100% 0% 0% 0% round 9999px 9999px 16px 16px)";
const CLIP_SHOW = "inset(0% 0% 0% 0% round 9999px 9999px 16px 16px)";
// Mobile: thread in a left gutter. md+: thread down the centre, cards alternate.
const COLS = "relative grid grid-cols-[3rem_1fr] gap-x-3 md:grid-cols-[1fr_7rem_1fr]";

const DAYS = ([1, 2] as const).map((day) => ({
  day,
  events: wedding.events.map((e, i) => ({ ...e, right: i % 2 === 0 })).filter((e) => e.day === day),
}));

type Pt = { x: number; y: number };
const r1 = (n: number) => Math.round(n * 10) / 10;
const mix = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

function cubicLength(p0: Pt, p1: Pt, p2: Pt, p3: Pt) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const u = 1 - t;
    const pt = {
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    };
    len += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    prev = pt;
  }
  return len;
}

/**
 * Two mirrored strands (a mauli braid) through every point, crossing at each point and once between.
 * Each gap is cut into S-curves about `pitch` px tall. `marks[i]` = share of strand length at point i.
 */
function braid(pts: Pt[], amp: number, pitch: number) {
  let a = `M${r1(pts[0].x)} ${r1(pts[0].y)}`;
  let b = a;
  let len = 0;
  const at = [0];
  for (let i = 1; i < pts.length; i++) {
    const k = Math.max(1, Math.round((pts[i].y - pts[i - 1].y) / pitch));
    for (let j = 0; j < k; j++) {
      const s = mix(pts[i - 1], pts[i], j / k);
      const e = mix(pts[i - 1], pts[i], (j + 1) / k);
      const h = (e.y - s.y) / 3;
      const c1 = { x: s.x + amp, y: s.y + h };
      const c2 = { x: e.x - amp, y: e.y - h };
      const end = `${r1(e.x)} ${r1(e.y)}`;
      a += ` C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${end}`;
      b += ` C${r1(s.x - amp)} ${r1(c1.y)} ${r1(e.x + amp)} ${r1(c2.y)} ${end}`;
      len += cubicLength(s, c1, c2, e);
    }
    at.push(len);
  }
  return { a, b, marks: at.map((l) => (len ? l / len : 0)) };
}

function Rosette({ petals, ...props }: SVGProps<SVGSVGElement> & { petals: number }) {
  return (
    <svg viewBox="-20 -20 40 40" aria-hidden {...props}>
      {petals > 8 && (
        <circle r={19} fill="none" className="stroke-marigold" strokeWidth={1} strokeDasharray="0.1 3.2" strokeLinecap="round" />
      )}
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d={PETAL} className={i % 2 ? "fill-rani" : "fill-marigold"} transform={`rotate(${(360 / petals) * i})`} />
      ))}
      <circle r={5.5} className="fill-night-deep stroke-marigold" strokeWidth={1.2} />
      <circle r={2} className="fill-ivory" />
    </svg>
  );
}

/** A bead on the thread. Unlit it is a small ring; lit, a marigold rosette blooms over it. */
function Knot({ big = false, className = "" }: { big?: boolean; className?: string }) {
  return (
    <span
      data-anchor="knot"
      aria-hidden
      className={`relative z-10 grid place-items-center justify-self-center ${big ? "size-11" : "size-7"} ${className}`}
    >
      <span data-flare className="absolute inset-0 rounded-full border-2 border-marigold opacity-0" />
      <span className="absolute inset-[24%] rounded-full border border-ivory/40 bg-night-deep" />
      <Rosette data-lit petals={big ? 12 : 8} className="relative size-full" />
    </span>
  );
}

function DayMarker({ day, date }: { day: 1 | 2; date: string }) {
  const copy = DAY_COPY[day];
  return (
    <div className={`${COLS} items-center`}>
      <Knot big className="md:col-start-2 md:row-start-1" />
      <h3
        data-day-title
        className="col-start-2 font-display text-6xl leading-[1.1] text-ivory md:col-start-1 md:row-start-1 md:text-right md:text-8xl"
      >
        {copy.title}
      </h3>
      <p data-day-sub className="col-start-2 flex flex-wrap items-baseline gap-x-3 md:col-start-3 md:row-start-1 md:flex-col md:gap-y-1">
        <span lang="hi" className="font-display text-2xl text-rani md:text-3xl">
          {copy.hindi}
        </span>
        <span className="text-[15px] font-semibold text-marigold md:text-base">{date}</span>
      </p>
    </div>
  );
}

function EventRow({ event, right, first }: { event: WeddingEvent; right: boolean; first: boolean }) {
  const Glyph = ICONS[event.icon];
  return (
    // Rows overlap on md (negative margin), so the row ignores taps and only the card takes them.
    <div className={`${COLS} pointer-events-none ${first ? "mt-12 md:mt-14" : "mt-14 md:-mt-36"}`}>
      <Knot className="mt-14 self-start md:col-start-2 md:row-start-1" />
      <div
        data-par
        className={`pointer-events-auto col-start-2 w-full max-w-[22rem] md:row-start-1 ${
          right ? "md:col-start-3 md:justify-self-start" : "md:col-start-1 md:justify-self-end"
        }`}
      >
        <article
          data-card
          className="rounded-t-full rounded-b-2xl border border-marigold/25 bg-night-deep bg-linear-to-b from-plum/70 to-night-deep px-6 pb-8 pt-8 text-center"
        >
          <div>
            <span className="relative mx-auto grid h-[74px] w-14 place-items-center">
              <svg viewBox="0 0 56 74" className="absolute inset-0 size-full text-marigold/55" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
                <path d={CARD_NICHE} />
              </svg>
              <Glyph weight="duotone" aria-hidden className="relative mt-5 size-7 text-marigold" />
            </span>
            <h4 className="mt-4 text-balance font-display text-[1.75rem] leading-[1.1] text-ivory md:text-3xl">{event.name}</h4>
            <p lang="hi" className="mt-1 font-display text-xl text-marigold/90">
              {event.hindi}
            </p>
            <p className="mt-4 flex items-center justify-center gap-2 text-[15px] font-semibold text-marigold">
              <span>{event.date}</span>
              <span aria-hidden className="size-1 rounded-full bg-rani" />
              <span>{event.time}</span>
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-ivory/90">
              <MapPinIcon weight="duotone" aria-hidden className="size-4 shrink-0 text-rani" />
              {event.place}
            </p>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ivory/75">{event.note}</p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const trackEl = track.current;
      if (!rootEl || !trackEl) return;
      const anchors = gsap.utils.toArray<HTMLElement>("[data-anchor]", trackEl);
      const [halo, strandB, strandA] = gsap.utils.toArray<SVGPathElement>("[data-strand]", trackEl);
      const guide = trackEl.querySelector<SVGPathElement>("[data-guide]");
      const lamp = trackEl.querySelector<HTMLElement>("[data-lamp]");
      if (!guide || !lamp || !strandA) return;

      // The thread is rebuilt from where the beads actually sit, so fonts or a new width can't misalign it.
      let marks: number[] = [];
      const layout = () => {
        const box = trackEl.getBoundingClientRect();
        const pts = anchors.map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
        });
        const wide = window.matchMedia("(min-width: 48rem)").matches;
        const { a, b, marks: m } = braid(pts, wide ? 150 : 44, wide ? 220 : 150);
        halo.setAttribute("d", a);
        strandA.setAttribute("d", a);
        strandB.setAttribute("d", b);
        guide.setAttribute("d", `M${pts.map((p) => `${r1(p.x)} ${r1(p.y)}`).join(" L")}`);
        marks = m;
      };

      const mm = gsap.matchMedia();

      // Reduced motion: thread fully drawn, every bead lit, cards open, diya resting in its niche (its DOM home).
      mm.add(REDUCED, () => {
        const ro = new ResizeObserver(layout);
        ro.observe(trackEl);
        return () => ro.disconnect();
      });

      mm.add(MOTION_OK, () => {
        layout();
        gsap.set(lamp, { willChange: "transform" });

        const heading = rootEl.querySelector("[data-heading]");
        const intro = rootEl.querySelectorAll("[data-intro]");
        if (heading) {
          SplitText.create(heading, {
            type: "lines,words",
            mask: "lines",
            linesClass: "tl-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap
                .timeline({ scrollTrigger: { trigger: heading, start: "top 85%" } })
                .from(self.words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06 })
                .from(intro, { y: 18, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 0.35),
          });
        }

        const mandala = rootEl.querySelector("[data-mandala]");
        if (mandala) {
          gsap.set(mandala, { willChange: "transform" });
          gsap.fromTo(
            mandala,
            { rotate: -15, yPercent: -6 },
            { rotate: 45, yPercent: 14, ease: "none", scrollTrigger: { trigger: rootEl, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }

        type Bead = {
          at: number;
          light: gsap.core.Animation;
          flare?: gsap.core.Animation;
          reveal?: gsap.core.Animation;
          lit: boolean;
          shown: boolean;
        };
        const beads: Bead[] = [];

        anchors.forEach((el, at) => {
          const kind = el.dataset.anchor;
          if (kind === "end") {
            const glow = trackEl.querySelector("[data-niche-lit]");
            beads.push({
              at,
              lit: false,
              shown: true,
              light: gsap.fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "power2.inOut", paused: true, immediateRender: true }),
            });
            return;
          }
          if (kind !== "knot") return;

          const bead: Bead = {
            at,
            lit: false,
            shown: false,
            light: gsap.fromTo(
              el.querySelector("[data-lit]"),
              { autoAlpha: 0, scale: 0.3, rotate: -90 },
              { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.8, ease: "expo.out", paused: true, immediateRender: true },
            ),
            flare: gsap.fromTo(
              el.querySelector("[data-flare]"),
              { scale: 0.6, autoAlpha: 0.9 },
              { scale: 2.8, autoAlpha: 0, duration: 1.1, ease: "power3.out", paused: true, immediateRender: false },
            ),
          };
          beads.push(bead);

          const row = el.parentElement;
          const card = row?.querySelector("[data-card]");
          const title = row?.querySelector("[data-day-title]");
          if (card) {
            bead.reveal = gsap
              .timeline({ paused: true })
              .fromTo(card, { clipPath: CLIP_HIDE }, { clipPath: CLIP_SHOW, duration: 1.3, ease: "expo.out", immediateRender: true })
              .from(card.firstElementChild, { y: 40, duration: 1.3, ease: "expo.out" }, 0);
          } else if (title) {
            SplitText.create(title, {
              type: "chars",
              autoSplit: true,
              onSplit: (self) => {
                const anim = gsap
                  .timeline({ paused: !bead.shown })
                  .from(self.chars, { yPercent: 70, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.035 })
                  .from(row?.querySelector("[data-day-sub]") ?? [], { y: 12, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 0.2);
                bead.reveal = anim;
                return anim;
              },
            });
          }
        });

        // One scrubbed timeline: the braid draws and the diya rides strand A on the same progress,
        // and beads light when that progress passes their share of the strand length.
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "none", duration: 1 } })
          .fromTo([halo, strandB, strandA], { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" }, 0)
          .to(lamp, { motionPath: { path: strandA, align: strandA, alignOrigin: [0.5, 0.5] }, immediateRender: true }, 0);

        const sync = () => {
          const p = tl.progress();
          for (const bead of beads) {
            const on = p >= (marks[bead.at] ?? 1) - 0.003;
            if (on === bead.lit) continue;
            bead.lit = on;
            if (!on) {
              bead.light.reverse();
              continue;
            }
            bead.light.play();
            bead.flare?.restart();
            if (!bead.shown) {
              bead.shown = true;
              bead.reveal?.play();
            }
          }
        };
        tl.eventCallback("onUpdate", sync);

        ScrollTrigger.create({
          trigger: trackEl,
          animation: tl,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: sync,
        });

        // Cards drift a little against the thread.
        gsap.utils.toArray<HTMLElement>("[data-par]", trackEl).forEach((el) => {
          gsap.fromTo(el, { y: 28 }, { y: -28, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // Runs before every refresh; invalidateOnRefresh then re-reads the new path for the draw and the diya.
        ScrollTrigger.addEventListener("refreshInit", layout);
        return () => ScrollTrigger.removeEventListener("refreshInit", layout);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="timeline"
      aria-labelledby="timeline-title"
      className="relative isolate min-h-[100dvh] overflow-x-clip bg-night py-24 md:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-b from-night via-plum/40 to-night-deep" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        style={{ backgroundImage: PATTERNS.leheriya }}
      />
      <Mandala
        data-mandala
        className="pointer-events-none absolute left-1/2 top-0 w-[40rem] -translate-x-1/2 -translate-y-1/4 text-marigold/10 md:w-[56rem]"
      />

      <header className="relative mx-auto max-w-2xl px-5 text-center">
        <h2
          id="timeline-title"
          data-heading
          className="text-balance font-display text-[2.75rem] leading-[1.05] text-ivory md:text-7xl [&_.tl-line-mask]:-mb-[0.15em] [&_.tl-line-mask]:pb-[0.15em]"
        >
          {HEADING}
        </h2>
        <p data-intro lang="hi" className="mt-4 font-display text-2xl text-rani md:text-3xl">
          {HEADING_HI}
        </p>
        <p data-intro className="mx-auto mt-5 max-w-md text-pretty text-[17px] leading-relaxed text-ivory/80 md:text-lg">
          {INTRO}
        </p>
      </header>

      <div ref={track} className="relative mx-auto mt-14 max-w-5xl px-5 md:mt-20 md:px-8">
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible" fill="none" strokeLinecap="round">
          <path data-guide className="stroke-ivory/20" strokeWidth={2} strokeDasharray="0 10" />
          <path data-strand className="stroke-marigold/20" strokeWidth={7} />
          <path data-strand className="stroke-rani" strokeWidth={1.75} />
          <path data-strand className="stroke-marigold" strokeWidth={2.25} />
        </svg>

        <span data-anchor="start" aria-hidden className="relative mx-auto block size-2.5 rounded-full bg-marigold" />

        {DAYS.map(({ day, events }) => (
          <div key={day} className={day === 1 ? "mt-20" : "mt-24 md:mt-32"}>
            <DayMarker day={day} date={events[0]?.date ?? ""} />
            {events.map((e, j) => (
              <EventRow key={e.id} event={e} right={e.right} first={j === 0} />
            ))}
          </div>
        ))}

        <div className={`${COLS} mt-14`}>
          <span data-anchor="pass" aria-hidden className="size-1 justify-self-center md:col-start-2" />
        </div>

        <div className="relative z-20 mt-16 flex flex-col items-center text-center">
          <div className="relative grid h-32 w-24 items-end justify-items-center pb-3">
            <svg viewBox="0 0 96 128" className="absolute inset-0 size-full" fill="none" strokeWidth={1.5} aria-hidden>
              <path d={END_NICHE} className="stroke-ivory/25" />
              <path data-niche-lit d={END_NICHE} className="fill-marigold/10 stroke-marigold" />
              <path d="M0 127H96" className="stroke-marigold/40" />
            </svg>
            <div data-anchor="end" className="relative grid size-14 place-items-center">
              <div data-lamp aria-hidden className="relative grid size-14 place-items-center">
                <span className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(242,168,59,0.38)_0%,rgba(242,168,59,0.12)_38%,transparent_68%)] motion-safe:animate-pulse" />
                <Diya className="relative w-10" />
              </div>
            </div>
          </div>
          <p lang="hi" className="mt-6 font-display text-3xl text-rani">
            {CLOSING_HI}
          </p>
          <p className="mt-2 text-ivory/80">{CLOSING}</p>
        </div>
      </div>
    </section>
  );
}
