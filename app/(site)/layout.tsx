import AskButton from "@/components/AskButton";
import CommandPalette, { type PaletteItem } from "@/components/CommandPalette";
import GurrabotDock from "@/components/GurrabotDock";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getContent } from "@/lib/content";
import { cvHref } from "@/lib/contact-mode";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  const { profile } = c;

  const contacts = [
    profile.email && { label: "Email", href: `mailto:${profile.email}` },
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  const items: PaletteItem[] = [
    { id: "s-about", group: "Sections", label: "About", href: "/home#about" },
    { id: "s-projects", group: "Sections", label: "Projects", href: "/home#projects" },
    { id: "s-skills", group: "Sections", label: "Skills", href: "/home#skills" },
    { id: "s-inv", group: "Sections", label: "Involvement", href: "/home#involvement" },
    { id: "s-contact", group: "Sections", label: "Contact", href: "/home#contact" },
    ...c.projects.map((p) => ({ id: `p-${p.slug}`, group: "Projects", label: p.name, hint: p.kind, href: `/projects/${p.slug}` })),
    { id: "n-all", group: "Notes", label: "All notes", href: "/notes" },
    ...c.notes.map((n) => ({ id: `n-${n.slug}`, group: "Notes", label: n.title, href: `/notes/${n.slug}` })),
    { id: "a-ask", group: "Actions", label: "Ask Gurrabot", hint: "AI assistant", action: "gurrabot" as const },
    { id: "a-theme", group: "Actions", label: "Switch light / dark theme", action: "theme" as const },
    { id: "a-cv", group: "Actions", label: "Download CV", href: cvHref(profile.cvUrl) },
    ...contacts.map((x) => ({ id: `c-${x.label}`, group: "Contact", label: x.label, href: x.href })),
  ];

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-mint focus:px-4 focus:py-2 focus:font-semibold focus:text-abyss"
      >
        Skip to content
      </a>
      <div className="on-light bg-mint text-abyss">
        <p className="mx-auto max-w-6xl px-5 py-2 text-center text-xs font-medium sm:text-sm md:px-6">
          Meet Gurrabot, my AI assistant.{" "}
          <AskButton className="font-bold underline underline-offset-4">Ask it about my work</AskButton>
        </p>
      </div>
      <SiteHeader hasCerts={c.certifications.length > 0} />
      {children}
      <SiteFooter name={profile.name} contacts={contacts} />
      <GurrabotDock />
      <CommandPalette items={items} />
    </>
  );
}
