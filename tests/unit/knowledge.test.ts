import { describe, expect, it } from "vitest";
import { buildKnowledge, cleanReadme } from "@/lib/knowledge";
import { defaults } from "@/lib/content";

describe("chatbot knowledge", () => {
  it("strips school, country, and credential lines from READMEs", () => {
    const out = cleanReadme(
      ["# Votera", "Made at Polytechnic University of the Philippines", "Login: admin123", "Handled under R.A. 10173", "![shot](a.png)", "Real feature line"].join("\n")
    );
    expect(out).toContain("Votera");
    expect(out).toContain("Real feature line");
    expect(out).not.toMatch(/polytechnic|philippines|admin123|R\.A\.|shot/i);
  });

  it("builds a profile without the school or country by default", () => {
    const k = buildKnowledge(defaults());
    expect(k).toContain("Votera");
    expect(k).toContain("Budget-Friendly Cooking");
    expect(k).not.toMatch(/sentra|crm|philippin|PUP\b/i);
  });
});
