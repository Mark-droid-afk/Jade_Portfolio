import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkPassword, createSession, verifySession } from "@/lib/auth";

describe("admin auth", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "correct horse";
    delete process.env.ADMIN_SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it("accepts only the right password", () => {
    expect(checkPassword("correct horse")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
    expect(checkPassword("")).toBe(false);
  });

  it("accepts a fresh session", () => {
    expect(verifySession(createSession())).toBe(true);
  });

  it("rejects expired, tampered, and empty sessions", () => {
    const now = Date.now();
    const token = createSession(now);
    expect(verifySession(token, now + 8 * 24 * 3600 * 1000)).toBe(false);
    const [exp, sig] = token.split(".");
    expect(verifySession(`${Number(exp) + 1000}.${sig}`)).toBe(false);
    expect(verifySession(`${exp}.${sig.slice(0, -1)}0`)).toBe(false);
    expect(verifySession(undefined)).toBe(false);
    expect(verifySession("garbage")).toBe(false);
  });

  it("rejects a session signed with a different secret", () => {
    const token = createSession();
    process.env.ADMIN_SECRET = "another secret";
    expect(verifySession(token)).toBe(false);
  });
});
