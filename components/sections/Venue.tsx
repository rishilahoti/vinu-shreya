"use client";

import { useId, useRef } from "react";
import { NavigationArrow } from "@phosphor-icons/react";
import { wedding } from "@/lib/content";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Mandala, Skyline, PATTERNS, archPath } from "@/components/motifs";
import VenueRsvp from "@/components/sections/VenueRsvp";

const EYEBROW = "पधारो म्हारे देस";
const CTA = "Open in Google Maps";

// Map art is drawn in a 400 x 500 box (aspect 4/5). The pin tip sits at (200, 330) = 50% / 66%.
const ARCH = archPath(2, 2, 396, 496, 6, 0.62);
const ARCH_INNER = archPath(12, 14, 376, 480, 6, 0.62);
const LAKE = "M30 200C34 176 78 164 112 172C146 180 164 200 156 222C148 244 108 252 74 246C42 240 26 222 30 200Z";
const ROADS = [
  "M-10 262C60 280 120 250 190 262S320 300 410 276",
  "M318 96C296 150 262 186 240 226S204 274 200 290",
  "M-10 410C40 400 70 362 110 354S150 342 160 340",
  "M410 372C350 368 280 352 240 342",
];
const PIN = "M30 84C24 70 4 52 4 30A26 26 0 1 1 56 30C56 52 36 70 30 84Z";
const PIN_WINDOW = archPath(19, 17, 22, 28, 3, 0.62);
// Static ripple sizes, used as-is under reduced motion; GSAP takes over otherwise.
const RINGS = [
  [0.45, 0.7],
  [0.8, 0.4],
  [1.15, 0.18],
];

