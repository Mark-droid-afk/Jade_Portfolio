"use client";

import { useEffect, useRef, useState } from "react";

// Counts up to a number the first time it scrolls into view.
export default function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return <span ref={ref}>{n}</span>;
}
