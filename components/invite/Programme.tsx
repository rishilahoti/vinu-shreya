"use client";

// Copy of the reference's programme section: header, day/chip jump buttons, one full-viewport panel per event.
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView } from "motion/react";
import { ChevronDown, Clock } from "lucide-react";
import { invite, type InviteEvent } from "@/lib/invite";
import { useLang } from "@/components/invite/lang";

const copy = {
  pill: { en: "Auspicious Muhurats & Ceremonial Itinerary", hi: "॥ शुभ लग्न मुहूर्त एवं मांगलिक अनुष्ठान रूपरेखा ॥" },
  title: { en: "THE AUSPICIOUS MUHURATS", hi: "मांगलिक कार्यक्रम एवं पावन मुहूर्त" },
  intro: {
    en: "From the auspicious Ganesh Puja and Maayra to Raasleela, the Ring Ceremony, the royal Baraat and Varmala & Pheras — an extraordinary visual journey across two celebratory days.",
    hi: "मंगलमय गणेश पूजन व मायरे, रासलीला और अंगूठी रस्म से लेकर शाही बारात एवं वरमाला व फेरों तक — दो स्वर्णिम दिवसों के पाँच पावन अनुष्ठानों की मंगलमय रूपरेखा।",
  },
  ceremony: { en: "CEREMONY", hi: "अनुष्ठान" },
};

