"use client";

// Copy of the reference's venue section (rachit-weds-kanchi, chunk 0_6yjuvmwh1-f.js): carousel with fade, lightbox, copy-address feedback.
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, MapPin, Maximize2, Navigation, PhoneCall, Sparkles, X } from "lucide-react";
import { invite } from "@/lib/invite";
import { useLang } from "./lang";

const v = invite.venue;

// Hindi captions are local: invite.ts only has English alt text for the photos.
const PHOTOS = [
  { ...v.photos[0], hi: "लॉन पर पेस्टल शामियाने के नीचे सफ़ेद कुर्सियाँ, दूर छोर पर फूलों से सजा मंडप" },
  { ...v.photos[1], hi: "कमल-ताल में लाल स्तंभों वाला गोल मंडप, सामने छोटा पुल और सफ़ेद सारस की प्रतिमा" },
];

const copy = {
  pill: { en: "The Wedding Sanctuary & Concierge", hi: "॥ सुरम्य हरित परिसर · पावन विवाह स्थल ॥" },
  chip: { en: "Official Wedding Destination", hi: "शाही विवाह स्थल · महू" },
  maps: { en: "Open Google Maps", hi: "गूगल मैप्स नेविगेशन" },
  copied: { en: "Copied!", hi: "कॉपी हुआ!" },
  copyAddress: { en: "Copy Address", hi: "पता कॉपी करें" },
  call: { en: "Call Concierge", hi: "आतिथ्य डेस्क" },
  desk: { en: "Hospitality Desk:", hi: "हेल्पडेस्क:" },
};

function CornerSprig({ position }: { position: "top-left" | "top-right" }) {
  const id = `goldSprig_${position}`;
  const pos = position === "top-left" ? "top-2 left-2 sm:top-3 sm:left-3" : "top-2 right-2 sm:top-3 sm:right-3 -scale-x-100";
  return (
    <div className={`absolute pointer-events-none select-none z-0 ${pos} `}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 sm:w-16 md:w-20 h-auto opacity-45 drop-shadow-[0_1px_4px_rgba(197,155,39,0.18)]">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AA771C" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E5C365" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#C59B27" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8A6516" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 4 116 C 16 95, 34 72, 60 48 C 80 30, 98 16, 116 4" stroke={`url(#${id})`} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M 22 96 C 14 88, 10 78, 16 70 C 24 76, 28 86, 22 96 Z" fill={`url(#${id})`} opacity="0.85" />
        <path d="M 32 86 C 42 78, 48 68, 42 60 C 34 68, 28 78, 32 86 Z" fill={`url(#${id})`} opacity="0.8" />
        <path d="M 48 70 C 38 60, 34 48, 42 40 C 50 48, 56 58, 48 70 Z" fill={`url(#${id})`} opacity="0.88" />
        <path d="M 60 60 C 72 50, 80 40, 74 32 C 64 42, 56 52, 60 60 Z" fill={`url(#${id})`} opacity="0.85" />
        <path d="M 76 44 C 68 34, 66 22, 74 16 C 82 24, 86 34, 76 44 Z" fill={`url(#${id})`} opacity="0.9" />
        <path d="M 90 32 C 102 22, 110 14, 104 6 C 94 14, 86 24, 90 32 Z" fill={`url(#${id})`} opacity="0.85" />
        <path d="M 106 18 C 112 10, 118 8, 116 4 C 110 6, 104 12, 106 18 Z" fill={`url(#${id})`} />
        <circle cx="16" cy="70" r="1.5" fill="#FFF2B2" />
        <circle cx="42" cy="40" r="1.6" fill="#FFF2B2" />
        <circle cx="74" cy="16" r="1.6" fill="#FFF2B2" />
        <circle cx="116" cy="4" r="1.8" fill="#FFF2B2" />
      </svg>
    </div>
  );
}

function SideFlourish({ flip }: { flip?: boolean }) {
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
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-4xl lg:max-w-5xl mx-auto my-1 sm:my-1.5 my-2">
      <div className="flex-1 flex items-center justify-end">
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] mr-1.5 sm:mr-2 opacity-75 select-none">✦</span>
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-r from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <SideFlourish />
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
        <SideFlourish flip />
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-l from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] ml-1.5 sm:ml-2 opacity-75 select-none">✦</span>
      </div>
    </div>
  );
}

const subBtn =
  "w-full inline-flex items-center justify-center gap-1.5 py-2 min-[360px]:py-2.5 px-2 rounded-lg border border-[#C59B27]/35 bg-white hover:bg-[#FAF5EB] text-[#78350F] font-semibold text-[11px] min-[360px]:text-xs transition-all cursor-pointer shadow-2xs hover:border-[#C59B27]/60 active:scale-[0.98]";
