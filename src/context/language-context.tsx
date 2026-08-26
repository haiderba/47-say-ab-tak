import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageOption } from "@/lib/i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sayabtak_lang") as SupportedLanguage;
      if (saved && ["en", "ur", "pa", "ps", "sd"].includes(saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("sayabtak_lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = ["ur", "pa", "ps", "sd"].includes(lang) ? "rtl" : "ltr";
    }
  };

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = currentOption.dir === "rtl";

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (key in dict) return dict[key];
    if (key in TRANSLATIONS.en) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentOption, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en" as SupportedLanguage,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => {
        const dict = TRANSLATIONS.en;
        return dict[key] || fallback || key;
      },
      currentOption: SUPPORTED_LANGUAGES[0],
      isRTL: false,
    };
  }
  return context;
}
