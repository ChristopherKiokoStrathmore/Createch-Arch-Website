import Link from "next/link";
import CinematicImage from "./cinematic-image";
import Reveal from "./reveal";
import DimensionCaption from "./dimension-caption";

/**
 * Founder block — "know the founder" moment for the home (folded into the
 * Studio section to keep the home at 4 sections, law #7). Matted B&W portrait
 * with a brief bio; the full profile lives on /studio (law #5).
 */
export default function Founder() {
  return (
    <div className="grid grid-cols-12 items-center gap-x-8 gap-y-10">
      <Reveal className="col-span-12 sm:col-span-6 md:col-span-4" as="figure">
        <div className="max-w-[360px] border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
          <CinematicImage
            src="/images/founder/Anvi_Shah_Profile.jpg"
            alt="Anvi Shah, founder and principal architect of Createch Architects."
            aspect="414 / 659"
            parallax={false}
            sizes="(min-width: 768px) 360px, 60vw"
          />
        </div>
      </Reveal>

      <div className="col-span-12 md:col-span-8 md:pl-6">
        <Reveal>
          <p className="kicker">Know the founder</p>
          <h3 className="h2 mt-3 font-serif">Anvi Shah</h3>
          <p className="caption mt-2 !tracking-[0.12em]">
            Founder · Principal Architect
          </p>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-6 max-w-[54ch] text-[var(--color-ink-60)]">
            Createch was founded by Anvi Shah, an architect and interior
            designer with over sixteen years across hospitality, retail,
            commercial and residential projects in Kenya, India, and East and
            West Africa — from concept development through technical detailing
            and consultant coordination to end-user experience.
          </p>
        </Reveal>
        <Reveal index={2}>
          <DimensionCaption
            className="mt-6"
            items={[
              { label: "Base", value: "Nairobi, Kenya" },
              { label: "Since", value: "16+ years" },
              { label: "Clients", value: "Grumeti · Village Market" },
            ]}
          />
        </Reveal>
        <Reveal index={3}>
          <Link
            href="/studio"
            className="group mt-8 inline-block text-[0.95rem] font-medium"
          >
            Read the full profile
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
