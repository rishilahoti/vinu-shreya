"use client";

// 1:1 copy of the reference hero: falling-petal canvas, separate mobile / desktop layouts, scroll parallax.
import { scrollToTarget } from "./SmoothScroll";
import { useReduce } from "./reveal";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { Calendar } from "lucide-react";
import { invite } from "@/lib/invite";
import { useLang } from "@/components/invite/lang";
import styles from "./Hero.module.css";

const G = invite.groom;
const B = invite.bride;
const copy = {
  titleM: { en: "The Wedding Celebration of", hi: "॥ मांगलिक वैवाहिक उत्सव ॥" },
  titleD: { en: "The Wedding Celebration of", hi: "॥ मांगलिक वैवाहिक परिणयोत्सव ॥" },
  // Full Hindi names are not in invite.ts; the reference shows them under the desktop title in Hindi.
  fullHi: "विनम्र राठी संग श्रेया लड्ढा",
  // The reference writes the Hindi date with Devanagari digits.
  dateHi: "१ एवं २ फ़रवरी",
  yearHi: "२०२७",
  exploreM: { en: "Explore Celebrations", hi: "उत्सव अवलोकन करें" },
  exploreD: { en: "Scroll to Explore", hi: "उत्सव में प्रवेश करें" },
};

function Petals({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    const n = t.getContext("2d");
    if (!n) return;
    let raf = 0;
    const size = () => {
      const e = t.parentElement;
      const w = e ? e.clientWidth : t.offsetWidth || window.innerWidth;
      const h = e ? e.clientHeight : t.offsetHeight || window.innerHeight;
      t.width = w;
      t.height = h;
      return { w, h };
    };
    let { w: W, h: H } = size();
    const mouse = { x: -1e3, y: -1e3, targetX: -1e3, targetY: -1e3 };
    const onResize = () => ({ w: W, h: H } = size());
    const onMove = (e: Event) => {
      const r = t.getBoundingClientRect();
      mouse.targetX = (e as MouseEvent).clientX - r.left;
      mouse.targetY = (e as MouseEvent).clientY - r.top;
    };
    const onLeave = () => {
      mouse.targetX = -1e3;
      mouse.targetY = -1e3;
    };
    window.addEventListener("resize", onResize);
    const host: HTMLElement | Window = t.parentElement || window;
    host.addEventListener("mousemove", onMove, { passive: true });
    host.addEventListener("mouseleave", onLeave, { passive: true });

    const sprite = (s: number, draw: (c: CanvasRenderingContext2D) => void) => {
      const e = document.createElement("canvas");
      e.width = s;
      e.height = s;
      const c = e.getContext("2d");
      if (c) draw(c);
      return e;
    };
    const gold = sprite(44, (c) => {
      c.save();
      c.translate(22, 22);
      c.beginPath();
      c.moveTo(-10, -14);
      c.lineTo(8, -12);
      c.lineTo(14, 2);
      c.lineTo(6, 14);
      c.lineTo(-8, 12);
      c.lineTo(-14, 0);
      c.closePath();
      const g = c.createLinearGradient(-12, -14, 14, 14);
      g.addColorStop(0, "#FFF6D3");
      g.addColorStop(0.3, "#E5C365");
      g.addColorStop(0.7, "#C59B27");
      g.addColorStop(1, "#8A6516");
      c.fillStyle = g;
      c.shadowColor = "rgba(229, 195, 101, 0.45)";
      c.shadowBlur = 5;
      c.fill();
      c.strokeStyle = "rgba(255, 255, 255, 0.6)";
      c.lineWidth = 0.7;
      c.stroke();
      c.restore();
    });
    const rose = sprite(48, (c) => {
      c.save();
      c.translate(24, 24);
      c.rotate(-0.2);
      c.beginPath();
      c.moveTo(0, -18);
      c.bezierCurveTo(12, -16, 18, -4, 16, 8);
      c.bezierCurveTo(14, 20, 6, 24, 0, 23);
      c.bezierCurveTo(-6, 24, -14, 19, -16, 8);
      c.bezierCurveTo(-18, -4, -12, -16, 0, -18);
      c.closePath();
      const g = c.createLinearGradient(-10, -14, 14, 18);
      g.addColorStop(0, "rgba(255, 225, 235, 0.95)");
      g.addColorStop(0.35, "rgba(224, 120, 148, 0.92)");
      g.addColorStop(0.75, "rgba(180, 60, 95, 0.9)");
      g.addColorStop(1, "rgba(125, 24, 52, 0.85)");
      c.fillStyle = g;
      c.shadowColor = "rgba(180, 60, 95, 0.25)";
      c.shadowBlur = 6;
      c.fill();
      c.strokeStyle = "rgba(255, 255, 255, 0.35)";
      c.lineWidth = 0.6;
      c.stroke();
      c.restore();
    });
    const jasmine = sprite(36, (c) => {
      c.save();
      c.translate(18, 18);
      c.beginPath();
      c.moveTo(0, -12);
      c.bezierCurveTo(8, -10, 10, 0, 7, 8);
      c.bezierCurveTo(4, 12, -4, 12, -7, 8);
      c.bezierCurveTo(-10, 0, -8, -10, 0, -12);
      c.closePath();
      const g = c.createLinearGradient(-6, -10, 8, 10);
      g.addColorStop(0, "#FFFFFF");
      g.addColorStop(0.5, "#FFFBF0");
      g.addColorStop(1, "#F3E5C0");
      c.fillStyle = g;
      c.shadowColor = "rgba(243, 229, 192, 0.4)";
      c.shadowBlur = 4;
      c.fill();
      c.restore();
    });
    const star = sprite(16, (c) => {
      const g = c.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, "#FFFFFF");
      g.addColorStop(0.35, "#F4E29F");
      g.addColorStop(0.75, "rgba(229, 195, 101, 0.45)");
      g.addColorStop(1, "rgba(229, 195, 101, 0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(8, 8, 7, 0, 2 * Math.PI);
      c.fill();
    });

    const R = Math.random;
    const ps = Array.from({ length: W < 768 ? 20 : 36 }, () => {
      const r = R();
      const type = r < 0.38 ? "gold-foil" : r < 0.68 ? "rose-petal" : r < 0.85 ? "jasmine" : "stardust";
      const dust = type === "stardust";
      return {
        x: R() * W,
        y: R() * H,
        size: dust ? 1.5 * R() + 0.8 : 0.5 * R() + 0.5,
        speedX: (R() - 0.48) * 0.65,
        speedY: dust ? 0.25 * R() + 0.15 : 0.7 * R() + 0.45,
        rotation: R() * Math.PI * 2,
        rotationSpeed: (R() - 0.5) * 0.03,
        flip: R() * Math.PI,
        flipSpeed: 0.02 * R() + 0.012,
        opacity: 0.35 * R() + 0.45,
        baseOpacity: 0.35 * R() + 0.45,
        pulseSpeed: 0.03 * R() + 0.01,
        pulsePhase: R() * Math.PI * 2,
        type,
      };
    });

    let time = 0;
    let running = true;
    const frame = () => {
      time += 0.01;
      n.clearRect(0, 0, W, H);
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.speedX + 0.4 * Math.sin(0.8 * time + i);
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;
        p.pulsePhase += p.pulseSpeed;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140 && d > 0) {
          const f = (1 - d / 140) * 1.2;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f * 0.6;
        }
        if (p.y > H + 40) {
          p.y = -30;
          p.x = R() * W;
        }
        if (p.x > W + 40) p.x = -30;
        if (p.x < -40) p.x = W + 30;
        if (p.type === "stardust") {
          n.globalAlpha = Math.max(0.1, Math.min(0.85, p.baseOpacity + 0.25 * Math.sin(p.pulsePhase)));
          const s = 5 * p.size;
          n.drawImage(star, p.x - s / 2, p.y - s / 2, s, s);
          continue;
        }
        n.save();
        n.translate(p.x, p.y);
        n.rotate(p.rotation);
        n.scale(p.size, p.size * Math.cos(p.flip));
        n.globalAlpha = Math.max(0.15, Math.min(0.85, p.opacity + 0.1 * Math.sin(p.pulsePhase)));
        n.drawImage(p.type === "rose-petal" ? rose : p.type === "jasmine" ? jasmine : gold, -22, -22);
        n.restore();
      }
      if (running) raf = requestAnimationFrame(frame);
    };
    // Pause when the hero is scrolled away.
    const io = new IntersectionObserver(
      ([e]) => {
        const vis = e?.isIntersecting ?? true;
        if (vis && !running) {
          running = true;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        } else if (!vis && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(t);
    frame();
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className={className || "absolute inset-0 pointer-events-none z-10 w-full h-full"} style={{ opacity: 0.92 }} />;
}

const C: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } } };
const F: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
const E: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] } },
};
const spinCw = { animate: { rotate: [0, 90, 180, 270, 360], scale: [1, 1.25, 1] }, transition: { duration: 7, repeat: Infinity, ease: "linear" as const } };
const spinCcw = { animate: { rotate: [360, 270, 180, 90, 0], scale: [1, 1.25, 1] }, transition: { duration: 7, repeat: Infinity, ease: "linear" as const } };
const pillStarCw = { animate: { rotate: [0, 180, 360], scale: [1, 1.25, 1] }, transition: { duration: 6, repeat: Infinity, ease: "linear" as const } };
const pillStarCcw = { animate: { rotate: [360, 180, 0], scale: [1, 1.25, 1] }, transition: { duration: 6, repeat: Infinity, ease: "linear" as const } };
const shine = { animate: { x: ["-130%", "240%"] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, repeatDelay: 1.8 } };
const dot = { animate: { y: [0, 9, 0], opacity: [1, 0.3, 1] }, transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const } };
const pillPulse = (a: string, b: string) => ({
  animate: { boxShadow: [a, b, a], scale: [1, 1.018, 1] },
  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const },
});

