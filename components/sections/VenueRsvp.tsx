"use client";

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Check, Minus, Plus } from "@phosphor-icons/react";
import { wedding, type WeddingEvent } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import Peacock from "@/components/art/Peacock";
import Kite from "@/components/art/Kite";

const R = wedding.rsvp;
const L = R.labels;
const EVENTS: WeddingEvent[] = wedding.events;
const MAX_GUESTS = 10;
const EASE = [0.23, 1, 0.32, 1] as const;
// Without script the coupon is still a way to reply: a plain prefilled WhatsApp link.
const FALLBACK = `https://wa.me/${R.whatsapp}?text=${encodeURIComponent(R.fallbackText)}`;
type Attend = keyof typeof R.attend;
type Errors = { name?: string; ceremonies?: string };

// Fields are filled blocks in a lighter tone of the coupon; a ticked one turns to ink, like a stamped box.
const LABEL = "t-small mb-2 block font-medium";
const BLOCK = "bg-paper/70";
const PRESS = "transition-[scale,background-color,color] duration-[160ms] ease-out active:scale-[0.97]";
const HOVER = "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-paper";
const tone = (on: boolean) => (on ? "bg-ink text-paper" : `${BLOCK} ${HOVER}`);
const FIELD = `${BLOCK} block w-full px-4 placeholder:text-muted aria-invalid:outline-2 aria-invalid:-outline-offset-2 aria-invalid:outline-ink`;
const ERROR = "t-small mt-2 inline-block bg-ink px-2 py-0.5 font-medium text-paper";
const NOTCH = "absolute size-7 -translate-x-1/2 -translate-y-1/2 bg-ground [clip-path:circle(50%)]";
const reveal = (i: number) => ({ "data-reveal": "", style: { "--i": i } as CSSProperties });

