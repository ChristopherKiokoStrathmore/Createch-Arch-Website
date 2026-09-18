import Image from "next/image";
import dims from "@/content/image-dimensions.json";
import type { GalleryImage } from "@/content";
import { projectImageSrc } from "@/lib/project";
import { PAPER_BLUR } from "@/lib/placeholder";

/**
 * Adaptive gallery (Build prompt §3.3):
 *  - Wide images (intrinsic ≥ 1600px) may span the full content width.
 *  - Everything else renders in a matted 2-up / 3-up grid, and — per the
 *    legacy-image rule — never wider than ~700px CSS (the grid cells cap
 *    well under that on a 1440 container). Images are never upscaled
 *    beyond their frame; matted on paper-2 like plates in a book.
 */
const DIMS = dims as Record<string, number[]>;

function aspectOf(file: string): string {
  const wh = DIMS[file];
  return wh && wh.length === 2 ? `${wh[0]} / ${wh[1]}` : "4 / 3";
}
function widthOf(file: string): number {
  return DIMS[file]?.[0] ?? 1200;
}

export default function Gallery({ images }: { images: GalleryImage[] }) {
  if (!images?.length) return null;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {images.map((img) => {
        const wide = widthOf(img.file) >= 1600;
        return (
          <figure
            key={img.file}
            className={wide ? "w-full" : "mx-auto w-full max-w-[700px]"}
          >
            <div
              className="relative overflow-hidden bg-[var(--color-paper-2)]"
              style={{ aspectRatio: aspectOf(img.file) }}
            >
              <Image
                src={projectImageSrc(img.file)}
                alt={img.alt}
                fill
                sizes={
                  wide
                    ? "(min-width: 1440px) 1200px, 100vw"
                    : "(min-width: 768px) 700px, 100vw"
                }
                placeholder="blur"
                blurDataURL={PAPER_BLUR}
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="caption mt-3 border-l border-[var(--color-gold)] pl-3">
                {img.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
