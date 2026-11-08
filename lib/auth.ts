import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";

function hmac(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSession(now = Date.now()): string {
  const exp = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${exp}.${hmac(String(exp))}`;
}

export function verifySession(token: string | undefined, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Math.floor(now / 1000)) return false;
  const expected = hmac(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || !input) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

export function isAdmin(): boolean {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
