import { logEvent } from "@/lib/monitor";
import { clientIp, limited } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["project_open", "gurrabot_open", "palette_open", "external_link", "theme_toggle"]);

export async function POST(req: Request) {
  if (await limited(`event:${clientIp(req)}`, 60, 60)) return new Response(null, { status: 204 });
  try {
    const b = (await req.json()) as { type?: string; label?: string };
    if (b.type && ALLOWED.has(b.type)) await logEvent(b.type, String(b.label ?? "").slice(0, 80));
  } catch {
    /* ignore bad payloads */
  }
  return new Response(null, { status: 204 });
}
