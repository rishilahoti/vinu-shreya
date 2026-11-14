import Image from "next/image";
import type { CSSProperties } from "react";
import { wedding } from "@/lib/content";
import Toran from "@/components/art/Toran";
import Elephant from "@/components/art/Elephant";
import Birds from "@/components/art/Birds";
import s from "./Venue.module.css";

const { venue, ceremonies } = wedding;
const at = (i: number) => ({ "--i": i }) as CSSProperties;

// Getting there: questions beside a tall photograph. The toran hangs over the leaf's top edge like over the palace door.
export default function Venue() {
  return (
    <section id="getting-there" aria-labelledby="getting-there-title" className="on-field relative bg-field text-field-ink">
      <Toran swags={3} className="pointer-events-none absolute inset-x-0 top-0 z-10 h-auto w-full md:hidden" />
      <Toran swags={7} className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-auto w-full md:block" />

      <div className="page-x grid gap-x-[var(--gutter)] lg:grid-cols-12">
        {/* The entrance front bleeds off the top; the Peacock Gate is tipped in over its corner. */}
        <div className="relative lg:order-2 lg:col-span-6 lg:col-start-7">
          <div
            data-reveal="picture"
            className="relative aspect-[4/5] overflow-hidden md:aspect-[4/3] lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-20 lg:aspect-auto"
          >
            <Image
              src={venue.tall.src}
              alt={venue.tall.alt}
              fill
              sizes="(min-width: 1024px) 47vw, 100vw"
              className="object-cover"
              style={{ objectPosition: venue.tall.focal }}
            />
            {/* Parakeets cross the patch of sky the toran leaves. */}
            <Birds className="absolute top-[11vw] left-[2%] hidden h-auto w-[38%] lg:block" />
          </div>
          <figure className="absolute right-3 -bottom-14 w-[38%] md:w-[30%] lg:right-auto lg:bottom-10 lg:-left-10 lg:w-1/3">
            <div data-reveal="picture" className="relative aspect-square overflow-hidden" style={at(3)}>
              <Image
                src={venue.square.src}
                alt={venue.square.alt}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 38vw"
                className="object-cover"
                style={{ objectPosition: venue.square.focal }}
              />
            </div>
            <figcaption className="t-small absolute right-full bottom-0 mr-3 w-[12rem] text-right md:w-[18rem] lg:right-auto lg:left-full lg:mr-0 lg:ml-4 lg:text-left">
              {venue.squareCaption}
            </figcaption>
          </figure>
          {/* A festival elephant on the palace lawn, its feet on the photograph's edge, facing into the page. */}
          <Elephant className="absolute -bottom-1 left-3 h-auto w-[42%] max-lg:-scale-x-100 md:w-[30%] lg:right-[4%] lg:bottom-[72px] lg:left-auto lg:w-[44%]" />
        </div>

        <div className="pt-36 pb-[var(--section)] md:max-w-[40rem] lg:order-1 lg:col-span-5 lg:pt-[var(--section)]">
          <h2 id="getting-there-title" data-reveal className="t-head">
            {venue.heading}
          </h2>
          <p data-reveal className="t-lead mt-6" style={at(1)}>
            {venue.lead}
          </p>

          <div data-reveal className="mt-10 flex flex-col gap-6" style={at(2)}>
            <address className="not-italic">
              <span className="t-lead block font-bold">{venue.name}</span>
              <span className="t-body mt-1 block">{venue.address}</span>
            </address>
            {venue.arrive.map((a) => (
              <div key={a.from}>
                <h3 className="t-lead">{a.from}</h3>
                <p className="t-body mt-1">{a.how}</p>
              </div>
            ))}
            <p className="t-body">{venue.driver}</p>
          </div>

          <div data-reveal className="mt-14 flex flex-col gap-2 lg:gap-5" style={at(3)}>
            {venue.questions.map(({ q, a }) => (
              <details key={q} className={s.q}>
                <summary className="t-lead font-medium">
                  {q}
                  <svg viewBox="0 0 16 10" aria-hidden className={s.chev}>
                    <path d="M1 1.5l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </summary>
                <p className={`${s.a} t-body max-w-[34em] pt-2 pb-3`}>{a}</p>
              </details>
            ))}
          </div>

          <div data-reveal className="mt-12 flex flex-col items-start gap-x-8 gap-y-5 sm:flex-row sm:items-center" style={at(4)}>
            <a className="button w-full sm:w-auto" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
              {venue.mapsLink}
            </a>
            <a className="link t-body" href="#rsvp">
              {ceremonies.afterLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
