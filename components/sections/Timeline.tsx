"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { wedding } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { DiyaRow } from "@/components/art/Diya";
import Petals from "@/components/art/Petals";
import Peacock from "@/components/art/Peacock";
import Dhol from "@/components/art/Dhol";
import Mare from "@/components/art/Mare";
import Lotus from "@/components/art/Lotus";
import Toran from "@/components/art/Toran";
import SacredFire from "@/components/art/SacredFire";
import s from "./Timeline.module.css";

const { ceremonies, events } = wedding;
const TONES = ["bg-paper", "bg-paper-2", "bg-[#e2d7c8]"];
const DECK = `(min-width: 1024px) and (min-height: 680px) and ${MOTION_OK}`;
const DAY_GAP = 16; // ground showing between Tuesday's leaves and Wednesday's
const FIT = "xMinYMax meet"; // drawings stand on the leaf's foot line
const fit = "h-full w-auto max-w-full";
const i = (n: number) => ({ "--i": n }) as CSSProperties;

// Each leaf's printed drawing, standing at its foot.
const ART: Record<string, ReactNode> = {
  haldi: <DiyaRow count={3} preserveAspectRatio={FIT} className="h-auto w-full max-w-72" />,
  mehendi: <Peacock preserveAspectRatio={FIT} className={fit} />,
  sangeet: <Dhol preserveAspectRatio={FIT} className={fit} />,
  baraat: (
    <>
      <Mare preserveAspectRatio={FIT} className={fit} />
      <Dhol preserveAspectRatio={FIT} className="h-1/2 w-auto max-w-full" />
    </>
  ),
  varmala: <Lotus preserveAspectRatio={FIT} className={fit} />,
  pheras: <SacredFire preserveAspectRatio={FIT} className={fit} />,
};

