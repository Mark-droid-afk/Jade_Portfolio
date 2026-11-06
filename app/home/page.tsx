import Avatar from "@/components/Avatar";
import AskButton from "@/components/AskButton";
import ContactForm from "@/components/ContactForm";
import GurrabotDock from "@/components/GurrabotDock";
import { MailIcon, SparkleIcon } from "@/components/Icons";
import MobileTabs from "@/components/MobileTabs";
import ProjectsGrid from "@/components/ProjectsGrid";
import Section from "@/components/Section";
import {
  certifications,
  focus,
  getStats,
  involvement,
  principles,
  profile,
  projects,
  skills,
} from "@/lib/data";

const NAV: [string, string][] = [
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Involvement", "#involvement"],
  ...(certifications.length ? ([["Certifications", "#certifications"]] as [string, string][]) : []),
];

const TAGS = ["bg-peach", "bg-aqua", "bg-lime"];

export default function Home() {
  const stats = getStats();

  const contacts = [
    profile.email && { label: "Email", href: `mailto:${profile.email}`, text: profile.email },
    profile.github && { label: "GitHub", href: profile.github, text: profile.github.replace(/^https?:\/\//, "") },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin, text: profile.linkedin.replace(/^https?:\/\//, "") },
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  const quick = [
    profile.cvUrl && { label: "Download CV", href: profile.cvUrl, download: true },
    ...contacts.map((c) => ({ label: c.label, href: c.href, download: false })),
  ].filter(Boolean) as { label: string; href: string; download: boolean }[];

  const glance = [
    ["Role", profile.role],
    ["Studying", profile.program],
    ["Focus", focus.join(", ")],
    profile.school && ["School", profile.school],
    profile.location && ["Based in", profile.location],
  ].filter(Boolean) as [string, string][];

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
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-aqua focus:px-4 focus:py-2 focus:font-semibold focus:text-midnight"
      >
        Skip to content
      </a>

      {/* Announcement bar */}
      <div className="on-light bg-lilac text-ink">
        <p className="mx-auto max-w-6xl px-5 py-2 text-center text-xs sm:text-sm md:px-6">
          Meet Gurrabot, my AI assistant.{" "}
          <AskButton className="font-bold underline underline-offset-4">Ask it about my work</AskButton>
        </p>
      </div>

      {/* Header: pill navigation on larger screens, slim bar on phones */}
      <header className="sticky top-0 z-30 px-3 pt-3 md:px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-midnight/85 py-2 pl-5 pr-2 backdrop-blur md:pl-6">
          <a href="#top" className="flex items-center gap-2.5 font-bold">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-aqua font-display text-sm text-midnight">
              MG
            </span>
            <span className="text-sm">{profile.firstLine}</span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="rounded-full bg-aqua px-5 py-2.5 text-sm font-bold text-midnight transition-opacity hover:opacity-90">
            Get in touch
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section id="hero" className="grid-bg bg-midnight">
          <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-6 md:pb-16 md:pt-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div className="relative mx-auto w-32 md:mx-0 md:w-64 lg:order-2 lg:mx-auto lg:w-full lg:max-w-sm">
                <div className="aspect-square overflow-hidden rounded-full ring-4 ring-aqua/70 md:rounded-3xl md:ring-0 lg:aspect-[4/5]">
                  <Avatar initials="MG" />
                </div>
                <div className="absolute -left-10 top-10 hidden rounded-2xl bg-white px-4 py-3 text-ink shadow-xl shadow-black/30 lg:block">
                  <p className="text-xs font-semibold text-muted">Currently</p>
                  <p className="text-sm font-bold">4th-year BSIT student</p>
                </div>
                <AskButton className="absolute -right-4 bottom-10 hidden items-center gap-2 rounded-2xl bg-aqua px-4 py-3 text-left text-midnight shadow-xl shadow-black/30 lg:flex">
                  <SparkleIcon className="h-6 w-6 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold">Ask Gurrabot</span>
                    <span className="block text-xs">anything about Mark</span>
                  </span>
                </AskButton>
              </div>

              <div className="text-center md:text-left lg:order-1">
                <h1 className="font-display text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[1.05]">
                  Hi, I’m {profile.firstLine} {profile.lastLine}.
                </h1>
                <p className="mt-4 text-lg font-bold text-aqua">{profile.role}</p>
                <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-white/75 md:mx-0">{profile.summary}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                  <a href="#projects" className="rounded-full bg-aqua px-6 py-3 text-sm font-bold text-midnight transition-opacity hover:opacity-90">
                    See projects
                  </a>
                  <AskButton className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition-colors hover:border-aqua hover:text-aqua">
                    <SparkleIcon className="h-4 w-4" />
                    Ask Gurrabot
                  </AskButton>
                </div>
                {quick.length > 0 && (
                  <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                    {quick.map((q) => (
                      <li key={q.label}>
                        <a
                          href={q.href}
                          {...(q.download ? { download: true } : {})}
                          className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-aqua hover:text-aqua"
                        >
                          {q.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Stats: swipeable chips on phones, divided row on larger screens */}
            <ul className="no-scrollbar -mx-5 mt-12 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:mt-16 md:grid md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10 md:overflow-visible md:px-0">
              {stats.map((s) => (
                <li key={s.label} className="min-w-[9.5rem] shrink-0 snap-start rounded-2xl bg-deep p-4 md:min-w-0 md:rounded-none md:bg-transparent md:px-6 md:text-center">
                  <p className="font-display text-4xl leading-none md:text-5xl">{s.value}</p>
                  <p className="mt-2 text-sm text-white/70">{s.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About */}
        <Section
          id="about"
          tone="lilac"
          title={
            <>
              Meet <span className="hl">{profile.firstLine}</span>
            </>
          }
        >
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-sm self-start">
              <div aria-hidden className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-peach md:-right-4 md:-top-4" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[4/5]">
                <Avatar initials="MG" />
              </div>
            </div>

            <div>
              <div className="max-w-prose space-y-4 text-lg leading-relaxed">
                {profile.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {glance.map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white p-4">
                    <dt className="text-sm font-semibold text-muted">{k}</dt>
                    <dd className="mt-1 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-10 font-display text-2xl">How I work</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {principles.map((p, i) => (
                  <li key={p.title} className="rounded-2xl bg-white p-4">
                    <span aria-hidden className={`block h-2 w-10 rounded-full ${TAGS[i % TAGS.length]}`} />
                    <p className="mt-3 font-bold">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects" tone="dark" title="Projects" intro="Capstone systems and personal builds, with what makes each one tick.">
          <ProjectsGrid projects={projects} />
        </Section>

        {/* Skills */}
        <Section id="skills" tone="paper" title="Skills">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group} className="rounded-3xl bg-lilac p-5 md:p-6">
                <dt className="font-display text-xl">{group}</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span key={s} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Involvement */}
        <Section id="involvement" tone="lilac" title="Involvement">
          <ul className="grid gap-4 md:grid-cols-3">
            {involvement.map((i, n) => (
              <li key={i.title} className="rounded-3xl bg-white p-6">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${TAGS[n % TAGS.length]}`}>{i.tag}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight">{i.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{i.detail}</p>
              </li>
            ))}
          </ul>
        </Section>

        {certifications.length > 0 && (
          <Section id="certifications" tone="paper" title="Certifications">
            <ul className="grid gap-4 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.title} className="rounded-3xl bg-lilac p-6">
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

        {/* Contact */}
        <Section id="contact" tone="dark" title="Let’s talk" intro="Questions, collaborations, or opportunities. Send a message, or ask Gurrabot the quick ones.">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <ul className="space-y-3 self-start">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-deep p-4 transition-colors hover:border-aqua"
                  >
                    <MailIcon className="h-6 w-6 shrink-0 text-aqua" />
                    <span className="min-w-0">
                      <span className="block text-sm text-white/70">{c.label}</span>
                      <span className="block break-all font-semibold">{c.text}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <AskButton className="flex w-full items-center gap-4 rounded-2xl bg-aqua p-4 text-left text-midnight">
                  <SparkleIcon className="h-6 w-6 shrink-0" />
                  <span>
                    <span className="block font-bold">Ask Gurrabot</span>
                    <span className="block text-sm">Get quick answers about my work</span>
                  </span>
                </AskButton>
              </li>
            </ul>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/10 bg-midnight">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pb-28 pt-8 text-sm text-white/70 md:px-6 md:pb-8">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex flex-wrap gap-5">
            {contacts.map((c) => (
              <a key={c.label} href={c.href} className="hover:text-aqua">
                {c.label}
              </a>
            ))}
            <a href="#top" className="hover:text-aqua">
              Back to top
            </a>
          </div>
        </div>
      </footer>

      <MobileTabs />
      <GurrabotDock />
    </>
  );
}
