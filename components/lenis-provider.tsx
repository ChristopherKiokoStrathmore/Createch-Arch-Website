"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Smooth scroll (Build prompt §1.4): Lenis, default easing, lerp 0.1,
 * continuous document flow. NO scroll-snap, NO scroll-jacking.
 * Disabled entirely under prefers-reduced-motion — native scroll takes over.
 */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