const sideArrow =
  "hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 hover:scale-105 shadow-md";
const barArrow =
  "h-8 w-8 rounded-full bg-white/10 active:bg-white/25 text-[#FFF2B2] flex items-center justify-center cursor-pointer border border-white/15 transition-all";

export default function Venue() {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const [copied, setCopied] = useState(false);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<(typeof PHOTOS)[number] | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const photo = PHOTOS[idx];
  const next = () => setIdx((i) => (i + 1) % PHOTOS.length);
  const prev = () => setIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
  const caption = (p: (typeof PHOTOS)[number]) => (hi ? p.hi : p.alt);
  const enter = { opacity: 0, y: 24 };

  return (
    <section id="venue" ref={ref} className="relative bg-gradient-to-b from-[#FAF7F2] via-[#FFFFFF] to-[#FAF7F2] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20">
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C59B27_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.14] pointer-events-none" />
      <CornerSprig position="top-left" />
      <CornerSprig position="top-right" />

      <div className="max-w-6xl xl:max-w-7xl mx-auto relative z-10">
        <motion.div initial={enter} animate={inView ? { opacity: 1, y: 0 } : enter} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#C59B27]/40 bg-gradient-to-r from-[#FFFBF0] via-[#FFFFFF] to-[#FFFBF0] text-[#8A6516] shadow-xs mb-3.5 sm:mb-4 max-w-full">
            <span className="text-[#C59B27] text-xs animate-spin-slow shrink-0">✦</span>
            <span className={`text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.24em] truncate ${hi ? "font-serif-hi" : "font-cinzel"}`}>{t(copy.pill)}</span>
            <span className="text-[#C59B27] text-xs animate-spin-slow-reverse shrink-0">✦</span>
          </div>
          <h2 className={`text-2xl min-[360px]:text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-[#1C1917] tracking-tight leading-[1.15] mb-2 sm:mb-3 drop-shadow-xs ${hi ? "font-display-hi" : "font-cinzel"}`}>{t(v.name)}</h2>
          <p className={`text-xs min-[360px]:text-sm sm:text-base md:text-lg font-semibold text-[#8A6516] mb-3 ${hi ? "font-serif-hi" : "font-serif"}`}>{t(v.area)}</p>
          <Filigree />
        </motion.div>

        <motion.div initial={enter} animate={inView ? { opacity: 1, y: 0 } : enter} transition={{ duration: 0.85, delay: 0.15 }} className="relative rounded-xl sm:rounded-2xl border border-[#C59B27]/50 ring-1 ring-[#C59B27]/15 bg-[#FCFAF6] shadow-[0_20px_50px_-10px_rgba(26,16,10,0.12),0_0_20px_rgba(197,155,39,0.06)] overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch relative z-10">
            <div className="lg:col-span-7 flex flex-col bg-[#0A0D1B] relative border-b lg:border-b-0 lg:border-r border-[#C59B27]/25">
              <div className="relative aspect-[16/10] sm:aspect-[16/9.5] lg:aspect-auto lg:h-[460px] w-full overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div key={photo.src} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="absolute inset-0">
                    <Image src={photo.src} alt={caption(photo)} fill priority={idx === 0} className="object-cover object-center transition-transform duration-700 group-hover:scale-103" sizes="(max-width: 1024px) 100vw, 60vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/25 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11.5px] font-sans font-bold tracking-wider uppercase bg-black/65 backdrop-blur-md border border-[#C59B27]/50 text-[#FFF2B2] shadow-sm flex items-center gap-1.5">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FDE68A]" aria-hidden="true" />
                    <span className="hidden min-[360px]:inline">{v.short.en}</span>
                    <span className="min-[360px]:hidden">Heaven Space</span>
                  </span>
                </div>
                <button type="button" onClick={() => setLightbox(photo)} aria-label="View Fullscreen Photo" className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 h-7.5 w-7.5 sm:h-9 sm:w-9 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FDE68A]" aria-hidden="true" />
                </button>
                <button type="button" onClick={prev} aria-label="Previous Photo" className={sideArrow.replace("absolute", "absolute left-3")}>
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                </button>
                <button type="button" onClick={next} aria-label="Next Photo" className={sideArrow.replace("absolute", "absolute right-3")}>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                </button>
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 pointer-events-none">
                  <span className="text-[9.5px] sm:text-[11px] font-mono text-[#FDE68A] font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 shadow-sm">
                    {idx + 1} / {PHOTOS.length}
                  </span>
                </div>
              </div>

              <div className="flex sm:hidden items-center justify-between px-3 py-2.5 bg-[#0F1424] border-t border-white/10">
                <button type="button" onClick={prev} aria-label="Previous Photo" className={barArrow}>
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2">
                  {PHOTOS.map((p, i) => (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`View photo ${i + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${i === idx ? "w-6 h-2 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "w-2 h-2 bg-white/35 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
                <button type="button" onClick={next} aria-label="Next Photo" className={barArrow}>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="hidden sm:flex p-2.5 bg-[#0F1424] border-t border-white/10 items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto">
                {PHOTOS.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`View photo ${i + 1}`}
                    className={`relative h-11 w-16 sm:h-13 sm:w-20 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer shrink-0 ${i === idx ? "ring-2 ring-[#C59B27] ring-offset-1 ring-offset-[#0F1424] scale-103 opacity-100" : "opacity-55 hover:opacity-85 border border-white/20"}`}
                  >
                    <Image src={p.src} alt={`Resort preview ${i + 1}`} fill className="object-cover object-center" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-4 min-[360px]:p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-gradient-to-b from-[#FCFAF6] via-[#FAF6EE] to-[#F7EFE2]">
              <div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#C59B27]/40 bg-[#FFFDF9] text-[#8A6516] text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-2 sm:mb-2.5 shadow-2xs">
                    <Sparkles className="h-3 w-3 text-[#C59B27]" aria-hidden="true" />
                    <span>{t(copy.chip)}</span>
                  </div>
                  <h3 className={`text-xl min-[360px]:text-2xl sm:text-[30px] lg:text-[32px] font-bold text-[#1C1917] mb-1 leading-snug sm:leading-tight ${hi ? "font-serif-hi" : "font-cinzel"}`}>{t(v.name)}</h3>
                  <p className="text-xs sm:text-[13.5px] text-[#7D5814] font-semibold mb-3 sm:mb-3.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" aria-hidden="true" />
                    <span>{t(v.area)}</span>
                  </p>
                </div>
                <p className={`text-[12.5px] min-[360px]:text-[13.5px] sm:text-[14.5px] text-[#292524] font-sans font-medium leading-relaxed mb-4 sm:mb-5 ${hi ? "font-serif-hi" : ""}`}>{t(v.about)}</p>
              </div>

              <div className="space-y-2.5 pt-2 sm:pt-4">
                <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer" className="relative group w-full overflow-hidden rounded-xl p-[2px] bg-gradient-to-r from-[#8A6516] via-[#E5C365] to-[#8A6516] shadow-[0_6px_20px_rgba(197,155,39,0.30)] hover:shadow-[0_10px_28px_rgba(197,155,39,0.45)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] block cursor-pointer">
                  <div className="w-full py-3 min-[360px]:py-3.5 sm:py-4 px-4 sm:px-6 rounded-[10px] bg-gradient-to-r from-[#9B7018] via-[#C59B27] to-[#8A6516] group-hover:from-[#A87A1A] group-hover:via-[#D4AF37] group-hover:to-[#9B7018] flex items-center justify-center gap-2.5 sm:gap-3 text-white transition-colors duration-300">
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFF9E6] fill-white/25 group-hover:rotate-12 transition-transform duration-300 shrink-0" aria-hidden="true" />
                    <span className="text-xs min-[360px]:text-sm sm:text-base font-bold font-sans tracking-wider uppercase text-white drop-shadow-xs whitespace-nowrap">{t(copy.maps)}</span>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white opacity-85 group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
                  </div>
                </a>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(v.address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2400);
                    }}
                    className={subBtn}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span className="text-emerald-700 font-bold truncate" role="status">{t(copy.copied)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#8A6516] shrink-0" aria-hidden="true" />
                        <span className="truncate">{t(copy.copyAddress)}</span>
                      </>
                    )}
                  </button>
                  <a href={invite.contact.tel} className={subBtn}>
                    <PhoneCall className="w-3.5 h-3.5 text-[#8A6516] shrink-0" aria-hidden="true" />
                    <span className="truncate">{t(copy.call)}</span>
                  </a>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[11px] sm:text-xs text-[#7D5814]">
                  <span className="text-[#8C6D38]">{t(copy.desk)}</span>
                  <a href={invite.contact.tel} className="font-mono font-bold text-[#1C1917] hover:text-[#C59B27] underline decoration-[#C59B27]/30 underline-offset-2 transition-colors">
                    {invite.contact.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onClick={() => setLightbox(null)}>
            <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setLightbox(null)} className="absolute -top-11 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-lg" aria-label="Close Lightbox">
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[80vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <Image src={lightbox.src} alt={caption(lightbox)} fill className="object-contain object-center" sizes="(max-width: 896px) 100vw, 896px" priority />
              </div>
              <p className="text-white text-xs sm:text-sm font-sans font-medium text-center mt-3 text-white/90">{caption(lightbox)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
