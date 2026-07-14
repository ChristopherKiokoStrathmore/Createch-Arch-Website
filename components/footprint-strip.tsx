/**
 * Footprint strip (Build prompt §3.1, S3): a single horizontal line of
 * location markers rendered as text stations on a gold hairline.
 * NOT an interactive map. Scrolls horizontally on narrow viewports so
 * nothing is ever cut off (law #3).
 */
const STATIONS = [
  "Nairobi",
  "Zanzibar",
  "Abuja",
  "Serengeti",
  "Mumbai",
  "Himachal",
];

export default function FootprintStrip() {
  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-max pt-6">
        {/* the gold hairline */}
        <div className="absolute left-0 right-0 top-1 h-px bg-[var(--color-gold)]" />
        <ul className="flex items-start gap-8 md:gap-16">
          {STATIONS.map((city) => (
            <li key={city} className="relative">
              {/* station tick */}
              <span className="absolute -top-5 left-0 block h-2 w-px bg-[var(--color-gold-deep)]" />
              <span className="caption !tracking-[0.12em] text-[var(--color-ink)]">
                {city}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
