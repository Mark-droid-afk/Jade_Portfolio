import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { SiteContent } from "./content";

// The standard PDF fonts only cover Latin-1, so swap typographic characters for plain ones.
export function safe(s: string): string {
  return s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "?");
}

const W = 595.28;
const H = 841.89;
const M = 50;
const INK = rgb(0.03, 0.15, 0.12);
const MUTED = rgb(0.27, 0.39, 0.35);
const ACCENT = rgb(0.02, 0.55, 0.33);

export async function buildCv(c: SiteContent): Promise<Uint8Array> {
  const { profile, projects, skills, involvement, certifications } = c;
  const doc = await PDFDocument.create();
  doc.setTitle(`${profile.name} - CV`);
  doc.setAuthor(profile.name);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage = doc.addPage([W, H]);
  let y = H - M;
  const width = W - 2 * M;

  const ensure = (h: number) => {
    if (y - h < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const wrap = (text: string, f: PDFFont, size: number, max: number): string[] => {
    const out: string[] = [];
    let cur = "";
    for (const word of safe(text).split(/\s+/)) {
      const next = cur ? `${cur} ${word}` : word;
      if (f.widthOfTextAtSize(next, size) > max && cur) {
        out.push(cur);
        cur = word;
      } else cur = next;
    }
    if (cur) out.push(cur);
    return out;
  };
  const para = (text: string, opts: { size?: number; f?: PDFFont; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) => {
    const { size = 10, f = font, color = INK, indent = 0, gap = 4 } = opts;
    for (const l of wrap(text, f, size, width - indent)) {
      ensure(size + 3);
      page.drawText(l, { x: M + indent, y: y - size, size, font: f, color });
      y -= size + 3;
    }
    y -= gap;
  };
  const heading = (t: string) => {
    ensure(40);
    y -= 12;
    page.drawText(safe(t.toUpperCase()), { x: M, y: y - 9, size: 9, font: bold, color: ACCENT });
    y -= 16;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: rgb(0.8, 0.88, 0.84) });
    y -= 10;
  };
  const bullet = (t: string) => {
    const lines = wrap(t, font, 10, width - 14);
    lines.forEach((l, i) => {
      ensure(13);
      if (i === 0) page.drawText("-", { x: M + 2, y: y - 10, size: 10, font, color: ACCENT });
      page.drawText(l, { x: M + 14, y: y - 10, size: 10, font, color: INK });
      y -= 13;
    });
    y -= 1;
  };

  // Header
  page.drawText(safe(profile.name), { x: M, y: y - 22, size: 22, font: bold, color: INK });
  y -= 30;
  page.drawText(safe(profile.role), { x: M, y: y - 12, size: 12, font: bold, color: ACCENT });
  y -= 20;
  const contact = [profile.email, profile.github, profile.linkedin, profile.location].filter(Boolean).join("   |   ");
  if (contact) para(contact, { size: 9, color: MUTED, gap: 2 });

  heading("Profile");
  para(profile.summary, { gap: 4 });
  profile.about.forEach((a) => para(a, { color: MUTED }));

  heading("Education");
  para(profile.program, { f: bold });
  if (profile.school) para(profile.school, { color: MUTED });

  heading("Projects");
  for (const p of projects) {
    ensure(50);
    page.drawText(safe(p.name), { x: M, y: y - 11, size: 11, font: bold, color: INK });
    page.drawText(safe(p.kind), {
      x: M + bold.widthOfTextAtSize(safe(p.name), 11) + 8,
      y: y - 11,
      size: 9,
      font,
      color: MUTED,
    });
    y -= 16;
    para(p.tagline, { color: MUTED, gap: 2 });
    p.highlights.slice(0, 4).forEach(bullet);
    para(`Built with: ${p.stack.join(", ")}`, { size: 9, color: MUTED, gap: 2 });
    if (p.link) para(p.link.url, { size: 9, color: ACCENT, gap: 8 });
    else y -= 6;
  }

  heading("Skills");
  for (const [group, items] of Object.entries(skills)) {
    ensure(14);
    para(`${group}: ${items.join(", ")}`, { gap: 2 });
  }

  if (involvement.length) {
    heading("Involvement");
    for (const i of involvement) {
      para(i.title, { f: bold, gap: 1 });
      para(i.detail, { color: MUTED, gap: 5 });
    }
  }
  if (certifications.length) {
    heading("Certifications");
    certifications.forEach((x) => bullet(`${x.title}, ${x.issuer}${x.year ? ` (${x.year})` : ""}`));
  }

  return doc.save();
}
