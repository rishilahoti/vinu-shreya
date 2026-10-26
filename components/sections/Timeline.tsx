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
// Phones and tablets: the same deck stood upright. Leaves rise from the bottom and stack at the top.
const PILE = `(max-width: 1023.98px) and (min-height: 560px) and ${MOTION_OK}`;
const PEEK = 28; // the strip of a stacked leaf left in view, printed with its name
const DEPTH = 2; // stacked leaves left in view; deeper ones fade away so the open leaf keeps the screen
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

/** The ceremonies leaf: six cards; a pinned deck whose earlier cards fold into spines on a wide screen and stack up on a phone. */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const go = useRef<((n: number, smooth?: boolean) => void) | null>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add({ deck: DECK, pile: PILE }, (ctx) => {
        const pile = Boolean(ctx.conditions?.pile);
        const sec = root.current;
        const band = list.current;
        if (!sec || !band || !wrap.current) return;
        const items = Array.from(band.children) as HTMLElement[];
        const prints = items.map((el) => el.querySelectorAll<HTMLElement>(":scope > article > *"));
        const last = items.length - 1;
        let active = -1;

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
        // Leaves waiting off stage are already printed; reveal-on-scroll would only see them arrive late.
        items.forEach((el) => el.querySelectorAll("[data-reveal]").forEach((r) => r.classList.add("is-in")));
        sec.classList.add(pile ? s.pile : s.deck);

        let layout: () => void;
        let redraw = () => {};
        // State follows the cards as drawn (the scrub lags the scroll), so a spine is named only once it has folded.
        const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: () => show(tl.progress()) });

        if (!pile) {
          let S = 0;
          let C = 0;
          // Spines take a fixed width; the open card gets the rest, so the last step fills the band exactly.
          layout = () => {
            S = Math.round(gsap.utils.clamp(72, 120, innerWidth * 0.084));
            C = Math.min(880, band.clientWidth - last * S - DAY_GAP);
            band.style.setProperty("--spine", `${S}px`);
            band.style.setProperty("--card", `${C}px`);
          };
          const off = (n: number) => (events[n].day === 2 ? DAY_GAP : 0);
          layout();
          // Card n travels from its place in the row to its spine slot, arriving at step n.
          items.forEach((el, n) => {
            if (n) tl.fromTo(el, { x: () => n * C + off(n) }, { x: () => n * S + off(n), duration: n }, 0);
            // A leaf's print fades in step with the scroll, before the next leaf's edge reaches its text
            // (autoAlpha also hides it, so covered text is never left readable underneath).
            if (n < last) tl.to(prints[n], { autoAlpha: 0, duration: 0.25 }, n + 0.3);
          });
        } else {
          // Upright: leaf k rises from below the band during step k-1→k, then recedes up the pile one peek per step.
          const top = PEEK * DEPTH;
          let H = 0;
          layout = () => {
            H = band.clientHeight;
            band.style.setProperty("--card", `${H - top}px`);
            // On a short or zoomed screen a leaf whose words do not fit gives up its painting, then its drawing, never its words.
            items.forEach((el) => {
              el.removeAttribute("data-tight");
              const a = el.querySelector("article")!;
              const over = () => a.scrollHeight > a.clientHeight + 1;
              if (over()) el.setAttribute("data-tight", "");
              if (over()) el.setAttribute("data-tight", "bare");
            });
          };
          const at = { p: 0 };
          const clamp = gsap.utils.clamp(0, 1);
          // The rising leaf eases in and overshoots its rest by about 1% before settling: the bounce lands on the card that arrives.
          const land = gsap.parseEase("back.out(0.6)");
          // Setters, not gsap.set: a set made during the scrub would be recorded in the matchMedia context on every frame.
          const setLeaf = items.map((el) => gsap.quickSetter(el, "css") as (v: gsap.TweenVars) => void);
          const setPrint = prints.map((p) => gsap.quickSetter(p, "css") as (v: gsap.TweenVars) => void);
          redraw = () =>
            items.forEach((_, k) => {
              const p = at.p;
              const d = Math.min(Math.max(p - k, 0), DEPTH);
              const y = p <= k - 1 ? H : p < k ? H - (H - top) * land(p - k + 1) : top - d * PEEK;
              // Opacity, not autoAlpha: covered leaves stay in the accessibility tree, and focusing one brings it forward.
              setLeaf[k]({ y, scale: 1 - d * 0.04, opacity: clamp(DEPTH + 1 - (p - k)) });
              // Its words fade only as the next leaf closes over them, so a leaf at rest is never washed out.
              if (k < last) setPrint[k]({ opacity: 1 - clamp((p - k - 0.8) / 0.2) });
            });
          gsap.set(items, { transformOrigin: "50% 0%" });
          layout();
          tl.to(at, { p: last, duration: last, onUpdate: redraw });
          redraw();
        }

        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          animation: tl,
          // Cards glide after the scroll instead of sticking to it, and each settles into place with a small bounce
          // (on the pile the bounce is in the rise itself, so the snap just eases home).
          scrub: pile ? 0.6 : 0.8,
          invalidateOnRefresh: true,
          // No inertia: its velocity comes from the lagging scrub and would fling the snap past the card asked for.
          snap: { snapTo: 1 / last, inertia: false, duration: { min: 0.35, max: 0.8 }, delay: 0.08, ease: pile ? "power3.out" : "back.out(1.4)" },
          onRefresh: (self) => {
            // A fast flick's native momentum stops at each leaf instead of blurring past two (stops are display:none off the pile).
            wrap.current?.querySelectorAll<HTMLElement>(`.${s.stop}`).forEach((el, n) => {
              el.style.top = `${((self.end - self.start) * n) / last}px`;
            });
            redraw();
            show(self.progress);
          },
        });
        ScrollTrigger.addEventListener("refreshInit", layout);
        go.current = (n, smooth = true) =>
          window.scrollTo({ top: st.start + ((st.end - st.start) * n) / last, behavior: smooth ? "smooth" : "instant" });
        show(st.progress);
        ScrollTrigger.refresh(); // the pinned runway moved every trigger below it

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", layout);
          go.current = null;
          sec.classList.remove(s.deck, s.pile);
          delete sec.dataset.day;
          band.style.removeProperty("--spine");
          band.style.removeProperty("--card");
          // gsap.set calls made while scrolling are not recorded by the matchMedia context, so clear them here.
          if (pile) {
            gsap.set(items, { clearProps: "transform,transformOrigin,opacity,visibility" });
            prints.forEach((p) => gsap.set(p, { clearProps: "opacity,visibility" }));
          }
          items.forEach((el) => {
            delete el.dataset.state;
            el.removeAttribute("data-tight");
            el.querySelector("button")!.hidden = true;
          });
          // On a phone this is the page's only ScrollTrigger: killing it makes ScrollTrigger forget the scroll, and the
          // refresh after a rotate or reduced-motion switch scrolls to 0 to measure. Put the guest back where they were.
          const y = scrollY;
          const back = () => {
            ScrollTrigger.removeEventListener("refresh", back);
            window.scrollTo(0, y);
          };
          ScrollTrigger.addEventListener("refresh", back);
          // Only the refresh that follows this switch; a later one (the RSVP growing) must not jump the guest back.
          window.setTimeout(() => ScrollTrigger.removeEventListener("refresh", back), 1000);
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
        {/* Snap stops for touch momentum, one per leaf (pile only; placed from ScrollTrigger's measured steps). */}
        {events.map((ev) => (
          <i key={ev.id} aria-hidden className={s.stop} />
        ))}
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
                  <div className={`${s.picCell} relative min-h-0 lg:col-start-2 lg:row-start-1`}>
                    <div data-reveal="picture" className={`${s.pic} relative aspect-[4/3] overflow-hidden`}>
                      <Image
                        src={ev.painting.src}
                        alt={ev.painting.alt}
                        fill
                        // Eager, low priority: leaves waiting off stage are clipped, so lazy loading would only fetch a painting as it rises.
                        loading="eager"
                        fetchPriority="low"
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: ev.painting.focal }}
                      />
                      {ev.id === "haldi" && <Petals count={12} colors={["#E8B83A", "#E39B2D"]} seed={202} />}
                    </div>
                    {/* The varmala painting is the doorway, with its toran over it. */}
                    {ev.id === "varmala" && <Toran swags={2} className="absolute inset-x-0 -top-3 w-full" />}
                  </div>

                  <div className={`${s.textCell} mt-6 min-h-0 lg:col-start-1 lg:row-start-1 lg:mt-0`}>
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

                  <div className={`${s.dateRow} mt-6 flex items-baseline justify-between gap-4 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-end`}>
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

                  <div className={`${s.artCell} mt-4 flex h-32 items-end justify-end gap-2 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:h-[clamp(7rem,16svh,9.5rem)] lg:justify-start`}>
                    {ART[ev.id]}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* Outside the pinned stage, so on a phone every pixel of the stage goes to the leaves. */}
      <p data-reveal className="t-body page-x mt-12">
        {ceremonies.after}{" "}
        <a href="#rsvp" className={`link ${s.press}`}>
          {ceremonies.afterLink}
        </a>
      </p>
    </section>
  );
}
