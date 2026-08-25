"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

/**
 * Blueprint through-line (the "from line to built" motif, extended site-wide).
 * Gold construction/plan lines that draw themselves as the block scrolls
 * through view — pathLength is bound to scroll progress, so it's passive and
 * reversible (NOT scroll-jacking; the page never stops moving).
 * Reduced motion: faint static lines.
 */
export default function BlueprintLines({
  paths,
  viewBox = "0 0 1200 200",
  className = "",
  strokeWidth = 1.25,
  opacity = 0.85,
}: {
  paths: string[];
  viewBox?: string;
  className?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 40%"],
  });

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <svg
        viewBox={viewBox}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="var(--color-gold)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={opacity}
            style={reduced ? { pathLength: 0.35 } : { pathLength: scrollYProgress }}
          />
        ))}
      </svg>
    </div>
  );
}
