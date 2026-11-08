"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6">
      <h1 className="font-display text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-lg text-white/70">An unexpected error happened. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 w-fit rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss"
      >
        Try again
      </button>
    </main>
  );
}
