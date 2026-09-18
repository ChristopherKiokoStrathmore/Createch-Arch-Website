import Reveal from "./reveal";
import { principles } from "@/content";

/**
 * Studio principles — lines already on createch.co.ke, typeset as a quiet
 * four-up rather than a SaaS feature grid. Copy supports; nothing here
 * claims a metric or a completed building.
 */
export default function Principles() {
  return (
    <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {principles.map((item, i) => (
        <Reveal as="li" key={item.title} index={i}>
          <p className="caption !tracking-[0.14em] text-[var(--color-gold-deep)]">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-serif text-[1.75rem] leading-[1.15] md:text-[2rem]">
            {item.title}
          </h3>
          <p className="mt-2 text-[0.95rem] text-[var(--color-ink-60)]">
            {item.body}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
