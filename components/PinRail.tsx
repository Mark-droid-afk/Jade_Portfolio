"use client";

import { useEffect, useState } from "react";
import { PinIcon } from "./Icons";

const STOPS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "involvement", label: "Involvement" },
  { id: "contact", label: "Contact" },
];

// "You are here" rail: the pin slides down as you scroll. Large screens only.
export default function PinRail() {
  const [pos, setPos] = useState(0);
  const [stops, setStops] = useState<number[]>(STOPS.map((_, i) => i / (STOPS.length - 1)));

  useEffect(() => {
    const max = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () => {
      const m = max();
      setStops(
        STOPS.map((s) => {
          const el = document.getElementById(s.id);
          return el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - 80) / m)) : 0;
        })
      );
      setPos(Math.min(1, window.scrollY / m));
    };
    const onScroll = () => setPos(Math.min(1, window.scrollY / max()));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(t);
    };
  }, []);

  let current = 0;
  stops.forEach((s, i) => {
    if (pos + 0.01 >= s) current = i;
  });

  return (
    <nav
      aria-label="Page position"
      className="fixed left-4 top-1/2 z-30 hidden h-[52vh] w-8 -translate-y-1/2 rounded-full border border-white/10 bg-abyss/80 backdrop-blur xl:block"
    >
      <div className="absolute inset-x-0 bottom-4 top-4">
        <span aria-hidden className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-white/20" />
        {STOPS.map((s, i) => (
          <a
            key={s.id}
            href={s.id === "hero" ? "#top" : `#${s.id}`}
            aria-label={s.label}
            aria-current={current === i ? "true" : undefined}
            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${stops[i] * 100}%` }}
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full border transition-colors ${
                current === i ? "border-mint bg-mint" : "border-white/50 bg-abyss group-hover:border-mint"
              }`}
            />
            <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-mint px-3 py-1 text-xs font-bold text-abyss opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-full transition-[top] duration-200 ease-out"
          style={{ top: `${pos * 100}%` }}
        >
          <PinIcon className="h-6 w-[18px] drop-shadow" />
        </span>
      </div>
    </nav>
  );
}
