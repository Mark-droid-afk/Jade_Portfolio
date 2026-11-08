import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { notes as defaultNotes } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";

export const dynamicParams = true;

export function generateStaticParams() {
  return defaultNotes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const n = (await getContent()).notes.find((x) => x.slug === params.slug);
  return n ? { title: n.title, description: n.summary } : {};
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const { notes, profile } = await getContent();
  const n = notes.find((x) => x.slug === params.slug);
  if (!n) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: n.title,
    datePublished: n.date,
    description: n.summary,
    author: { "@type": "Person", name: profile.name },
  };

  return (
    <main id="top" className="bg-abyss">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:px-6 md:pt-16">
        <Link href="/notes" className="text-sm font-bold text-mint underline underline-offset-4">
          All notes
        </Link>
        <p className="mt-8 text-sm font-semibold text-mint">{n.date}</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-[1.08]">{n.title}</h1>
        <p className="mt-4 text-xl text-white/75">{n.summary}</p>
        <div className="mt-6 text-lg text-white/85">{renderMarkdown(n.body)}</div>
      </article>
    </main>
  );
}
