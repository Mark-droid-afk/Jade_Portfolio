import { describe, expect, it } from "vitest";
import { CONTENT_KEYS, defaults, validateContent } from "@/lib/content";

describe("content validation", () => {
  it("accepts every default section", () => {
    const d = defaults();
    for (const key of CONTENT_KEYS) {
      const value = key === "profile"
        ? { role: d.profile.role, summary: d.profile.summary, program: d.profile.program, about: d.profile.about }
        : d[key];
      expect(validateContent(key, value), key).toBeNull();
    }
  });

  const project = {
    slug: "demo", name: "Demo", kind: "Personal project", category: "Personal",
    tagline: "t", overview: "o", highlights: ["a"], stack: ["x"],
  };

  it("accepts a minimal project", () => {
    expect(validateContent("projects", [project])).toBeNull();
  });

  it("rejects bad projects", () => {
    expect(validateContent("projects", [{ ...project, category: "Work" }])).toMatch(/category/);
    expect(validateContent("projects", [{ ...project, slug: "Bad Slug" }])).toMatch(/slug/);
    expect(validateContent("projects", [project, project])).toMatch(/duplicate/);
    expect(validateContent("projects", [{ ...project, image: "https://evil.example/x.png" }])).toMatch(/image/);
    expect(validateContent("projects", [{ ...project, link: { label: "x", url: "javascript:alert(1)" } }])).toMatch(/link/);
    expect(validateContent("projects", "nope")).toMatch(/list/);
  });

  it("restricts profile fields", () => {
    expect(validateContent("profile", { summary: "Hi", about: ["a"] })).toBeNull();
    expect(validateContent("profile", { name: "Someone else" })).toMatch(/Unknown profile field/);
    expect(validateContent("profile", { github: "javascript:x" })).toMatch(/github/);
  });

  it("validates notes and testimonials", () => {
    const note = { slug: "hello", title: "Hi", date: "2026-01-02", summary: "s", body: "b" };
    expect(validateContent("notes", [note])).toBeNull();
    expect(validateContent("notes", [{ ...note, date: "Jan 2" }])).toMatch(/date/);
    expect(validateContent("testimonials", [{ quote: "Great", name: "A", approved: true }])).toBeNull();
    expect(validateContent("testimonials", [{ quote: "Great" }])).toMatch(/needs/);
  });

  it("rejects unknown keys", () => {
    expect(validateContent("secrets", {})).toMatch(/Unknown/);
  });
});
