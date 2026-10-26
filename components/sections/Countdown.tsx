"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/content";
import Bell from "@/components/art/Bell";
import { KiteSky } from "@/components/art/Kite";
import { DiyaRow } from "@/components/art/Diya";
import s from "./Countdown.module.css";

const c = wedding.countdown;
const TARGET = Date.parse(wedding.startsAt);
const SLUG = `${wedding.groom.name}-${wedding.bride.name}-wedding`.toLowerCase();

// Temple bells hung from the field's top edge: chain links, width in px, swing phase in s.
const BELLS = [
  [7, 54, 0],
  [12, 68, 1.3],
  [4, 44, 0.5],
  [9, 60, 2.1],
  [5, 48, 0.9],
] as const;

// RFC 5545 text values: escape \ , ; and newlines; fold lines at 75 octets.
const esc = (t: string) => t.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
function fold(line: string) {
  const enc = new TextEncoder();
  let out = "";
  let n = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (n + b > 75) {
      out += "\r\n ";
      n = 1;
    }
    out += ch;
    n += b;
  }
  return out;
}
const ymd = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");

function addToCalendar() {
  const start = new Date(wedding.startsAt.slice(0, 10)); // date-only string: UTC midnight, no timezone drift
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 2); // all-day DTEND is exclusive: the day after the second day
  const ics =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${SLUG}//EN`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${ymd(start)}-${SLUG}@${location.hostname}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d+/g, "")}`,
      `DTSTART;VALUE=DATE:${ymd(start)}`,
      `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${esc(c.calendar.title)}`,
      `LOCATION:${esc(`${wedding.venue.name}, ${wedding.venue.address}`)}`,
      `DESCRIPTION:${esc(c.calendar.description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  Object.assign(document.createElement("a"), { href: url, download: `${SLUG}.ics` }).click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000); // Safari reads the blob after click() returns
}

export default function Countdown() {
  return (
    <section id="dates" aria-labelledby="dates-heading" className="on-field relative overflow-hidden bg-field text-field-ink">
      <div className="page-x grid gap-x-(--gutter) lg:min-h-[80svh] lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-4 lg:justify-between">
          <div aria-hidden className="flex items-start justify-between">
            {BELLS.map(([length, w, phase]) => (
              <Bell key={phase} length={length} phase={phase} className="block shrink-0" style={{ width: w }} />
            ))}
          </div>
          <div className="pt-10 lg:pt-12">
            <p data-reveal className="t-lead max-w-[34ch]">
              {c.paragraph}
            </p>
            {/* A row of lamps on the field's floor, in the 64px under the paragraph. */}
            <DiyaRow count={6} className="mt-2 block h-14 w-auto" />
          </div>
        </div>

        <div className="relative mt-[calc(34vw-1rem)] -mb-10 lg:col-span-7 lg:col-start-6 lg:mt-0 lg:-mb-[60px] lg:self-end">
          {/* Kites flown from behind the card: their strings run down behind it and off the field's edge. */}
          <KiteSky className="absolute right-[calc(var(--margin)*-1)] bottom-[calc(100%-40px)] block w-[calc(100%+var(--margin))]" />
          <div
            data-reveal
            className={`${s.card} relative mx-auto flex aspect-[7/5] w-[90vw] flex-col items-center justify-center bg-paper px-6 pt-8 pb-[calc(2rem+40px)] text-center text-ink md:p-12 md:pb-[calc(3rem+40px)] lg:w-[max(44vw,30rem)] lg:px-8 lg:pb-[calc(3rem+60px)] xl:px-12`}
          >
            <h2 id="dates-heading" className="t-head">
              {c.heading}
            </h2>
            <p className="t-body mt-3">{c.line}</p>
            <Clock />
            <button
              type="button"
              onClick={addToCalendar}
              className={`${s.bar} t-body mt-8 flex h-13 w-full items-center justify-center bg-ink font-medium text-paper lg:mt-10 lg:h-14`}
            >
              {c.button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Only this ticks; the section around it renders once.
function Clock() {
  // null until mounted: server and first client render agree on the placeholder.
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.ceil((TARGET - Date.now()) / 1000));
      setLeft(secs); // same value: React skips the render
      if (!secs) window.clearInterval(id);
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, []);

  const parts = left === null ? null : [Math.floor(left / 86400), Math.floor(left / 3600) % 24, Math.floor(left / 60) % 60, left % 60];
  const say = (n: number, i: number) => `${n} ${c.units[i][n === 1 ? 0 : 1]}`;
  // Days, hours and minutes only, so the live region changes once a minute.
  const summary = left === 0 ? c.begun : parts ? parts.slice(0, 3).map(say).join(", ") : "";

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
      {left === 0 ? (
        <p aria-hidden className="t-lead mt-8 lg:mt-10">
          {c.begun}
        </p>
      ) : (
        <div aria-hidden className="mt-8 flex w-full justify-between lg:mt-10">
          {c.units.map((unit, i) => {
            const n = parts?.[i];
            const shown = n === undefined ? "––" : String(n).padStart(2, "0"); // taste-skill-ignore: a clock face, not numbering
            return (
              <div key={unit[1]} className="flex flex-col items-center">
                <span className={`${s.digits} t-head font-display font-bold`}>
                  {/* Keyed from the right, so the units column survives 100 → 99. */}
                  {[...shown].map((d, j) => (
                    <Digit key={shown.length - j} d={d} />
                  ))}
                </span>
                <span className="t-small mt-1 text-muted">{unit[n === 1 ? 0 : 1]}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// One digit column: on change the old digit rolls out upwards and the new one in from below.
function Digit({ d }: { d: string }) {
  const [[cur, old], set] = useState([d, d]);
  if (d !== cur) set([d, cur]);
  const moved = old !== cur;
  return (
    <span className={s.slot}>
      {moved && (
        <span key={old + cur} className={s.out}>
          {old}
        </span>
      )}
      <span key={cur} className={moved ? s.in : undefined}>
        {cur}
      </span>
    </span>
  );
}
