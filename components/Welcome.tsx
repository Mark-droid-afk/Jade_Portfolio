"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { profile } from "@/lib/data";

const DELAY_MS = 4000; // change this to adjust how long the welcome page shows

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/home");
    const id = setTimeout(() => router.replace("/home"), DELAY_MS);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <main className="grid-bg relative flex min-h-dvh flex-col justify-center overflow-hidden bg-midnight px-5 text-white md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <p className="welcome-rise text-lg text-white/70" style={{ animationDelay: "0.1s" }}>
          Welcome to the portfolio of
        </p>
        <h1
          className="welcome-rise mt-3 break-words font-display text-[clamp(2.75rem,10vw,7rem)] leading-[1.02]"
          style={{ animationDelay: "0.35s" }}
        >
          {profile.firstLine}
          <br />
          {profile.lastLine}
        </h1>
        <p className="welcome-rise mt-5 text-xl font-semibold text-aqua" style={{ animationDelay: "0.65s" }}>
          {profile.role}
        </p>
        <p className="welcome-rise mt-2 max-w-md text-white/70" style={{ animationDelay: "0.9s" }}>
          Say hi to Gurrabot, my AI assistant, on the next page.
        </p>
        <Link
          href="/home"
          replace
          className="welcome-rise mt-10 inline-block rounded-full bg-aqua px-7 py-3.5 text-sm font-bold text-midnight transition-opacity hover:opacity-90"
          style={{ animationDelay: "1.1s" }}
        >
          Enter site
        </Link>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-white/15 motion-reduce:hidden">
        <div
          className="welcome-progress h-full origin-left bg-aqua"
          style={{ animationDuration: `${DELAY_MS}ms` }}
        />
      </div>
    </main>
  );
}
