import { dbConfigured, dbInsert } from "@/lib/db";
import { emailConfigured, sendEmail } from "@/lib/email";
import { logEvent, reportError } from "@/lib/monitor";
import { clientIp, limited } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  if (!dbConfigured() && !emailConfigured()) {
    return json({ error: "The contact form isn’t set up yet." }, 503);
  }
  if (await limited(`contact:${clientIp(req)}`, 5, 3600)) {
    return json({ error: "Too many messages from this connection. Please try again later." }, 429);
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Spam traps: a hidden field real people never fill, and a form that was submitted too quickly.
  const elapsed = Date.now() - Number(b.t ?? 0);
  if (b.website || !(elapsed > 2500)) return json({ ok: true });

  const name = String(b.name ?? "").trim().slice(0, 100);
  const email = String(b.email ?? "").trim().slice(0, 150);
  const message = String(b.message ?? "").trim().slice(0, 2000);
  const source = b.source === "gurrabot" ? "gurrabot" : "form";
  if (!name || !EMAIL.test(email) || message.length < 3) {
    return json({ error: "Please enter your name, a valid email, and a message." }, 400);
  }

  let saved = false;
  try {
    if (dbConfigured()) {
      await dbInsert("messages", { name, email, message, source });
      saved = true;
    }
  } catch (e) {
    await reportError("contact:save", e);
  }
  const emailed = await sendEmail({
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\nVia: ${source}\n\n${message}`,
    replyTo: email,
  });

  if (!saved && !emailed) return json({ error: "Your message couldn’t be sent. Please try again." }, 502);
  void logEvent("contact_submit", source);
  return json({ ok: true });
}
