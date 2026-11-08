// Minimal Supabase (PostgREST) client. Server only. Every feature that uses it
// keeps working without it, so check dbConfigured() first.

export const dbConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

type Opts = { revalidate?: number; tags?: string[] };

async function rest(path: string, init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}) {
  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    },
    signal: AbortSignal.timeout(8000),
    ...(init.next ? {} : { cache: "no-store" as const }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Database ${res.status}: ${text.slice(0, 200)}`);
  }
  return res;
}

export async function dbSelect<T>(table: string, query = "select=*", opts: Opts = {}): Promise<T[]> {
  const res = await rest(`${table}?${query}`, opts.revalidate || opts.tags ? { next: { revalidate: opts.revalidate, tags: opts.tags } } : {});
  return (await res.json()) as T[];
}

export async function dbInsert<T = unknown>(table: string, row: Record<string, unknown>, returning = false): Promise<T | null> {
  const res = await rest(table, {
    method: "POST",
    headers: { Prefer: returning ? "return=representation" : "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!returning) return null;
  const rows = (await res.json()) as T[];
  return rows[0] ?? null;
}

export async function dbUpdate(table: string, match: string, patch: Record<string, unknown>) {
  await rest(`${table}?${match}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
}

export async function dbDelete(table: string, match: string) {
  await rest(`${table}?${match}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

export async function dbUpsert(table: string, row: Record<string, unknown>, onConflict: string) {
  await rest(`${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(row),
  });
}

export async function dbRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await rest(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  return (await res.json()) as T;
}