/** The WhatsApp message, worded as in .taste-skill/copy.md §5. */
function message(name: string, attend: Attend, guests: number, chosen: WeddingEvent[], note: string) {
  const yes = attend === "yes";
  return [
    `Namaste ${wedding.groom.name} & ${wedding.bride.name}! This is ${name}.`,
    ...(yes
      ? [
          `${R.attend.yes}, ${guests === 1 ? "just me" : `${guests} of us`}.`,
          guests === 1 ? "I’ll be at:" : "We’ll be at:",
          ...chosen.map((e) => `- ${e.name}, ${e.date}, ${e.time}`),
        ]
      : [`${R.attend.no}, with all our love and blessings.`]),
    note && `Note: ${note}`,
    yes ? "See you at Rambagh!" : "Sending our love from here.",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function VenueRsvp() {
  const uid = useId().replace(/[^\w-]/g, "");
  // MotionConfig reducedMotion="user" stops transforms, not height: the guests block must not slide under reduced motion.
  const reduce = useReducedMotion();
  const id = (k: string) => `${uid}-${k}`;
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const firstEvent = useRef<HTMLButtonElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const [name, setName] = useState("");
  const [attend, setAttend] = useState<Attend>("yes");
  const [guests, setGuests] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const yes = attend === "yes";
  const chosen = EVENTS.filter((e) => picked.includes(e.id));
  const all = picked.length === EVENTS.length;

  const tick = (next: (p: string[]) => string[]) => {
    setPicked(next);
    setErrors((er) => ({ ...er, ceremonies: undefined }));
  };

  // The coupon changes height as it is filled in, which moves every ScrollTrigger below it. Re-measure once it settles.
  useEffect(() => {
    let t = 0;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) return void (first = false);
      window.clearTimeout(t);
      // Safe refresh: waits for any smooth scroll in flight (a "Count me in" glide to #rsvp) instead of cutting it short.
      t = window.setTimeout(() => ScrollTrigger.refresh(true), 300);
    });
    if (section.current) ro.observe(section.current);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // "Count me in" on a ceremony card ticks it here; its own #rsvp jump does the scrolling.
  useEffect(() => {
    const onTick = (ev: Event) => {
      const tid = (ev as CustomEvent<string>).detail;
      if (!EVENTS.some((e) => e.id === tid)) return;
      setAttend("yes");
      setSent(false);
      setPicked((p) => (p.includes(tid) ? p : [...p, tid]));
      setErrors((er) => ({ ...er, ceremonies: undefined }));
      requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    };
    window.addEventListener("rsvp:tick", onTick);
    return () => window.removeEventListener("rsvp:tick", onTick);
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      name: name.trim() ? undefined : R.errors.name,
      ceremonies: yes && picked.length === 0 ? R.errors.ceremonies : undefined,
    };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.ceremonies) return firstEvent.current?.focus();

    const text = message(name.trim(), attend, guests, chosen, note.trim());
    window.open(`https://wa.me/${R.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    flushSync(() => setSent(true));
    sentRef.current?.focus();
  }

  function change() {
    flushSync(() => setSent(false));
    nameRef.current?.focus();
  }

  const cerErr = errors.ceremonies ? id("cer-err") : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <section ref={section} id="rsvp" aria-labelledby={id("h")} className="page-x bg-ground py-[var(--section)] text-ink">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)]">
          <div className="relative col-span-12 xl:col-start-2 xl:col-end-12">
            {/* A patang over the coupon's far corner, its string running down behind the card. */}
            <div {...reveal(3)} className="absolute bottom-[calc(100%-1.5rem)] right-1 w-[clamp(3.5rem,7vw,6.5rem)] lg:-right-[3%]">
              <Kite body="#1F5E8A" top="#E8B83A" className="block w-full" />
            </div>

            <form
              noValidate
              onSubmit={submit}
              {...reveal(0)}
              className="relative z-10 grid grid-cols-1 bg-accent px-5 py-8 text-accent-ink sm:px-8 lg:grid-cols-[46%_0_54%] lg:grid-rows-[auto_1fr_auto] lg:px-0 lg:py-12"
            >
              {/* The stub: heading at the top, the guest's own programme in the middle, the sentence at the foot. */}
              <h2 ref={heading} id={id("h")} tabIndex={-1} className="t-head outline-none! lg:col-start-1 lg:row-start-1 lg:px-12">
                {R.heading.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && " "}
                    <span className="block whitespace-nowrap sm:inline lg:block">{line}</span>
                  </Fragment>
                ))}
              </h2>
              <p className="t-body mt-4 lg:col-start-1 lg:row-start-3 lg:mt-8 lg:self-end lg:px-12">{R.sentence}</p>

              {/* Perforation: round dots in the ground colour between two semicircular notches. Vertical at 46% on desktop, across on a phone. */}
              <div aria-hidden className="relative -mx-5 my-8 h-[5px] sm:-mx-8 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mx-0 lg:-my-12 lg:h-auto">
                <span className="absolute inset-x-5 top-0 h-[5px] lg:inset-x-auto lg:inset-y-5 lg:-left-[2.5px] lg:h-auto lg:w-[5px]">
                  <svg className="block size-full">
                    <defs>
                      <pattern id={id("dots")} width="11" height="11" patternUnits="userSpaceOnUse">
                        <circle cx="2.5" cy="2.5" r="2.5" fill="var(--color-ground)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${id("dots")})`} />
                  </svg>
                </span>
                <span className={`${NOTCH} left-0 top-1/2 lg:left-1/2 lg:top-0`} />
                <span className={`${NOTCH} left-full top-1/2 lg:left-1/2 lg:top-full`} />
              </div>

              {/* The part that is sent. Locked once sent, until "Change my reply". */}
              <fieldset disabled={sent} className="min-w-0 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:px-12">
                <div>
                  <label htmlFor={id("name")} className={LABEL}>
                    {L.name}
                  </label>
                  <input
                    ref={nameRef}
                    id={id("name")}
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? id("name-err") : undefined}
                    placeholder={L.namePlaceholder}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                    }}
                    className={`${FIELD} h-[54px] lg:h-[52px]`}
                  />
                  {errors.name && (
                    <p id={id("name-err")} className={ERROR}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <fieldset className="mt-6 min-w-0">
                  <legend className={LABEL}>{L.attend}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(R.attend) as Attend[]).map((v) => (
                      <label
                        key={v}
                        className={`relative flex h-[54px] cursor-pointer items-center justify-center px-3 text-center leading-tight [transition:scale_160ms_var(--ease-out),color_350ms_var(--ease-out),background-color_200ms_ease] active:scale-[0.97] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-ink lg:h-[52px] ${BLOCK} ${attend === v ? "text-paper" : HOVER}`}
                      >
                        <input type="radio" name="attend" value={v} checked={attend === v} onChange={() => setAttend(v)} className="sr-only" />
                        {attend === v && (
                          <motion.span layoutId={id("attend")} className="absolute inset-0 bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.35 }} />
                        )}
                        <span className="relative">{R.attend[v]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {yes && (
                    <motion.div
                      key="coming"
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0, transition: { duration: 0.12 } } : { height: 0, opacity: 0, transition: { duration: 0.2, ease: EASE } }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="-mx-2 overflow-hidden px-2 pb-2"
                    >
                      <div className="pt-6">
                        <p id={id("guests")} className={LABEL}>
                          {L.guests}
                        </p>
                        <div role="group" aria-labelledby={id("guests")} className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={L.fewer}
                            disabled={guests <= 1}
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                            className={`grid size-[54px] place-items-center lg:size-[52px] disabled:opacity-40 ${PRESS} ${tone(false)}`}
                          >
                            <Minus aria-hidden weight="bold" className="size-5" />
                          </button>
                          <output aria-live="polite" className="t-body min-w-[7.5rem] text-center font-medium">
                            {R.guestsValue(guests)}
                          </output>
                          <button
                            type="button"
                            aria-label={L.more}
                            disabled={guests >= MAX_GUESTS}
                            onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                            className={`grid size-[54px] place-items-center lg:size-[52px] disabled:opacity-40 ${PRESS} ${tone(false)}`}
                          >
                            <Plus aria-hidden weight="bold" className="size-5" />
                          </button>
                        </div>
                      </div>

                      <div role="group" aria-labelledby={id("cer")} aria-describedby={cerErr} className="mt-6">
                        <div className="mb-2 flex items-end justify-between gap-4">
                          <p id={id("cer")} className="t-small font-medium">
                            {L.ceremonies}
                          </p>
                          <button
                            type="button"
                            aria-pressed={all}
                            onClick={() => tick(() => (all ? [] : EVENTS.map((e) => e.id)))}
                            className={`t-small inline-flex h-11 items-center gap-1.5 px-4 font-medium ${PRESS} ${tone(all)}`}
                          >
                            {all && <Check aria-hidden weight="bold" className="size-4" />}
                            {L.all}
                          </button>
                        </div>
                        {/* One column per day on a phone and on desktop, one row per day on a tablet. */}
                        <div className="grid grid-flow-col grid-cols-2 grid-rows-3 gap-2 sm:grid-flow-row sm:grid-cols-3 sm:grid-rows-2 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-3">
                          {EVENTS.map((e, i) => {
                            const on = picked.includes(e.id);
                            return (
                              <button
                                key={e.id}
                                ref={i === 0 ? firstEvent : undefined}
                                type="button"
                                aria-pressed={on}
                                aria-describedby={cerErr}
                                onClick={() => tick((p) => (on ? p.filter((x) => x !== e.id) : [...p, e.id]))}
                                className={`relative flex min-h-14 flex-col items-start justify-center py-2 pl-3 pr-8 text-left ${PRESS} ${tone(on)}`}
                              >
                                <span className="t-body font-medium leading-tight">{e.name}</span>
                                <span className="t-small">
                                  {e.date.split(",")[0]} {e.time}
                                </span>
                                {on && <Check aria-hidden weight="bold" className="absolute right-2.5 top-2.5 size-4" />}
                              </button>
                            );
                          })}
                        </div>
                        {errors.ceremonies && (
                          <p id={cerErr} className={ERROR}>
                            {errors.ceremonies}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4">
                  <label htmlFor={id("note")} className={LABEL}>
                    {L.note}
                  </label>
                  <textarea
                    id={id("note")}
                    name="note"
                    rows={2}
                    placeholder={L.notePlaceholder}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${FIELD} resize-y py-3`}
                  />
                </div>
              </fieldset>

              {/* The live programme: the guest's own two days, composed as they tick. */}
              <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:px-12">
                <h3 className="t-lead">{R.programme.heading}</h3>
                <div className="relative">
                  <AnimatePresence initial={false} mode="popLayout">
                    {(!yes || chosen.length === 0) && (
                      <motion.p
                        key={yes ? "empty" : "declining"}
                        className="t-body mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.24 } }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      >
                        {yes ? R.programme.empty : R.programme.declining}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <ul className="relative">
                    <AnimatePresence initial={false} mode="popLayout">
                      {yes &&
                        chosen.map((e) => (
                          <motion.li
                            key={e.id}
                            layout
                            className="mt-4"
                            initial={{ opacity: 0, transform: "translateY(10px)" }}
                            animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.26, ease: EASE } }}
                            exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.16, ease: EASE } }}
                            transition={{ layout: { duration: 0.26, ease: EASE } }}
                          >
                            <p className="t-small font-medium">
                              {e.date}, {e.time}
                            </p>
                            <p className="t-body font-medium leading-snug">
                              {e.name}, {e.place}
                            </p>
                            <p className="t-small">{e.wear}</p>
                          </motion.li>
                        ))}
                    </AnimatePresence>
                  </ul>
                </div>
              </div>

              <div className="relative mt-8 lg:col-start-3 lg:row-start-3 lg:px-12">
                <AnimatePresence initial={false} mode="popLayout">
                  {sent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, transform: "translateY(8px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.28, ease: EASE } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <p ref={sentRef} tabIndex={-1} className="t-body font-medium">
                        {R.sent}
                      </p>
                      <button type="button" onClick={change} className="link t-body mt-1 inline-flex min-h-11 items-center font-medium">
                        {R.change}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <button
                        type="submit"
                        className={`hidden h-[54px] w-full items-center justify-center bg-ink px-6 font-medium text-paper lg:h-14 [.js_&]:flex [@media(hover:hover)_and_(pointer:fine)]:hover:bg-field-2 ${PRESS}`}
                      >
                        {R.submit}
                      </button>
                      <noscript>
                        <a href={FALLBACK} className="flex h-[54px] w-full items-center justify-center bg-ink px-6 font-medium text-paper lg:h-14">
                          {R.submit}
                        </a>
                      </noscript>
                      <p className="t-small mt-3">{R.submitNote}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* A Rambagh lawn peacock walking along the coupon's top edge, feet on the card. */}
            <div {...reveal(2)} className="absolute bottom-full left-[5%] z-20 w-[clamp(10rem,18vw,16.5rem)]">
              <Peacock flip className="block w-full" />
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
