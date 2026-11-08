import { adminEnabled, checkPassword, createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { clientIp, limited } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminEnabled()) return Response.json({ error: "Admin is not enabled. Set ADMIN_PASSWORD." }, { status: 503 });
  if (await limited(`login:${clientIp(req)}`, 5, 900)) {
    return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  let password = "";
  try {
    password = String(((await req.json()) as { password?: string }).password ?? "");
  } catch {
    /* empty */
  }
  if (!checkPassword(password)) return Response.json({ error: "Wrong password." }, { status: 401 });

  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${createSession()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionCookieOptions.maxAge}${sessionCookieOptions.secure ? "; Secure" : ""}`
  );
  return res;
}
