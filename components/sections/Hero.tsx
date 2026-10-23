"use client";

import { useRef, useState } from "react";
import { DeviceMobile } from "@phosphor-icons/react";
import { gsap, SplitText, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { wedding } from "@/lib/content";
import { Mandala, Kite, Diya, Toran, Skyline, archPath } from "@/components/motifs";

// Seeded PRNG so server and client render identical star/petal markup.
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = prng(2027);
const STARS = Array.from({ length: 42 }, () => ({ x: rand() * 100, y: rand() * 50, r: 1 + rand() * 1.6, d: rand() * 4 }));
const PETAL_COLORS = ["#F2A83B", "#E5771E", "#E04A7E", "#F7C65C"];
const PETALS = Array.from({ length: 14 }, (_, i) => ({ x: rand() * 100, s: 9 + rand() * 9, c: PETAL_COLORS[i % 4] }));

// Arch opening + carved inlay lines, in the wall's 400x800 viewBox.
const OPENING = archPath(48, 80, 304, 721, 6);
const INLAY = archPath(38, 68, 324, 740, 6);
const INLAY_DOTS = archPath(43, 74, 314, 730, 6);
const WALL = "linear-gradient(#A23A5E, #6A1D40)";
const SKY = "radial-gradient(120% 65% at 50% 100%, #5B1A4A 0%, #2A1550 38%, #12153A 66%, #0B0D27 100%)";
// Centre an absolutely positioned layer that is k times the arch width (mx-auto can't centre an overflowing box).
const centered = (k: number) => ({ width: `calc(var(--arch) * ${k})`, left: `calc(50% - var(--arch) * ${k / 2})` });
const DOOR = (dir: "90deg" | "270deg") =>
  `radial-gradient(circle, #F2A83B 1.3px, transparent 1.7px) 0 0 / 22px 22px, linear-gradient(${dir}, #2E0C26, #561A3C)`;

// Gyroscope calibration knobs: degrees of tilt for full effect, and how fast "neutral" follows the guest's posture.
const TILT_RANGE = 20;
const BASELINE_DRIFT = 0.005;

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const enableGyro = useRef<() => void>(() => {});
  const [askTilt, setAskTilt] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(REDUCED, () => {
        gsap.set(".hero-doors", { autoAlpha: 0 });
      });

      mm.add(MOTION_OK, () => {
        const html = document.documentElement;
        history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        html.classList.add("is-locked");
        const fine = matchMedia("(pointer: fine)").matches;
        const needsPermission =
          typeof (window.DeviceOrientationEvent as unknown as OrientationPermission | undefined)?.requestPermission === "function";

        // Intro: the seal draws itself, the palace doors swing open, the scene settles in.
        const split = SplitText.create(".hero-names", { type: "words,chars", mask: "words" });
        gsap.set(".door-mandala", { autoAlpha: 1 });
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "expo.out" },
          onComplete: () => {
            html.classList.remove("is-locked");
            setAskTilt(needsPermission && !fine);
          },
        });
        tl.from(".door-mandala .mandala-line", { drawSVG: 0, duration: 0.9, stagger: { amount: 0.7 }, ease: "power2.inOut" })
          .from(".door-mandala .mandala-dots", { autoAlpha: 0, duration: 0.6 }, "-=0.6")
          .to(".seam", { autoAlpha: 1, scaleX: 3, duration: 0.5, ease: "power2.out" }, "-=0.2")
          .addLabel("open")
          .to(".door-l", { rotationY: -108, duration: 1.9, ease: "power3.inOut" }, "open")
          .to(".door-r", { rotationY: 108, duration: 1.9, ease: "power3.inOut" }, "open")
          .to(".seam", { autoAlpha: 0, duration: 0.6 }, "open+=0.25")
          .from(".scene", { scale: 1.2, duration: 2.8, ease: "power3.out" }, "open")
          .from(".moon", { scale: 0.6, autoAlpha: 0, duration: 1.8 }, "open+=0.3")
          .from(".kite", { yPercent: 80, autoAlpha: 0, stagger: 0.18, duration: 1.8 }, "open+=0.5")
          .from(".invocation", { autoAlpha: 0, y: 14, duration: 1.1 }, "open+=0.8")
          .from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.05 }, "open+=0.9")
          .from(".hero-date", { autoAlpha: 0, y: 16, duration: 1.1 }, "open+=1.6")
          .from(".toran", { yPercent: -110, duration: 1.8, ease: "elastic.out(1, 0.5)" }, "open+=1.0")
          .from(".diya", { scale: 0, transformOrigin: "50% 100%", stagger: 0.08, duration: 0.9, ease: "back.out(2)" }, "open+=1.2")
          .set(".hero-doors", { autoAlpha: 0 });

        document.fonts.ready.then(() => tl.play());
        gsap.delayedCall(2.5, () => tl.play()); // don't wait forever on a slow font
        const skip = () => tl.timeScale(3);
        const el = root.current;
        el?.addEventListener("pointerdown", skip, { once: true });

        // Ambient life: bobbing kites, swaying garland strands, falling marigold petals.
        gsap.to(".kite-bob", { y: "random(-12, 12)", rotation: "random(-7, 7)", duration: "random(2.4, 4)", repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.utils.toArray<SVGGElement>(".toran .toran-strand").forEach((strand, i) =>
          gsap.to(strand, { rotation: i % 2 ? 5 : -5, svgOrigin: `${i * 100} 5`, duration: 2 + (i % 3) * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        );
        gsap.utils.toArray<HTMLElement>(".petal").forEach((petal) =>
          gsap.to(petal, {
            y: () => window.innerHeight * 1.15,
            x: "random(-60, 60)",
            rotation: "random(240, 720)",
            duration: "random(7, 12)",
            delay: "random(1.5, 9)",
            repeat: -1,
            ease: "none",
          }),
        );

        // Scroll: walk through the arch. Frame rushes past, layers separate by depth.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=130%", pin: true, scrub: 0.8 },
          })
          .to(".s-frame", { scale: 3.2, transformOrigin: "50% 62%" }, 0)
          .to(".s-near", { yPercent: 45, scale: 1.25, transformOrigin: "50% 100%" }, 0)
          .to(".s-far", { yPercent: 16, scale: 1.08, transformOrigin: "50% 100%" }, 0)
          .to(".s-kites", { yPercent: -30 }, 0)
          .to(".s-sky", { yPercent: -5, scale: 1.06 }, 0)
          .to(".s-copy", { yPercent: -45, autoAlpha: 0, ease: "power1.in" }, 0.15)
          .to(".hero-fade", { autoAlpha: 1 }, 0.7);

        // Motion-sensitive parallax: layers drift by depth around the focal plane of the names.
        const movers = gsap.utils.toArray<HTMLElement>(".tilt").map((el) => ({
          d: Number(el.dataset.depth) - 0.55,
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
        }));
        const clamp = gsap.utils.clamp(-1, 1);
        const tilt = (nx: number, ny: number) =>
          movers.forEach((m) => {
            m.x(nx * m.d * -40);
            m.y(ny * m.d * -24);
          });

        const onPointer = (e: PointerEvent) => tilt((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2);
        let base: [number, number] | null = null;
        const onOrient = (e: DeviceOrientationEvent) => {
          if (e.gamma == null || e.beta == null) return;
          base ??= [e.gamma, e.beta];
          base[0] += (e.gamma - base[0]) * BASELINE_DRIFT;
          base[1] += (e.beta - base[1]) * BASELINE_DRIFT;
          tilt(clamp((e.gamma - base[0]) / TILT_RANGE), clamp((e.beta - base[1]) / TILT_RANGE));
        };
        enableGyro.current = () => window.addEventListener("deviceorientation", onOrient);

        if (fine) window.addEventListener("pointermove", onPointer);
        else if (!needsPermission) enableGyro.current();

        return () => {
          html.classList.remove("is-locked");
          el?.removeEventListener("pointerdown", skip);
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("deviceorientation", onOrient);
          enableGyro.current = () => {};
        };
      });
    },
    { scope: root },
  );

  // iOS only grants gyroscope access from a tap.
  const requestTilt = async () => {
    setAskTilt(false);
    const res = await (window.DeviceOrientationEvent as unknown as OrientationPermission).requestPermission?.();
    if (res === "granted") enableGyro.current();
  };

  return (
    <section
      id="hero"
      ref={root}
      className="relative h-[100dvh] overflow-hidden bg-night-deep [--arch:min(100vw,62dvh)]"
    >
      <div className="scene absolute inset-0">
        <div className="s-sky absolute inset-0">
          <div className="tilt absolute inset-0" data-depth="0.15">
            <div className="absolute -inset-[10%]" style={{ background: SKY }} />
            <div className="absolute inset-0" aria-hidden>
              {STARS.map((s, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-ivory motion-safe:animate-pulse"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, animationDelay: `${-s.d}s`, opacity: 0.7 }}
                />
              ))}
            </div>
            <div
              className="moon absolute inset-x-0 top-[15%] mx-auto aspect-square rounded-full"
              style={{
                width: "calc(var(--arch) * 0.3)",
                background: "radial-gradient(circle at 38% 34%, #FFF4D6, #F7C65C 55%, #E5952E)",
                boxShadow: "0 0 70px 22px rgba(242,168,59,.26)",
              }}
            />
          </div>
        </div>

        <div className="s-kites absolute inset-0">
          <div className="tilt absolute inset-x-0 inset-y-0 mx-auto" data-depth="0.35" style={{ width: "var(--arch)" }}>
            <div className="kite absolute left-[17%] top-[30%] w-[12%]">
              <Kite className="kite-bob h-auto w-full -rotate-12" />
            </div>
            <div className="kite absolute right-[16%] top-[37%] w-[9%]">
              <Kite className="kite-bob h-auto w-full rotate-12" body="#1F7A7A" top="#E04A7E" />
            </div>
            <div className="kite absolute left-[70%] top-[24%] w-[6%]">
              <Kite className="kite-bob h-auto w-full rotate-6" body="#F2A83B" top="#C2312F" />
            </div>
          </div>
        </div>

        <div className="s-far absolute inset-0">
          <div className="tilt absolute inset-0" data-depth="0.45">
            <Skyline
              variant="far"
              className="absolute bottom-[13%] h-auto text-[#1F2560]"
              style={centered(1.25)}
            />
          </div>
        </div>

        <div className="s-copy absolute inset-0">
          <div className="tilt absolute inset-x-0 top-[41%] mx-auto px-[13%] text-center" data-depth="0.55" style={{ width: "var(--arch)" }}>
            <p className="invocation font-display text-marigold" style={{ fontSize: "calc(var(--arch) * 0.048)" }}>
              {wedding.invocation}
            </p>
            <h1
              className="hero-names mt-3 font-display leading-[0.95] text-ivory [text-shadow:0_2px_24px_rgba(11,13,39,.7)]"
              style={{ fontSize: "calc(var(--arch) * 0.18)" }}
            >
              <span className="block">{wedding.groom.name}</span>
              <span className="block text-[0.42em] text-marigold">&amp;</span>
              <span className="block">{wedding.bride.name}</span>
            </h1>
            <p
              className="hero-date mt-5 leading-snug text-ivory/90 [text-shadow:0_1px_12px_rgba(11,13,39,.9)]"
              style={{ fontSize: "calc(var(--arch) * 0.042)" }}
            >
              {wedding.dateLabel}
              <br />
              {wedding.venue.name}, {wedding.city}
            </p>
          </div>
        </div>

        <div className="s-near absolute inset-0">
          <div className="tilt absolute inset-0" data-depth="0.8">
            <Skyline
              variant="near"
              windows={false}
              className="absolute -bottom-px h-auto text-night-deep"
              style={centered(1.3)}
            />
          </div>
        </div>
      </div>

      <div className="s-frame absolute inset-0">
        <div className="tilt absolute inset-0" data-depth="1">
          <div className="hero-doors absolute inset-y-0 inset-x-0 mx-auto [perspective:1400px]" style={{ width: "var(--arch)" }}>
            {(["l", "r"] as const).map((side) => (
              <div
                key={side}
                className={`door-${side} absolute inset-y-0 w-1/2 overflow-hidden [backface-visibility:hidden] ${side === "l" ? "left-0 origin-left" : "right-0 origin-right"}`}
                style={{ background: DOOR(side === "l" ? "90deg" : "270deg") }}
              >
                <div className="absolute inset-3 rounded-t-full border border-marigold/50" />
                <div className="absolute inset-5 rounded-t-full border border-dashed border-ivory/20" />
                <Mandala
                  className="door-mandala absolute aspect-square text-marigold"
                  style={{
                    width: "calc(var(--arch) * 0.86)",
                    top: "calc(58% - var(--arch) * 0.43)",
                    left: side === "l" ? "14%" : "-86%",
                    opacity: 0,
                  }}
                />
              </div>
            ))}
            <div className="seam absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-marigold to-transparent opacity-0" />
          </div>

          <div className="absolute inset-y-0 -inset-x-[10%] flex">
            <div className="flex-1" style={{ background: WALL }} />
            <svg viewBox="0 0 400 800" preserveAspectRatio="none" className="h-full shrink-0" style={{ width: "var(--arch)" }} aria-hidden>
              <defs>
                <linearGradient id="hero-wall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#A23A5E" />
                  <stop offset="1" stopColor="#6A1D40" />
                </linearGradient>
              </defs>
              <path fillRule="evenodd" fill="url(#hero-wall)" d={`M0 0H400V800H0Z ${OPENING}`} />
              <path d={INLAY} fill="none" stroke="#F2A83B" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              <path
                d={INLAY_DOTS}
                fill="none"
                stroke="#F7EBD3"
                strokeOpacity={0.55}
                strokeWidth={2.5}
                strokeDasharray="0.5 8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="flex-1" style={{ background: WALL }} />
          </div>

          <div className="absolute top-0" style={centered(1.06)}>
            <Toran className="toran h-auto w-full" />
          </div>

          <div className="absolute inset-x-0 bottom-[1.5%] mx-auto flex justify-between px-[5%]" style={{ width: "var(--arch)" }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Diya key={i} className="diya h-auto w-[12%]" />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal absolute -top-[5%] block rounded-[60%_0]"
            style={{ left: `${p.x}%`, width: p.s, height: p.s * 0.62, background: p.c }}
          />
        ))}
      </div>

      <div className="hero-fade pointer-events-none invisible absolute inset-0 bg-night-deep opacity-0" />

      {askTilt && (
        <button
          type="button"
          onClick={requestTilt}
          className="absolute inset-x-0 bottom-[calc(14%+env(safe-area-inset-bottom))] mx-auto flex min-h-11 w-fit items-center gap-2 rounded-full border border-marigold/40 bg-night-deep/70 px-4 text-sm text-ivory transition-transform duration-150 active:scale-[0.97] motion-safe:animate-[fadein_.6s_var(--ease-out-expo)]"
        >
          <DeviceMobile size={18} weight="duotone" className="text-marigold" />
          Tilt your phone to look around
        </button>
      )}
    </section>
  );
}
