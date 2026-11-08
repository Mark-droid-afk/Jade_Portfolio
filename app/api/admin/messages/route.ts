import { isAdmin } from "@/lib/auth";
import { dbConfigured, dbDelete, dbUpdate } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: Request) {
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });
  if (!dbConfigured()) return Response.json({ error: "Database not configured." }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as { id?: string; read?: boolean };
  if (!b.id || !UUID.test(b.id) || typeof b.read !== "boolean") return Response.json({ error: "Bad request." }, { status: 400 });
  await dbUpdate("messages", `id=eq.${b.id}`, { read: b.read });
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return Response.json({ error: "Not signed in." }, { status: 401 });
  if (!dbConfigured()) return Response.json({ error: "Database not configured." }, { status: 503 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!UUID.test(id)) return Response.json({ error: "Bad request." }, { status: 400 });
  await dbDelete("messages", `id=eq.${id}`);
  return Response.json({ ok: true });
}
