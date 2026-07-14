/**
 * Section index (Build prompt §1.3): the blueprint motif.
 * Gold index numeral (01–04) above a 1px gold construction line,
 * 40% width, left-aligned. Optional small-caps label.
 */
export default function SectionIndex({
  number,
  label,
}: {
  number: string;
  label?: string;
}) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-[var(--color-gold-deep)] text-xl tabular-nums">
          {number}
        </span>
        {label && <span className="caption">{label}</span>}
      </div>
      <hr className="mt-3 h-px w-2/5 border-0 bg-[var(--color-gold)]" />
    </div>
  );
}
