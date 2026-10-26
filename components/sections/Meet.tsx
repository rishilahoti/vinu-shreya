"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { wedding, type Photo } from "@/lib/content";
import Kite from "@/components/art/Kite";
import Peacock from "@/components/art/Peacock";
import Petals from "@/components/art/Petals";
import s from "./Meet.module.css";

const { letter, groom, bride, moments, clip, rsvp } = wedding;
// The number never breaks across lines.
const STRIP = letter.strip.replace(rsvp.whatsappDisplay, rsvp.whatsappDisplay.replaceAll(" ", "\u00a0"));

// The sheet's bottom edge, cut into 24 small scallops. x in % so the cut follows the sheet's width.
const N = 24;
const STEPS = 6;
const DEPTH = 8;
const SCALLOPS = `polygon(0 0, 100% 0, ${Array.from({ length: N * STEPS + 1 }, (_, k) => {
  const i = N * STEPS - k;
  const y = DEPTH * (1 - Math.sin((Math.PI * (i % STEPS)) / STEPS));
  return `${((i / (N * STEPS)) * 100).toFixed(3)}% calc(100% - ${y.toFixed(2)}px)`;
}).join(", ")})`;

const vars = (r: number, i: number) => ({ "--r": `${r}deg`, "--i": i }) as CSSProperties;

/** A photograph tipped onto the desk: paper margin, slight tilt, drops in. */
function Plate({ photo, r, i, className = "" }: { photo: Photo; r: number; i: number; className?: string }) {
  return (
    <figure data-reveal className={`${s.plate} relative z-[1] bg-paper p-1.5 sm:p-2 ${className}`} style={vars(r, i)}>
      <div className="relative aspect-[4/5]">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 300px, (min-width: 640px) 310px, 50vw" className="object-cover" />
      </div>
    </figure>
  );
}

/** The peacock clip as one more plate: plays only while on screen, never under reduced motion. */
function Clip({ r, i, className = "" }: { r: number; i: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce.matches) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure data-reveal className={`${s.plate} relative z-[1] bg-paper p-1.5 sm:p-2 ${className}`} style={vars(r, i)}>
      <video
        ref={ref}
        src={clip.src}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        aria-label={clip.alt}
        muted
        loop
        playsInline
        preload="metadata"
        className="block aspect-video h-auto w-full object-cover"
      />
    </figure>
  );
}

export default function Meet() {
  return (
    <section id="letter" aria-labelledby="letter-heading" className="relative isolate overflow-clip bg-ground page-x py-(--section)">
      <Petals count={18} seed={2302} className="-z-10" />

      {/* Phone and tablet: two plates above the letter, the clip and two plates below.
          Desktop: the side columns become the desk on either side of the sheet. */}
      <div className="mx-auto grid max-w-[640px] grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:max-w-[1400px] xl:grid-cols-[minmax(0,1fr)_640px_minmax(0,1fr)] xl:gap-x-12">
        <div className="contents xl:relative xl:col-start-1 xl:row-start-1 xl:flex xl:flex-col xl:items-start xl:justify-between">
          <Kite body="#1F5E8A" top="#E8B83A" className="pointer-events-none absolute -top-44 -right-12 hidden w-[180px] -scale-x-100 xl:block" />
          <Plate photo={moments[0]} r={-2.5} i={0} className="xl:mt-36 xl:w-[86%] xl:self-end" />
          <Plate photo={moments[1]} r={2} i={2} className="xl:w-[74%]" />
          {/* A Rambagh peacock wanders up to the letter, as if invited too; it stands on the line of the sheet's foot. */}
          <Peacock flip className="pointer-events-none hidden w-[92%] xl:block" />
        </div>

        <article
          data-reveal
          className="relative z-[2] col-span-2 bg-paper max-sm:-mx-(--margin) xl:col-span-1 xl:col-start-2 xl:row-start-1"
          style={{ clipPath: SCALLOPS }}
        >
          <div className="p-6 sm:p-[60px]">
            <div className="flex">
              {[groom, bride].map((p, i) => (
                <span key={p.name} className={`block rounded-full bg-paper p-[3px] ${i ? "-ml-3" : "-ml-[3px]"}`}>
                  <Image src={p.photo.src} alt={p.photo.alt} width={44} height={44} className="block size-11 rounded-full object-cover" />
                </span>
              ))}
            </div>
            <h2 id="letter-heading" className="t-head mt-7">
              {letter.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className={`${s.letter} mt-8 space-y-[1.55em]`}>
              {letter.paragraphs.map((p, i) => (
                <p key={i} className="t-body">
                  {p}
                </p>
              ))}
            </div>
            <p className="t-lead mt-10 font-medium">{letter.signoff}</p>
            <p className="t-small text-muted">{letter.signoffNote}</p>
          </div>

          {/* Perforation: real round holes, showing the ground through, across the fold. */}
          <div aria-hidden className="relative z-[1] -mb-[2.5px] flex justify-around">
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} className="block size-[5px] rounded-full bg-ground" />
            ))}
          </div>
          <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-x-5 gap-y-3 bg-paper-2 px-6 pt-3 pb-5 sm:px-8">
            <p className="t-body flex-[1_1_14rem] text-balance">{STRIP}</p>
            <a href={`https://wa.me/${rsvp.whatsapp}`} target="_blank" rel="noopener" className="button shrink-0 max-sm:w-full">
              {letter.stripLink}
            </a>
          </div>
        </article>

        <div className="contents xl:relative xl:col-start-3 xl:row-start-1 xl:flex xl:flex-col xl:items-start xl:justify-around">
          <Kite className="pointer-events-none absolute top-4 right-(--margin) w-[84px] sm:w-[110px] xl:-top-44 xl:right-auto xl:-left-12 xl:w-[180px]" />
          <Plate photo={moments[2]} r={2.5} i={1} className="max-xl:order-1 xl:w-[80%]" />
          <Clip r={-1.5} i={3} className="col-span-2 xl:w-full" />
          <Plate photo={moments[3]} r={-2} i={4} className="max-xl:order-1 xl:w-[70%] xl:self-end" />
        </div>
      </div>
    </section>
  );
}
