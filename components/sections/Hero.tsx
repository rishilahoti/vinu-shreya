"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "@/lib/content";
import Stripe from "@/components/Stripe";
import Toran from "@/components/art/Toran";
import Bell from "@/components/art/Bell";
import Diya from "@/components/art/Diya";
import Peacock from "@/components/art/Peacock";
import Birds from "@/components/art/Birds";
import Kite from "@/components/art/Kite";
import s from "./Hero.module.css";

const { hero } = wedding;
// Each view of the palace holds 5s, then the next fades in over it for 1.6s (.view in Hero.module.css).
const STEP = 6600;
const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Hero() {
  // The view on top and the one it is fading in over, so the room never dips to the ground colour mid-fade.
  const [[top, under], setViews] = useState([0, -1]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      // Hold the view while the tab is hidden or the hero is scrolled away (data-rest, set by RevealObserver).
      if (!document.hidden && !document.getElementById("hero")?.hasAttribute("data-rest"))
        setViews(([t]) => [(t + 1) % hero.palace.length, t]);
    }, STEP);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="grid grid-cols-1 p-(--margin) md:grid-cols-2 md:gap-3">
      {/* The card, set like a doorway: toran over the lintel, bells at the jambs, diyas at the threshold. */}
      <div className={`${s.card} relative z-10 -mt-6 flex flex-col overflow-clip bg-paper md:mt-0 md:min-h-[calc(100svh-2*var(--margin))]`}>
        <Stripe className="relative z-10 h-10 md:h-14" />
        <div className="mx-11 md:mx-[72px]">
          <Toran swags={3} className={`${s.drop} block h-auto w-full`} />
        </div>
        <Bell length={8} phase={0.4} className={`${s.drop} absolute left-3 top-10 w-7 md:left-5 md:top-14 md:w-11`} style={at(1)} />
        <Bell length={8} phase={1.7} className={`${s.drop} absolute right-3 top-10 w-7 md:right-5 md:top-14 md:w-11`} style={at(2)} />

        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 pt-5 text-center md:px-12 md:py-10">
          <h1 className="t-display">
            {hero.lines.map((line, i) => (
              <span key={line} className={`${s.rise} block`} style={at(i)}>
                {line}
              </span>
            ))}
          </h1>
          <p className={`${s.rise} t-lead mt-5 max-w-[36ch] md:mt-7`} style={at(2)}>
            {hero.sentence}
          </p>
          <a href="#rsvp" className={`${s.rise} button mt-6 max-md:w-full md:mt-9`} style={at(3)}>
            {hero.button}
          </a>
        </div>

        <div className={`${s.rise} flex items-end gap-2 px-3 pb-7 md:px-5`} style={at(4)}>
          <Diya className="w-10 shrink-0 md:w-[72px]" />
          <ul className="t-body flex flex-1 flex-wrap justify-center gap-x-6 gap-y-1 pb-1">
            {hero.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* mirrored, so both spouts and flames lean in towards the links */}
          <Diya className="w-10 shrink-0 -scale-x-100 md:w-[72px]" />
        </div>
      </div>

      {/* The room: Rambagh in slow crossfade, alive on the lawn and in the sky. */}
      <div className="relative h-[48svh] overflow-clip bg-paper-2 max-md:order-first md:sticky md:top-(--margin) md:h-[calc(100svh-2*var(--margin))]">
        <div className={`${s.open} absolute inset-0`}>
          {hero.palace.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              preload={i === 0}
              className={s.view}
              style={{ objectPosition: p.focal, opacity: i === top || i === under ? 1 : 0, zIndex: i === top ? 2 : i === under ? 1 : 0 }}
            />
          ))}
        </div>
        <Birds className={`${s.late} absolute left-[3%] top-[3%] z-10 w-[40%]`} />
        {/* flown from a roof off to the right: the string leaves the picture at its right edge */}
        <Kite className={`${s.late} absolute right-0 top-[4%] z-10 w-[12%] -scale-x-100 text-ink`} style={at(1)} />
        <Peacock display className={`${s.rise} absolute bottom-0 right-[5%] z-10 w-[clamp(150px,44%,340px)] max-md:bottom-6`} style={at(6)} />
      </div>
    </section>
  );
}
