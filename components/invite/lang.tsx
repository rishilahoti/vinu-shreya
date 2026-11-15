"use client";

// Language for the whole invite. Components read it with useLang() and pick strings with t({ en, hi }).
import { createContext, useContext, useState, type ReactNode } from "react";
import type { L } from "@/lib/invite";

export type Lang = "en" | "hi";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  return { lang, setLang, t: (s: L) => s[lang] };
}
