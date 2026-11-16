"use client";

// Copy of the reference's countdown section (#timeline). Facts come from invite.ts.
import { useEffect, useState } from "react";
import Image from "next/image";
import { Parallax, Reveal, RevealGroup, RevealItem } from "@/components/invite/reveal";
import { Calendar, CircleCheck, Download, ExternalLink, Sparkles } from "lucide-react";
import { invite, googleCalendarUrl } from "@/lib/invite";
import { useLang } from "@/components/invite/lang";

const copy = {
  badge: { en: "THE ROYAL COUNTDOWN", hi: "उत्सव की प्रतीक्षा" },
  venue: {
    en: `${invite.venue.name.en} · ${invite.venue.area.en}`,
    hi: `${invite.venue.name.hi}, ${invite.venue.area.hi}`,
  },
  days: { en: "DAYS", hi: "दिन" },
  hours: { en: "HOURS", hi: "घंटे" },
  minutes: { en: "MINUTES", hi: "मिनट" },
  seconds: { en: "SECONDS", hi: "सेकंड" },
  saved: { en: "Saved to Calendar!", hi: "कैलेंडर में सेव हुआ!" },
  download: { en: "Download .ICS Calendar", hi: "कैलेंडर डाउनलोड (.ICS)" },
  google: { en: "Add to Google Calendar", hi: "गूगल कैलेंडर में जोड़ें" },
  note: {
    en: "Pre-synced with all 5 celebrations, timings & Google Maps venue directions",
    hi: "समस्त ५ कार्यक्रमों के मुहूर्त, समय एवं गूगल मैप्स वेन्यू सहित",
  },
};

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// "10:00 AM Onwards" on day N -> UTC Date (times are IST).
function eventStart(e: (typeof invite.events)[number]) {
  const [, h, m, ap] = e.time.en.match(/(\d+):(\d+)\s*(AM|PM)/)!;
  const hh = (Number(h) % 12) + (ap === "PM" ? 12 : 0);
  const d = new Date(`${invite.startsAt.slice(0, 10)}T00:00:00+05:30`);
  return new Date(d.getTime() + ((e.day - 1) * 24 + hh) * 36e5 + Number(m) * 6e4);
}

