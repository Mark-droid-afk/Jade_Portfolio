import {
  certifications as defaultCertifications,
  involvement as defaultInvolvement,
  notes as defaultNotes,
  profile as defaultProfile,
  projects as defaultProjects,
  skills as defaultSkills,
  testimonials as defaultTestimonials,
  type Certification,
  type Involvement,
  type Note,
  type Project,
  type Testimonial,
} from "./data";
import { dbConfigured, dbSelect } from "./db";

export type Profile = typeof defaultProfile;

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  skills: Record<string, string[]>;
  involvement: Involvement[];
  certifications: Certification[];
  testimonials: Testimonial[];
  notes: Note[];
  knowledge: string;
};

export const CONTENT_KEYS = [
  "profile",
  "projects",
  "skills",
  "involvement",
  "certifications",
  "testimonials",
  "notes",
  "knowledge",
] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export function defaults(): SiteContent {
  return {
    profile: defaultProfile,
    projects: defaultProjects,
    skills: defaultSkills,
    involvement: defaultInvolvement,
    certifications: defaultCertifications,
    testimonials: defaultTestimonials,
    notes: defaultNotes,
    knowledge: "",
  };
}

// ---------- validation (used by the admin editor and when reading from the database) ----------
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const optStr = (v: unknown) => v === undefined || isStr(v);
const httpUrl = (v: unknown) => isStr(v) && /^https?:\/\//i.test(v);
const localPath = (v: unknown) => isStr(v) && v.startsWith("/") && !v.startsWith("//");
const slugOk = (v: unknown) => isStr(v) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);

const PROFILE_FIELDS = ["role", "summary", "program", "school", "location", "email", "github", "linkedin", "cvUrl"];

