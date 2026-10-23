"use client";

import { useRef } from "react";
import { wedding } from "@/lib/content";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Mandala, PATTERNS } from "@/components/motifs";

const { blessing, groom, bride } = wedding;

const NAME_SIZE = "text-[length:clamp(3.5rem,min(25vw,15svh),11rem)]";
const KIN = "max-w-[20rem] text-[0.9375rem] leading-snug text-balance text-ivory/85 md:max-w-none md:text-xl";

// Shisha (mirror-work) pieces resting on the mandala's dotted rings, in Mandala's -100..100 space.
const GLINTS = Array.from({ length: 8 }, (_, i) => {
  const a = ((i * 45 + 22.5) * Math.PI) / 180;
  const r = i % 2 ? 54 : 96;
  return { x: Math.round(Math.cos(a) * r * 100) / 100, y: Math.round(Math.sin(a) * r * 100) / 100 };
});

/** Gathbandhan: his marigold thread and her rani thread meet in the middle and tie one knot. */
function Gathbandhan() {
  return (
    <svg viewBox="0 -14 320 100" fill="none" strokeLinecap="round" className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="cp-thread-l" gradientUnits="userSpaceOnUse" x1="6" y1="0" x2="90" y2="0">
          <stop offset="0" stopColor="#f2a83b" stopOpacity="0" />
          <stop offset="1" stopColor="#f2a83b" />
        </linearGradient>
        <linearGradient id="cp-thread-r" gradientUnits="userSpaceOnUse" x1="314" y1="0" x2="230" y2="0">
          <stop offset="0" stopColor="#e04a7e" stopOpacity="0" />
          <stop offset="1" stopColor="#e04a7e" />
        </linearGradient>
      </defs>
      <path className="cp-thread" d="M6 30C30 30 44 46 72 44S120 36 140 36" stroke="url(#cp-thread-l)" strokeWidth={1.75} />
      <path className="cp-thread" d="M314 30C290 30 276 46 248 44S200 36 180 36" stroke="url(#cp-thread-r)" strokeWidth={1.75} />
      {/* Both threads enter the knot level at y=36, so scaling it about (160 36) never opens a gap.
          Butt caps: a round cap would show as a dot at DrawSVG 0. */}
      <g className="cp-knot" strokeWidth={2} strokeLinecap="butt">
        <path d="M140 36C152 36 160 22 170 24C182 26 180 44 166 46C156 48 150 58 154 79" stroke="#f2a83b" />
        <path d="M180 36C168 36 160 22 150 24C138 26 140 44 154 46C164 48 170 58 166 79" stroke="#e04a7e" />
        <circle className="cp-bead" cx={154} cy={81} r={2.6} fill="#f2a83b" />
        <circle className="cp-bead" cx={166} cy={81} r={2.6} fill="#e04a7e" />
      </g>
      <path className="cp-bindu" d="M160 29L161.6 36L160 43L158.4 36ZM153 36L160 34.4L167 36L160 37.6Z" fill="#f7ebd3" />
    </svg>
  );
}

