"use client";

// Full-screen entry gate: invocation, monogram art, names, live countdown, "Open Wedding Invitation".
// Copy of the reference portal; clicking starts the music, slides the gate up and reveals the site.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { invite } from "@/lib/invite";
import { useLang } from "./lang";

const copy = {
  invocation: { en: "SHREE GANESHAY NAMAH", hi: "श्री गणेशाय नमः" },
  names: { en: `${invite.groom.en} & ${invite.bride.en}`, hi: `${invite.groom.hi} एवं ${invite.bride.hi}` },
  tagline: { en: "We Are Getting Married", hi: "हमारा शुभ विवाह" },
  days: { en: "DAYS", hi: "दिन" },
  hours: { en: "HOURS", hi: "घंटे" },
  mins: { en: "MINS", hi: "मिनट" },
  secs: { en: "SECS", hi: "सेकंड" },
  open: { en: "Open Wedding Invitation", hi: "विवाह पत्रिका खोलें" },
};

const unlockScroll = () => {
  const h = document.documentElement.style, b = document.body.style;
  h.overflow = b.overflow = h.overscrollBehavior = b.overscrollBehavior = "";
};

export default function Gate({ onComplete }: { onComplete?: () => void }) {
  const { lang, t } = useLang();
  const hi = lang === "hi";
  const [open, setOpen] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown to the first ceremony.
  useEffect(() => {
    const target = new Date(invite.startsAt).getTime();
    const tick = () => {
      const d = target - Date.now();
      setLeft(
        d > 0
          ? { days: Math.floor(d / 864e5), hours: Math.floor((d / 36e5) % 24), minutes: Math.floor((d / 1e3 / 60) % 60), seconds: Math.floor((d / 1e3) % 60) }
          : { days: 0, hours: 0, minutes: 0, seconds: 0 },
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Drifting gold / rose specks behind the content.
  useEffect(() => {
    if (!open) return;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    let w = (c.width = window.innerWidth), h = (c.height = window.innerHeight), raf = 0;
    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 42 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 1.8 * Math.random() + 0.6,
      baseAlpha: 0.45 * Math.random() + 0.18,
      pulseSpeed: 0.025 * Math.random() + 0.01,
      angle: Math.random() * Math.PI * 2,
      vy: 0.45 * Math.random() + 0.18,
      color: Math.random() > 0.45 ? "rgba(217, 119, 6, " : Math.random() > 0.5 ? "rgba(245, 158, 11, " : "rgba(225, 29, 72, ",
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        p.angle += p.pulseSpeed;
        p.y += p.vy;
        if (p.y > h + 10) p.y = -10;
        const a = Math.max(0.08, Math.min(0.85, p.baseAlpha + 0.2 * Math.sin(p.angle)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `${p.color}${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [open]);

  // Lock page scroll while the gate is up.
  useEffect(() => {
    if (!open) return unlockScroll();
    const h = document.documentElement.style, b = document.body.style;
    const prev = [h.overflow, b.overflow, h.overscrollBehavior, b.overscrollBehavior];
    h.overflow = b.overflow = "hidden";
    h.overscrollBehavior = b.overscrollBehavior = "none";
    const block = (e: Event) => e.cancelable && e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      [h.overflow, b.overflow, h.overscrollBehavior, b.overscrollBehavior] = prev.map((v) => v || "");
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [open]);

  const enter = () => {
    window.__weddingAudioPlay?.(); // inside the click, so the browser allows playback
    setOpen(false);
    onComplete?.();
    unlockScroll();
    try {
      window.dispatchEvent(new CustomEvent("wedding:play-audio"));
      window.dispatchEvent(new CustomEvent("wedding:intro-finished"));
    } catch {}
  };

  const units = [
    { label: t(copy.days), value: left.days },
    { label: t(copy.hours), value: left.hours },
    { label: t(copy.mins), value: left.minutes },
    { label: t(copy.secs), value: left.seconds },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="luxury-royal-ivory-portal"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 1, transition: { duration: 1.15, ease: [0.77, 0, 0.175, 1] } }}
          className="fixed inset-0 z-[999] w-full max-w-[100vw] h-full h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none touch-none select-none flex flex-col items-center justify-center text-[#1C1917] selection:bg-[#E5C365]/30 p-2 min-[360px]:p-3 sm:p-6"
        >
          <div className="md:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <picture className="w-full h-full block">
              <source srcSet="/images/background-images/bg-potrait-updated.webp" type="image/webp" />
              <img src="/images/background-images/bg-potrait-updated.webp" alt="Royal Wedding Background" className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
            </picture>
          </div>
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <picture className="w-full h-full block">
              <source srcSet="/images/background-images/bg-landscape.webp" type="image/webp" />
              <img src="/images/background-images/bg-landscape.webp" alt="Royal Wedding Background" className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
            </picture>
          </div>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[620px] h-[45vh] max-h-[420px] rounded-full bg-[#E5C365]/20 blur-[110px] z-0 overflow-hidden" />
          <canvas ref={canvas} className="absolute inset-0 pointer-events-none z-0 w-full h-full opacity-65" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[360px] min-[360px]:max-w-[420px] sm:max-w-md md:max-w-lg mx-auto flex flex-col items-center justify-center text-center my-auto px-2"
          >
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex items-center justify-center shrink-0 mb-0.5 sm:mb-1">
              <div className="inline-flex items-center justify-center gap-1 min-[360px]:gap-1.5 sm:gap-2 px-2 min-[360px]:px-2.5 sm:px-3 py-0.5 rounded-full border border-[#D97706]/35 bg-[#FFFDF7]/95 backdrop-blur-xs shadow-[0_1px_4px_rgba(217,119,6,0.06)] mx-auto max-w-full select-none">
                <span className="text-[#D97706] text-[6px] min-[360px]:text-[6.5px] sm:text-[7.5px] leading-none shrink-0 select-none">✦</span>
                <span className="font-serif-hi text-[#B45309] font-bold text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] leading-none shrink-0 select-none">॥</span>
                <span className={`font-bold text-[7px] min-[360px]:text-[7.5px] sm:text-[9px] uppercase leading-none select-none text-[#92400E] tracking-[0.14em] -mr-[0.14em] ${hi ? "font-serif-hi tracking-[0.06em] -mr-[0.06em]" : "font-cinzel"}`}>
                  {t(copy.invocation)}
                </span>
                <span className="font-serif-hi text-[#B45309] font-bold text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] leading-none shrink-0 select-none">॥</span>
                <span className="text-[#D97706] text-[6px] min-[360px]:text-[6.5px] sm:text-[7.5px] leading-none shrink-0 select-none">✦</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ aspectRatio: "860 / 935" }}
              className="relative w-52 min-[360px]:w-60 min-[400px]:w-68 sm:w-76 md:w-84 my-0.5 sm:my-1 max-h-[35vh] sm:max-h-[40vh] shrink filter drop-shadow-[0_6px_22px_rgba(138,101,22,0.28)] mx-auto flex items-center justify-center"
            >
              <Image
                src="/images/logo/shravi-mark.webp"
                alt={`${invite.groom.en} & ${invite.bride.en} Wedding Logo`}
                fill
                preload
                className="object-contain object-center"
                sizes="(max-width: 640px) 280px, 340px"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-1">
              <h1
                className={`text-[22px] min-[360px]:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-center px-1 ${hi ? "font-serif-hi" : "font-cinzel"}`}
                style={{
                  background: "linear-gradient(135deg, #781028 0%, #9E1538 35%, #B45309 70%, #8A5208 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 10px rgba(180,83,9,0.18))",
                }}
              >
                {t(copy.names)}
              </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="w-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 mb-1 sm:mb-2">
              <p className={`text-[9.5px] min-[360px]:text-[10.5px] sm:text-[12.5px] font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#8A6516] text-center ${hi ? "font-serif-hi tracking-wide" : "font-cinzel"}`}>
                {t(copy.tagline)}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="w-full max-w-[260px] min-[360px]:max-w-[285px] sm:max-w-sm mx-auto my-1.5 sm:my-2.5 shrink-0">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 w-full mx-auto">
                {units.map((u, i) => (
                  <div key={i} className="flex flex-col items-center justify-center py-1.5 sm:py-2.5 px-0.5 sm:px-1 rounded-xl sm:rounded-2xl border border-[#C59B27]/40 bg-white/85 backdrop-blur-xs shadow-[0_2px_8px_rgba(217,119,6,0.12)] transition-all duration-200">
                    <span className="font-cinzel text-lg min-[360px]:text-xl sm:text-2xl md:text-3xl font-extrabold text-[#781028] tracking-tight leading-none drop-shadow-2xs">{String(u.value).padStart(2, "0")}</span>
                    <span className="font-cinzel text-[7px] min-[360px]:text-[8px] sm:text-[9.5px] tracking-wider uppercase text-[#92400E] mt-0.5 sm:mt-1 font-bold leading-none">{u.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} className="w-full flex items-center justify-center mt-2.5 sm:mt-3.5 px-1 shrink-0">
              <button
                onClick={enter}
                type="button"
                className="group relative overflow-hidden rounded-full py-2.5 sm:py-3.5 px-6 min-[360px]:px-7 sm:px-9 font-cinzel text-[10.5px] min-[360px]:text-xs sm:text-[13px] tracking-[0.16em] sm:tracking-[0.24em] uppercase font-bold text-[#FFFDF7] shadow-[0_6px_22px_rgba(107,17,36,0.4),0_2px_6px_rgba(212,175,55,0.22)] hover:shadow-[0_10px_32px_rgba(107,17,36,0.6),0_0_24px_rgba(212,175,55,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 sm:gap-2.5 border border-[#E5C365] ring-1 ring-[#921535]/60 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #5B0C1E 0%, #7F122C 35%, #921535 55%, #6B0E23 100%)" }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" aria-hidden="true" />
                <span className="relative z-10 text-[#FFFDF7] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{t(copy.open)}</span>
                <span className="relative z-10 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#F5D77F] via-[#E5C365] to-[#B48328] flex items-center justify-center text-[#5B0C1E] shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
