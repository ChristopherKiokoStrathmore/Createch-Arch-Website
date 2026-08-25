/**
 * Page header — the standing title block for interior pages (Work, Studio,
 * Contact). Real text rendered on the server: this is the LCP element on every
 * page that uses it, so nothing here animates in (law #1, and §1.4's rule that
 * the hero H1 is never an image).
 *
 * Top padding clears the fixed nav; the homepage handles that itself via the
 * hero's own min-height.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="gutter mx-auto max-w-[90rem] pt-32 md:pt-44">
      <p className="kicker mb-5">{eyebrow}</p>
      <h1 className="h-display max-w-[18ch]">{title}</h1>
      {lede && (
        <p className="mt-7 max-w-[54ch] text-[1.0625rem] text-[var(--color-ink-60)]">
          {lede}
        </p>
      )}
      <hr className="mt-12 h-px w-full border-0 bg-[var(--color-line)] md:mt-16" />
    </header>
  );
}
