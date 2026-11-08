import { getContent, type SiteContent } from "./content";
import { focus, principles } from "./data";

// Lines that must never reach the chatbot (school, country, demo credentials).
const BLOCK = /polytechnic|\bPUP\b|philippin|quezon|admin123|student123|ADMIN-001|\b2022-9\d{4}|R\.A\./i;

export function cleanReadme(md: string, max = 3500): string {
  return md
    .split("\n")
    .filter((l) => !BLOCK.test(l))
    .join("\n")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

async function fetchReadme(repo: string): Promise<string> {
  for (const branch of ["main", "master"]) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/README.md`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) return cleanReadme(await res.text());
    } catch {
      /* try the next branch */
    }
  }
  return "";
}

export function buildKnowledge(c: SiteContent): string {
  const { profile, projects, skills, involvement, certifications } = c;
  const lines: string[] = [`Name: ${profile.name}`, `Role: ${profile.role}`, `Program: ${profile.program}`];
  if (profile.school) lines.push(`School: ${profile.school}`);
  if (profile.location) lines.push(`Location: ${profile.location}`);
  lines.push(
    `Summary: ${profile.summary}`,
    `About: ${profile.about.join(" ")}`,
    `Focus areas: ${focus.join(", ")}`,
    `How he works: ${principles.map((p) => `${p.title} (${p.detail})`).join(" ")}`,
    "",
    "Projects:",
    ...projects.map(
      (p) =>
        `- ${p.name} (${p.kind}): ${p.overview} Highlights: ${p.highlights.join("; ")}. Tech: ${p.stack.join(", ")}.${
          p.link ? ` ${p.link.label}: ${p.link.url}` : ""
        } Case study: /projects/${p.slug}`
    ),
    "",
    "Skills:",
    ...Object.entries(skills).map(([k, v]) => `- ${k}: ${v.join(", ")}`),
    "",
    "Involvement:",
    ...involvement.map((i) => `- ${i.title}: ${i.detail}`),
    ""
  );
  if (certifications.length) {
    lines.push("Certifications:", ...certifications.map((x) => `- ${x.title}, ${x.issuer}${x.year ? ` (${x.year})` : ""}`), "");
  }
  lines.push("Contact:");
  if (profile.email) lines.push(`- Email: ${profile.email}`);
  if (profile.github) lines.push(`- GitHub: ${profile.github}`);
  if (profile.linkedin) lines.push(`- LinkedIn: ${profile.linkedin}`);
  if (!profile.email && !profile.github && !profile.linkedin)
    lines.push("- No public contact details are listed. Visitors can use the contact form on the site.");
  return lines.join("\n");
}

// Profile, project READMEs from GitHub, and any extra notes added in the admin page.
export async function getKnowledge(): Promise<string> {
  const c = await getContent();
  let out = buildKnowledge(c);
  const readmes = await Promise.all(c.projects.map(async (p) => (p.repo ? [p.name, await fetchReadme(p.repo)] : null)));
  for (const r of readmes) if (r && r[1]) out += `\n\nFrom the ${r[0]} README:\n${r[1]}`;
  if (c.knowledge.trim()) out += `\n\nAdditional notes from Mark:\n${c.knowledge.trim()}`;
  return out;
}
