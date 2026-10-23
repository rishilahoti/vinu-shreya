"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check, Minus, Plus, WhatsappLogo } from "@phosphor-icons/react";
import { wedding } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { Diya } from "@/components/motifs";

const HEADING = "Will you join us?";
const HINDI = "आपकी प्रतीक्षा रहेगी";
const ATTEND = { yes: "Joyfully attending", no: "Regretfully declining" } as const;
type Attend = keyof typeof ATTEND;
const dayDate = (day: 1 | 2) => wedding.events.find((e) => e.day === day)?.date.split(", ").pop() ?? "";
const DAYS = [
  { id: 1, label: `Day one, ${dayDate(1)}` },
  { id: 2, label: `Day two, ${dayDate(2)}` },
];
const MAX_GUESTS = 10;
const EASE = [0.16, 1, 0.3, 1] as const;
const COUPLE = `${wedding.groom.name} and ${wedding.bride.name}`;

const HOVER = "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-ivory/10";
const LABEL = "block text-[0.95rem] font-medium text-ivory/85";
const INPUT =
  "mt-2 block w-full rounded-xl border bg-night-deep/70 px-4 text-base text-ivory placeholder:text-ivory/50 transition-colors duration-200 focus-visible:border-marigold";
const HELP = "mt-1.5 text-sm text-ivory/75";
const ERROR = "mt-1.5 text-sm font-medium text-[#f38bb0]";
const STEP = `grid size-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-[transform,background-color] duration-150 active:scale-[0.97] disabled:opacity-40 ${HOVER}`;

type Errors = { name?: string; days?: string };

