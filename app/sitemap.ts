import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().origin;
  const c = await getContent();
  return [
    { url: `${base}/home`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/notes`, changeFrequency: "monthly", priority: 0.6 },
    ...c.projects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...c.notes.map((n) => ({ url: `${base}/notes/${n.slug}`, lastModified: n.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
