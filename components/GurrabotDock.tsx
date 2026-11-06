"use client";

import { useEffect, useState } from "react";
import Gurrabot from "./Gurrabot";
import { SparkleIcon } from "./Icons";

// Desktop: floating launcher + corner panel. Mobile: full-width bottom sheet.
export default function GurrabotDock() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("gurrabot:open", openIt);
    return () => window.removeEventListener("gurrabot:open", openIt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    if (window.matchMedia("(max-width: 767px)").matches) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-aqua px-5 py-3 text-sm font-bold text-midnight shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5 md:flex"
        >
          <SparkleIcon className="h-5 w-5" />
          Ask Gurrabot
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        role="dialog"
        aria-label="Chat with Gurrabot"
        aria-hidden={!open}
        className={`${
          open ? "flex" : "hidden"
        } sheet-in fixed inset-x-0 bottom-0 z-50 h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0F2142] shadow-2xl shadow-black/50 md:inset-x-auto md:bottom-6 md:right-6 md:h-[34rem] md:w-[24rem] md:rounded-3xl`}
      >
        <Gurrabot active={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
