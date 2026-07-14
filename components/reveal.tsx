"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

/**
 * Reveal-on-scroll (Build prompt §1.4): opacity 0→1 + translateY 8px→0,
 * 350ms ease-out, once. Stagger groups by passing incremental `index`
 * (60ms steps). Under reduced motion: pure fade, no transform.
 */
type RevealProps = HTMLMotionProps<"div"> & {
  index?: number;
  as?: "div" | "section" | "li" | "figure" | "article";
};

export default function Reveal({
  children,
  index = 0,
  as = "div",
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
        delay: reduced ? 0 : index * 0.06,
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