export default function Venue() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^\w-]/g, "");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const heading = () => ({ trigger: title.current, start: "top 85%", once: true });
        SplitText.create(title.current, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: heading() }),
        });
        gsap.from(q(".v-fade"), { y: 16, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: heading() });

        // Signature: roads draw in, the pin drops and bounces, then the ground keeps rippling.
        gsap.set(q(".v-ring"), { opacity: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: map.current, start: "top 75%", once: true } })
          .from(map.current, { y: 48, opacity: 0, duration: 1, ease: "expo.out" })
          .from(q(".v-road"), { drawSVG: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.15 }, 0.3)
          .from(q(".v-pin"), { yPercent: -320, duration: 1.1, ease: "bounce.out" }, 1.1)
          .from(q(".v-pin"), { opacity: 0, duration: 0.2 }, 1.1)
          .from(q(".v-shadow"), { scale: 0.1, opacity: 0, duration: 1.1, ease: "bounce.out" }, 1.1)
          .fromTo(
            q(".v-ring"),
            { scale: 0.3, opacity: 0.8 },
            { scale: 1.35, opacity: 0, duration: 3.6, ease: "power1.out", immediateRender: false, stagger: { each: 1.2, repeat: -1 } },
            1.6,
          );

        gsap.from(form.current, {
          y: 56,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: form.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="venue"
      ref={root}
      className="relative min-h-[100dvh] overflow-hidden bg-linear-to-b from-night via-night-deep to-night-deep px-5 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_70%_75%,rgba(58,18,64,0.6),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-60 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{ backgroundImage: PATTERNS.leheriya }}
      />

      <div className="relative mx-auto grid max-w-5xl items-start gap-20 lg:grid-cols-2 lg:gap-14">
        <div className="text-center">
          <p lang="hi" className="v-fade font-display text-xl text-marigold">
            {EYEBROW}
          </p>
          <h2 ref={title} className="mt-2 font-display text-[clamp(2.75rem,12vw,4.5rem)] leading-[1.05]">
            {wedding.venue.name}
          </h2>
          <p className="v-fade mx-auto mt-4 max-w-xs text-ivory/75">{wedding.venue.address}</p>

          <div ref={map} className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-[26rem]">
            <svg viewBox="0 0 400 500" aria-hidden className="absolute inset-0 size-full">
              <defs>
                <clipPath id={`${id}-clip`}>
                  <path d={ARCH} />
                </clipPath>
                <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#12153a" />
                  <stop offset="1" stopColor="#3a1240" />
                </linearGradient>
                <pattern id={`${id}-dots`} width="28" height="28" patternUnits="userSpaceOnUse">
                  <g fill="#f2a83b" fillOpacity=".16">
                    <circle cx="7" cy="7" r="1.6" />
                    <circle cx="11" cy="7" r="1.6" />
                    <circle cx="9" cy="10.5" r="1.6" />
                    <circle cx="21" cy="21" r="1.6" />
                    <circle cx="25" cy="21" r="1.6" />
                    <circle cx="23" cy="24.5" r="1.6" />
                  </g>
                </pattern>
                <pattern id={`${id}-waves`} width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M-10 30Q0 20 10 30T30 30T50 30M-10 10Q0 0 10 10T30 10T50 10"
                    fill="none"
                    stroke="#f7ebd3"
                    strokeOpacity=".22"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>

              <g clipPath={`url(#${id}-clip)`}>
                <rect width="400" height="500" fill={`url(#${id}-ground)`} />
                <rect width="400" height="500" fill={`url(#${id}-dots)`} />
                <Mandala x={140} y={56} width={120} height={120} strokeWidth={1.4} opacity={0.28} className="text-marigold" />
                <path d={LAKE} fill="#1f7a7a" fillOpacity=".45" />
                <path d={LAKE} fill={`url(#${id}-waves)`} stroke="#f7ebd3" strokeOpacity=".25" />
                <rect x="86" y="200" width="18" height="9" rx="1.5" fill="#0b0d27" fillOpacity=".7" />
                {ROADS.map((d) => (
                  <path key={d} className="v-road" d={d} fill="none" stroke="#f7ebd3" strokeOpacity=".2" strokeWidth="7" />
                ))}
                <g fill="none" stroke="#f2a83b">
                  <rect x="160" y="290" width="80" height="80" rx="2" strokeOpacity=".45" />
                  <path d="M200 290V370M160 330H240" strokeOpacity=".3" />
                  <circle cx="200" cy="330" r="7" strokeOpacity=".45" />
                </g>
                <Skyline variant="near" windows={false} x={0} y={300} width={400} height={200} className="text-night-deep" />
              </g>
              <path d={ARCH} fill="none" stroke="#f2a83b" strokeOpacity=".5" strokeWidth="2" />
              <path d={ARCH_INNER} fill="none" stroke="#f2a83b" strokeOpacity=".18" />
            </svg>

            <div className="v-shadow absolute left-1/2 top-[66%] aspect-[3/1] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(11,13,39,0.85),transparent)]" />
            <div aria-hidden className="absolute left-1/2 top-[66%] aspect-[5/2] w-[46%] -translate-x-1/2 -translate-y-1/2">
              {RINGS.map(([scale, opacity]) => (
                <span
                  key={scale}
                  className="v-ring absolute inset-0 will-change-transform rounded-[50%] border-2 border-marigold/70"
                  style={{ transform: `scale(${scale})`, opacity }}
                />
              ))}
            </div>
            <svg viewBox="0 0 60 84" aria-hidden className="v-pin absolute bottom-[34%] left-[42%] h-auto w-[16%] overflow-visible">
              <defs>
                <linearGradient id={`${id}-pin`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f7c65c" />
                  <stop offset="1" stopColor="#e5771e" />
                </linearGradient>
              </defs>
              <path d={PIN} fill={`url(#${id}-pin)`} stroke="#f7ebd3" strokeOpacity=".6" />
              <circle cx="30" cy="30" r="21" fill="none" stroke="#0b0d27" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.01 4.4" />
              <path d={PIN_WINDOW} fill="#0b0d27" />
              <circle cx="30" cy="38" r="2.6" fill="#fff1c9" />
            </svg>
          </div>

          <a
            href={wedding.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-6 font-semibold text-night-deep transition-[transform,background-color] duration-150 active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#f7c65c]"
          >
            {CTA}
            <NavigationArrow weight="duotone" aria-hidden className="size-5" />
          </a>
        </div>

        <div ref={form}>
          <VenueRsvp />
        </div>
      </div>
    </section>
  );
}
