"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/track";
import { MoonIcon, SunIcon } from "./Icons";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  const apply = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode */
    }
    track("theme_toggle", next ? "dark" : "light");
  };

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const toggle = () => apply(!document.documentElement.classList.contains("dark"));
    window.addEventListener("theme:toggle", toggle);
    return () => window.removeEventListener("theme:toggle", toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={() => apply(!dark)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={`grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white ${className}`}
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
