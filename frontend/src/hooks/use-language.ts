import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants";

type Language = "en" | "ar";

const LANG_KEY = STORAGE_KEYS.LANG;

function readLang(): Language {
  try {
    return (localStorage.getItem(LANG_KEY) as Language) || "en";
  } catch {
    return "en";
  }
}

function applyLang(lang: Language) {
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    console.warn("[use-language] Failed to save language preference:", err);
  }
}

/** Read/write the language preference and apply RTL/LTR document direction. */
export function useLanguage() {
  const [lang, setLang] = useState<Language>(readLang);

  useEffect(() => {
    applyLang(lang);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  return { lang, toggleLang };
}
