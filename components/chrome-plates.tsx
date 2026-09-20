import { isRemoteSrc } from "@/lib/chrome-utils";
import type { ChromeConfig, ChromeImage } from "@/lib/chrome-types";

/**
 * Homepage plates from chrome gallery slots. Untitled — these are placed
 * photographs, not invented case studies.
 */
export default function ChromePlates({ chrome }: { chrome: ChromeConfig }) {
  const plates = chrome.images.slots.gallery
    .map((id) => chrome.images.library.find((img) => img.id === id))
    .filter((img): img is ChromeImage => Boolean(img));

  if (plates.length === 0) return null;

  return (
    <section
      className="gutter mx-auto max-w-[90rem] py-16 md:py-24"
      aria-label="Selected plates"
    >
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {plates.map((img, i) => {
          const remote = isRemoteSrc(img.url);
          return (
            <figure
              key={`${img.id}-${i}`}
              className={
                i % 3 === 0
                  ? "col-span-12 md:col-span-8"
                  : "col-span-12 md:col-span-4"
              }
            >
              {/* Railway URLs are absolute; the local WebP loader does not apply. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ""}
                width={img.width ?? 1600}
                height={img.height ?? 1000}
                className="w-full bg-[var(--color-paper-2)] object-cover"
                style={{ aspectRatio: "16 / 10" }}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                {...(remote ? { referrerPolicy: "no-referrer" as const } : {})}
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
