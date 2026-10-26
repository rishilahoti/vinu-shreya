// The back of the card: the families' sign-off, the address block under a Hawa Mahal stamp, the printer's imprint
// and a credit for every found picture the page shows.
import Image from "next/image";
import { wedding } from "@/lib/content";
import Stripe from "@/components/Stripe";
import Toran from "@/components/art/Toran";
import Peacock from "@/components/art/Peacock";
import palace from "@/public/art/palace/credits.json";
import paintings from "@/public/art/paintings/credits.json";
import video from "@/public/art/video/credits.json";
import s from "./Footer.module.css";

const { footer, venue, rsvp } = wedding;

// Credit only the found pictures the page actually shows, in page order.
const shown = [
  ...wedding.hero.palace,
  wedding.intro.painting,
  ...wedding.events.map((e) => e.painting),
  venue.tall,
  venue.square,
  footer.stamp,
  wedding.clip,
];
const found = [...palace, ...paintings, ...video];
const credits = shown.flatMap(({ src }) => found.filter((c) => c.file === `public${src}`));

const [street, ...place] = venue.address.split(", ");
const address = [
  { label: `${venue.name}, ${street}`, href: venue.mapsUrl },
  { label: place.join(", "), href: venue.mapsUrl },
  { label: `WhatsApp ${rsvp.whatsappDisplay}`, href: `https://wa.me/${rsvp.whatsapp}` },
  { label: footer.hashtag, href: `https://www.instagram.com/explore/tags/${footer.hashtag.replace(/^#/, "")}/` },
];

// Stamp perforation: round bites along all four edges of a 3:4 stamp, drawn in a 300 x 400 box.
const R = 10;
const bites = (n: number, len: number, at: (t: number) => [number, number], next: (t: number) => [number, number]) =>
  Array.from({ length: n }, (_, i) => {
    const c = ((i + 0.5) * len) / n;
    return `L${at(c - R).join(" ")}A${R} ${R} 0 0 0 ${next(c + R).join(" ")}`;
  }).join("");
const PERF =
  "M0 0" +
  bites(11, 300, (t) => [t, 0], (t) => [t, 0]) +
  "L300 0" +
  bites(15, 400, (t) => [300, t], (t) => [300, t]) +
  "L300 400" +
  bites(11, 300, (t) => [300 - t, 400], (t) => [300 - t, 400]) +
  "L0 400" +
  bites(15, 400, (t) => [0, 400 - t], (t) => [0, 400 - t]) +
  "Z";

const SCALLOP = { clipPath: "ellipse(50% 100% at 50% 100%)" };

export default function Footer() {
  return (
    <footer id="footer" className="bg-ground">
      <Stripe className="h-2" bar={28} />
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id="stamp-perf" clipPathUnits="objectBoundingBox">
          <path d={PERF} transform="scale(0.0033333 0.0025)" />
        </clipPath>
      </svg>

      <div className="page-x pt-[clamp(4rem,8vw,7.5rem)] pb-[clamp(3rem,6vw,6rem)]">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)]">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            {/* the card's scalloped top edge: six bites on a phone, twelve from md */}
            <div aria-hidden className="-mb-px flex">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={`aspect-[2/1] flex-1 bg-paper ${i < 6 ? "" : "hidden md:block"}`} style={SCALLOP} />
              ))}
            </div>

            <div className="bg-paper pb-[clamp(1.5rem,3vw,2.5rem)]">
              <Toran swags={3} className="block w-full md:hidden" />
              <Toran swags={6} className="hidden w-full md:block" />

              <div className="relative grid gap-y-12 px-[clamp(1.5rem,4.5vw,4rem)] pt-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-2 md:gap-x-16">
                <div>
                  <h2 data-reveal className="t-head" style={{ "--i": 1 } as React.CSSProperties}>
                    {footer.heading.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p data-reveal className="t-body mt-6 max-w-[36ch]" style={{ "--i": 2 } as React.CSSProperties}>
                    {footer.message}
                  </p>
                  {/* the lawn peacock walks up to the sign-off; under it on narrow cards, beside it from lg */}
                  <div data-reveal className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-2 lg:flex-nowrap" style={{ "--i": 3 } as React.CSSProperties}>
                    <p className="t-body max-w-[30ch]">
                      {footer.blessing}
                      <br />
                      <span className="font-medium">{footer.families}</span>
                    </p>
                    <Peacock className="ml-auto w-[136px] shrink-0 lg:ml-0 lg:w-[176px]" />
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-10">
                  {/* the stamp: Hawa Mahal on a perforated paper margin, stuck on slightly askew */}
                  <div
                    className="absolute top-[clamp(1.5rem,3vw,2.5rem)] right-[clamp(1.5rem,4.5vw,4rem)] aspect-[3/4] w-16 rotate-[4deg] bg-paper-2 p-1.5 md:static md:w-[88px] md:self-end"
                    style={{ clipPath: "url(#stamp-perf)" }}
                  >
                    <div data-reveal="picture" className="relative h-full w-full overflow-hidden" style={{ "--i": 4 } as React.CSSProperties}>
                      <Image
                        src={footer.stamp.src}
                        alt={footer.stamp.alt}
                        fill
                        sizes="88px"
                        className="object-cover"
                        style={{ objectPosition: footer.stamp.focal }}
                      />
                    </div>
                  </div>
                  <address data-reveal className={`t-lead not-italic ${s.address}`} style={{ "--i": 4 } as React.CSSProperties}>
                    <ul className="flex flex-col gap-3 text-balance">
                      {address.map((a) => (
                        <li key={a.label}>
                          <a className="link" href={a.href}>
                            {a.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </address>
                </div>
              </div>

              <div className={`mt-16 px-[clamp(1.5rem,4.5vw,4rem)] ${s.credits}`}>
                <p className="t-small max-w-[60ch] text-ink">{footer.creditsIntro}</p>
                <ul className="t-small mt-4 gap-x-[var(--gutter)] text-muted md:columns-2 lg:columns-3">
                  {credits.map((c) => {
                    const m = /^"([^"]+)"(.*)$/.exec(c.credit);
                    return (
                      <li key={c.file} className="mb-2 break-inside-avoid">
                        “<a className="link text-ink" href={c.page}>{m ? m[1] : c.title}</a>”{m ? m[2] : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="t-small mt-12 px-[clamp(1.5rem,4.5vw,4rem)] text-center text-ink">{footer.imprint}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
