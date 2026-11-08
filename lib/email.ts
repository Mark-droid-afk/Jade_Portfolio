// Sends email through Resend. Optional: returns false when not configured.
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.OWNER_EMAIL);

export async function sendEmail(opts: { subject: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!emailConfigured()) return false;
  const base = process.env.RESEND_BASE_URL || "https://api.resend.com";
  try {
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>",
        to: [process.env.OWNER_EMAIL],
        subject: opts.subject,
        text: opts.text,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
