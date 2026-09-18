"use client";

import { useEffect } from "react";
import Link from "next/link";
import { errorCopy, mailtoHref, site } from "@/content/copy";

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
      <p className="kicker mb-5">{errorCopy.kicker}</p>
      <h1 className="h-display max-w-[16ch]">{errorCopy.title}</h1>
      <p className="mt-7 max-w-[52ch] text-[var(--color-ink-60)]">
        {errorCopy.lede}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={reset}
          className="border border-[var(--color-ink)] px-7 py-3 text-[0.95rem] font-medium transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          {errorCopy.retry}
        </button>
        <Link href="/" className="text-[0.95rem] font-medium">
          {errorCopy.home}
        </Link>
        <a
          href={mailtoHref(site.email)}
          className="text-[0.95rem] font-medium"
        >
          {site.email}
        </a>
      </div>
    </section>
  );
}
