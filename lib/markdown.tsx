import React from "react";

// Tiny, safe Markdown renderer: ## headings, lists, code blocks, **bold**, `code`, [links](url).
// It builds React elements (never raw HTML), and only allows http(s) and relative links.

const safeHref = (u: string) => (/^(https?:\/\/|\/|#|mailto:)/i.test(u) ? u : null);

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("**")) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`"))
      out.push(
        <code key={k} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]">
          {t.slice(1, -1)}
        </code>
      );
    else {
      const [, label, url] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      const href = safeHref(url);
      out.push(
        href ? (
          <a key={k} href={href} className="text-mint underline underline-offset-4" {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        ) : (
          label
        )
      );
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(src: string): React.ReactNode[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let n = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      nodes.push(
        <pre key={n++} className="mt-5 overflow-x-auto rounded-xl bg-forest p-4 text-sm">
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      nodes.push(
        h[1].length === 2 ? (
          <h2 key={n++} className="mt-12 font-display text-3xl">
            {inline(h[2], `h${n}`)}
          </h2>
        ) : (
          <h3 key={n++} className="mt-8 font-display text-2xl">
            {inline(h[2], `h${n}`)}
          </h3>
        )
      );
      i++;
      continue;
    }
    if (/^(-|\*)\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\.\s+/.test(lines[i]) : /^(-|\*)\s+/.test(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\d+\.\s+/ : /^(-|\*)\s+/, ""));
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      nodes.push(
        <Tag key={n++} className={`mt-4 space-y-2 pl-6 leading-relaxed ${ordered ? "list-decimal" : "list-disc"} marker:text-mint`}>
          {items.map((t, j) => (
            <li key={j}>{inline(t, `li${n}-${j}`)}</li>
          ))}
        </Tag>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|(-|\*)\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    nodes.push(
      <p key={n++} className="mt-4 leading-relaxed">
        {inline(para.join(" "), `p${n}`)}
      </p>
    );
  }
  return nodes;
}
