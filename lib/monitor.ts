import { dbConfigured, dbInsert } from "./db";
import { sendEmail } from "./email";
import { limited } from "./ratelimit";

// Logs a server error, stores it for the admin page, and emails the owner (at most once per 10 minutes).
export async function reportError(where: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${where}]`, message);
  try {
    if (dbConfigured()) await dbInsert("events", { type: "error", label: where, meta: { message: message.slice(0, 300) } });
    if (!(await limited("alert-email", 1, 600))) {
      await sendEmail({ subject: `Portfolio error in ${where}`, text: message.slice(0, 500) });
    }
  } catch {
    /* never let monitoring break a request */
  }
}

export async function logEvent(type: string, label?: string, meta?: Record<string, unknown>) {
  if (!dbConfigured()) return;
  try {
    await dbInsert("events", { type, label: label ?? null, meta: meta ?? null });
  } catch {
    /* ignore */
  }
}
