import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AskButton from "@/components/AskButton";
import { ExternalIcon, SparkleIcon } from "@/components/Icons";
import { Frame } from "@/components/ProjectFrame";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content";
import { projects as defaultProjects } from "@/lib/data";
import { getRepoStats } from "@/lib/github";

export const dynamicParams = true;

export function generateStaticParams() {
  return defaultProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = (await getContent()).projects.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: `${p.name} case study`, description: p.tagline };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { projects } = await getContent();
  const i = projects.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const p = projects[i];
  const stats = await getRepoStats(p.repo);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const hasVisual = Boolean(p.image || p.frame);

  return (
    <main id="top" className="rings-bg-center bg-abyss">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 md:px-6 md:pt-16">
        <Link href="/home#projects" className="text-sm font-bold text-mint underline underline-offset-4">
          All projects
        </Link>

        <header className="mt-8">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">{p.kind}</span>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,4.8rem)] leading-[1.02]">{p.name}</h1>
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-white/80">{p.tagline}</p>
          {stats && (
            <p className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-white/70">
              <span className="rounded-full bg-white/10 px-3 py-1">Updated {stats.updated}</span>
              {stats.stars > 0 && <span className="rounded-full bg-white/10 px-3 py-1">★ {stats.stars}</span>}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {p.link && (
              <a
                href={p.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5"
              >
                {p.link.label}
                <ExternalIcon className="h-4 w-4" />
              </a>
            )}
            <AskButton className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition-colors hover:border-mint hover:text-mint">
              <SparkleIcon className="h-4 w-4" />
              Ask Gurrabot about this
            </AskButton>
          </div>
        </header>

        {hasVisual && (
          <Reveal className="mt-14">
            <div className="mx-auto max-w-3xl">
              <Frame p={p} sizes="(min-width: 1024px) 768px, 92vw" />
            </div>
          </Reveal>
        )}

        {p.video && (
          <Reveal className="mt-10">
            <video controls preload="metadata" poster={p.image} className="w-full rounded-2xl border border-white/10 bg-black">
              <source src={p.video} />
            </video>
          </Reveal>
        )}

        <Reveal className="mt-16">
          <h2 className="font-display text-3xl">Overview</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">{p.overview}</p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-display text-3xl">What it does</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {p.highlights.map((h) => (
              <li key={h} className="rounded-2xl border border-white/10 bg-forest p-4 leading-relaxed text-white/85">
                {h}
              </li>
            ))}
          </ul>
        </Reveal>

        {p.sections?.map((s, n) => (
          <Reveal key={s.heading} delay={n * 60} className="mt-14">
            <h2 className="font-display text-3xl">{s.heading}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">{s.body}</p>
          </Reveal>
        ))}

        {p.gallery && p.gallery.length > 0 && (
          <Reveal className="mt-14">
            <h2 className="font-display text-3xl">Gallery</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {p.gallery.map((src, n) => (
                <li key={src} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-forest">
                  <Image src={src} alt={`${p.name} screenshot ${n + 1}`} fill sizes="(min-width: 640px) 50vw, 92vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal className="mt-14">
          <h2 className="font-display text-3xl">Built with</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-white/85">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        {projects.length > 1 && (
          <nav aria-label="More projects" className="mt-20 grid gap-4 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="rounded-3xl border border-white/10 bg-forest p-6 transition-all hover:-translate-y-1 hover:border-mint">
              <span className="text-xs font-semibold text-mint">Previous</span>
              <span className="mt-1 block font-display text-2xl">{prev.name}</span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="rounded-3xl border border-white/10 bg-forest p-6 text-right transition-all hover:-translate-y-1 hover:border-mint">
              <span className="text-xs font-semibold text-mint">Next</span>
              <span className="mt-1 block font-display text-2xl">{next.name}</span>
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}
