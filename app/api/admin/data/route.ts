import { adminEnabled, isAdmin } from "@/lib/auth";
import { dbConfigured, dbSelect } from "@/lib/db";
import { emailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

export async function GET() {
  if (!adminEnabled()) return Response.json({ error: "Admin is not enabled." }, { status: 503 });
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });

  const status = { database: dbConfigured(), email: emailConfigured(), groq: Boolean(process.env.GROQ_API_KEY) };
  if (!dbConfigured()) return Response.json({ status, messages: [], chats: [], events: {}, errors: [], ratings: { up: 0, down: 0 } });

  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  try {
    const [messages, chats, events] = await Promise.all([
      dbSelect<Row>("messages", "select=*&order=created_at.desc&limit=100"),
      dbSelect<Row>("chat_logs", "select=*&order=created_at.desc&limit=100"),
      dbSelect<Row>("events", `select=type,label,meta,created_at&created_at=gte.${since}&order=created_at.desc&limit=2000`),
    ]);
    const counts: Record<string, Record<string, number>> = {};
    const errors: Row[] = [];
    for (const e of events) {
      const type = String(e.type);
      if (type === "error") {
        if (errors.length < 15) errors.push(e);
        continue;
      }
      const label = String(e.label ?? "-");
      counts[type] ??= {};
      counts[type][label] = (counts[type][label] ?? 0) + 1;
    }
    const ratings = {
      up: chats.filter((c) => c.rating === 1).length,
      down: chats.filter((c) => c.rating === -1).length,
    };
    return Response.json({ status, messages, chats, events: counts, errors, ratings });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Database error." }, { status: 502 });
  }
}
