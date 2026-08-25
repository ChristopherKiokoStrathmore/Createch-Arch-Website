"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Cinematic image (Reel-4 language, light theme). On enter:
 *  - the frame wipes open (clip-path inset 100%→0), 1s
 *  - the photo settles from scale 1.14→1 over the same beat
 *  - then drifts with scroll parallax (±4%) for continued life
 *  - optional gold construction lines draw over it on enter
 * Hover deepens the zoom slightly inside overflow-hidden frames.
 * Reduced motion: a plain fade, no transforms, no lines.
 *
 * `eager` drops the entrance animation entirely and paints the frame at rest.
 * Use it for a cover above the fold. Two reasons, both about the LCP element:
 * the -12% observer margin carves the root short of the first screen, so on a
 * short viewport the frame can sit clipped and empty until the visitor happens
 * to scroll; and a 1s clip-path wipe delays the paint of the largest element on
 * the page for no gain. Scroll parallax still applies once it is on screen.
 *
 * NOTE: whileInView does not reliably fire on absolutely-positioned motion
 * elements, so we observe the STATIC frame with useInView and drive the
 * absolute inner layers with `animate` (which does work on absolute elements).
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export default function CinematicImage({
  src,
  alt,
  aspect = "16 / 10",
  sizes = "100vw",
  priority = false,
  parallax = true,
  hover = true,
  eager = false,
  lines,
  lineViewBox = "0 0 1600 1000",
  className = "",
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
  hover?: boolean;
  eager?: boolean;
  lines?: string[];
  lineViewBox?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, margin: "0px 0px -12% 0px" });
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const drift = parallax && !reduced;
  const shown = eager || inView;

  // An eager frame paints at rest: no `initial`/`animate` at all, so the
  // entrance never renders into the SSR markup and never waits on a frame
  // loop. Everything else keeps the wipe-and-settle reveal.
  const reveal = eager
    ? {}
    : {
        initial: reduced
          ? { opacity: 0 }
          : { clipPath: "inset(100% 0% 0% 0%)" },
        animate: reduced
          ? { opacity: shown ? 1 : 0 }
          : {
              clipPath: shown
                ? "inset(0% 0% 0% 0%)"
                : "inset(100% 0% 0% 0%)",
            },
        transition: { duration: 1.0, ease: EASE },
      };

  const settle =
    eager || reduced
      ? {}
      : {
          initial: { scale: 1.14 },
          animate: { scale: shown ? 1 : 1.14 },
          transition: { duration: 1.4, ease: EASE },
        };

  return (
    <div
      ref={frameRef}
      className={`group relative overflow-hidden bg-[var(--color-paper-2)] ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <motion.div
        className="absolute inset-[-4%]"
        {...reveal}
        style={drift ? { y } : undefined}
      >
        <motion.div className="absolute inset-0" {...settle}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover transition-transform duration-[900ms] ease-out ${
              hover ? "group-hover:scale-[1.04]" : ""
            } motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
          />
        </motion.div>
      </motion.div>

      {/* gold construction lines drawing over the image */}
      {!reduced && lines && lines.length > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={lineViewBox}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          {lines.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="var(--color-gold)"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                shown
                  ? { pathLength: 1, opacity: [0, 0.9, 0.9, 0] }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                delay: 0.3 + i * 0.06,
                opacity: { duration: 2.4, times: [0, 0.25, 0.7, 1] },
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
