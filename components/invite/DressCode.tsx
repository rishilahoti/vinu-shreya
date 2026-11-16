"use client";

import { motion } from "motion/react";
import { invite } from "@/lib/invite";
import { useLang } from "@/components/invite/lang";
import { Parallax, Reveal, RevealGroup, RevealItem } from "./reveal";

const copy = {
  pill: { en: "Celebration Couture & Attire", hi: "॥ मांगलिक परिधान निर्देशिका ॥" },
  title: { en: "Dress Code & Styling", hi: "ड्रेस कोड व शृंगार" },
  intro: {
    en: "Curated royal color palettes, silhouettes, and fabrics crafted for each celebration.",
    hi: "हर पावन उत्सव के विशेष रंगों, साड़ियों और शेरवानियों की संपूर्ण रूपरेखा।",
  },
  label: { en: "Dresscode:", hi: "ड्रेस कोड:" },
};

// The reference ties each halo colour to its attire illustration, so key it by image.
const halo: Record<string, string> = {
  "carnival-haldi": "from-[#FDF3D6] via-[#FCE8B3] to-[#F5DE9C]",
  mayra: "from-[#FCE7F3] via-[#FBCFE8] to-[#F5D0E3]",
  sangeet: "from-[#EDE9FE] via-[#DDD6FE] to-[#D8CEF6]",
  baarat: "from-[#E0F2FE] via-[#BAE6FD] to-[#AEE0FC]",
  "shaadi-phere": "from-[#FEE2E2] via-[#FECACA] to-[#FBC4C4]",
};

