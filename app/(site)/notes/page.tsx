import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Write-ups and dev logs from the things Mark Jade is building.",
};

export default async function NotesPage() {
  const { notes } = await getContent();
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main id="top" className="rings-bg-center min-h-[70vh] bg-abyss">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-10 md:px-6 md:pt-16">
        <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-tight">Notes</h1>
        <p className="mt-3 max-w-xl text-lg text-white/70">Write-ups and dev logs from the things I’m building.</p>
        {sorted.length === 0 ? (
          <p className="mt-10 text-white/70">Nothing here yet.</p>
        ) : (
          <ul className="mt-10 space-y-4">
            {sorted.map((n, i) => (
              <li key={n.slug}>
                <Reveal delay={i * 80}>
                  <Link href={`/notes/${n.slug}`} className="block rounded-3xl border border-white/10 bg-forest p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mint">
                    <p className="text-xs font-semibold text-mint">{n.date}</p>
                    <h2 className="mt-2 font-display text-2xl leading-tight md:text-3xl">{n.title}</h2>
                    <p className="mt-2 text-white/70">{n.summary}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
