"use client";

import Image from "next/image";
import { useState } from "react";

// Fills its (relative) parent. Falls back to initials if the image file is missing.
export default function Photo({
  src,
  alt,
  position = "center",
  initials = "MG",
  sizes = "(min-width: 1024px) 420px, 320px",
  priority = false,
}: {
  src: string;
  alt: string;
  position?: string;
  initials?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div aria-hidden className="grid h-full w-full place-items-center bg-forest font-display text-6xl text-mint">
        {initials}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className="object-cover"
      style={{ objectPosition: position }}
    />
  );
}
