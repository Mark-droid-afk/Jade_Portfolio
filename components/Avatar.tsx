"use client";

import { useState } from "react";

// Fills its parent. Shows /public/photo.jpg if it exists, otherwise a monogram.
export default function Avatar({ initials }: { initials: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        aria-hidden
        className="grid h-full w-full place-items-center bg-deep font-display text-[min(30vw,6rem)] text-aqua"
      >
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/photo.jpg"
      alt="Portrait of Mark Jade D. Gurrobat"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}