export default function VenueRsvp() {
  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attend, setAttend] = useState<Attend>("yes");
  const [guests, setGuests] = useState(1);
  const [days, setDays] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);

  // The form changes height, which moves every ScrollTrigger below it. Re-measure once motion settles.
  const remeasure = () => window.setTimeout(() => ScrollTrigger.refresh(), 850);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    remeasure();
    const next: Errors = {
      name: name.trim() ? undefined : "Please tell us your name.",
      days: attend === "yes" && days.length === 0 ? "Please pick at least one day." : undefined,
    };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.days) return dayRef.current?.focus();

    const picked = DAYS.filter((d) => days.includes(d.id)).map((d) => d.label);
    const msg = [
      `Namaste! Here is my RSVP for ${COUPLE}'s wedding.`,
      `Name: ${name.trim()}`,
      phone.trim() && `Phone: ${phone.trim()}`,
      attend === "yes" ? `${ATTEND.yes}, ${guests === 1 ? "just me" : `${guests} of us`}` : ATTEND.no,
      attend === "yes" && `Days: ${picked.join(" and ")}`,
      note.trim() && `Note: ${note.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${wedding.rsvp.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  }

  const toggleDay = (day: number) => {
    setDays((d) => (d.includes(day) ? d.filter((x) => x !== day) : [...d, day]));
    setErrors((er) => ({ ...er, days: undefined }));
  };

  const ids = { name: `${uid}-name`, nameErr: `${uid}-name-err`, phone: `${uid}-phone`, phoneHelp: `${uid}-phone-help`, guests: `${uid}-guests`, daysErr: `${uid}-days-err`, note: `${uid}-note` };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative mx-auto w-full max-w-md rounded-t-[14rem] rounded-b-3xl border border-marigold/25 bg-night-deep/60 px-5 pb-8 pt-12 md:px-8 md:pb-10">
        <div className="text-center">
          <Diya className="mx-auto w-11" />
          <h3 className="mt-3 font-display text-[2rem] leading-tight md:text-[2.5rem]">{HEADING}</h3>
          <p lang="hi" className="mt-1 text-marigold">
            {HINDI}
          </p>
          <p className="mt-3 text-sm text-ivory/75">Kindly reply by {wedding.rsvp.deadline}</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {sentUrl ? (
            <Success
              key="sent"
              url={sentUrl}
              name={name.trim().split(/\s+/)[0]}
              attending={attend === "yes"}
              onEdit={() => {
                setEdited(true);
                setSentUrl(null);
                remeasure();
              }}
            />
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={submit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-8 text-left"
            >
              <div>
                <label htmlFor={ids.name} className={LABEL}>
                  Your name
                </label>
                <input
                  ref={nameRef}
                  id={ids.name}
                  name="name"
                  autoComplete="name"
                  autoFocus={edited}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? ids.nameErr : undefined}
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                  }}
                  className={`${INPUT} h-12 ${errors.name ? "border-rani" : "border-ivory/20"}`}
                />
                {errors.name && (
                  <p id={ids.nameErr} className={ERROR}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor={ids.phone} className={LABEL}>
                  Phone <span className="font-normal text-ivory/75">(optional)</span>
                </label>
                <input
                  id={ids.phone}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby={ids.phoneHelp}
                  placeholder="+91"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${INPUT} h-12 border-ivory/20`}
                />
                <p id={ids.phoneHelp} className={HELP}>
                  Only if we need to reach you about travel or stay.
                </p>
              </div>

              <fieldset className="mt-6">
                <legend className={LABEL}>Will you be there?</legend>
                <div className="mt-2 grid grid-cols-2 rounded-full border border-ivory/20 bg-night-deep/70 p-1">
                  {(Object.keys(ATTEND) as Attend[]).map((v) => (
                    <label
                      key={v}
                      className={`relative flex min-h-12 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-[0.95rem] font-medium leading-tight transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marigold ${
                        attend === v ? "text-night-deep" : "text-ivory/85"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attend"
                        value={v}
                        checked={attend === v}
                        onChange={() => {
                          setAttend(v);
                          remeasure();
                        }}
                        className="sr-only"
                      />
                      {attend === v && (
                        <motion.span
                          layoutId={`${uid}-attend`}
                          className="absolute inset-0 rounded-full bg-marigold"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative">{ATTEND[v]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {attend === "yes" && (
                  <motion.div
                    key="attending"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="-mx-2 overflow-hidden px-2"
                  >
                    <div className="pb-1 pt-6">
                      <p id={ids.guests} className={LABEL}>
                        How many of you?
                      </p>
                      <div role="group" aria-labelledby={ids.guests} className="mt-2 flex items-center gap-4">
                        <button
                          type="button"
                          aria-label="One guest fewer"
                          disabled={guests <= 1}
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className={STEP}
                        >
                          <Minus weight="duotone" aria-hidden className="size-5" />
                        </button>
                        <output aria-labelledby={ids.guests} className="w-8 text-center font-display text-3xl">
                          {guests}
                        </output>
                        <button
                          type="button"
                          aria-label="One guest more"
                          disabled={guests >= MAX_GUESTS}
                          onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                          className={STEP}
                        >
                          <Plus weight="duotone" aria-hidden className="size-5" />
                        </button>
                        <span className="text-sm text-ivory/75">Including you</span>
                      </div>

                      <fieldset className="mt-6">
                        <legend className={LABEL}>Which days?</legend>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {DAYS.map((d, i) => {
                            const on = days.includes(d.id);
                            return (
                              <label
                                key={d.id}
                                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.95rem] transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marigold ${HOVER} ${
                                  on ? "border-rani bg-rani/20 text-ivory" : errors.days ? "border-rani/70 text-ivory/85" : "border-ivory/25 text-ivory/85"
                                }`}
                              >
                                <input
                                  ref={i === 0 ? dayRef : undefined}
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggleDay(d.id)}
                                  aria-invalid={!!errors.days}
                                  aria-describedby={errors.days ? ids.daysErr : undefined}
                                  className="sr-only"
                                />
                                <Check
                                  weight="duotone"
                                  aria-hidden
                                  className={`size-4 text-marigold transition-[opacity,transform] duration-200 ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                                />
                                {d.label}
                              </label>
                            );
                          })}
                        </div>
                        {errors.days && (
                          <p id={ids.daysErr} className={ERROR}>
                            {errors.days}
                          </p>
                        )}
                      </fieldset>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6">
                <label htmlFor={ids.note} className={LABEL}>
                  A note for the couple <span className="font-normal text-ivory/75">(optional)</span>
                </label>
                <textarea
                  id={ids.note}
                  name="note"
                  rows={3}
                  placeholder="A blessing, a song request, or just hello"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${INPUT} resize-y border-ivory/20 py-3`}
                />
              </div>

              <button
                type="submit"
                className="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-marigold font-semibold text-night-deep transition-[transform,background-color] duration-150 active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#f7c65c]"
              >
                Send RSVP
                <WhatsappLogo weight="duotone" aria-hidden className="size-6" />
              </button>
              <p className="mt-3 text-center text-sm text-ivory/75">This opens WhatsApp with your reply ready to send.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function Success({ url, name, attending, onEdit }: { url: string; name: string; attending: boolean; onEdit: () => void }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const thanks = attending
    ? `We can't wait to celebrate with you, ${name}.`
    : `We will miss you, ${name}. Thank you for letting us know.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mt-8 flex flex-col items-center text-center"
    >
      <svg viewBox="0 0 64 64" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-20 text-marigold">
        <motion.circle cx="32" cy="32" r="29" strokeOpacity={0.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
        <motion.path d="M20 33l8 8 16-18" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.5, ease: EASE }} />
      </svg>
      <p ref={ref} tabIndex={-1} className="mt-5 font-display text-2xl leading-snug">
        Opening WhatsApp to send your reply.
      </p>
      <p className="mt-2 text-ivory/75">{thanks}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm text-marigold underline underline-offset-4">
        If WhatsApp did not open, tap here.
      </a>
      <button
        type="button"
        onClick={onEdit}
        className={`mt-4 inline-flex h-12 items-center rounded-full border border-ivory/30 px-6 font-medium text-ivory transition-[transform,background-color] duration-150 active:scale-[0.97] ${HOVER}`}
      >
        Edit reply
      </button>
    </motion.div>
  );
}
