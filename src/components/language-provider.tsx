"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "ar" | "en";
type LanguageContextValue = { locale: Locale; isArabic: boolean; setLocale: (locale: Locale) => void; tr: (ar: string, en: string) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");
  useEffect(() => {
    const saved = window.localStorage.getItem("trinity-locale") as Locale | null;
    const timer = window.setTimeout(() => { if (saved === "ar" || saved === "en") setLocale(saved); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("trinity-locale", locale);
  }, [locale]);
  const value = useMemo(() => ({ locale, isArabic: locale === "ar", setLocale, tr: (ar: string, en: string) => locale === "ar" ? ar : en }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
