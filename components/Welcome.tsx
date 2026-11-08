"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { profile } from "@/lib/data";

const DELAY_MS = 4000; // change this to adjust how long the welcome page shows

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/home");
    const id = setTimeout(() => router.replace("/home"), DELAY_MS);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <main className="rings-bg-center relative flex min-h-dvh items-center overflow-hidden bg-abyss px-5 text-white md:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="order-last md:order-first">
          <p className="fade-up text-lg text-white/70" style={d(100)}>
            Welcome to the portfolio of
          </p>
          <h1 className="mt-3 break-words font-display text-[clamp(2.8rem,9vw,6.5rem)] leading-[1.02]">
            <span className="mask-line" style={d(250)}>
              <span>{profile.firstLine}</span>
            </span>
            <span className="mask-line" style={d(380)}>
              <span>{profile.lastLine}</span>
            </span>
          </h1>
          <p className="fade-up mt-5 text-xl font-semibold text-mint" style={d(800)}>
            {profile.role}
          </p>
          <p className="fade-up mt-2 max-w-md text-white/70" style={d(950)}>
            Say hi to Gurrabot, my AI assistant, on the next page.
          </p>
          <Link
            href="/home"
            replace
            className="fade-up mt-10 inline-block rounded-full bg-mint px-7 py-3.5 text-sm font-bold text-abyss transition-transform hover:-translate-y-0.5"
            style={d(1100)}
          >
            Enter site
          </Link>
        </div>

        <div className="fade-up justify-self-center" style={d(200)}>
          <div className="float-y">
            <Image src="/logo.png" alt="Jade mask logo with a location pin" width={512} height={512} priority className="w-44 md:w-72" />
          </div>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-white/15 motion-reduce:hidden">
        <div className="welcome-progress h-full origin-left bg-mint" style={{ animationDuration: `${DELAY_MS}ms` }} />
      </div>
    </main>
  );
}