export default function Hero() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const sectionRef = useRef<HTMLElement>(null);
  // Content reveals when the gate dispatches wedding:intro-finished, or 800ms after mount (as the reference does).
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(true);
    window.addEventListener("wedding:intro-finished", on);
    const id = setTimeout(on, 800);
    return () => {
      window.removeEventListener("wedding:intro-finished", on);
      clearTimeout(id);
    };
  }, []);

  const reduce = useReduce();
  const { scrollY } = useScroll();
  const s = useSpring(scrollY, { stiffness: 90, damping: 25, mass: 0.6 });
  const yD = useTransform(s, [0, 800], [0, 110]);
  const scaleD = useTransform(s, [0, 800], [1, 1.05]);
  const yM = useTransform(s, [0, 800], [0, 85]);
  const scaleM = useTransform(s, [0, 800], [1, 1.04]);
  const yText = useTransform(s, [0, 700], [0, -85]);
  const opText = useTransform(s, [0, 500], [1, 0.05]);
  const scaleText = useTransform(s, [0, 600], [1, 0.96]);
  const opCue = useTransform(s, [0, 90], [1, 0]);

  // The reference targets #welcome-letter, which it never renders; fall back to the section after the hero.
  const explore = () => {
    const el = document.getElementById("welcome-letter") ?? sectionRef.current?.nextElementSibling;
    if (el instanceof HTMLElement) scrollToTarget(el);
  };
  const cueProps = {
    onClick: explore,
    role: "button",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        explore();
      }
    },
  };
  const ff = hi ? "font-serif-hi" : "font-cinzel";
  const pairEn = `${G.en} & ${B.en}`;

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label={`${G.en} and ${B.en} Royal Wedding Invitation`}
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#FAF7F2] select-none"
    >
      <Petals className="absolute inset-0 z-30 pointer-events-none" />

      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden">
        <motion.div style={reduce ? undefined : { y: yM, scale: scaleM }} className="absolute inset-0 z-0 will-change-transform">
          <picture className="w-full h-full block">
            <source srcSet="/images/hero/hero-potrait.webp" type="image/webp" />
            { }
            <img src="/images/hero/hero-potrait.webp" alt={`${pairEn} Royal Wedding Portrait`} className="w-full h-full object-cover object-bottom" loading="eager" decoding="async" />
          </picture>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/30 to-transparent pointer-events-none" />
        </motion.div>
        <motion.div
          style={reduce ? { opacity: opText } : { y: yText, opacity: opText, scale: scaleText }}
          variants={C}
          initial="hidden"
          animate={shown ? "visible" : "hidden"}
          className="relative z-20 pt-10 min-[360px]:pt-12 min-[400px]:pt-14 px-4 max-w-sm sm:max-w-md mx-auto text-center flex flex-col items-center will-change-transform"
        >
          <motion.div variants={F} className="inline-flex items-center gap-2 mb-2">
            <motion.span {...spinCw} className="text-[#C59B27] text-xs inline-block">✦</motion.span>
            <span className="font-serif-hi text-xs min-[360px]:text-[13px] font-bold tracking-[0.24em] text-[#8A6516] drop-shadow-xs">{invite.invocation.hi}</span>
            <motion.span {...spinCcw} className="text-[#C59B27] text-xs inline-block">✦</motion.span>
          </motion.div>
          <motion.p variants={F} className={`text-[10px] min-[360px]:text-[11px] font-bold uppercase tracking-[0.32em] text-[#8A6516] mb-1 drop-shadow-2xs ${ff}`}>
            {copy.titleM[lang]}
          </motion.p>
          <motion.div variants={E} className="my-1">
            <h1 className={`text-4xl min-[360px]:text-[46px] min-[400px]:text-5xl font-black tracking-tight leading-[1.06] drop-shadow-[0_4px_16px_rgba(255,255,255,0.95)] ${hi ? "font-display-hi text-[#78350F]" : `font-cinzel ${styles.nameM}`}`}>
              {hi ? (
                <span className="gold-foil-text font-black">
                  {G.hi} <span className="font-serif italic font-normal text-[#C59B27] text-3xl min-[360px]:text-4xl inline-block mx-1">एवं</span> {B.hi}
                </span>
              ) : (
                <span>
                  <span className="gold-foil-text font-black">{G.en}</span>
                  <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="inline-block mx-2 font-serif italic font-normal text-[#C59B27] text-3xl min-[360px]:text-4xl">&amp;</motion.span>
                  <span className="gold-foil-text font-black">{B.en}</span>
                </span>
              )}
            </h1>
            <p className={`text-xs min-[360px]:text-sm text-[#8A6516] font-bold mt-1 tracking-widest ${hi ? "font-cinzel" : "font-serif-hi"}`}>
              {hi ? pairEn : `${G.hi}  ✦  ${B.hi}`}
            </p>
          </motion.div>
          <motion.div variants={F} className="flex items-center justify-center my-3 w-full px-1">
            <motion.div
              {...pillPulse("0 3px 14px rgba(217,119,6,0.2), 0 0 0 rgba(245,158,11,0)", "0 5px 22px rgba(217,119,6,0.38), 0 0 14px rgba(251,191,36,0.4)")}
              className="relative overflow-hidden rounded-full py-1.5 px-3 min-[360px]:px-4 border-1.5 border-[#D4AF37] bg-gradient-to-r from-[#FFFDF7] via-[#FEF3C7] to-[#FFFDF7] flex items-center justify-center gap-1.5 min-[360px]:gap-2 whitespace-nowrap shadow-[0_4px_16px_rgba(217,119,6,0.2)] max-w-full"
            >
              <motion.span {...shine} className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none" />
              <motion.span {...pillStarCw} className="text-[#D97706] text-[10px] min-[360px]:text-xs inline-block shrink-0">✦</motion.span>
              <Calendar className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 text-[#D97706] shrink-0 drop-shadow-2xs" />
              <div className="flex items-center gap-1 min-[360px]:gap-1.5 leading-none">
                {hi ? (
                  <>
                    <span className="font-serif-hi text-xs min-[360px]:text-[13px] font-black text-[#881337] tracking-wider drop-shadow-2xs">{copy.dateHi}</span>
                    <span className="text-[#C59B27] font-serif text-xs">|</span>
                    <span className="font-serif-hi text-[11px] min-[360px]:text-xs font-bold text-[#92400E] tracking-widest drop-shadow-2xs">{copy.yearHi}</span>
                  </>
                ) : (
                  <>
                    <span className="font-cinzel text-[11px] min-[360px]:text-[12.5px] font-black text-[#881337] tracking-[0.14em] min-[360px]:tracking-[0.18em] drop-shadow-2xs">
                      1<sup className="text-[8.5px] font-black text-[#D97706] ml-0.5">ST</sup> &amp; 2<sup className="text-[8.5px] font-black text-[#D97706] ml-0.5">ND</sup> FEBRUARY
                    </span>
                    <span className="text-[#C59B27] font-serif text-xs">|</span>
                    <span className="font-cinzel text-[10.5px] min-[360px]:text-xs font-bold text-[#92400E] tracking-[0.18em] drop-shadow-2xs">{invite.dates.year}</span>
                  </>
                )}
              </div>
              <motion.span {...pillStarCcw} className="text-[#D97706] text-[10px] min-[360px]:text-xs inline-block shrink-0">✦</motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          style={{ opacity: opCue }}
          initial={{ opacity: 0, y: 10 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-20 pb-5 min-[360px]:pb-7 px-4 flex flex-col items-center pointer-events-auto cursor-pointer group"
          {...cueProps}
        >
          <span className={`text-[10px] min-[360px]:text-[11px] font-bold uppercase tracking-[0.28em] text-[#8A6516] mb-1.5 group-hover:text-[#6B2D0B] transition-colors drop-shadow-xs ${ff}`}>
            {copy.exploreM[lang]}
          </span>
          <div className="w-4 h-7 rounded-full border border-[#C59B27]/70 flex items-start justify-center p-1 shadow-2xs">
            <motion.div {...dot} className="w-1 h-1 rounded-full bg-[#C59B27]" />
          </div>
        </motion.div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex relative w-full min-h-[100svh] items-center overflow-hidden">
        <motion.div style={reduce ? undefined : { y: yD, scale: scaleD }} className="absolute inset-0 z-0 will-change-transform">
          <picture className="w-full h-full block">
            <source srcSet="/images/hero/hero-landscape.webp" type="image/webp" />
            { }
            <img src="/images/hero/hero-landscape.webp" alt={`${pairEn} Royal Wedding Landscape`} className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
          </picture>
        </motion.div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 flex items-center justify-end py-16">
          <motion.div
            style={reduce ? { opacity: opText } : { y: yText, opacity: opText, scale: scaleText }}
            variants={C}
            initial="hidden"
            animate={shown ? "visible" : "hidden"}
            className="w-[50%] lg:w-[46%] xl:w-[42%] flex flex-col items-start text-left will-change-transform"
          >
            <motion.div variants={F} className="inline-flex items-center gap-2.5 mb-2 select-none">
              <motion.span {...spinCw} className="text-[#C59B27] text-xs inline-block">✦</motion.span>
              <span className="font-serif-hi text-xs lg:text-sm font-bold tracking-[0.28em] text-[#8A6516] drop-shadow-xs">{invite.invocation.hi}</span>
              <motion.span {...spinCcw} className="text-[#C59B27] text-xs inline-block">✦</motion.span>
            </motion.div>
            <motion.p variants={F} className={`text-xs lg:text-[13px] font-bold uppercase tracking-[0.38em] text-[#8A6516] mb-2 drop-shadow-2xs ${ff}`}>
              {copy.titleD[lang]}
            </motion.p>
            <motion.div variants={E} className="mb-2">
              <h1 className={`text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.04] drop-shadow-[0_4px_20px_rgba(255,255,255,0.95)] ${hi ? "font-display-hi text-[#78350F]" : `font-cinzel ${styles.nameD}`}`}>
                {hi ? (
                  <span className="gold-foil-text font-black">
                    {G.hi} <span className="font-serif italic font-normal text-[#C59B27] text-4xl lg:text-5xl inline-block mx-2">एवं</span> {B.hi}
                  </span>
                ) : (
                  <span>
                    <span className="gold-foil-text font-black">{G.en}</span>
                    <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="inline-block mx-3 font-serif italic font-normal text-[#C59B27] text-4xl lg:text-5xl">&amp;</motion.span>
                    <span className="gold-foil-text font-black">{B.en}</span>
                  </span>
                )}
              </h1>
              <p className="font-serif-hi text-xl lg:text-2xl font-bold text-[#8A6516] mt-2 tracking-wider drop-shadow-xs">{hi ? copy.fullHi : `${G.hi}  ✦  ${B.hi}`}</p>
            </motion.div>
            <motion.div variants={F} className="flex items-center gap-3 my-4 w-full max-w-lg">
              <div className="h-[1.5px] flex-1 max-w-[60px] lg:max-w-[80px] bg-gradient-to-r from-transparent via-[#C59B27] to-[#C59B27]" />
              <motion.div
                {...pillPulse("0 4px 18px rgba(217,119,6,0.22), 0 0 0 rgba(245,158,11,0)", "0 6px 28px rgba(217,119,6,0.42), 0 0 16px rgba(251,191,36,0.5)")}
                className="relative overflow-hidden rounded-full py-2 px-5 lg:px-6 border-2 border-[#D4AF37] bg-gradient-to-r from-[#FFFDF7] via-[#FEF3C7] to-[#FFFDF7] flex items-center justify-center gap-2.5 whitespace-nowrap shadow-[0_4px_20px_rgba(217,119,6,0.22)]"
              >
                <motion.span {...shine} className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none" />
                <motion.span {...pillStarCw} className="text-[#D97706] text-xs lg:text-sm inline-block shrink-0">✦</motion.span>
                <Calendar className="w-4 h-4 text-[#D97706] shrink-0 drop-shadow-2xs" />
                <div className="flex items-center gap-2 leading-none">
                  {hi ? (
                    <>
                      <span className="font-serif-hi text-sm lg:text-base font-black text-[#881337] tracking-wider drop-shadow-2xs">{copy.dateHi}</span>
                      <span className="text-[#C59B27] font-serif text-sm">|</span>
                      <span className="font-serif-hi text-sm lg:text-base font-bold text-[#92400E] tracking-widest drop-shadow-2xs">{copy.yearHi}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-cinzel text-[13px] lg:text-[15px] font-black text-[#881337] tracking-[0.2em] drop-shadow-2xs">
                        1<sup className="text-[10px] font-black text-[#D97706] ml-0.5">ST</sup> &amp; 2<sup className="text-[10px] font-black text-[#D97706] ml-0.5">ND</sup> FEBRUARY
                      </span>
                      <span className="text-[#C59B27] font-serif text-sm">|</span>
                      <span className="font-cinzel text-xs lg:text-sm font-bold text-[#92400E] tracking-[0.24em] drop-shadow-2xs">{invite.dates.year}</span>
                    </>
                  )}
                </div>
                <motion.span {...pillStarCcw} className="text-[#D97706] text-xs lg:text-sm inline-block shrink-0">✦</motion.span>
              </motion.div>
              <div className="h-[1.5px] flex-1 max-w-[60px] lg:max-w-[80px] bg-gradient-to-l from-transparent via-[#C59B27] to-[#C59B27]" />
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          style={{ opacity: opCue }}
          initial={{ opacity: 0, y: 12 }}
          animate={shown ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center cursor-pointer group"
          {...cueProps}
        >
          <span className={`text-[10px] font-bold uppercase tracking-[0.32em] text-[#8A6516] mb-1.5 group-hover:text-[#6B2D0B] transition-colors drop-shadow-xs ${ff}`}>
            {copy.exploreD[lang]}
          </span>
          <div className="w-4 h-7 rounded-full border border-[#C59B27]/70 flex items-start justify-center p-1 shadow-2xs">
            <motion.div {...dot} className="w-1 h-1 rounded-full bg-[#C59B27]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
