"use client";

import { useEffect, useRef } from "react";

// Fades and slides its children in when they scroll into view.
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
