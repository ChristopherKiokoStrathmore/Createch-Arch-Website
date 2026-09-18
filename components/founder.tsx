import Link from "next/link";
import CinematicImage from "./cinematic-image";
import Reveal from "./reveal";
import DimensionCaption from "./dimension-caption";
import { founderCopy } from "@/content";

/**
 * Founder block for the home. Copy from `@/content`. Full profile on /studio.
 */
export default function Founder() {
  const f = founderCopy;

  return (
    <div className="grid grid-cols-12 items-center gap-x-8 gap-y-10">
      <Reveal className="col-span-12 sm:col-span-6 md:col-span-4" as="figure">
        <div className="max-w-[360px] border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
          <CinematicImage
            src={f.portraitSrc}
            alt={f.portraitAlt}
            aspect="414 / 659"
            parallax={false}
            sizes="(min-width: 768px) 360px, 60vw"
          />
        </div>
      </Reveal>

      <div className="col-span-12 md:col-span-8 md:pl-6">
        <Reveal>
          <p className="kicker">{f.kicker}</p>
          <h3 className="h2 mt-3 font-serif">{f.name}</h3>
          <p className="caption mt-2 !tracking-[0.12em]">{f.role}</p>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-6 max-w-[54ch] text-[var(--color-ink-60)]">{f.short}</p>
        </Reveal>
        <Reveal index={2}>
          <DimensionCaption className="mt-6" items={[...f.caption]} />
        </Reveal>
        <Reveal index={3}>
          <Link
            href="/studio"
            className="group mt-8 inline-block text-[0.95rem] font-medium"
          >
            {f.cta}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