// invite.ts has no night flag; the evening Ring Ceremony uses the reference's night (Sangeet) art and colours.
const NIGHT = new Set(["ring"]);

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Marigolds() {
  const leaves = [110, 170, 230, 290, 350, 410, 590, 650, 710, 770, 830, 890];
  const flowers: [number, number, number, boolean][] = [
    [50, 15, 10, false], [140, 32, 8.5, true], [200, 39, 9, false], [260, 42, 10, true], [320, 39, 9, false],
    [380, 32, 8.5, true], [450, 16, 9.5, false], [500, 14, 11, true], [550, 16, 9.5, false], [620, 32, 8.5, true],
    [680, 39, 9, false], [740, 42, 10, true], [800, 39, 9, false], [860, 32, 8.5, true], [950, 15, 10, false],
  ];
  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-none select-none my-2 sm:my-3 overflow-hidden">
      <svg viewBox="0 0 1000 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_2px_8px_rgba(217,119,6,0.22)]">
        <defs>
          <linearGradient id="marigoldOrangeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="marigoldYellowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="leafGreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="goldStringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B48834" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E5C378" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B48834" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 50 15 Q 250 55 450 15 Q 500 12 550 15 Q 750 55 950 15" stroke="url(#goldStringGrad)" strokeWidth="1.8" strokeDasharray="4 2" />
        {leaves.map((x) => (
          <path key={x} d={`M ${x} 26 Q ${x + 6} 44 ${x} 52 Q ${x - 6} 44 ${x} 26 Z`} fill="url(#leafGreenGrad)" opacity="0.9" />
        ))}
        {flowers.map(([cx, cy, r, yellow]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r={r} fill={yellow ? "url(#marigoldYellowGrad)" : "url(#marigoldOrangeGrad)"} />
            <circle cx={cx} cy={cy} r={0.6 * r} fill="#FEF3C7" opacity="0.85" />
            <circle cx={cx} cy={cy} r={0.25 * r} fill="#B45309" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function Swirl({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 90 24" fill="none" className={`w-10 sm:w-16 h-auto stroke-[#C59B27] opacity-85 shrink-0 hidden sm:block${flip ? " -scale-x-100" : ""}`}>
      <path d="M 0 12 C 25 12, 40 4, 60 4 C 75 4, 82 20, 88 12" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M 30 12 C 45 18, 65 18, 75 14" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="60" cy="4" r="1.8" fill="#C59B27" />
      <circle cx="88" cy="12" r="1.4" fill="#FFF2B2" />
    </svg>
  );
}

// The reference's RoyalCelebrationFiligree divider.
function Filigree({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-4xl lg:max-w-5xl mx-auto my-1 sm:my-1.5 ${className}`}>
      <div className="flex-1 flex items-center justify-end">
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] mr-1.5 sm:mr-2 opacity-75 select-none">✦</span>
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-r from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <Swirl />
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
          <path d="M 15 24 C 45 6, 90 4, 90 4 C 90 4, 135 6, 165 24" stroke="url(#filigreeStrokeGradFull)" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="90" cy="4" r="2.2" fill="url(#filigreeGoldGradFull)" />
          <path d="M 90 6 C 90 6, 99 18, 99 30 C 99 37, 95 42, 90 42 C 85 42, 81 37, 81 30 C 81 18, 90 6, 90 6 Z" fill="url(#filigreeGoldGradFull)" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.8" />
          <path d="M 90 42 C 83 40, 72 34, 72 25 C 72 16, 82 13, 82 13 C 82 13, 76 24, 85 34 C 87 38, 90 42, 90 42 Z" fill="url(#filigreeGoldGradFull)" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.75" />
          <path d="M 90 42 C 97 40, 108 34, 108 25 C 108 16, 98 13, 98 13 C 98 13, 104 24, 95 34 C 93 38, 90 42, 90 42 Z" fill="url(#filigreeGoldGradFull)" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.75" />
          <path d="M 88 42 C 79 42, 59 37, 59 27 C 59 19, 70 17, 70 17 C 70 17, 63 27, 75 36 C 81 40, 88 42, 88 42 Z" fill="url(#filigreeGoldGradFull)" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.7" opacity="0.88" />
          <path d="M 92 42 C 101 42, 121 37, 121 27 C 121 19, 110 17, 110 17 C 110 17, 117 27, 105 36 C 99 40, 92 42, 92 42 Z" fill="url(#filigreeGoldGradFull)" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.7" opacity="0.88" />
          <path d="M 56 36 C 42 33, 30 35, 20 40" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="19" cy="40" r="1.6" fill="url(#filigreeGoldGradFull)" />
          <path d="M 124 36 C 138 33, 150 35, 160 40" stroke="url(#filigreeStrokeGradFull)" strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="161" cy="40" r="1.6" fill="url(#filigreeGoldGradFull)" />
          <path d="M 38 42 C 54 40, 74 44, 90 44 C 106 44, 126 40, 142 42 C 142 42, 126 46, 90 46 C 54 46, 38 42, 38 42 Z" fill="url(#filigreeGoldGradFull)" opacity="0.95" />
          <polygon points="90,44 94,48 90,52 86,48" fill="url(#filigreeGoldGradFull)" />
          <circle cx="90" cy="36" r="2.2" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </motion.div>
      <div className="flex-1 flex items-center justify-start">
        <Swirl flip />
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-l from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] ml-1.5 sm:ml-2 opacity-75 select-none">✦</span>
      </div>
    </div>
  );
}

function Panel({ event: e, index, total, nextId }: { event: InviteEvent; index: number; total: number; nextId: string }) {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 85, damping: 24, mass: 0.5 });
  const yD = useTransform(p, [0, 1], [-45, 45]);
  const sD = useTransform(p, [0, 0.5, 1], [1.07, 1.015, 1.07]);
  const yM = useTransform(p, [0, 1], [-35, 35]);
  const sM = useTransform(p, [0, 0.5, 1], [1.06, 1.015, 1.06]);
  const yText = useTransform(p, [0, 0.5, 1], [20, 0, -20]);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const night = NIGHT.has(e.id);
  const alt = `${e.name.en} - ${e.hindiLine}`;
  const loading = index === 0 ? "eager" : "lazy";
  const veil = night
    ? "bg-gradient-to-b from-[#090D16]/85 via-[#090D16]/45 to-transparent"
    : "bg-gradient-to-b from-[#FAF7F2]/90 via-[#FAF7F2]/45 to-transparent";

  return (
    <div ref={ref} id={e.id} className="relative w-full h-[100svh] min-h-[500px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none border-b border-[#C59B27]/25">
      <motion.div style={{ y: yM, scale: sM }} className="md:hidden absolute inset-0 z-0 pointer-events-none will-change-transform">
        <motion.div animate={inView ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full">
          <picture className="w-full h-full block">
            <source srcSet={e.art.portrait} type="image/webp" />
            { }
            <img src={e.art.portrait} alt={alt} className="w-full h-full object-cover object-bottom" loading={loading} decoding="async" width={1536} height={2752} />
          </picture>
        </motion.div>
        <div className={`absolute inset-x-0 top-0 h-52 min-[360px]:h-60 sm:h-72 pointer-events-none ${veil}`} />
      </motion.div>
      <motion.div style={{ y: yD, scale: sD }} className="hidden md:block absolute inset-0 z-0 pointer-events-none will-change-transform">
        <motion.div animate={inView ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full">
          <picture className="w-full h-full block">
            <source srcSet={e.art.landscape} type="image/webp" />
            { }
            <img src={e.art.landscape} alt={alt} className="w-full h-full object-cover object-center" loading={loading} decoding="async" width={2752} height={1536} />
          </picture>
        </motion.div>
        <div className={`absolute inset-x-0 top-0 h-52 md:h-64 lg:h-72 pointer-events-none ${veil}`} />
      </motion.div>

      <motion.div
        style={{ y: yText }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
        className="relative z-20 pt-11 min-[360px]:pt-13 sm:pt-16 md:pt-14 lg:pt-18 px-3 sm:px-6 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-center flex flex-col items-center pointer-events-auto will-change-transform"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          className={`inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full border shadow-2xs ${night ? "bg-[#0F172A]/85 border-[#FCD34D]/45 text-[#FDE68A]" : "bg-[#FFFDF9]/95 border-[#C59B27]/45 text-[#78350F]"}`}
        >
          <motion.span animate={{ rotate: [0, 180, 360], scale: [1, 1.25, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} className="text-[#C59B27] text-[8px] sm:text-[9px] inline-block">✦</motion.span>
          <span className={`text-[9.5px] min-[360px]:text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] ${hi ? "font-serif-hi" : "font-cinzel"}`}>
            {t(copy.ceremony)} {e.num} · {t(e.dateShort)}
          </span>
          <motion.span animate={{ rotate: [360, 180, 0], scale: [1, 1.25, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} className="text-[#C59B27] text-[8px] sm:text-[9px] inline-block">✦</motion.span>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
          className={`inline-flex items-center justify-center gap-1.5 my-1 sm:my-1.5 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full border shadow-2xs ${night ? "bg-[#0F172A]/80 border-[#FCD34D]/35 text-[#FDE68A]" : "bg-[#FFFDF9]/92 border-[#C59B27]/35 text-[#78350F]"}`}
        >
          <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C59B27]" aria-hidden="true" />
          </motion.div>
          <span className="font-sans font-bold text-[11px] min-[360px]:text-xs sm:text-sm tracking-wide uppercase tabular-nums">{t(e.time)}</span>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="my-0.5 sm:my-1 max-w-lg lg:max-w-2xl">
          <h3
            className={`text-xl min-[360px]:text-[22px] min-[400px]:text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-bold tracking-tight leading-[1.15] text-center ${night ? "text-[#FFFDF5] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]" : "text-[#2B1304] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] drop-shadow-[0_1px_3px_rgba(255,255,255,1)]"} ${hi ? "font-serif-hi" : "font-cinzel"}`}
          >
            {hi ? e.name.hi : e.name.en}
          </h3>
          <p
            className={`text-[10.5px] min-[360px]:text-[11.5px] sm:text-sm md:text-[15px] font-bold mt-0.5 sm:mt-1 tracking-wider text-center ${night ? "text-[#FCD34D] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" : "text-[#6B3008] drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]"} ${hi ? "font-cinzel" : "font-serif-hi"}`}
          >
            {hi ? e.name.en : e.hindiLine}
          </p>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.5 } } }} className="flex items-center justify-center gap-1.5 mt-0.5 sm:mt-1 w-full max-w-[90px] sm:max-w-[130px]">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C59B27]/70" />
          <span className="text-[#C59B27] text-[8px] sm:text-[9px]">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C59B27]/70" />
        </motion.div>
      </motion.div>

      <div className="relative z-20 pb-3 sm:pb-4 md:pb-5 px-3.5 sm:px-6 flex items-center justify-between text-xs text-[#78350F] max-w-7xl mx-auto w-full">
        <span className={`font-cinzel text-[9.5px] sm:text-[11px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border shadow-2xs ${night ? "bg-[#0F172A]/85 text-[#FDE68A] border-[#FCD34D]/40" : "bg-[#FFFDF9]/90 text-[#78350F] border-[#C59B27]/35"}`}>
          0{index + 1} / 0{total}
        </span>
        <button
          type="button"
          onClick={() => go(nextId)}
          className={`group flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${night ? "bg-[#0F172A]/85 hover:bg-[#1E293B]/95 text-[#FDE68A] border-[#FCD34D]/45 hover:border-[#FCD34D]" : "bg-[#FFFDF9]/92 hover:bg-[#FFF8E7] text-[#78350F] border-[#C59B27]/40 hover:border-[#C59B27]"}`}
        >
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-sans">{t(e.next)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-y-0.5 transition-transform duration-200 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Programme() {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const events = invite.events;
  const dayStart = [events[0].id, events.find((e) => e.day === 2)!.id];

  return (
    <section id="programme" className="relative w-full bg-[#FAF7F2] text-[#1C1917] overflow-hidden scroll-mt-0 border-t border-[#C59B27]/30">
      <div className="py-8 sm:py-12 md:py-14 px-4 text-center max-w-4xl mx-auto relative z-10">
        <Marigolds />
        <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#FFFDF9]/95 border border-[#C59B27]/40 shadow-2xs">
          <span className="text-[#C59B27] text-xs">✦</span>
          <span className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#8A6516] ${hi ? "font-serif-hi" : "font-cinzel"}`}>{t(copy.pill)}</span>
          <span className="text-[#C59B27] text-xs">✦</span>
        </div>
        <h2 className={`text-2xl min-[360px]:text-3xl sm:text-5xl md:text-6xl font-bold text-[#78350F] tracking-tight leading-[1.1] mb-2 ${hi ? "font-display-hi" : "font-cinzel"}`}>{t(copy.title)}</h2>
        <p className={`text-xs min-[400px]:text-sm sm:text-base text-[#292524] font-medium tracking-wide max-w-2xl mx-auto leading-relaxed ${hi ? "font-serif-hi" : "font-serif"}`}>{t(copy.intro)}</p>
        <Filigree className="my-2.5 sm:my-3.5 opacity-85" />
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-3 sm:mt-4">
          <button
            type="button"
            onClick={() => go(dayStart[0])}
            className="px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-[#9B7018] via-[#C59B27] to-[#8A6516] text-[#FFFDF8] text-[11px] sm:text-xs font-bold tracking-wider uppercase border border-[#FFF2B2]/60 shadow-xs hover:brightness-105 transition-all cursor-pointer"
          >
            {t(invite.dates.days[0])}
          </button>
          <button
            type="button"
            onClick={() => go(dayStart[1])}
            className="px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#FAF3E2] hover:bg-[#F3E7CA] text-[#78350F] text-[11px] sm:text-xs font-bold tracking-wider uppercase border border-[#C59B27]/40 shadow-xs transition-all cursor-pointer"
          >
            {t(invite.dates.days[1])}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => go(e.id)}
              className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9]/80 hover:bg-[#FFFDF9] text-[#78350F] text-[10px] sm:text-[11px] font-semibold border border-[#C59B27]/30 hover:border-[#C59B27]/60 transition-colors cursor-pointer"
            >
              <span className="text-[#C59B27] mr-1 font-bold">0{i + 1}</span>
              <span>{t(e.chip)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col">
        {events.map((e, i) => (
          <Panel key={e.id} event={e} index={i} total={events.length} nextId={events[i + 1]?.id ?? "dress-code"} />
        ))}
      </div>
    </section>
  );
}
