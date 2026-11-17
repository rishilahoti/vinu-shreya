"use client";

// Copy of the reference footer: monogram, blessing, hashtag card with confetti copy, share/copy/top buttons, address line.
import { scrollToTarget } from "./SmoothScroll";
import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Camera, Check, Copy, Heart, MapPin, Share2, Sparkles } from "lucide-react";
import { invite, waShare } from "@/lib/invite";
import { useLang } from "./lang";
import { Parallax, Reveal } from "./reveal";

const { groom, bride, families, venue, dates, hashtag } = invite;
// Not in invite.ts: the reference shows a Devanagari hashtag in Hindi with the English one underneath.
const HASHTAG_HI = "#विनम्रवेड्सश्रेया";
const deva = (s: string) => s.replace(/\d/g, (d) => "०१२३४५६७८९"[+d]);

const copy = {
  blessing: { en: "॥ SADA MANGALAM BHAVATU ॥", hi: "॥ सदा मंगलम् भवतु · शुभं करोति कल्याणम् ॥" },
  couple: { en: `${groom.en} & ${bride.en}`, hi: `${groom.hi} एवं ${bride.hi}` },
  message: {
    en: `Looking forward to celebrating love, laughter, and timeless memories with our cherished family and friends. Warm regards from the ${families.en} families.`,
    hi: `आप सभी स्नेही स्वजनों के शुभाशीष एवं स्नेहिल सान्निध्य की अभिलाषा में — ${families.hi} परिवार।`,
  },
  official: { en: "OFFICIAL CELEBRATION HASHTAG", hi: "आधिकारिक विवाह हैशटैग" },
  tagLine: {
    en: "Tag your cherished photos, stories, and reels to be part of our wedding tapestry.",
    hi: "अपनी सभी खूबसूरत तस्वीरों, रील्स एवं यादों में इस पावन हैशटैग को अवश्य जोड़ें।",
  },
  copied: { en: "Hashtag Copied to Clipboard! ✨", hi: "हैशटैग कॉपी हुआ! ✨" },
  copyTag: { en: "Copy Hashtag", hi: "हैशटैग कॉपी करें" },
  ready: { en: "Ready to tag on Instagram & Reels!", hi: "इंस्टाग्राम व रील्स पर टैग करने हेतु तैयार!" },
  share: { en: "Share on WhatsApp", hi: "व्हाट्सएप पर शेयर करें" },
  linkCopied: { en: "Invitation Link Copied!", hi: "निमंत्रण लिंक कॉपी हुआ!" },
  copyLink: { en: "Copy Invitation Link", hi: "निमंत्रण लिंक कॉपी करें" },
  top: { en: "Back to Top", hi: "शीर्ष पर जाएं" },
  address: {
    en: `${venue.name.en}, ${venue.area.en} · ${dates.range.en}`,
    hi: deva(`${venue.name.hi}, ${venue.area.hi} · ${dates.range.hi}`),
  },
  crafted: { en: `Crafted with love for ${groom.en} & ${bride.en}`, hi: `${groom.hi} एवं ${bride.hi} के लिए सस्नेह समर्पित` },
};

