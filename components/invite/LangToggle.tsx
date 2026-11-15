"use client";

// Fixed EN / हिंदी pill, top right. Like the reference it remembers the choice (localStorage + ?lang=hi).
import { Globe } from "lucide-react";
import { useLang, type Lang } from "./lang";

export const LANG_KEY = "wedding-lang";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const hi = lang === "hi";
  const choose = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
      const u = new URL(window.location.href);
      if (l === "hi") u.searchParams.set("lang", "hi");
      else u.searchParams.delete("lang");
      window.history.replaceState({}, "", u.toString());
      document.documentElement.lang = l;
    } catch {}
  };
  const on = "bg-[#C59B27] text-white shadow-xs";
  const off = "text-[#0F172A] hover:text-[#8A6516]";
  return (
    <aside aria-label="Language selection" className="fixed top-2.5 right-2.5 sm:top-5 sm:right-5 z-40">
      <div className="flex items-center gap-0.5 sm:gap-1.5 p-0.5 sm:p-1 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#C59B27]/40 rounded-full shadow-md text-xs sm:text-[13px] font-sans">
        <div className="pl-1 sm:pl-2 pr-0.5 sm:pr-1 text-[#8A6516] flex items-center">
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
        <button onClick={() => choose("en")} className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all duration-200 cursor-pointer font-bold ${hi ? off : on}`}>
          <span className="sm:hidden">EN</span>
          <span className="hidden sm:inline">English</span>
        </button>
        <button onClick={() => choose("hi")} className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all duration-200 cursor-pointer font-bold ${hi ? on : off}`}>
          <span>हिंदी</span>
        </button>
      </div>
    </aside>
  );
}
