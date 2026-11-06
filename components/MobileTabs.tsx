"use client";

import { useEffect, useState } from "react";
import { GridIcon, HomeIcon, MailIcon, SparkleIcon, UserIcon } from "./Icons";

const TABS = [
  { id: "hero", href: "#top", label: "Home", Icon: HomeIcon },
  { id: "about", href: "#about", label: "About", Icon: UserIcon },
  { id: "projects", href: "#projects", label: "Work", Icon: GridIcon },
  { id: "contact", href: "#contact", label: "Contact", Icon: MailIcon },
];

// App-style bottom navigation, shown on phones only.
export default function MobileTabs() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-3xl border border-white/10 bg-midnight/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl shadow-black/40 backdrop-blur md:hidden"
    >
      {TABS.map(({ id, href, label, Icon }) => (
        <a
          key={id}
          href={href}
          aria-current={active === id ? "true" : undefined}
          className={`flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold transition-colors ${
            active === id ? "bg-white/10 text-aqua" : "text-white/70"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("gurrabot:open"))}
        className="flex flex-col items-center gap-0.5 rounded-2xl bg-aqua py-2 text-[11px] font-bold text-midnight"
      >
        <SparkleIcon className="h-5 w-5" />
        Ask
      </button>
    </nav>
  );
}
