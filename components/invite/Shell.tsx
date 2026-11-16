"use client";

// Everything around the sections: language context, the entry gate, the <main> wrapper,
// the fixed language pill (after the gate opens) and the background music pill.
import { useEffect, useState, type ReactNode } from "react";
import { LangProvider, useLang } from "./lang";
import Gate from "./Gate";
import LangToggle, { LANG_KEY } from "./LangToggle";
import MusicToggle from "./MusicToggle";
import SmoothScroll from "./SmoothScroll";

function Frame({ children }: { children: ReactNode }) {
  const { setLang } = useLang();
  const [revealed, setRevealed] = useState(false);

  // Restore the language like the reference: ?lang=hi or the saved choice.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("lang") === "hi" || localStorage.getItem(LANG_KEY) === "hi") setLang("hi");
    } catch {}
  }, [setLang]);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#1C1917] relative selection:bg-[#C59B27]/20 selection:text-[#9B2C47] paper-texture overflow-x-hidden">
      <SmoothScroll held={!revealed} />
      <Gate onComplete={() => setRevealed(true)} />
      {revealed && <LangToggle />}
      {children}
      <MusicToggle />
    </main>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <Frame>{children}</Frame>
    </LangProvider>
  );
}
