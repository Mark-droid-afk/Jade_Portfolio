import { describe, expect, it } from "vitest";
import { limited } from "@/lib/ratelimit";

describe("rate limiter (in-memory fallback)", () => {
  it("blocks after the limit and tracks keys separately", async () => {
    const key = `t-${Math.random()}`;
    expect(await limited(key, 3, 60)).toBe(false);
    expect(await limited(key, 3, 60)).toBe(false);
    expect(await limited(key, 3, 60)).toBe(false);
    expect(await limited(key, 3, 60)).toBe(true);
    expect(await limited(`other-${key}`, 3, 60)).toBe(false);
  });
});
