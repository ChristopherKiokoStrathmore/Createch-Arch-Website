/**
 * Logo (Build prompt §1.5) — PLACEHOLDER until GATE H0.
 * Faithful-in-spirit hexagonal C/A monogram: ink strokes + gold
 * construction lines. Replace `Mark` paths with the real exported SVG
 * (logo-full.svg / logo-inverse.svg) once Illustrator export lands.
 *
 * variant:
 *   "full"    — mark + CREATECH ARCHITECTS wordmark (ink, for nav)
 *   "mark"    — monogram only
 *   "inverse" — paper-white + gold, for the dark footer band / OG images
 */
export default function Logo({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "mark" | "inverse";
  className?: string;
}) {
  const inverse = variant === "inverse";
  const stroke = inverse ? "#faf7f2" : "#111110";
  const gold = "#f5bf4f";

  const Mark = (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* hexagon */}
      <path
        d="M24 3 43.2 14v22L24 47 4.8 36V14Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* gold construction guides */}
      <path d="M24 3v44" stroke={gold} strokeWidth="0.9" opacity="0.9" />
      <path d="M4.8 14 43.2 36" stroke={gold} strokeWidth="0.9" opacity="0.55" />
      {/* C */}
      <path
        d="M30 18a8 8 0 1 0 0 12"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* A crossbar accent in gold */}
      <path d="M19 30h10" stroke={gold} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );

  if (variant === "mark") {
    return <span className={className}>{Mark}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {Mark}
      <span
        className="text-sm font-medium tracking-[0.18em]"
        style={{ color: stroke }}
      >
        CREATECH ARCHITECTS
      </span>
    </span>
  );
}