export default function Couple() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);

        // Intro line reveals on approach, before the pin, so the chapter never arrives empty.
        SplitText.create(q(".cp-blessing"), {
          type: "lines",
          mask: "lines",
          tag: "span",
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.12,
              scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none reverse" },
            }),
        });

        // Timeline runs 0..10. Everything settles by 8, so the last 20% of the pin holds the finished card.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });

        tl.to(q(".cp-pattern"), { yPercent: -18, ease: "none", duration: 10 }, 0)
          .fromTo(q(".cp-glow"), { scale: 0.6, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 4, ease: "power2.out" }, 0)
          .fromTo(q(".cp-wheel"), { rotation: -24, scale: 0.9 }, { rotation: 12, scale: 1, duration: 8, ease: "none" }, 0)
          // Dotted rings stay static (DrawSVG would overwrite their dash pattern); petals draw centre outward.
          .from(q(".cp-wheel .mandala-line:not([stroke-dasharray])"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut", stagger: { amount: 3.2 } }, 0)
          .from(q(".cp-glint"), { opacity: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.8, stagger: 0.25, ease: "back.out(3)" }, 2.4);

        // Tracking settles: words start fanned out from the centre and close in.
        const settle = (sel: string) => {
          const words = SplitText.create(q(sel), { type: "words", tag: "span", aria: "none" }).words;
          return { targets: words, vars: { opacity: 0, x: (i: number) => (i - (words.length - 1) / 2) * 14, duration: 1.4, ease: "power2.out" } };
        };
        const sonOf = settle(".cp-groom-kin");
        const daughterOf = settle(".cp-bride-kin");

        // Names rise through their clip, his from the left, hers from the right.
        const his = SplitText.create(q(".cp-groom"), { type: "chars", tag: "span", aria: "none" }).chars;
        const hers = SplitText.create(q(".cp-bride"), { type: "chars", tag: "span", aria: "none" }).chars;

        tl.from(sonOf.targets, sonOf.vars, 0.4)
          .from(his, { yPercent: 120, xPercent: -40, rotation: -8, duration: 1.4, stagger: 0.18 }, 1.2)
          .from(q(".cp-thread"), { drawSVG: 0, duration: 2, ease: "power2.inOut" }, 2.8)
          .from(hers, { yPercent: 120, xPercent: 40, rotation: 8, duration: 1.4, stagger: { each: 0.18, from: "end" } }, 3.4)
          .from(q(".cp-knot path"), { drawSVG: 0, duration: 1, ease: "power1.inOut" }, 4.6)
          .from(q(".cp-knot"), { scale: 1.4, svgOrigin: "160 36", duration: 1.2, ease: "back.out(2.5)" }, 5.4)
          .from(q(".cp-bead"), { opacity: 0, duration: 0.4 }, 5.4)
          .from(daughterOf.targets, daughterOf.vars, 5.2)
          .from(q(".cp-bindu"), { scale: 0, rotation: -90, svgOrigin: "160 36", duration: 0.8, ease: "back.out(3)" }, 6.2)
          .to({}, { duration: 2 }, 8);

        // Mirrors catch the light at random while the section is on screen.
        gsap.fromTo(
          q(".cp-flash"),
          { opacity: 0.2 },
          {
            opacity: 1,
            duration: 1.1,
            ease: "sine.inOut",
            stagger: { each: 0.5, from: "random", repeat: -1, yoyo: true },
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="couple"
      className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-clip bg-linear-to-b from-night-deep via-plum to-night-deep px-5 py-10 text-center md:px-10 md:py-16"
    >
      <div
        aria-hidden
        className="cp-pattern absolute inset-x-0 top-0 -z-20 h-[130%] opacity-50 will-change-transform"
        style={{ backgroundImage: PATTERNS.bandhani }}
      />

      <p className="cp-blessing max-w-[19rem] text-[0.9375rem] leading-relaxed text-balance text-ivory/80 md:max-w-xl md:text-lg">
        {blessing}
      </p>

      <p className={`cp-groom-kin mt-6 md:mt-10 ${KIN}`}>
        <span className="text-marigold">{groom.relation}</span> {groom.parents}
      </p>

      <h2 className="mt-3 flex w-full flex-col items-center font-display font-normal leading-none text-ivory">
        <span className="sr-only">
          {groom.name} & {bride.name}
        </span>
        <span aria-hidden className={`cp-groom block overflow-y-clip whitespace-nowrap pt-[0.04em] pb-[0.08em] ${NAME_SIZE}`}>
          {groom.name}
        </span>

        <span aria-hidden className="relative block w-[min(20rem,100%,42svh)] md:w-[min(26rem,46svh)]">
          {/* Mandala and glow are centred on the knot, so the knot becomes the mandala's bindu. */}
          <span className="absolute top-1/2 left-1/2 -z-10 block aspect-square w-[min(150vw,54rem,88svh)] -translate-x-1/2 -translate-y-1/2">
            <span className="cp-glow absolute inset-[6%] block rounded-full bg-[radial-gradient(closest-side,rgb(224_74_126/0.22),rgb(58_18_64/0.35)_55%,transparent)] will-change-transform" />
            <span className="cp-wheel absolute inset-0 block will-change-transform">
              <Mandala strokeWidth={0.5} className="absolute inset-0 size-full text-marigold opacity-40" />
              <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full overflow-visible">
                {GLINTS.map(({ x, y }) => (
                  <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
                    <g className="cp-glint">
                      <path d="M0-2.4L2.4 0L0 2.4L-2.4 0Z" fill="#0b0d27" stroke="#f2a83b" strokeWidth={0.4} />
                      <path className="cp-flash" d="M0-1.4L1.4 0L0 1.4L-1.4 0Z" fill="#f7ebd3" opacity={0.7} />
                    </g>
                  </g>
                ))}
              </svg>
            </span>
          </span>
          <Gathbandhan />
        </span>

        <span aria-hidden className={`cp-bride block overflow-y-clip whitespace-nowrap pt-[0.04em] pb-[0.08em] ${NAME_SIZE}`}>
          {bride.name}
        </span>
      </h2>

      <p className={`cp-bride-kin mt-3 ${KIN}`}>
        <span className="text-marigold">{bride.relation}</span> {bride.parents}
      </p>
    </section>
  );
}
