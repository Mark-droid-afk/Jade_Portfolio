import Link from "next/link";
import AskButton from "@/components/AskButton";
import ContactForm from "@/components/ContactForm";
import CountUp from "@/components/CountUp";
import { MailIcon, PinIcon, SparkleIcon } from "@/components/Icons";
import InvolvementCards from "@/components/InvolvementCards";
import MobileTabs from "@/components/MobileTabs";
import OrbitRing from "@/components/OrbitRing";
import Photo from "@/components/Photo";
import PinRail from "@/components/PinRail";
import ProjectShowcase from "@/components/ProjectShowcase";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { contactMode, cvHref } from "@/lib/contact-mode";
import { getContent } from "@/lib/content";
import { focus, getStats, principles } from "@/lib/data";
import { getRepoStats, type RepoStats } from "@/lib/github";

const TAGS = ["bg-mint", "bg-coral/20", "bg-jade/25"];
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function Home() {
  const { profile, projects, skills, involvement, certifications, testimonials, notes } = await getContent();
  const stats = getStats(projects, skills);
  const ticker = Object.values(skills).flat();
  const mode = contactMode();

  const repoStats: Record<string, RepoStats> = {};
  await Promise.all(
    projects.map(async (p) => {
      const s = await getRepoStats(p.repo);
      if (s) repoStats[p.slug] = s;
    })
  );

  const contacts = [
    profile.email && { label: "Email", href: `mailto:${profile.email}`, text: profile.email },
    profile.github && { label: "GitHub", href: profile.github, text: profile.github.replace(/^https?:\/\//, "") },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin, text: profile.linkedin.replace(/^https?:\/\//, "") },
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  const quick = [
    { label: "Download CV", href: cvHref(profile.cvUrl), download: Boolean(profile.cvUrl) },
    ...contacts.map((c) => ({ label: c.label, href: c.href, download: false })),
  ];

  const glance = [
    ["Role", profile.role],
    ["Studying", profile.program],
    ["Focus", focus.join(", ")],
    profile.school && ["School", profile.school],
    profile.location && ["Based in", profile.location],
  ].filter(Boolean) as [string, string][];

  const approved = testimonials.filter((t) => t.approved);
  const latestNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PinRail />

      <main id="top">
        {/* Hero */}
        <section id="hero" className="rings-bg overflow-x-clip bg-abyss">
          <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-6 md:pb-16 md:pt-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* Portrait: arch, orbit ring (behind and in front), floating cards */}
              <div className="fade-up relative mx-auto w-56 md:w-72 lg:order-2 lg:w-full lg:max-w-sm" style={d(150)}>
                <OrbitRing className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-[#ffffff] ring-1 ring-white/10">
                  <Photo src="/photo-formal.jpg" alt="Portrait of Mark Jade D. Gurrobat" position="center 20%" priority sizes="(min-width: 1024px) 384px, 288px" />
                </div>
                <OrbitRing className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 [clip-path:inset(54%_0_0_0)]" />
                <div className="float-y absolute -left-10 top-14 z-30 hidden rounded-2xl bg-card px-4 py-3 text-ink shadow-xl shadow-black/30 lg:block">
                  <p className="text-xs font-semibold text-muted">Currently</p>
                  <p className="text-sm font-bold">4th-year BSIT student</p>
                </div>
                <div className="float-y absolute -right-6 bottom-16 z-30 hidden lg:block" style={{ animationDelay: "-2s" }}>
                  <AskButton className="flex items-center gap-2 rounded-2xl bg-mint px-4 py-3 text-left text-abyss shadow-xl shadow-black/30">
                    <SparkleIcon className="h-6 w-6 shrink-0" />
                    <span>
                      <span className="block text-sm font-bold">Ask Gurrabot</span>
                      <span className="block text-xs">anything about Mark</span>
                    </span>
                  </AskButton>
                </div>
              </div>

              <div className="text-center md:text-left lg:order-1">
                <h1 className="font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[1.02]">
                  <span className="mask-line" style={d(100)}>
                    <span>{profile.name.split(" D. ")[0]}</span>
                  </span>
                  <span className="mask-line" style={d(230)}>
                    <span>D. {profile.name.split(" D. ")[1]}</span>
                  </span>
                </h1>
                <p className="fade-up mt-5 flex items-center justify-center gap-2.5 text-lg font-bold text-mint md:justify-start" style={d(600)}>
                  <PinIcon className="h-5 w-4 shrink-0" />
                  {profile.role}
                </p>
                <p className="fade-up mx-auto mt-3 max-w-md text-lg leading-relaxed text-white/75 md:mx-0" style={d(720)}>
                  {profile.summary}
                </p>
                <div className="fade-up mt-7 flex flex-wrap justify-center gap-3 md:justify-start" style={d(840)}>
                  <a href="#projects" className="rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5">
                    See projects
                  </a>
                  <AskButton className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition-colors hover:border-mint hover:text-mint">
                    <SparkleIcon className="h-4 w-4" />
                    Ask Gurrabot
                  </AskButton>
                </div>
                <ul className="fade-up mt-5 flex flex-wrap justify-center gap-2 md:justify-start" style={d(960)}>
                  {quick.map((q) => (
                    <li key={q.label}>
                      <a
                        href={q.href}
                        {...(q.download ? { download: true } : {})}
                        className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-mint hover:text-mint"
                      >
                        {q.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats */}
            <ul className="fade-up no-scrollbar -mx-5 mt-14 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:mt-20 md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10 md:overflow-visible md:px-0" style={d(1100)}>
              {stats.map((s) => (
                <li key={s.label} className="min-w-[10rem] shrink-0 snap-start rounded-2xl bg-forest p-4 md:min-w-0 md:rounded-none md:bg-transparent md:px-6 md:text-center">
                  <p className="font-display text-4xl leading-none md:text-6xl">
                    <CountUp to={s.value} />
                  </p>
                  <p className="mt-2 text-sm text-white/70">{s.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tech marquee */}
        <div aria-hidden className="marquee overflow-hidden bg-mint py-4 text-abyss">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} className="flex shrink-0 items-center">
                {ticker.map((t) => (
                  <li key={t + k} className="flex items-center whitespace-nowrap font-display text-2xl md:text-3xl">
                    <span className="px-6 md:px-9">{t}</span>
                    <PinIcon className="h-5 w-4" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* About */}
        <Section
          id="about"
          tone="mist"
          title={
            <>
              Meet <span className="hl">{profile.name.split(" ").slice(0, 2).join(" ")}</span>
            </>
          }
        >
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal className="self-start">
              <div className="group relative mx-auto w-full max-w-xs">
                <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rotate-[5deg] rounded-sm bg-sand transition-transform duration-500 group-hover:rotate-[7deg]" />
                <figure className="relative -rotate-3 rounded-sm bg-card p-3 pb-16 shadow-2xl shadow-black/20 transition-transform duration-500 group-hover:rotate-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-forest">
                    <Photo src="/photo-casual.jpg" alt="Mark Jade relaxing at a table" position="center 15%" sizes="320px" />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-4 text-center font-display text-2xl">Off the clock</figcaption>
                </figure>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="max-w-prose space-y-4 text-lg leading-relaxed">
                  {profile.about.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>

              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {glance.map(([k, v], i) => (
                  <Reveal key={k} delay={i * 80}>
                    <div className="h-full rounded-2xl bg-card p-4 transition-transform duration-300 hover:-translate-y-1">
                      <dt className="text-sm font-semibold text-muted">{k}</dt>
                      <dd className="mt-1 font-semibold">{v}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal>
                <h3 className="mt-10 font-display text-3xl">How I work</h3>
              </Reveal>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {principles.map((p, i) => (
                  <li key={p.title}>
                    <Reveal delay={i * 100} className="h-full">
                      <div className="h-full rounded-2xl bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
                        <span aria-hidden className={`block h-2 w-10 rounded-full ${TAGS[i % TAGS.length]}`} />
                        <p className="mt-3 font-bold">{p.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{p.detail}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects" tone="dark" title="Selected work" intro="Click a project to see what it does, what it’s built with, and where to try it.">
          <ProjectShowcase projects={projects} stats={repoStats} />
        </Section>

        {/* Skills */}
        <Section id="skills" tone="paper" title="Skills">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items], i) => (
              <Reveal key={group} delay={i * 90} className="h-full">
                <div className="h-full rounded-3xl bg-mist p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 md:p-6">
                  <dt className="font-display text-xl">{group}</dt>
                  <dd className="mt-4 flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s} className="rounded-full bg-card px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-mint hover:text-[#07261E]">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>

        {/* Involvement */}
        <Section id="involvement" tone="sand" title="Involvement" intro="Tap a card to read more.">
          <InvolvementCards items={involvement} />
        </Section>

        {certifications.length > 0 && (
          <Section id="certifications" tone="paper" title="Certifications">
            <ul className="grid gap-4 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.title} className="rounded-3xl bg-mist p-6">
                  <h3 className="font-display text-xl">{c.title}</h3>
                  <p className="mt-1 text-muted">
                    {c.issuer}
                    {c.year ? `, ${c.year}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {approved.length > 0 && (
          <Section id="kind-words" tone="mist" title="Kind words">
            <ul className="grid gap-4 md:grid-cols-2">
              {approved.map((t, i) => (
                <li key={t.name + i}>
                  <Reveal delay={i * 100} className="h-full">
                    <figure className="h-full rounded-3xl bg-card p-6">
                      <blockquote className="font-display text-xl leading-snug">“{t.quote}”</blockquote>
                      <figcaption className="mt-4 text-sm font-semibold text-muted">
                        {t.name}
                        {t.role ? `, ${t.role}` : ""}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Notes teaser */}
        {latestNotes.length > 0 && (
          <Section id="notes" tone="dark" title="Notes" intro="Write-ups and dev logs from things I’m building.">
            <ul className="grid gap-4 md:grid-cols-2">
              {latestNotes.map((n, i) => (
                <li key={n.slug}>
                  <Reveal delay={i * 100} className="h-full">
                    <Link
                      href={`/notes/${n.slug}`}
                      className="block h-full rounded-3xl border border-white/10 bg-forest p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mint"
                    >
                      <p className="text-xs font-semibold text-mint">{n.date}</p>
                      <h3 className="mt-2 font-display text-2xl leading-tight">{n.title}</h3>
                      <p className="mt-2 text-white/70">{n.summary}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Link href="/notes" className="mt-6 inline-block text-sm font-bold text-mint underline underline-offset-4">
              All notes
            </Link>
          </Section>
        )}

        {/* Contact */}
        <Section id="contact" tone="mist" title="Let’s talk" intro="Questions, collaborations, or opportunities. Send a message, or ask Gurrabot the quick ones.">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <ul className="space-y-3 self-start">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a href={c.href} className="flex items-center gap-4 rounded-2xl bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
                    <MailIcon className="h-6 w-6 shrink-0 text-jade" />
                    <span className="min-w-0">
                      <span className="block text-sm text-muted">{c.label}</span>
                      <span className="block break-all font-semibold">{c.text}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <AskButton className="flex w-full items-center gap-4 rounded-2xl bg-abyss p-4 text-left text-white transition-transform hover:-translate-y-0.5">
                  <SparkleIcon className="h-6 w-6 shrink-0 text-mint" />
                  <span>
                    <span className="block font-bold">Ask Gurrabot</span>
                    <span className="block text-sm text-white/70">Get quick answers about my work</span>
                  </span>
                </AskButton>
              </li>
            </ul>
            <ContactForm mode={mode} />
          </div>
        </Section>
      </main>

      <MobileTabs />
    </>
  );
}
