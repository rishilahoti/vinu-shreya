"use client";

// "Moments In Motion" film section, a copy of the reference's #our-engagement-story.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Pause, Play } from "lucide-react";
import { invite } from "@/lib/invite";
import { useLang } from "./lang";
import { EASE_OUT, Parallax, RevealGroup, RevealItem, useReduce } from "./reveal";

const copy = {
  pill: { en: "Cinematic Celebration", hi: "॥ मांगलिक चलचित्र ॥" },
  title: { en: "Moments In Motion", hi: "यादों के हसीन पल" },
  body: {
    en: "A cinematic glimpse into our celebration of love, laughter, and timeless memories as two families unite as one.",
    hi: "हमारे प्रेम, आनंद और मांगलिक उत्सवों की एक खूबसूरत सिनेमैटिक झलक।",
  },
  playing: { en: "Playing", hi: "चल रहा है" },
  paused: { en: "Paused", hi: "रोकें" },
  caption: { en: "Welcome to the beginning of our journey", hi: "यादों की पावन शुरुआत · हमारा अमर सफर" },
};

const SPRIG_POS = {
  "top-left": "top-2 left-2 sm:top-3 sm:left-3",
  "bottom-right": "bottom-2 right-2 sm:bottom-3 sm:right-3 -scale-x-100 -scale-y-100",
};

