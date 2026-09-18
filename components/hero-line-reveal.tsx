"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PAPER_BLUR } from "@/lib/placeholder";
import type { HeroCopy } from "@/content/copy";

/**
 * Hero line-to-built reveal — the ONE signature moment. Runs once on load,
 * under 1.7s total. Copy comes from `@/content` so the live-site voice
 * ("The art of layouts…") lives in one place. H1 is real text, not an image.
 */
export default function HeroLineReveal({
  src,
  alt,
  paths,
  viewBox = "0 0 1600 1000",
  copy,
}: {
  src: string;
  alt: string;
  paths: string[];
  viewBox?: string;
  copy: HeroCopy;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-[var(--color-paper)] pt-24 md:pt-28">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: reduced ? 0 : 0.6,
          ease: "easeOut",
        }}
      >
        <div className="kenburns absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={PAPER_BLUR}
            className="object-cover"
          />
        </div>
        <div className="scrim-copy absolute inset-0" />
        <div className="scrim-t absolute inset-x-0 top-0 h-40 md:h-48" />
      </motion.div>

      {!reduced && paths.length > 0 && (
        <motion.svg
          // Same kenburns class as the photograph so the traced lines stay
          // locked to the building as the slow zoom runs.
          className="kenburns pointer-events-none absolute inset-0 h-full w-full"
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

      <div className="gutter relative z-10 mx-auto w-full max-w-[90rem] pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduced ? 0.2 : 1.0, ease: "easeOut" }}
        >
          <p className="kicker mb-5 !text-[var(--color-ink)]">{copy.kicker}</p>
          <h1 className="h-display max-w-[18ch]">{copy.title}</h1>
          <p className="mt-6 max-w-[28ch] font-serif text-[1.35rem] leading-[1.3] text-[var(--color-ink)] md:text-[1.6rem]">
            {copy.strap}
          </p>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] text-[var(--color-ink)]/80">
            {copy.lede}
          </p>
          <Link
            href={copy.ctaHref}
            className="group mt-8 inline-block text-[0.95rem] font-medium"
          >
            {copy.cta}
            <span className="ml-1 inline-block transition-transform group-hover:translate-y-1">
              ↓
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
