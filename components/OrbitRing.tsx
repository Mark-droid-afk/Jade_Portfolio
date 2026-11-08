"use client";

import { useEffect, useState } from "react";

const PATH = "M10,220 a250,120 0 1,1 500,0 a250,120 0 1,1 -500,0";

// The logo's orbit ring with a pin travelling around it.
export default function OrbitRing({ className = "" }: { className?: string }) {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <svg viewBox="0 0 520 440" fill="none" aria-hidden className={className}>
      <g transform="rotate(-14 260 220)">
        <ellipse cx="260" cy="220" rx="250" ry="120" stroke="#72F2B0" strokeOpacity="0.6" strokeWidth="6" />
        <circle
          r="12"
          cx={still ? 510 : 0}
          cy={still ? 220 : 0}
          fill="#E5402B"
          stroke="#04201A"
          strokeWidth="4"
        >
          {!still && <animateMotion dur="16s" repeatCount="indefinite" path={PATH} />}
        </circle>
      </g>
    </svg>
  );
}