function CornerSprig({ position }: { position: keyof typeof SPRIG_POS }) {
  const g = `url(#goldSprig_${position})`;
  return (
    <div className={`absolute pointer-events-none select-none z-0 ${SPRIG_POS[position]} opacity-35`}>
      <Parallax speed={28}>
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
  const fill = "url(#filigreeGoldGradFull)";
  const stroke = "url(#filigreeStrokeGradFull)";
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-4xl lg:max-w-5xl mx-auto my-1 sm:my-1.5 opacity-80">
      <div className="flex-1 flex items-center justify-end">
        <span className="text-[#C59B27] text-[8px] sm:text-[10px] mr-1.5 sm:mr-2 opacity-75 select-none">✦</span>
        <div className="h-[1px] w-full max-w-[80px] sm:max-w-[180px] md:max-w-[280px] bg-gradient-to-r from-transparent via-[#C59B27]/40 to-[#C59B27]" />
        <SideFlourish />
      </div>
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
        className="relative flex items-center justify-center shrink-0 "
      >
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
          <path d="M 15 24 C 45 6, 90 4, 90 4 C 90 4, 135 6, 165 24" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="90" cy="4" r="2.2" fill={fill} />
          <path d="M 90 6 C 90 6, 99 18, 99 30 C 99 37, 95 42, 90 42 C 85 42, 81 37, 81 30 C 81 18, 90 6, 90 6 Z" fill={fill} stroke={stroke} strokeWidth="0.8" />
          <path d="M 90 42 C 83 40, 72 34, 72 25 C 72 16, 82 13, 82 13 C 82 13, 76 24, 85 34 C 87 38, 90 42, 90 42 Z" fill={fill} stroke={stroke} strokeWidth="0.75" />
          <path d="M 90 42 C 97 40, 108 34, 108 25 C 108 16, 98 13, 98 13 C 98 13, 104 24, 95 34 C 93 38, 90 42, 90 42 Z" fill={fill} stroke={stroke} strokeWidth="0.75" />
          <path d="M 88 42 C 79 42, 59 37, 59 27 C 59 19, 70 17, 70 17 C 70 17, 63 27, 75 36 C 81 40, 88 42, 88 42 Z" fill={fill} stroke={stroke} strokeWidth="0.7" opacity="0.88" />
          <path d="M 92 42 C 101 42, 121 37, 121 27 C 121 19, 110 17, 110 17 C 110 17, 117 27, 105 36 C 99 40, 92 42, 92 42 Z" fill={fill} stroke={stroke} strokeWidth="0.7" opacity="0.88" />
          <path d="M 56 36 C 42 33, 30 35, 20 40" stroke={stroke} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="19" cy="40" r="1.6" fill={fill} />
          <path d="M 124 36 C 138 33, 150 35, 160 40" stroke={stroke} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="161" cy="40" r="1.6" fill={fill} />
          <path d="M 38 42 C 54 40, 74 44, 90 44 C 106 44, 126 40, 142 42 C 142 42, 126 46, 90 46 C 54 46, 38 42, 38 42 Z" fill={fill} opacity="0.95" />
          <polygon points="90,44 94,48 90,52 86,48" fill={fill} />
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

export default function Moments() {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const reduce = useReduce();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.15 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);

  // React does not reliably reflect the muted attribute; autoplay needs it set on the element.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
      userPaused.current = true;
    } else {
      userPaused.current = false;
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  // Play when 15% of the section is on screen (unless the guest paused it), pause when it leaves.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !userPaused.current) {
      v.play()?.catch(() => setPlaying(false));
    } else if (!inView) {
      v.pause();
    }
  }, [inView]);

  const label = playing ? "Pause film" : "Play film";

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#C59B27]/25 overflow-hidden select-none"
      id="our-engagement-story"
    >
      <CornerSprig position="top-left" />
      <CornerSprig position="bottom-right" />
      <Parallax speed={70} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#F5E6BE]/25 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      </Parallax>
      <RevealGroup className="max-w-2xl mx-auto text-center mb-8 sm:mb-12 relative z-10 px-2">
        <RevealItem>
        <div className="inline-flex items-center gap-2 mb-2.5 px-3.5 py-1 rounded-full bg-[#FFFDF9]/95 border border-[#C59B27]/40 shadow-2xs">
          <span className="text-[#C59B27] text-xs">✦</span>
          <span className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#8A6516] ${hi ? "font-serif-hi" : "font-cinzel"}`}>{t(copy.pill)}</span>
          <span className="text-[#C59B27] text-xs">✦</span>
        </div>
        </RevealItem>
        <RevealItem>
        <h2 className={`text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B4D3E] tracking-tight leading-[1.15] ${hi ? "font-display-hi" : "font-cinzel"}`}>{t(copy.title)}</h2>
        </RevealItem>
        <RevealItem className="my-2.5 sm:my-3.5 flex justify-center">
          <Filigree />
        </RevealItem>
        <RevealItem>
        <p className={`text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto leading-relaxed px-2 ${hi ? "font-serif-hi" : "font-sans"}`}>{t(copy.body)}</p>
        </RevealItem>
      </RevealGroup>
      <div className="max-w-xl sm:max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center">
        {/* the film frame is a big layer: rise + fade only, no filter (Reveal would leave blur() on it) */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={reduce ? { duration: 0.4, delay: 0.08, y: { duration: 0 } } : { duration: 0.9, ease: EASE_OUT, delay: 0.08 }}
        >
        <div
          className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0A0C] border-2 border-[#D4AF37]/60 shadow-[0_20px_50px_-15px_rgba(26,16,10,0.25),0_0_35px_rgba(212,175,55,0.16)] ring-1 ring-[#FFF2B2]/20 group cursor-pointer flex flex-col justify-end"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={toggle}
        >
          <video
            ref={videoRef}
            src={invite.video}
            autoPlay
            playsInline
            loop
            muted
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.36] sm:scale-[1.01] group-hover:scale-[1.38] sm:group-hover:scale-[1.03] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              aria-label={label}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 text-[#FFF2B2] text-[10px] sm:text-xs font-sans font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {playing ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t(copy.playing)}</span>
                  <Pause className="w-3 h-3 text-[#FFF2B2] fill-current ml-0.5" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{t(copy.paused)}</span>
                  <Play className="w-3 h-3 text-[#FFF2B2] fill-current ml-0.5" />
                </>
              )}
            </button>
          </div>
          <AnimatePresence>
            {(!playing || hover) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  aria-label={label}
                  className="pointer-events-auto relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#000000]/65 hover:bg-[#000000]/85 border-2 border-[#D4AF37] text-[#FFF2B2] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.4)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {playing ? (
                    <Pause className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FFF2B2] fill-[#FFF2B2]" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FFF2B2] fill-[#FFF2B2] ml-0.5" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative z-20 px-3.5 py-2.5 sm:px-6 sm:py-5 md:px-8 md:py-6 pointer-events-none flex flex-col justify-end">
            <h2 className={`text-xs min-[360px]:text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-[#FFFFFF] leading-snug sm:leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl ${hi ? "font-display-hi" : "font-cinzel"}`}>
              <span>{t(copy.caption)}</span>
            </h2>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}