function Sprig({ position }: { position: "top-left" | "bottom-right" }) {
  const id = `goldSprig_${position}`;
  const pos = position === "top-left" ? "top-2 left-2 sm:top-3 sm:left-3" : "bottom-2 right-2 sm:bottom-3 sm:right-3 -scale-x-100 -scale-y-100";
  const f = `url(#${id})`;
  return (
    // Tailwind's -scale-* flips the Parallax translate too, so the bottom sprig takes the opposite sign to drift the same way.
    <Parallax speed={position === "top-left" ? 28 : -28} className={`absolute pointer-events-none select-none z-0 ${pos} opacity-40`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 sm:w-16 md:w-20 h-auto opacity-45 drop-shadow-[0_1px_4px_rgba(197,155,39,0.18)]">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AA771C" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E5C365" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#C59B27" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8A6516" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 4 116 C 16 95, 34 72, 60 48 C 80 30, 98 16, 116 4" stroke={f} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M 22 96 C 14 88, 10 78, 16 70 C 24 76, 28 86, 22 96 Z" fill={f} opacity="0.85" />
        <path d="M 32 86 C 42 78, 48 68, 42 60 C 34 68, 28 78, 32 86 Z" fill={f} opacity="0.8" />
        <path d="M 48 70 C 38 60, 34 48, 42 40 C 50 48, 56 58, 48 70 Z" fill={f} opacity="0.88" />
        <path d="M 60 60 C 72 50, 80 40, 74 32 C 64 42, 56 52, 60 60 Z" fill={f} opacity="0.85" />
        <path d="M 76 44 C 68 34, 66 22, 74 16 C 82 24, 86 34, 76 44 Z" fill={f} opacity="0.9" />
        <path d="M 90 32 C 102 22, 110 14, 104 6 C 94 14, 86 24, 90 32 Z" fill={f} opacity="0.85" />
        <path d="M 106 18 C 112 10, 118 8, 116 4 C 110 6, 104 12, 106 18 Z" fill={f} />
        <circle cx="16" cy="70" r="1.5" fill="#FFF2B2" />
        <circle cx="42" cy="40" r="1.6" fill="#FFF2B2" />
        <circle cx="74" cy="16" r="1.6" fill="#FFF2B2" />
        <circle cx="116" cy="4" r="1.8" fill="#FFF2B2" />
      </svg>
    </Parallax>
  );
}

function Flourish({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 90 24" fill="none" className={`w-10 sm:w-16 h-auto stroke-[#C59B27] opacity-85 shrink-0 hidden sm:block${flip ? " -scale-x-100" : ""}`}>
      <path d="M 0 12 C 25 12, 40 4, 60 4 C 75 4, 82 20, 88 12" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M 30 12 C 45 18, 65 18, 75 14" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="60" cy="4" r="1.8" fill="#C59B27" />
      <circle cx="88" cy="12" r="1.4" fill="#FFF2B2" />
    </svg>
  );
}

function Filigree() {
  const g = "url(#filigreeGoldGradFull)";
  const s = "url(#filigreeStrokeGradFull)";
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-4xl lg:max-w-5xl mx-auto my-1 sm:my-1.5 opacity-80">
      <div className="flex-1 flex items-center justify-end">
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] mr-1.5 sm:mr-2 opacity-75 select-none">✦</span>
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-r from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <Flourish />
      </div>
      <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }} className="relative flex items-center justify-center shrink-0 ">
        <svg viewBox="0 0 180 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 sm:w-36 md:w-44 h-auto text-[#C59B27] drop-shadow-[0_2px_10px_rgba(197,155,39,0.25)]">
          <defs>
            <linearGradient id="filigreeGoldGradFull" x1="0" y1="0" x2="180" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8A6516" />
              <stop offset="25%" stopColor="#C59B27" />
              <stop offset="50%" stopColor="#FFF4BD" />
              <stop offset="75%" stopColor="#C59B27" />
              <stop offset="100%" stopColor="#8A6516" />
            </linearGradient>
            <linearGradient id="filigreeStrokeGradFull" x1="0" y1="0" x2="180" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#AA771C" />
              <stop offset="50%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#8A6516" />
            </linearGradient>
          </defs>
          <path d="M 15 24 C 45 6, 90 4, 90 4 C 90 4, 135 6, 165 24" stroke={s} strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="90" cy="4" r="2.2" fill={g} />
          <path d="M 90 6 C 90 6, 99 18, 99 30 C 99 37, 95 42, 90 42 C 85 42, 81 37, 81 30 C 81 18, 90 6, 90 6 Z" fill={g} stroke={s} strokeWidth="0.8" />
          <path d="M 90 42 C 83 40, 72 34, 72 25 C 72 16, 82 13, 82 13 C 82 13, 76 24, 85 34 C 87 38, 90 42, 90 42 Z" fill={g} stroke={s} strokeWidth="0.75" />
          <path d="M 90 42 C 97 40, 108 34, 108 25 C 108 16, 98 13, 98 13 C 98 13, 104 24, 95 34 C 93 38, 90 42, 90 42 Z" fill={g} stroke={s} strokeWidth="0.75" />
          <path d="M 88 42 C 79 42, 59 37, 59 27 C 59 19, 70 17, 70 17 C 70 17, 63 27, 75 36 C 81 40, 88 42, 88 42 Z" fill={g} stroke={s} strokeWidth="0.7" opacity="0.88" />
          <path d="M 92 42 C 101 42, 121 37, 121 27 C 121 19, 110 17, 110 17 C 110 17, 117 27, 105 36 C 99 40, 92 42, 92 42 Z" fill={g} stroke={s} strokeWidth="0.7" opacity="0.88" />
          <path d="M 56 36 C 42 33, 30 35, 20 40" stroke={s} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="19" cy="40" r="1.6" fill={g} />
          <path d="M 124 36 C 138 33, 150 35, 160 40" stroke={s} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="161" cy="40" r="1.6" fill={g} />
          <path d="M 38 42 C 54 40, 74 44, 90 44 C 106 44, 126 40, 142 42 C 142 42, 126 46, 90 46 C 54 46, 38 42, 38 42 Z" fill={g} opacity="0.95" />
          <polygon points="90,44 94,48 90,52 86,48" fill={g} />
          <circle cx="90" cy="36" r="2.2" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </motion.div>
      <div className="flex-1 flex items-center justify-start">
        <Flourish flip />
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-l from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] ml-1.5 sm:ml-2 opacity-75 select-none">✦</span>
      </div>
    </div>
  );
}

