"use client";

import { useState } from "react";
import type { Project } from "@/lib/data";
import { CheckIcon } from "./Icons";

const FILTERS = ["All", "Capstone", "Personal"] as const;

// Phones: swipeable cards. Larger screens: two-column grid.
export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filter === f ? "bg-aqua text-midnight" : "bg-deep text-white/80 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0">
        {shown.map((p) => (
          <li key={p.name} className="w-[86%] shrink-0 snap-center md:w-auto">
            <Card p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({ p }: { p: Project }) {
  const capstone = p.category === "Capstone";
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-deep p-4 md:p-5">
      <div
        className={`grid-bg relative flex aspect-[16/8] items-end overflow-hidden rounded-2xl ${
          capstone ? "bg-aqua/15 text-aqua" : "bg-lilac/15 text-lilac"
        }`}
      >
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.name} screenshot`} className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden className="px-4 font-display text-7xl leading-none">
            {p.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
          {p.kind}
        </span>
        <h3 className="mt-3 font-display text-2xl leading-tight">{p.name}</h3>
        <p className="mt-2 leading-relaxed text-white/75">{p.description}</p>

        {p.highlights && (
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/80">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-5 flex flex-wrap gap-2 pt-1">
          {p.stack.map((s) => (
            <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
              {s}
            </li>
          ))}
        </ul>

        {(p.github || p.live) && (
          <p className="mt-5 flex gap-5 text-sm font-bold">
            {p.github && (
              <a href={p.github} className="text-aqua underline underline-offset-4">
                Source code
              </a>
            )}
            {p.live && (
              <a href={p.live} className="text-aqua underline underline-offset-4">
                Live site
              </a>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
