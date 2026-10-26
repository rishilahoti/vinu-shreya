import type { CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "@/lib/content";
import Bell from "@/components/art/Bell";
import Toran from "@/components/art/Toran";
import Elephant from "@/components/art/Elephant";
import { LotusMark } from "@/components/art/Lotus";

const { invocation, blessing, groom, bride, intro } = wedding;
const { painting } = intro;

// Reveal stagger index (globals.css multiplies it by --stagger).
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** The second leaf of the kankotri: both families' invitation, the facts of the two days, and Rama and Sita's wedding. */
export default function Couple() {
  return (
    <section
      id="blessing"
      aria-labelledby="blessing-heading"
      className="relative mx-(--margin) bg-paper px-(--pad) pt-36 pb-[clamp(4.5rem,8vw,7.5rem)] text-ink [--pad:clamp(1.25rem,5vw,4.5rem)]"
    >
      {/* Temple bells hung from the leaf's top edge at both margins; the longer one fills the space above the heading on desktop. */}
      <Bell length={4} className="absolute top-0 left-(--pad) w-11 lg:hidden" />
      <Bell length={10} className="absolute top-0 left-(--pad) hidden w-20 lg:block" />
      <Bell length={2} phase={1.3} className="absolute top-0 right-(--pad) w-11 lg:w-16" />

      <div className="grid grid-cols-12 gap-x-(--gutter)">
        <h2 id="blessing-heading" className="t-head col-span-12 md:col-span-8 lg:col-span-7 lg:self-end">
          {intro.heading.map((line, n) => (
            <span key={line} data-reveal className="block" style={i(n)}>
              {line}
            </span>
          ))}
        </h2>

        <div className="col-span-12 mt-10 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-8 lg:mt-0 xl:col-span-4 xl:col-start-9">
          <p lang="sa" data-reveal className="t-lead font-medium" style={i(2)}>
            {invocation}
          </p>
          <p data-reveal className="t-body mt-4" style={i(3)}>
            {blessing}
          </p>
          <p data-reveal className="mt-7" style={i(4)}>
            <span className="t-lead block font-bold">{groom.fullName}</span>
            <span className="t-body block">
              {groom.relation} {groom.parents}
            </span>
          </p>
          <p data-reveal className="t-body my-3 flex items-center gap-3" style={i(5)}>
            <LotusMark className="w-9 shrink-0" />
            {intro.and}
          </p>
          <p data-reveal style={i(6)}>
            <span className="t-lead block font-bold">{bride.fullName}</span>
            <span className="t-body block">
              {bride.relation} {bride.parents}
            </span>
          </p>
        </div>
      </div>

      {/* The facts, set like the line of times on a printed programme. */}
      <ul className="mt-[clamp(4.5rem,8.5vw,7.5rem)] grid grid-cols-2 gap-x-(--gutter) gap-y-8 lg:flex lg:justify-between">
        {intro.facts.map(({ fact, note }, n) => (
          <li key={fact} data-reveal style={i(3 + n)}>
            <p className="t-lead font-bold text-balance">{fact}</p>
            <p className="t-small mt-1 text-muted">{note}</p>
          </li>
        ))}
      </ul>

      {/* The plate, and a festival elephant walking up to it on the same ground line. */}
      <figure className="mt-[clamp(4rem,7vw,6rem)] grid grid-cols-12 gap-x-(--gutter)">
        <Elephant
          flip
          data-reveal
          style={i(5)}
          className="col-span-8 col-start-3 mb-8 w-full md:col-span-5 md:col-start-1 md:row-start-1 md:mb-0 md:self-end"
        />
        <div className="relative col-span-12 md:col-span-7 md:col-start-6 md:row-start-1">
          <div data-reveal="picture" className="overflow-hidden" style={i(4)}>
            <Image
              src={painting.src}
              width={painting.width}
              height={painting.height}
              alt={painting.alt}
              sizes="(min-width: 768px) 54vw, 92vw"
              className="block h-auto w-full"
              style={{ objectPosition: painting.focal }}
            />
          </div>
          {/* A garland hung over the plate's top edge, like over a framed picture. */}
          <Toran swags={3} data-reveal style={i(7)} className="absolute -top-2 left-0 w-full" />
        </div>
        <figcaption className="t-small col-span-12 mt-3 text-muted md:col-span-7 md:col-start-6">
          {intro.caption}
        </figcaption>
      </figure>
    </section>
  );
}
