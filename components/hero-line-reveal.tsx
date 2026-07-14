"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

/**
 * Hero line-to-built reveal (Build prompt §2.1 / §1.4) — the ONE signature
 * moment. Runs once on load, under 1.7s total:
 *   paper → gold line-drawing draws in (pathLength, 0.9s) →
 *   photograph fades in underneath (0.5s, overlapping) →
 *   lines fade to 0 (0.3s).
 * Reduced motion: photo simply fades in, no lines.
 *
 * H1 is real text (SEO / LCP), not an image.
 */
export default function HeroLineReveal({
  src,
  alt,
  paths,
  viewBox = "0 0 1600 1000",
}: {
  src: string;
  alt: string;
  paths: string[];
  viewBox?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-[var(--color-paper)]">
      {/* photograph */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: reduced ? 0 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduced ? 0.5 : 0.5,
          delay: reduced ? 0 : 0.6,
          ease: "easeOut",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* paper scrim, bottom-left, for AA on the H1 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-paper)]/85 via-[var(--color-paper)]/20 to-transparent md:bg-gradient-to-tr md:from-[var(--color-paper)]/80 md:via-transparent" />
      </motion.div>

      {/* gold line drawing overlay — skipped entirely under reduced motion */}
      {!reduced && paths.length > 0 && (
        <motion.svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.25, ease: "easeIn" }}
        >
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="var(--color-gold)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: i * 0.02 }}
            />
          ))}
        </motion.svg>
      )}

      {/* copy — bottom-left */}
      <div className="gutter relative z-10 mx-auto w-full max-w-[90rem] pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduced ? 0.2 : 1.0, ease: "easeOut" }}
        >
          <h1 className="h1 max-w-[18ch]">
            Architecture for hospitality, from first line to final detail.
          </h1>
          <p className="mt-6 max-w-[46ch] text-[var(--color-ink)]/80">
            Createch Architects is a Nairobi practice designing hotels,
            restaurants and lifestyle destinations across Africa and India.
          </p>
          <Link
            href="#featured-work"
            className="group mt-8 inline-block text-[0.95rem] font-medium"
          >
            View work
            <span className="ml-1 inline-block transition-transform group-hover:translate-y-1">
              ↓
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
