import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { CONTENT_KEYS, defaults, getContent, validateContent, type ContentKey } from "@/lib/content";
import { dbConfigured, dbDelete, dbUpsert } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isKey = (k: string | null): k is ContentKey => !!k && (CONTENT_KEYS as readonly string[]).includes(k);

function refresh() {
  revalidateTag("content");
  for (const p of ["/home", "/notes", "/projects/[slug]", "/notes/[slug]"]) revalidatePath(p, p.includes("[") ? "page" : undefined);
  revalidatePath("/sitemap.xml");
}

export async function GET(req: Request) {
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });
  const key = new URL(req.url).searchParams.get("key");
  if (!isKey(key)) return Response.json({ error: "Unknown key." }, { status: 400 });
  const current = (await getContent())[key];
  const isDefault = JSON.stringify(current) === JSON.stringify(defaults()[key]);
  return Response.json({ key, value: current, isDefault });
}

export async function PUT(req: Request) {
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });
  if (!dbConfigured()) return Response.json({ error: "Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to save changes." }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as { key?: string; value?: unknown };
  if (!isKey(b.key ?? null)) return Response.json({ error: "Unknown key." }, { status: 400 });
  const problem = validateContent(b.key!, b.value);
  if (problem) return Response.json({ error: problem }, { status: 400 });
  await dbUpsert("content", { key: b.key, value: b.value, updated_at: new Date().toISOString() }, "key");
  refresh();
  return Response.json({ ok: true });
}

// Reset one section back to the defaults in the code.
export async function DELETE(req: Request) {
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });
  if (!dbConfigured()) return Response.json({ error: "Database not configured." }, { status: 503 });
  const key = new URL(req.url).searchParams.get("key");
  if (!isKey(key)) return Response.json({ error: "Unknown key." }, { status: 400 });
  await dbDelete("content", `key=eq.${key}`);
  refresh();
  return Response.json({ ok: true });
}
