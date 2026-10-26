import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants";

type Theme = "dark" | "light";

const THEME_KEY = STORAGE_KEYS.THEME;

function readTheme(): Theme {
  try {
    return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn("[use-theme] Failed to save theme preference:", err);
  }
}

/** Read/write the dark/light theme preference to localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
