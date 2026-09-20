import Image from "next/image";

/**
 * Official Createch mark — vertical hexagon C+A with gold construction
 * lines (public/brand/createch-logo.png). Do not redraw it.
 *
 * The PNG is transparent. Charcoal structure + gold lines. On paper (nav)
 * it sits as-is. On ink (footer) it sits on a paper plate so the charcoal
 * C+A does not vanish. The letterspaced wordmark is the existing system
 * lockup, not a new drawing.
 *
 * variant:
 *   "full"    — one mark + CREATECH ARCHITECTS (nav). Wordmark from md up.
 *   "mark"    — mark only
 *   "inverse" — paper-plated mark + paper wordmark (dark footer)
 *
 * Mount this once per lockup. Two <Logo> nodes (e.g. mark + full) paint the
 * PNG twice; Tailwind `hidden` cannot reliably hide one when the other root
 * also has `inline-flex`.
 */
export const BRAND_LOGO = {
  src: "/brand/createch-logo.png",
  width: 547,
  height: 768,
} as const;

export default function Logo({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "mark" | "inverse";
  className?: string;
}) {
  const inverse = variant === "inverse";
  const ink = inverse ? "#faf7f2" : "#111110";

  const mark = (
    <Image
      src={BRAND_LOGO.src}
      alt=""
      width={BRAND_LOGO.width}
      height={BRAND_LOGO.height}
      unoptimized
      priority={!inverse}
      className={inverse ? "h-20 w-auto" : "h-12 w-auto md:h-14"}
    />
  );

  const framed = inverse ? (
    <span className="inline-flex shrink-0 bg-[var(--color-paper)] p-1.5">
      {mark}
    </span>
  ) : (
    <span className="inline-flex shrink-0">{mark}</span>
  );

  if (variant === "mark") {
    return <span className={className}>{framed}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {framed}
      <span
        className={`text-sm font-medium tracking-[0.18em] ${
          inverse ? "" : "hidden md:inline"
        }`}
        style={{ color: ink }}
      >
        CREATECH ARCHITECTS
      </span>
    </span>
  );
}
