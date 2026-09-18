"use client";

import Image from "next/image";
import { useRef } from "react";
import { PAPER_BLUR } from "@/lib/placeholder";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Parallax image frame (Build prompt §1.4):
 *  - overflow-hidden frame, explicit aspect ratio (zero CLS)
 *  - max 6% translateY parallax on large images (useScroll + useTransform)
 *  - hover: image scales 1.03 over 500ms
 *  - reduced motion: no parallax, no hover scale — static image
 *
 * `src` is a path under public/, e.g. "/images/slug/file.jpg".
 */
export default function ParallaxImage({
  src,
  alt,
  aspect = "4 / 3",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  parallax = true,
  className = "",
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // ±3% around center → 6% total travel, large images only.
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const animate = parallax && !reduced;

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden bg-[var(--color-paper-2)] ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <motion.div
        className="absolute inset-0"
        style={animate ? { y, scale: 1.06 } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={PAPER_BLUR}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </motion.div>
    </div>
  );
}
