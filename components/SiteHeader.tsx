"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ hasCerts }: { hasCerts: boolean }) {
  const onHome = usePathname() === "/home";
  const base = onHome ? "" : "/home";
  const nav: [string, string][] = [
    ["About", `${base}#about`],
    ["Projects", `${base}#projects`],
    ["Skills", `${base}#skills`],
    ["Involvement", `${base}#involvement`],
    ...(hasCerts ? ([["Certifications", `${base}#certifications`]] as [string, string][]) : []),
    ["Notes", "/notes"],
  ];

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 md:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-abyss/85 py-1.5 pl-3 pr-2 backdrop-blur md:pl-4">
        <Link href={onHome ? "#top" : "/home"} className="flex items-center gap-2.5 font-bold">
          <Image src="/logo.png" alt="" width={40} height={40} priority className="h-10 w-10 object-contain" />
          <span className="text-sm">Mark Jade</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("palette:open"))}
            aria-label="Search the site (Ctrl+K)"
            className="hidden items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm text-white/70 transition-colors hover:border-mint hover:text-white md:flex"
          >
            <SearchIcon className="h-4 w-4" />
            Search
            <kbd className="rounded border border-white/20 px-1.5 text-xs">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <Link href={`${base}#contact`} className="rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5">
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
}