export function validateContent(key: string, value: unknown): string | null {
  switch (key) {
    case "profile": {
      if (!isObj(value)) return "Profile must be an object.";
      for (const [k, v] of Object.entries(value)) {
        if (k === "about") {
          if (!isStrArr(v)) return "about must be a list of strings.";
        } else if (PROFILE_FIELDS.includes(k)) {
          if (!isStr(v)) return `${k} must be a string.`;
        } else return `Unknown profile field “${k}”. Allowed: about, ${PROFILE_FIELDS.join(", ")}.`;
      }
      if (isStr(value.github) && value.github && !httpUrl(value.github)) return "github must start with http:// or https://.";
      if (isStr(value.linkedin) && value.linkedin && !httpUrl(value.linkedin)) return "linkedin must start with http:// or https://.";
      if (isStr(value.cvUrl) && value.cvUrl && !localPath(value.cvUrl) && !httpUrl(value.cvUrl)) return "cvUrl must be a /path or an http(s) link.";
      return null;
    }
    case "projects": {
      if (!Array.isArray(value) || value.length > 20) return "Projects must be a list of up to 20 projects.";
      const seen = new Set<string>();
      for (const [i, p] of value.entries()) {
        const at = `Project ${i + 1}`;
        if (!isObj(p)) return `${at} must be an object.`;
        if (!slugOk(p.slug)) return `${at}: slug must be lowercase letters, numbers and dashes.`;
        if (seen.has(p.slug as string)) return `${at}: duplicate slug “${p.slug}”.`;
        seen.add(p.slug as string);
        for (const f of ["name", "kind", "tagline", "overview"]) if (!isStr(p[f]) || !(p[f] as string).trim()) return `${at}: ${f} is required.`;
        if (p.category !== "Capstone" && p.category !== "Personal") return `${at}: category must be "Capstone" or "Personal".`;
        if (!isStrArr(p.highlights)) return `${at}: highlights must be a list of strings.`;
        if (!isStrArr(p.stack)) return `${at}: stack must be a list of strings.`;
        if (p.featured !== undefined && typeof p.featured !== "boolean") return `${at}: featured must be true or false.`;
        if (p.image !== undefined && !localPath(p.image)) return `${at}: image must be a file in /public, like "/projects/shot.png".`;
        if (!optStr(p.imageBg)) return `${at}: imageBg must be a string.`;
        if (p.frame !== undefined && p.frame !== "phone" && p.frame !== "window") return `${at}: frame must be "phone" or "window".`;
        if (p.repo !== undefined && !(isStr(p.repo) && /^[\w.-]+\/[\w.-]+$/.test(p.repo))) return `${at}: repo must look like "owner/name".`;
        if (p.video !== undefined && !localPath(p.video)) return `${at}: video must be a file in /public.`;
        if (p.gallery !== undefined && !(isStrArr(p.gallery) && p.gallery.every(localPath))) return `${at}: gallery must be a list of files in /public.`;
        if (p.link !== undefined) {
          if (!isObj(p.link) || !isStr(p.link.label) || !httpUrl(p.link.url)) return `${at}: link needs a label and an http(s) url.`;
        }
        if (p.sections !== undefined) {
          if (!Array.isArray(p.sections) || !p.sections.every((s) => isObj(s) && isStr(s.heading) && isStr(s.body))) return `${at}: sections must be a list of {heading, body}.`;
        }
      }
      return null;
    }
    case "skills": {
      if (!isObj(value) || Object.keys(value).length > 12) return "Skills must be an object of up to 12 groups.";
      for (const [g, items] of Object.entries(value)) if (!isStrArr(items)) return `Group “${g}” must be a list of strings.`;
      return null;
    }
    case "involvement": {
      if (!Array.isArray(value) || value.length > 12) return "Involvement must be a list of up to 12 items.";
      for (const [i, v] of value.entries()) {
        if (!isObj(v) || !["tag", "title", "summary", "detail"].every((f) => isStr(v[f]))) return `Item ${i + 1} needs tag, title, summary and detail.`;
      }
      return null;
    }
    case "certifications": {
      if (!Array.isArray(value) || value.length > 30) return "Certifications must be a list.";
      for (const [i, v] of value.entries()) {
        if (!isObj(v) || !isStr(v.title) || !isStr(v.issuer) || !optStr(v.year)) return `Certification ${i + 1} needs title and issuer (year optional).`;
      }
      return null;
    }
    case "testimonials": {
      if (!Array.isArray(value) || value.length > 30) return "Testimonials must be a list.";
      for (const [i, v] of value.entries()) {
        if (!isObj(v) || !isStr(v.quote) || !isStr(v.name) || !optStr(v.role)) return `Testimonial ${i + 1} needs quote and name (role optional).`;
        if (v.approved !== undefined && typeof v.approved !== "boolean") return `Testimonial ${i + 1}: approved must be true or false.`;
      }
      return null;
    }
    case "notes": {
      if (!Array.isArray(value) || value.length > 100) return "Notes must be a list.";
      const seen = new Set<string>();
      for (const [i, v] of value.entries()) {
        if (!isObj(v) || !slugOk(v.slug) || !["title", "date", "summary", "body"].every((f) => isStr(v[f]))) return `Note ${i + 1} needs slug, title, date, summary and body.`;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date as string)) return `Note ${i + 1}: date must look like 2026-11-08.`;
        if (seen.has(v.slug as string)) return `Note ${i + 1}: duplicate slug.`;
        seen.add(v.slug as string);
      }
      return null;
    }
    case "knowledge":
      return isStr(value) && value.length <= 8000 ? null : "Knowledge must be text up to 8000 characters.";
    default:
      return `Unknown content key “${key}”.`;
  }
}

function apply(base: SiteContent, key: ContentKey, value: unknown): SiteContent {
  switch (key) {
    case "profile":
      return { ...base, profile: { ...base.profile, ...(value as Partial<Profile>) } };
    default:
      return { ...base, [key]: value } as SiteContent;
  }
}

export async function getContent(): Promise<SiteContent> {
  let content = defaults();
  if (!dbConfigured()) return content;
  try {
    const rows = await dbSelect<{ key: string; value: unknown }>("content", "select=key,value", {
      revalidate: 60,
      tags: ["content"],
    });
    for (const row of rows) {
      if ((CONTENT_KEYS as readonly string[]).includes(row.key) && validateContent(row.key, row.value) === null) {
        content = apply(content, row.key as ContentKey, row.value);
      }
    }
  } catch (e) {
    console.error("Could not load content overrides", e instanceof Error ? e.message : e);
  }
  return content;
}
