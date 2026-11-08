import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid-bg mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6">
      <h1 className="font-display text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-white/70">
        This page doesn’t exist. Head back to the homepage to see Mark’s projects.
      </p>
      <Link
        href="/home"
        className="mt-8 inline-block w-fit rounded-full bg-mint px-6 py-3 text-sm font-bold text-abyss"
      >
        Go to homepage
      </Link>
    </main>
  );
}