function buildIcs() {
  const c = invite.calendar;
  const stamp = utc(new Date());
  const events = invite.events.map((e) => {
    const s = eventStart(e);
    // shortcut: invite.ts has no end times, so each event gets 3 hours; add ends there if the family wants exact ones.
    const end = new Date(s.getTime() + 3 * 36e5);
    return [
      "BEGIN:VEVENT",
      `UID:vinamra-shreya-${e.id}-2027@vinamra-weds-shreya`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(s)}`,
      `DTEND:${utc(end)}`,
      `SUMMARY:${e.name.en} · ${c.title}`,
      `DESCRIPTION:${c.details.replace(/,/g, "\\,")}`,
      `LOCATION:${invite.venue.address.replace(/,/g, "\\,")}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
    ].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Vinamra and Shreya Wedding//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", ...events, "END:VCALENDAR"].join("\r\n");
}

const SPRIG = {
  "top-left": "top-2 left-2 sm:top-3 sm:left-3",
  "top-right": "top-2 right-2 sm:top-3 sm:right-3 -scale-x-100",
} as const;

function BotanicalCornerSprig({ position }: { position: keyof typeof SPRIG }) {
  const g = `url(#goldSprig_${position})`;
  return (
    <div className={`absolute pointer-events-none select-none z-0 ${SPRIG[position]} `}>
      {/* negative: the sprig sits at the section's clipped top edge, so it drifts down into view rather than up out of it */}
      <Parallax speed={-24}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 sm:w-16 md:w-20 h-auto opacity-45 drop-shadow-[0_1px_4px_rgba(197,155,39,0.18)]">
        <defs>
          <linearGradient id={`goldSprig_${position}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AA771C" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E5C365" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#C59B27" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8A6516" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 4 116 C 16 95, 34 72, 60 48 C 80 30, 98 16, 116 4" stroke={g} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M 22 96 C 14 88, 10 78, 16 70 C 24 76, 28 86, 22 96 Z" fill={g} opacity="0.85" />
        <path d="M 32 86 C 42 78, 48 68, 42 60 C 34 68, 28 78, 32 86 Z" fill={g} opacity="0.8" />
        <path d="M 48 70 C 38 60, 34 48, 42 40 C 50 48, 56 58, 48 70 Z" fill={g} opacity="0.88" />
        <path d="M 60 60 C 72 50, 80 40, 74 32 C 64 42, 56 52, 60 60 Z" fill={g} opacity="0.85" />
        <path d="M 76 44 C 68 34, 66 22, 74 16 C 82 24, 86 34, 76 44 Z" fill={g} opacity="0.9" />
        <path d="M 90 32 C 102 22, 110 14, 104 6 C 94 14, 86 24, 90 32 Z" fill={g} opacity="0.85" />
        <path d="M 106 18 C 112 10, 118 8, 116 4 C 110 6, 104 12, 106 18 Z" fill={g} />
        <circle cx="16" cy="70" r="1.5" fill="#FFF2B2" />
        <circle cx="42" cy="40" r="1.6" fill="#FFF2B2" />
        <circle cx="74" cy="16" r="1.6" fill="#FFF2B2" />
        <circle cx="116" cy="4" r="1.8" fill="#FFF2B2" />
      </svg>
      </Parallax>
    </div>
  );
}

export default function Timeline() {
  const { lang, t } = useLang();
  const [saved, setSaved] = useState(false);
  // Placeholder until the first tick, same as the reference (keeps SSR and hydration equal).
  const [left, setLeft] = useState({ days: 62, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const target = new Date(invite.startsAt).getTime();
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setLeft({ days: Math.floor(d / 864e5), hours: Math.floor((d % 864e5) / 36e5), minutes: Math.floor((d % 36e5) / 6e4), seconds: Math.floor((d % 6e4) / 1e3) });
    };
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, []);

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "Vinamra_Shreya_Wedding.ics");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };

  const units = [
    { label: copy.days, value: left.days },
    { label: copy.hours, value: left.hours },
    { label: copy.minutes, value: left.minutes },
    { label: copy.seconds, value: left.seconds },
  ];

  return (
    <section id="timeline" className="relative py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 border-t border-[#C59B27]/30 overflow-hidden scroll-mt-16 bg-[#FAF7F2]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* scale 1.2 keeps the edges hidden over ±40px travel even on the 460px-tall phone frame */}
        <Parallax className="absolute inset-0" speed={40} scale={1.2}>
          <Image src="/images/milestones/promenade_palace_bg.webp" alt="Royal Palace Architecture and Promenade Background" fill priority className="object-cover object-[center_20%] opacity-25 filter brightness-[1.04] contrast-[0.98]" sizes="100vw" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#F7F2E8]/60 to-[#FAF7F2]/90" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#FAF7F2] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
      </div>
      <BotanicalCornerSprig position="top-left" />
      <BotanicalCornerSprig position="top-right" />
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full max-w-3xl sm:max-w-4xl mx-auto px-3 sm:px-6">
          <Reveal className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#C59B27]/50" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] border border-[#C59B27]/40 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              <span className="text-[10px] sm:text-[11px] font-cinzel font-bold text-[#8A6516] tracking-[0.2em] uppercase">{t(copy.badge)}</span>
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
            </div>
            <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#C59B27]/50" />
          </Reveal>
          <Reveal delay={0.08} className="relative overflow-hidden rounded-3xl border border-[#C59B27]/45 bg-gradient-to-b from-[#FFFDF9]/98 via-[#FAF5EB]/95 to-[#F5EEDD]/95 p-5 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(138,101,22,0.12)]">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C59B27]/40 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C59B27]/40 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C59B27]/40 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C59B27]/40 rounded-br-sm pointer-events-none" />
            <RevealGroup delay={0.2} className="flex flex-col items-center text-center">
              <RevealItem y={14} blur={6} className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-[#C59B27]" />
                <h4 className={`text-xs min-[400px]:text-sm sm:text-base font-bold text-[#78350F] tracking-[0.16em] uppercase ${lang === "hi" ? "font-serif-hi" : "font-cinzel"}`}>{t(invite.dates.commence)}</h4>
              </RevealItem>
              <RevealItem y={14} blur={6}>
                <p className="text-[11px] sm:text-xs text-[#8A6516] font-medium tracking-wide">{t(copy.venue)}</p>
              </RevealItem>
              <RevealItem y={14} blur={6} className="grid grid-cols-4 gap-2 min-[400px]:gap-3 sm:gap-4 md:gap-6 w-full max-w-lg mx-auto my-5 sm:my-6">
                {units.map((u, i) => (
                  <div key={i} className="flex flex-col items-center justify-center py-2.5 sm:py-3.5 md:py-4 px-1.5 sm:px-3 rounded-2xl border border-[#C59B27]/40 bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF3E4] shadow-[0_4px_16px_rgba(197,155,39,0.12)] transition-transform duration-300 hover:scale-105">
                    <span className="font-cinzel text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#78350F] tracking-tight leading-none drop-shadow-2xs">{String(u.value).padStart(2, "0")}</span>
                    <span className="font-cinzel text-[8px] min-[400px]:text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#8A6516] mt-1.5 sm:mt-2 font-bold leading-none">{t(u.label)}</span>
                  </div>
                ))}
              </RevealItem>
              <RevealItem y={14} blur={6} className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#C59B27]/35 to-transparent my-1 sm:my-2">{null}</RevealItem>
              <RevealItem y={14} blur={6} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-3 sm:mt-4">
                <button type="button" onClick={downloadIcs} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#9B7018] via-[#C59B27] to-[#9B7018] text-white text-xs sm:text-[13px] font-cinzel font-bold tracking-wider shadow-[0_4px_16px_rgba(138,101,22,0.28)] hover:brightness-108 active:scale-98 transition-all cursor-pointer border border-[#FFF2B2]/50">
                  {saved ? (
                    <>
                      <CircleCheck className="w-4 h-4 text-emerald-200" />
                      <span>{t(copy.saved)}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{t(copy.download)}</span>
                    </>
                  )}
                </button>
                <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FFFFFF] hover:bg-[#FAF5EB] border border-[#C59B27]/50 text-[#8A6516] hover:text-[#78350F] text-xs sm:text-[13px] font-cinzel font-bold tracking-wider shadow-2xs hover:shadow-xs transition-all cursor-pointer">
                  <Calendar className="w-4 h-4 text-[#C59B27]" />
                  <span>{t(copy.google)}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C59B27]/70" />
                </a>
              </RevealItem>
              <RevealItem y={14} blur={6}>
                <p className="text-[10px] sm:text-[11.5px] text-[#8A6516]/80 font-medium mt-3">{t(copy.note)}</p>
              </RevealItem>
            </RevealGroup>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
