"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteSettings } from "@/content/seed";

/**
 * Client-side error boundary. On a static export the pages themselves are
 * prerendered HTML, so this only fires if hydration or a client component
 * throws — rare, but without it React unmounts the tree and the visitor gets a
 * blank page, which is the worst possible outcome on a portfolio.
 *
 * The direct contact routes stay reachable here on purpose: whatever broke,
 * the enquiry should still be able to get through.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[createch]", error);
  }, [error]);

  return (
    <section className="gutter mx-auto max-w-[90rem] pt-32 pb-24 md:pt-44">
      <p className="kicker mb-5">Something went wrong</p>
      <h1 className="h-display max-w-[16ch]">This page didn&rsquo;t load properly.</h1>
      <p className="mt-7 max-w-[52ch] text-[var(--color-ink-60)]">
        Reloading usually fixes it. If it doesn&rsquo;t, we&rsquo;d rather hear
        from you directly than have you leave.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={reset}
          className="border border-[var(--color-ink)] px-7 py-3 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          Try again
        </button>
        <Link href="/" className="text-[0.95rem] font-medium">
          Back to the homepage
        </Link>
        <a
          href={`mailto:${siteSettings.email}`}
          className="text-[0.95rem] font-medium"
        >
          {siteSettings.email}
        </a>
      </div>
    </section>
  );
}