export default function DressCode() {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const serif = hi ? "font-serif-hi" : "font-serif";
  const display = hi ? "font-display-hi" : "font-cinzel";
  const small = hi ? "font-serif-hi" : "font-cinzel";
  return (
    <section id="dress-code" className="relative bg-[#FAF7F2] scroll-mt-16 sm:scroll-mt-20 py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 overflow-hidden border-t border-[#C59B27]/30 select-none">
      <Sprig position="top-left" />
      <Sprig position="bottom-right" />
      <Parallax speed={70} className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#FDF3D6]/20 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none z-0">{null}</Parallax>
      <div className="max-w-4xl mx-auto relative z-10">
        <RevealGroup className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <RevealItem>
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#FFFDF9]/95 border border-[#C59B27]/40 shadow-2xs">
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#8A6516] ${small}`}>{t(copy.pill)}</span>
            <span className="text-[#C59B27] text-xs">✦</span>
          </div>
          </RevealItem>
          <RevealItem>
          <h2 className={`text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B4D3E] tracking-tight leading-[1.15] ${display}`}>{t(copy.title)}</h2>
          </RevealItem>
          <RevealItem className="my-2.5 sm:my-3.5 flex justify-center">
            <Filigree />
          </RevealItem>
          <RevealItem>
          <p className={`text-xs min-[360px]:text-[13px] sm:text-base text-[#785E3A] font-medium leading-relaxed ${serif}`}>{t(copy.intro)}</p>
          </RevealItem>
        </RevealGroup>
        <div className="space-y-8 min-[360px]:space-y-10 sm:space-y-14 md:space-y-18">
          {invite.events.map((ev, i) => {
            const even = i % 2 === 0;
            const webp = ev.attire;
            const key = webp.split("/").pop()!.replace("-attire.webp", "");
            return (
              <div
                key={ev.id}
                className={`group flex items-center gap-3 min-[360px]:gap-4 sm:gap-8 md:gap-12 ${even ? "flex-row" : "flex-row-reverse"}`}
              >
                <Reveal delay={0.08} className="w-[46%] min-[360px]:w-[48%] sm:w-[46%] md:w-[44%] shrink-0 flex items-center justify-center relative min-h-[155px] min-[360px]:min-h-[180px] sm:min-h-[230px] md:min-h-[270px]">
                  <Parallax speed={-14} className={`absolute w-[102px] h-[102px] min-[360px]:w-[120px] min-[360px]:h-[120px] sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${halo[key]} border border-[#D4AF37]/35 shadow-[0_6px_20px_rgba(197,155,39,0.14)]`}>{null}</Parallax>
                  <Parallax speed={24} className="relative z-10">
                  <picture className="relative z-10 flex items-center justify-center">
                    <source srcSet={webp} type="image/webp" />
                    { }
                    <img
                      src={webp}
                      alt={`${ev.name.en.replace(/&/g, "and")} Attire`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-auto h-[150px] min-[360px]:h-[175px] min-[400px]:h-[195px] sm:h-56 md:h-68 lg:h-72 object-contain drop-shadow-[0_4px_14px_rgba(28,25,23,0.18)] transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>
                  </Parallax>
                </Reveal>
                <Reveal className={`w-[54%] min-[360px]:w-[52%] sm:w-[54%] md:w-[56%] flex flex-col justify-center ${even ? "text-left pl-1 sm:pl-3" : "text-right pr-1 sm:pr-3"}`}>
                  <span className={`text-[8.5px] min-[360px]:text-[9.5px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#8A6516] mb-0.5 sm:mb-1 block ${small}`}>{hi ? `अनुष्ठान ${ev.num}` : `CEREMONY ${ev.num}`}</span>
                  <h3 className={`text-[13px] min-[360px]:text-[14.5px] sm:text-xl md:text-2xl lg:text-[26px] font-bold text-[#1B4D3E] tracking-tight leading-[1.18] ${display}`}>{t(ev.name)}</h3>
                  <p className={`text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm text-[#785E3A] font-medium mt-0.5 sm:mt-1 ${serif}`}>{t(ev.dateLong)}</p>
                  <div className="mt-1.5 sm:mt-2.5 md:mt-3">
                    <span className={`text-[9.5px] min-[360px]:text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#9E2A2B] block ${small}`}>{t(copy.label)}</span>
                    <p className={`text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs md:text-sm lg:text-[15px] font-medium text-[#4A1521] leading-snug mt-0.5 ${serif}`}>{t(ev.dress)}</p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