// shortcut: tiny stand-in for canvas-confetti (not installed); same burst parameters, simpler particle shapes.
function confetti({ count, angle = 90, spread, x, y, colors }: { count: number; angle?: number; spread: number; x: number; y: number; colors: string[] }) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100";
  c.width = innerWidth;
  c.height = innerHeight;
  document.body.appendChild(c);
  const g = c.getContext("2d")!;
  const ps = Array.from({ length: count }, () => ({
    x: x * c.width, y: y * c.height, v: 22.5 + Math.random() * 45,
    a: -(angle * Math.PI) / 180 + ((0.5 - Math.random()) * spread * Math.PI) / 180,
    w: Math.random() * 10, ws: 0.05 + Math.random() * 0.06, t: Math.random() * Math.PI,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  let tick = 0;
  const frame = () => {
    g.clearRect(0, 0, c.width, c.height);
    g.globalAlpha = 1 - tick / 200;
    for (const p of ps) {
      p.x += Math.cos(p.a) * p.v;
      p.y += Math.sin(p.a) * p.v + 3;
      p.v *= 0.9;
      p.w += p.ws;
      p.t += 0.1;
      g.fillStyle = p.color;
      g.save();
      g.translate(p.x + 10 * Math.cos(p.w), p.y + 10 * Math.sin(p.w));
      g.rotate(p.t);
      g.fillRect(-5, -3 * Math.abs(Math.cos(p.t)), 10, 6 * Math.abs(Math.cos(p.t)) + 1);
      g.restore();
    }
    if (++tick < 200) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}

function BotanicalCornerSprig({ position }: { position: "top-left" | "top-right" }) {
  const pos = { "top-left": "top-2 left-2 sm:top-3 sm:left-3", "top-right": "top-2 right-2 sm:top-3 sm:right-3 -scale-x-100" }[position];
  const u = `url(#goldSprig_${position})`;
  return (
    <div className={`absolute pointer-events-none select-none z-0 ${pos} `}>
      {/* negative: drifts down as the footer rises, so the sprig never slides up under the clipped top edge */}
      <Parallax speed={-20}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 sm:w-16 md:w-20 h-auto opacity-45 drop-shadow-[0_1px_4px_rgba(197,155,39,0.18)]">
        <defs>
          <linearGradient id={`goldSprig_${position}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#AA771C" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E5C365" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#C59B27" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8A6516" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M 4 116 C 16 95, 34 72, 60 48 C 80 30, 98 16, 116 4" stroke={u} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M 22 96 C 14 88, 10 78, 16 70 C 24 76, 28 86, 22 96 Z" fill={u} opacity="0.85" />
        <path d="M 32 86 C 42 78, 48 68, 42 60 C 34 68, 28 78, 32 86 Z" fill={u} opacity="0.8" />
        <path d="M 48 70 C 38 60, 34 48, 42 40 C 50 48, 56 58, 48 70 Z" fill={u} opacity="0.88" />
        <path d="M 60 60 C 72 50, 80 40, 74 32 C 64 42, 56 52, 60 60 Z" fill={u} opacity="0.85" />
        <path d="M 76 44 C 68 34, 66 22, 74 16 C 82 24, 86 34, 76 44 Z" fill={u} opacity="0.9" />
        <path d="M 90 32 C 102 22, 110 14, 104 6 C 94 14, 86 24, 90 32 Z" fill={u} opacity="0.85" />
        <path d="M 106 18 C 112 10, 118 8, 116 4 C 110 6, 104 12, 106 18 Z" fill={u} />
        <circle cx="16" cy="70" r="1.5" fill="#FFF2B2" />
        <circle cx="42" cy="40" r="1.6" fill="#FFF2B2" />
        <circle cx="74" cy="16" r="1.6" fill="#FFF2B2" />
        <circle cx="116" cy="4" r="1.8" fill="#FFF2B2" />
      </svg>
      </Parallax>
    </div>
  );
}

function Swirl({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 90 24" fill="none" className={`w-10 sm:w-16 h-auto stroke-[#C59B27] opacity-85 shrink-0 hidden sm:block${flip ? " -scale-x-100" : ""}`}>
      <path d="M 0 12 C 25 12, 40 4, 60 4 C 75 4, 82 20, 88 12" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M 30 12 C 45 18, 65 18, 75 14" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="60" cy="4" r="1.8" fill="#C59B27" />
      <circle cx="88" cy="12" r="1.4" fill="#FFF2B2" />
    </svg>
  );
}

function RoyalCelebrationFiligree({ className = "" }: { className?: string }) {
  const f = "url(#filigreeGoldGradFull)";
  const s = "url(#filigreeStrokeGradFull)";
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
          <path d="M 15 24 C 45 6, 90 4, 90 4 C 90 4, 135 6, 165 24" stroke={s} strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="90" cy="4" r="2.2" fill={f} />
          <path d="M 90 6 C 90 6, 99 18, 99 30 C 99 37, 95 42, 90 42 C 85 42, 81 37, 81 30 C 81 18, 90 6, 90 6 Z" fill={f} stroke={s} strokeWidth="0.8" />
          <path d="M 90 42 C 83 40, 72 34, 72 25 C 72 16, 82 13, 82 13 C 82 13, 76 24, 85 34 C 87 38, 90 42, 90 42 Z" fill={f} stroke={s} strokeWidth="0.75" />
          <path d="M 90 42 C 97 40, 108 34, 108 25 C 108 16, 98 13, 98 13 C 98 13, 104 24, 95 34 C 93 38, 90 42, 90 42 Z" fill={f} stroke={s} strokeWidth="0.75" />
          <path d="M 88 42 C 79 42, 59 37, 59 27 C 59 19, 70 17, 70 17 C 70 17, 63 27, 75 36 C 81 40, 88 42, 88 42 Z" fill={f} stroke={s} strokeWidth="0.7" opacity="0.88" />
          <path d="M 92 42 C 101 42, 121 37, 121 27 C 121 19, 110 17, 110 17 C 110 17, 117 27, 105 36 C 99 40, 92 42, 92 42 Z" fill={f} stroke={s} strokeWidth="0.7" opacity="0.88" />
          <path d="M 56 36 C 42 33, 30 35, 20 40" stroke={s} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="19" cy="40" r="1.6" fill={f} />
          <path d="M 124 36 C 138 33, 150 35, 160 40" stroke={s} strokeWidth="0.9" strokeLinecap="round" />
          <circle cx="161" cy="40" r="1.6" fill={f} />
          <path d="M 38 42 C 54 40, 74 44, 90 44 C 106 44, 126 40, 142 42 C 142 42, 126 46, 90 46 C 54 46, 38 42, 38 42 Z" fill={f} opacity="0.95" />
          <polygon points="90,44 94,48 90,52 86,48" fill={f} />
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

export default function Footer() {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const [linkCopied, setLinkCopied] = useState(false);
  const [tagCopied, setTagCopied] = useState(false);
  const tag = hi ? HASHTAG_HI : hashtag;

  const copyTag = (e: MouseEvent<HTMLElement>) => {
    navigator.clipboard?.writeText(tag);
    setTagCopied(true);
    const r = (e.target as HTMLElement).getBoundingClientRect();
    const x = (r.left + r.width / 2) / innerWidth;
    const y = (r.top + r.height / 2) / innerHeight;
    confetti({ count: 55, spread: 70, x, y, colors: ["#C59B27", "#E5C365", "#AA771C", "#8A6516", "#FFFFFF"] });
    setTimeout(() => {
      const colors = ["#F5D77F", "#C59B27", "#BD788A", "#9B2C47"];
      confetti({ count: 40, angle: 60, spread: 55, x: Math.max(0.2, x - 0.15), y, colors });
      confetti({ count: 40, angle: 120, spread: 55, x: Math.min(0.8, x + 0.15), y, colors });
    }, 150);
    setTimeout(() => setTagCopied(false), 3000);
  };

  const share = () => {
    const text = `✨ Royal Wedding Invitation ✨

You are warmly invited to celebrate the royal wedding of ${groom.en} & ${bride.en} at ${venue.short.en.replace(" ·", ",")} on ${dates.range.en}.

Wedding Day: 2nd February 2027
Official Celebration Hashtag: ${tag}

View the full digital invitation and itinerary:
${location.href}`;
    window.open(waShare(text), "_blank");
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2400);
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#F5ECE0] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#C59B27]/30 text-center overflow-hidden">
      <Parallax speed={70} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C59B27]/12 rounded-full blur-[160px] pointer-events-none" />
      </Parallax>
      {/* the dot layer overhangs by 48px top and bottom so its edges never show across the 40px travel */}
      <Parallax speed={40} className="absolute inset-x-0 -inset-y-12 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#C59B27_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.14] pointer-events-none" />
      </Parallax>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [-15, 15, -15], x: i % 2 === 0 ? [-10, 10, -10] : [10, -10, 10], opacity: [0.25, 0.7, 0.25], scale: [0.9, 1.2, 0.9] }}
          transition={{ repeat: Infinity, duration: 6 + 1.5 * i, ease: "easeInOut", delay: 0.8 * i }}
          className="absolute pointer-events-none text-[#C59B27]/40 text-sm select-none"
          style={{ top: `${15 + 14 * i}%`, left: `${10 + 15 * i}%` }}
          aria-hidden="true"
        >
          ✦
        </motion.div>
      ))}
      <BotanicalCornerSprig position="top-left" />
      <BotanicalCornerSprig position="top-right" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal className="relative inline-block mx-auto mb-6">
          <span className="animate-ping absolute inset-0 rounded-full bg-[#C59B27] opacity-20" />
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute -inset-3 rounded-full border border-dashed border-[#C59B27]/40 pointer-events-none" />
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-[#C59B27] bg-gradient-to-br from-[#FFFFFF] via-[#FAF6EE] to-[#F5ECE0] shadow-[0_10px_30px_rgba(138,101,22,0.22)] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/shravi-mark.webp" alt={`${groom.en} & ${bride.en} monogram`} width={860} height={935} style={{ height: "78%", width: "auto" }} loading="lazy" decoding="async" />
          </div>
        </Reveal>
        <div>
          <Reveal delay={0.08}>
          <p className={`text-xs sm:text-sm uppercase mb-2 font-bold text-[#8A6516] tracking-[0.28em] ${hi ? "font-serif-hi" : "font-cinzel"}`}>{t(copy.blessing)}</p>
          </Reveal>
          <Reveal delay={0.16}>
          <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold text-[#1C1917] tracking-tight leading-tight mb-2 drop-shadow-xs ${hi ? "font-display-hi" : "font-cinzel"}`}>{t(copy.couple)}</h2>
          </Reveal>
          <Reveal delay={0.24}>
          <RoyalCelebrationFiligree className="my-3" />
          </Reveal>
          <Reveal delay={0.32}>
          <p className={`text-[14.5px] sm:text-base md:text-[17px] text-[#0F172A] max-w-xl mx-auto leading-relaxed mb-8 font-sans font-medium ${hi ? "font-serif-hi" : ""}`}>{t(copy.message)}</p>
          </Reveal>
        </div>
        <div className="mb-10 sm:mb-14">
          <Reveal blur={6} className="relative inline-block max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto">
            <motion.div animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.3, 0.75, 0.3] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }} className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#C59B27]/30 via-[#F5D77F]/50 to-[#C59B27]/30 blur-2xl pointer-events-none" />
            <motion.div whileHover={{ scale: 1.015, y: -3 }} transition={{ duration: 0.25 }} className="relative rounded-3xl border border-[#C59B27]/50 bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF5EB] p-4 sm:p-7 md:p-8 shadow-[0_18px_50px_-10px_rgba(197,155,39,0.3)] overflow-hidden group">
              <div className="absolute inset-1.5 rounded-[22px] border border-[#C59B27]/30 pointer-events-none" />
              <motion.div animate={{ x: ["-200%", "250%"] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", repeatDelay: 1.8 }} className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none z-10" />
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FAF5EB] border border-[#C59B27]/35 text-[#8A6516] text-[10px] min-[360px]:text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-3 sm:mb-4 shadow-2xs relative z-20">
                <motion.span animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} className="text-[#C59B27]">
                  ✦
                </motion.span>
                <span>{t(copy.official)}</span>
                <Camera className="w-3.5 h-3.5 text-[#C59B27]" />
              </div>
              <div onClick={copyTag} className="relative my-1 sm:my-3 flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-full px-2 select-all cursor-pointer group" title="Click to copy hashtag with confetti">
                <motion.span animate={{ rotate: [0, 180, 360], scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="text-[#C59B27] text-sm sm:text-xl shrink-0 select-none hidden md:inline-block">
                  ✦
                </motion.span>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
                  className="relative max-w-full overflow-hidden pt-2 sm:pt-4 pb-1 sm:pb-2 px-1 flex items-center justify-center"
                >
                  <h3
                    className={`${hi ? "font-serif-hi" : "font-cinzel"} text-[clamp(1.15rem,3.2vw,2.65rem)] font-extrabold tracking-normal sm:tracking-wide leading-[1.3] sm:leading-[1.35] select-all max-w-full text-center inline-block`}
                    style={{ background: "linear-gradient(180deg, #FFF6D1 0%, #E5C365 32%, #C59B27 70%, #8A6516 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 4px 16px rgba(197,155,39,0.38))" }}
                  >
                    {tag}
                  </h3>
                </motion.div>
                <motion.span animate={{ rotate: [360, 180, 0], scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="text-[#C59B27] text-sm sm:text-xl shrink-0 select-none hidden md:inline-block">
                  ✦
                </motion.span>
              </div>
              <p className="text-sm sm:text-[14.5px] font-sans text-[#0F172A] font-medium mt-2 mb-2 max-w-md mx-auto leading-relaxed relative z-20">{t(copy.tagLine)}</p>
              {hi && (
                <div className="mb-5 relative z-20 flex items-center justify-center gap-1.5 text-[11.5px] text-[#8A6516]/80 font-sans">
                  <span>English:</span>
                  <span className="font-mono font-bold text-[#6D4F10]">{hashtag}</span>
                </div>
              )}
              <div className="relative z-20 inline-flex flex-col items-center">
                <button type="button" onClick={copyTag} className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-[#9B7018] via-[#C59B27] to-[#9B7018] hover:brightness-105 active:scale-98 text-white text-xs sm:text-sm font-sans font-bold shadow-[0_4px_16px_rgba(197,155,39,0.28)] hover:shadow-[0_8px_24px_rgba(197,155,39,0.38)] transition-all cursor-pointer group">
                  {tagCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>{t(copy.copied)}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>{t(copy.copyTag)}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#FFF2B2] animate-pulse" />
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {tagCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold shadow-xs"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{t(copy.ready)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Reveal>
        </div>
        <Reveal delay={0.08} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button type="button" onClick={share} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1E7A4E]/40 bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#1E7A4E] text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5">
            <Share2 className="h-4 w-4" />
            <span>{t(copy.share)}</span>
          </button>
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C59B27]/40 bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#1C1917] text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5">
            {linkCopied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">{t(copy.linkCopied)}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#8A6516]" />
                <span>{t(copy.copyLink)}</span>
              </>
            )}
          </button>
          <button type="button" onClick={() => scrollToTarget(0)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#C59B27]/30 bg-[#FAF5EB] hover:bg-[#FFFFFF] text-[#8A6516] text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer shadow-xs hover:-translate-y-0.5" title="Return to the beginning">
            <ArrowUp className="h-4 w-4" />
            <span>{t(copy.top)}</span>
          </button>
        </Reveal>
        <Reveal delay={0.08} className="border-t border-[#C59B27]/25 pt-8 text-[12.5px] sm:text-[13.5px] font-sans font-medium text-[#0F172A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
            <span>{t(copy.address)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8A6516] font-semibold">
            <span>{t(copy.crafted)}</span>
            <Heart className="h-3.5 w-3.5 text-[#9B2C47] fill-[#9B2C47]" />
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
