"use client";

// Background song (two <audio> copies cross-fading into each other for a seamless loop) and the
// fixed "Music Playing" pill. Same mechanics as the reference: the gate calls window.__weddingAudioPlay
// inside its click, and the pill appears on the wedding:intro-finished event.
import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { invite } from "@/lib/invite";
import { useLang } from "./lang";

declare global {
  interface Window {
    __weddingAudioPlay?: () => void;
    __weddingAudioPause?: () => void;
    __weddingAudioIsPlaying?: () => boolean;
  }
}

const copy = {
  mute: { en: "Mute Wedding Music", hi: "संगीत रोकें" },
  play: { en: "Play Wedding Music", hi: "संगीत चालू करें" },
  playing: { en: "Music Playing", hi: "संगीत चालू" },
  paused: { en: "Play Music", hi: "संगीत बजाएं" },
};

const VOL = 0.85;
const FADE = 2; // seconds of cross-fade at the end of each pass

export default function MusicToggle() {
  const { t } = useLang();
  const [playing, setPlaying] = useState(true);
  const [shown, setShown] = useState(false);
  const a1 = useRef<HTMLAudioElement>(null);
  const a2 = useRef<HTMLAudioElement>(null);
  const current = useRef(1);
  const fading = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const wantPlay = useRef(true);
  const userPaused = useRef(false);

  const pair = () => (current.current === 1 ? [a1.current, a2.current] : [a2.current, a1.current]);

  const monitor = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (userPaused.current) return;
      const [cur, next] = pair();
      if (!cur || !cur.duration || isNaN(cur.duration)) return;
      const left = cur.duration - cur.currentTime;
      if (left <= FADE && left > 0.05) {
        if (!fading.current && next) {
          fading.current = true;
          next.currentTime = 0;
          next.volume = 0;
          next.play().catch(() => {});
        }
        if (next && fading.current) {
          const k = (FADE - left) / FADE;
          cur.volume = Math.max(0, VOL * (1 - k));
          next.volume = Math.min(VOL, VOL * k);
        }
      } else if (cur.currentTime >= cur.duration - 0.08 || cur.ended) {
        cur.pause();
        cur.currentTime = 0;
        cur.volume = 0;
        if (next) next.volume = VOL;
        current.current = current.current === 1 ? 2 : 1;
        fading.current = false;
      }
    }, 200);
  }, []);

  const play = useCallback(() => {
    if (userPaused.current) return;
    const [cur, next] = pair();
    if (!cur) return;
    cur.volume = VOL;
    cur
      .play()
      .then(() => {
        wantPlay.current = true;
        setPlaying(true);
        monitor();
        // prime the second copy so iOS lets it start later without a gesture
        if (next && next.paused) {
          next.volume = 0;
          next.currentTime = 0;
          next.play().then(() => { next.pause(); next.currentTime = 0; }).catch(() => {});
        }
      })
      .catch(() => {
        if (!userPaused.current) {
          wantPlay.current = true;
          setPlaying(true);
        }
      });
  }, [monitor]);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    a1.current?.pause();
    a2.current?.pause();
    fading.current = false;
    wantPlay.current = false;
    setPlaying(false);
  }, []);

  useEffect(() => {
    window.__weddingAudioPlay = () => {
      userPaused.current = false;
      wantPlay.current = true;
      setPlaying(true);
      play();
    };
    window.__weddingAudioPause = () => {
      userPaused.current = true;
      stop();
    };
    window.__weddingAudioIsPlaying = () => wantPlay.current;
    return () => {
      delete window.__weddingAudioPlay;
      delete window.__weddingAudioPause;
      delete window.__weddingAudioIsPlaying;
      if (timer.current) clearInterval(timer.current);
    };
  }, [play, stop]);

  // Fallback hand-off if an "ended" fires before the monitor catches it.
  useEffect(() => {
    const e1 = a1.current, e2 = a2.current;
    const to2 = () => {
      if (userPaused.current) return;
      if (e2) { e2.volume = VOL; if (e2.paused) e2.play().catch(() => {}); }
      current.current = 2;
      fading.current = false;
    };
    const to1 = () => {
      if (userPaused.current) return;
      if (e1) { e1.volume = VOL; if (e1.paused) e1.play().catch(() => {}); }
      current.current = 1;
      fading.current = false;
    };
    e1?.addEventListener("ended", to2);
    e2?.addEventListener("ended", to1);
    return () => {
      e1?.removeEventListener("ended", to2);
      e2?.removeEventListener("ended", to1);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    const on = () => {
      setShown(true);
      if (!userPaused.current) play();
    };
    window.addEventListener("wedding:play-audio", on);
    window.addEventListener("wedding:intro-finished", on);
    return () => {
      window.removeEventListener("wedding:play-audio", on);
      window.removeEventListener("wedding:intro-finished", on);
    };
  }, [play]);

  const toggle = () => {
    if (wantPlay.current) {
      userPaused.current = true;
      stop();
    } else {
      userPaused.current = false;
      wantPlay.current = true;
      setPlaying(true);
      play();
    }
  };

  return (
    <>
      <audio ref={a1} src={invite.audio} preload="metadata" playsInline />
      <audio ref={a2} src={invite.audio} preload="none" playsInline />
      {shown && (
        <aside aria-label="Audio controls" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
          <button
            onClick={toggle}
            type="button"
            title={playing ? t(copy.mute) : t(copy.play)}
            className={`group relative flex items-center gap-2 sm:gap-2.5 rounded-full border px-3 sm:px-4 py-2 sm:py-2.5 shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer ${playing ? "border-[#C59B27] bg-[#C59B27] text-white shadow-lg" : "border-[#C59B27] bg-[#FFFFFF]/95 text-[#1C1917] hover:border-[#C59B27] hover:bg-[#FAF7F2] shadow-xl"}`}
            aria-label="Toggle ambient wedding audio"
          >
            {playing ? (
              <>
                <div className="flex items-end gap-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="w-0.5 sm:w-1 bg-white rounded-full animate-bounce [animation-delay:0ms] h-2.5 sm:h-3" />
                  <span className="w-0.5 sm:w-1 bg-white rounded-full animate-bounce [animation-delay:200ms] h-3.5 sm:h-4" />
                  <span className="w-0.5 sm:w-1 bg-white rounded-full animate-bounce [animation-delay:400ms] h-2" />
                </div>
                <span className="text-xs sm:text-[13px] font-sans font-bold tracking-normal">{t(copy.playing)}</span>
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </>
            ) : (
              <>
                <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8A6516] group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-[13px] font-sans tracking-normal text-[#0F172A] font-bold">{t(copy.paused)}</span>
                <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8A6516] opacity-80" />
              </>
            )}
          </button>
        </aside>
      )}
    </>
  );
}