/** The ceremonies leaf: six cards; on a wide screen a pinned deck whose earlier cards fold into spines. */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const go = useRef<((n: number, smooth?: boolean) => void) | null>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(DECK, () => {
        const sec = root.current;
        const band = list.current;
        if (!sec || !band || !wrap.current) return;
        const items = Array.from(band.children) as HTMLElement[];
        const last = items.length - 1;
        let S = 0;
        let C = 0;
        let active = -1;

        // Spines take a fixed width; the open card gets the rest, so the last step fills the band exactly.
        const layout = () => {
          S = Math.round(gsap.utils.clamp(72, 120, innerWidth * 0.084));
          C = Math.min(880, band.clientWidth - last * S - DAY_GAP);
          band.style.setProperty("--spine", `${S}px`);
          band.style.setProperty("--card", `${C}px`);
        };
        const off = (n: number) => (events[n].day === 2 ? DAY_GAP : 0);
        const show = (progress: number) => {
          const a = Math.round(progress * last);
          if (a === active) return;
          active = a;
          sec.dataset.day = String(events[a].day);
          items.forEach((el, n) => {
            el.dataset.state = n < a ? "spine" : n === a ? "open" : n === a + 1 ? "next" : "later";
            el.querySelector("button")!.hidden = n >= a;
          });
        };

        sec.classList.add(s.deck);
        layout();
        // Card n travels from its place in the row to its spine slot, arriving at step n.
        const tl = gsap.timeline({ defaults: { ease: "none" } });
        items.forEach((el, n) => {
          if (n) tl.fromTo(el, { x: () => n * C + off(n) }, { x: () => n * S + off(n), duration: n }, 0);
          // A leaf's print fades in step with the scroll, before the next leaf's edge reaches its text
          // (autoAlpha also hides it, so covered text is never left readable underneath).
          if (n < last) tl.to(el.querySelectorAll(":scope > article > *"), { autoAlpha: 0, duration: 0.25 }, n + 0.3);
          // Leaves waiting off to the right are already printed; reveal-on-scroll would only see them arrive late.
          el.querySelectorAll("[data-reveal]").forEach((r) => r.classList.add("is-in"));
        });
        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          animation: tl,
          scrub: true,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.5 }, delay: 0.1, ease: "power1.inOut" },
          onUpdate: (self) => show(self.progress),
          onRefresh: (self) => show(self.progress),
        });
        ScrollTrigger.addEventListener("refreshInit", layout);
        go.current = (n, smooth = true) =>
          window.scrollTo({ top: st.start + ((st.end - st.start) * n) / last, behavior: smooth ? "smooth" : "instant" });
        show(st.progress);
        ScrollTrigger.refresh(); // the 300svh runway moved every trigger below it

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", layout);
          go.current = null;
          sec.classList.remove(s.deck);
          delete sec.dataset.day;
          band.style.removeProperty("--spine");
          band.style.removeProperty("--card");
          items.forEach((el) => {
            delete el.dataset.state;
            el.querySelector("button")!.hidden = true;
          });
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ceremonies" aria-labelledby="ceremonies-title" className="relative overflow-x-clip pt-(--section)">
      {/* The heading scrolls on; only the deck pins, so no title is held on screen for three screens. */}
      <h2 id="ceremonies-title" className="t-head page-x">
        {ceremonies.heading.map((line, n) => (
          <span key={line} data-reveal className="block" style={i(n)}>
            {line}
          </span>
        ))}
      </h2>
      <div ref={wrap} className={s.wrap}>
        <div className={`${s.stage} page-x`}>
          <div aria-hidden className={s.dusk} />
          <ol ref={list} className={`${s.band} mt-10 flex flex-col gap-3 lg:mt-0`}>
            {events.map((ev, n) => (
              <li
                key={ev.id}
                className={`${s.item} ${n && ev.day !== events[n - 1].day ? "mt-9" : ""}`}
                // Tabbing into a card that sits under the deck brings it forward.
                onFocus={(e) => e.target.tagName !== "BUTTON" && go.current?.(n, false)}
              >
                <button
                  type="button"
                  hidden
                  aria-label={ev.name}
                  className={s.spine}
                  onClick={(e) => {
                    go.current?.(n);
                    (e.currentTarget.nextElementSibling as HTMLElement).focus({ preventScroll: true });
                  }}
                >
                  {/* Printed up the spine like a book's title, so a folded leaf still names itself in full. */}
                  <span aria-hidden className={`${s.spineLabel} t-body font-bold`}>
                    {ev.name}
                  </span>
                </button>
                <article
                  aria-labelledby={`${ev.id}-title`}
                  tabIndex={-1}
                  data-reveal
                  className={`${TONES[n % 3]} grid p-5 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-8 lg:gap-y-6`}
                >
                  <div className="relative min-h-0 lg:col-start-2 lg:row-start-1">
                    <div data-reveal="picture" className={`${s.pic} relative aspect-[4/3] overflow-hidden`}>
                      <Image
                        src={ev.painting.src}
                        alt={ev.painting.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: ev.painting.focal }}
                      />
                      {ev.id === "haldi" && <Petals count={12} colors={["#E8B83A", "#E39B2D"]} seed={202} />}
                    </div>
                    {/* The varmala painting is the doorway, with its toran over it. */}
                    {ev.id === "varmala" && <Toran swags={2} className="absolute inset-x-0 -top-3 w-full" />}
                  </div>

                  <div className="mt-6 min-h-0 lg:col-start-1 lg:row-start-1 lg:mt-0">
                    <h3 id={`${ev.id}-title`} className="t-lead font-bold">
                      {ev.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    <p lang="hi" className="t-lead mt-1">
                      {ev.hindi}
                    </p>
                    <p className="t-body mt-3 font-medium">{ev.place}</p>
                    <p className="t-body mt-4">{ev.about}</p>
                    <p className="t-body mt-3">
                      <span className="font-bold">{ceremonies.wearLabel}</span> {ev.wear}
                    </p>
                  </div>

                  <div className="mt-6 flex items-baseline justify-between gap-4 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-end">
                    <p className="t-body">
                      <span className="font-bold">{ev.date}</span> {ev.time}
                    </p>
                    <a
                      href="#rsvp"
                      data-tick={ev.id}
                      aria-describedby={`${ev.id}-title`}
                      className={`link t-body font-medium ${s.press}`}
                      onClick={() => window.dispatchEvent(new CustomEvent("rsvp:tick", { detail: ev.id }))}
                    >
                      {ceremonies.link}
                    </a>
                  </div>

                  <div className="mt-4 flex h-32 items-end justify-end gap-2 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:h-[clamp(7rem,16svh,9.5rem)] lg:justify-start">
                    {ART[ev.id]}
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <p data-reveal className="t-body mt-12">
            {ceremonies.after}{" "}
            <a href="#rsvp" className={`link ${s.press}`}>
              {ceremonies.afterLink}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
