import { Fragment } from "react";

/**
 * Dimension caption (Build prompt §1.2): drawing-annotation metadata.
 * Small-caps grotesk with a gold hairline to the left.
 * e.g. LOCATION Nairobi, Kenya · AREA 3,400 m² · ROLE Lead Architect
 */
export type DimensionItem = { label: string; value: string };

export default function DimensionCaption({
  items,
  className = "",
}: {
  items: DimensionItem[];
  className?: string;
}) {
  return (
    <p
      className={`caption flex flex-wrap items-baseline gap-x-1 border-l border-[var(--color-gold)] pl-3 ${className}`}
    >
      {items.map((item, i) => (
        <Fragment key={item.label + i}>
          {i > 0 && <span aria-hidden="true" className="px-1 text-[var(--color-gold-deep)]">·</span>}
          <span className="text-[var(--color-gold-deep)]">{item.label}</span>{" "}
          <span className="text-[var(--color-ink-60)]">{item.value}</span>
        </Fragment>
      ))}
    </p>
  );
}
