import { dbConfigured, dbUpdate } from "@/lib/db";
import { clientIp, limited } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Thumbs up/down on a Gurrabot reply.
export async function POST(req: Request) {
  if (!dbConfigured() || (await limited(`feedback:${clientIp(req)}`, 30, 600))) return new Response(null, { status: 204 });
  try {
    const b = (await req.json()) as { chatId?: string; rating?: number };
    if (b.chatId && UUID.test(b.chatId) && (b.rating === 1 || b.rating === -1)) {
      await dbUpdate("chat_logs", `id=eq.${b.chatId}`, { rating: b.rating });
    }
  } catch {
    /* ignore */
  }
  return new Response(null, { status: 204 });
}
