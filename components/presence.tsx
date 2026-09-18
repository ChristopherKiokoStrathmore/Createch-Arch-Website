import Reveal from "./reveal";
import { presence } from "@/content";

/**
 * Geographic statement from the live site: Based in Kenya / Serving Africa,
 * Procuring from the world. Large type, no invented street address.
 */
export default function Presence() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      {presence.map((item, i) => (
        <Reveal key={item.title} index={i}>
          <h3 className="h2 max-w-[12ch] font-serif">{item.title}</h3>
          <p className="mt-3 text-[1.125rem] text-[var(--color-ink-60)] md:text-[1.25rem]">
            {item.body}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
