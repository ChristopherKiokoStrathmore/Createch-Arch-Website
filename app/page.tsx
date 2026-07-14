import SectionIndex from "@/components/section-index";
import DimensionCaption from "@/components/dimension-caption";
import Reveal from "@/components/reveal";

/**
 * Home — Phase 0 placeholder. The real 4-section home (Hero, Featured Work,
 * Studio-in-brief, Contact CTA) lands in Phase 2. This exists so Phase 0
 * acceptance passes: tokens, nav, footer, blueprint motif all render.
 */
export default function Home() {
  return (
    <section className="gutter mx-auto max-w-[90rem] pt-32 pb-24 md:pt-44 md:pb-36">
      <SectionIndex number="00" label="Foundations" />
      <Reveal>
        <h1 className="h1 max-w-[16ch]">
          Architecture for hospitality, from first line to final detail.
        </h1>
      </Reveal>
      <Reveal index={1}>
        <p className="mt-8 max-w-[52ch] text-[var(--color-ink-60)]">
          Createch Architects is a Nairobi practice designing hotels,
          restaurants and lifestyle destinations across Africa and India.
        </p>
      </Reveal>
      <Reveal index={2}>
        <DimensionCaption
          className="mt-10"
          items={[
            { label: "Location", value: "Nairobi, Kenya" },
            { label: "Founded by", value: "Anvi Shah" },
            { label: "Experience", value: "16+ years" },
          ]}
        />
      </Reveal>
    </section>
  );
}
