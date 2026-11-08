import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

const html = (md: string) => renderToStaticMarkup(<div>{renderMarkdown(md)}</div>);

describe("markdown renderer", () => {
  it("renders headings, lists, bold, and code", () => {
    const out = html("## Title\n\nSome **bold** and `code`.\n\n- one\n- two\n\n1. first\n2. second");
    expect(out).toContain("<h2");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<code");
    expect(out.match(/<li>/g)?.length).toBe(4);
    expect(out).toContain("<ol");
  });

  it("only links to safe URLs", () => {
    expect(html("[ok](https://example.com)")).toContain('href="https://example.com"');
    expect(html("[bad](javascript:alert(1))")).not.toContain("href");
  });

  it("escapes raw HTML", () => {
    const out = html("<script>alert(1)</script>");
    expect(out).not.toContain("<script>");
  });
});
