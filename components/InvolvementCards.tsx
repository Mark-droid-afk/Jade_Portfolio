"use client";

import { useState } from "react";
import { PlusIcon } from "./Icons";

type Item = { tag: string; title: string; summary: string; detail: string };
const TAGS = ["bg-mint text-[#07261E]", "bg-coral/20", "bg-jade/25"];

// Tap a card to expand it.
export default function InvolvementCards({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="grid items-start gap-4 md:grid-cols-3">
      {items.map((i, n) => {
        const isOpen = open === n;
        return (
          <li key={i.title} className="rounded-3xl bg-card shadow-sm transition-shadow hover:shadow-lg hover:shadow-black/10">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : n)}
              className="flex w-full items-start gap-4 rounded-3xl p-6 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${TAGS[n % TAGS.length]}`}>
                  {i.tag}
                </span>
                <span className="mt-4 block font-display text-2xl leading-tight">{i.title}</span>
                <span className="mt-2 block text-muted">{i.summary}</span>
              </span>
              <span
                aria-hidden
                className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <PlusIcon className="h-5 w-5" />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed">{i.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
