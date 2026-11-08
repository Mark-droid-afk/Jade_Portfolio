"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { RepoStats } from "@/lib/github";
import type { Project } from "@/lib/data";
import { track } from "@/lib/track";
import { CheckIcon, CloseIcon, ExternalIcon, PlusIcon } from "./Icons";
import { Frame } from "./ProjectFrame";
import Reveal from "./Reveal";

function StatChips({ s }: { s?: RepoStats }) {
  if (!s) return null;
  return (
    <p className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-white/70">
      <span className="rounded-full bg-white/10 px-3 py-1">Updated {s.updated}</span>
      {s.stars > 0 && <span className="rounded-full bg-white/10 px-3 py-1">★ {s.stars}</span>}
    </p>
  );
}

// Featured projects get a large image and open a details window on click.
export default function ProjectShowcase({ projects, stats }: { projects: Project[]; stats: Record<string, RepoStats> }) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  const [open, setOpen] = useState<Project | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = (p: Project) => {
    opener.current = document.activeElement as HTMLElement;
    setOpen(p);
    track("project_open", p.name);
  };
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  return (
    <>
      <div className="space-y-24 md:space-y-32">
        {featured.map((p, i) => (
          <Reveal key={p.slug}>
            <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${p.name}`}
                  onClick={() => show(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      show(p);
                    }
                  }}
                  className="group relative cursor-pointer rounded-3xl p-4"
                >
                  <span
                    aria-hidden
                    className="absolute inset-2 rounded-[2rem] border border-mint/25 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"
                  />
                  <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
                    <Frame p={p} />
                  </div>
                  <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-mint px-4 py-2 text-xs font-bold text-abyss opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Click for details
                  </span>
                </div>
              </div>

              <div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">{p.kind}</span>
                <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight">{p.name}</h3>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-white/75">{p.tagline}</p>
                <StatChips s={stats[p.slug]} />
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.slice(0, 6).map((s) => (
                    <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => show(p)}
                    className="rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5"
                  >
                    View details
                  </button>
                  {p.link && (
                    <a
                      href={p.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("external_link", p.name)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition-colors hover:border-mint hover:text-mint"
                    >
                      {p.link.label}
                      <ExternalIcon className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center rounded-full px-4 py-3 text-sm font-bold text-white/80 underline underline-offset-4 transition-colors hover:text-mint"
                  >
                    Case study
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {more.length > 0 && (
        <Reveal className="mt-24 md:mt-32">
          <h3 className="font-display text-3xl">More builds</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => show(p)}
                  className="group flex h-full w-full items-start justify-between gap-4 rounded-3xl border border-white/10 bg-forest p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-mint"
                >
                  <span>
                    <span className="text-xs font-semibold text-mint">{p.kind}</span>
                    <span className="mt-2 block font-display text-2xl">{p.name}</span>
                    <span className="mt-2 block text-white/70">{p.tagline}</span>
                    <span className="mt-4 block text-xs font-medium text-white/60">{p.stack.join(", ")}</span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-mint group-hover:text-abyss"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {open && createPortal(<Modal p={open} stats={stats[open.slug]} onClose={close} />, document.body)}
    </>
  );
}

function Modal({ p, stats, onClose }: { p: Project; stats?: RepoStats; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const hasVisual = Boolean(p.image || p.frame);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
      <div className="fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} details`}
        className="modal-in relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-forest text-white shadow-2xl md:rounded-3xl"
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-abyss/80 text-white backdrop-blur hover:bg-mint hover:text-abyss"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className={`grid min-h-0 flex-1 overflow-y-auto overscroll-contain ${hasVisual ? "md:grid-cols-[0.85fr_1.15fr]" : ""}`}>
          {hasVisual && (
            <div className="grid place-items-center bg-abyss p-8 md:p-10">
              <div className="w-full max-w-sm">
                <Frame p={p} />
              </div>
            </div>
          )}
          <div className="p-6 md:p-10">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">{p.kind}</span>
            <h3 className="mt-4 pr-10 font-display text-4xl leading-tight">{p.name}</h3>
            <p className="mt-4 leading-relaxed text-white/80">{p.overview}</p>
            <StatChips s={stats} />

            <h4 className="mt-7 text-sm font-bold text-mint">What it does</h4>
            <ul className="mt-3 space-y-2.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 leading-relaxed text-white/85">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-mint" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-7 text-sm font-bold text-mint">Built with</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/85">
                  {s}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {p.link && (
                <a
                  href={p.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("external_link", p.name)}
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5"
                >
                  {p.link.label}
                  <ExternalIcon className="h-4 w-4" />
                </a>
              )}
              <Link
                href={`/projects/${p.slug}`}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition-colors hover:border-mint hover:text-mint"
              >
                Read the case study
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
