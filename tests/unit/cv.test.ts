import { describe, expect, it } from "vitest";
import { defaults } from "@/lib/content";
import { buildCv, safe } from "@/lib/cv";
import { timeAgo } from "@/lib/github";

describe("generated CV", () => {
  it("replaces characters the PDF fonts can't draw", () => {
    expect(safe("It’s “fine” — really…")).toBe('It\'s "fine" - really...');
    expect(safe("emoji 🎉")).toBe("emoji ??");
  });

  it("produces a real PDF", async () => {
    const bytes = await buildCv(defaults());
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(3000);
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-11-08T12:00:00Z");
  it("formats ages", () => {
    expect(timeAgo("2026-11-08T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2026-11-08T11:00:00Z", now)).toBe("1 hour ago");
    expect(timeAgo("2026-11-05T12:00:00Z", now)).toBe("3 days ago");
    expect(timeAgo("2026-05-08T12:00:00Z", now)).toBe("6 months ago");
  });
});
