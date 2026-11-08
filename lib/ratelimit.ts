import { dbConfigured, dbRpc } from "./db";

const memory = new Map<string, { count: number; reset: number }>();

function memoryLimited(key: string, limit: number, windowSec: number): boolean {
  const now = Date.now();
  if (memory.size > 2000) {
    memory.forEach((v, k) => {
      if (now > v.reset) memory.delete(k);
    });
  }
  const h = memory.get(key);
  if (!h || now > h.reset) {
    memory.set(key, { count: 1, reset: now + windowSec * 1000 });
    return false;
  }
  h.count += 1;
  return h.count > limit;
}

// Returns true when the caller is over the limit. Uses the database when it is
// configured (shared across serverless instances), otherwise memory.
export async function limited(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (dbConfigured()) {
    try {
      return await dbRpc<boolean>("hit_rate_limit", { p_key: key, p_window: windowSec, p_limit: limit });
    } catch {
      /* fall through to memory */
    }
  }
  return memoryLimited(key, limit, windowSec);
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "anon";
}
