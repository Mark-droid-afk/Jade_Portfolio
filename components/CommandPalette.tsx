"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/track";
import { SearchIcon } from "./Icons";

export type PaletteItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  href?: string;
  action?: "gurrabot" | "theme";
};

// Press Ctrl+K (or Cmd+K) to jump anywhere, open a project, or ask Gurrabot.
export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const opener = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ""}`.toLowerCase().includes(s)) : items;
  }, [items, q]);

  const show = () => {
    opener.current = document.activeElement as HTMLElement;
    setQ("");
    setIdx(0);
    setOpen(true);
    track("palette_open");
  };
  const hide = () => {
    setOpen(false);
    opener.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) show();
          return o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", show);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  const run = (item: PaletteItem) => {
    setOpen(false);
    if (item.action === "gurrabot") window.dispatchEvent(new Event("gurrabot:open"));
    else if (item.action === "theme") window.dispatchEvent(new Event("theme:toggle"));
    else if (item.href) {
      if (/^https?:/i.test(item.href)) window.open(item.href, "_blank", "noopener,noreferrer");
      else if (/^\/(cv)/.test(item.href)) window.location.href = item.href;
      else router.push(item.href);
    }
  };

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") hide();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && results[idx]) {
      e.preventDefault();
      run(results[idx]);
    }
  };

  let lastGroup = "";
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <div className="fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={hide} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="modal-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-forest text-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-white/60" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-label="Search the site"
            placeholder="Search sections, projects, actions…"
            className="w-full bg-transparent py-4 text-base text-white placeholder:text-white/50 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded-md border border-white/20 px-2 py-0.5 text-xs text-white/60 sm:block">Esc</kbd>
        </div>
        <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-white/60">No results. Try Ask Gurrabot.</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-xs font-bold text-mint">{header}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === idx}
                  onMouseMove={() => setIdx(i)}
                  onClick={() => run(item)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left ${
                    i === idx ? "bg-mint text-abyss" : "text-white/90"
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  {item.hint && <span className={`truncate text-xs ${i === idx ? "text-abyss/70" : "text-white/50"}`}>{item.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body
  );
}
