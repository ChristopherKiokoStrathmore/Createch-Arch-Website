import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectCard from "@/components/project-card";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import { projects } from "@/content/seed";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected hospitality, retail, healthcare and residential projects by Createch Architects and by Anvi Shah with previous practices, across Kenya, Tanzania, Nigeria and India.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · Createch Architects",
    description:
      "Selected hospitality, retail, healthcare and residential projects across Kenya, Tanzania, Nigeria and India.",
    url: "/work",
    type: "website",
  },
};

/**
 * Work index (Build prompt §3.2). Two honest groups, in this order:
 *   01  Createch Architects — projects delivered under the practice
 *   02  Selected earlier work — Anvi's role named on every card
 * The split is driven by `underCreatech`, and exists for attribution
 * integrity (§0): the site must never imply the practice built what it
 * coordinated for someone else.
 *
 * Rows alternate 7/5 and 5/7 column spans with the second card dropped, so
 * the grid reads as an editorial spread rather than a uniform tile wall.
 */
const RHYTHM = [
  { span: "md:col-span-7", drop: "", sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-5", drop: "md:mt-28", sizes: "(min-width: 768px) 41vw, 100vw" },
  { span: "md:col-span-5", drop: "", sizes: "(min-width: 768px) 41vw, 100vw" },
  { span: "md:col-span-7", drop: "md:mt-28", sizes: "(min-width: 768px) 58vw, 100vw" },
];

export default function WorkIndex() {
  const byOrder = [...projects].sort((a, b) => a.order - b.order);
  const own = byOrder.filter((p) => p.underCreatech);
  const earlier = byOrder.filter((p) => !p.underCreatech);

  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="Eleven projects, four countries."
        lede="Hotels, lodges, restaurants, retail destinations, a children's hospital and private houses — from first concept to handover."
      />

      {/* 01 — under Createch */}
      <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
        <SectionIndex number="01" label="Createch Architects" />
        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          {own.map((project, i) => (
            <Reveal
              key={project.slug}
              as="article"
              index={i}
              className="col-span-12 md:col-span-8"
            >
              <ProjectCard
                project={project}
                priority={i === 0}
                sizes="(min-width: 768px) 66vw, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 02 — earlier work with previous practices */}
      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number="02" label="Earlier Work" />
          <Reveal>
            <p className="max-w-[62ch] text-[var(--color-ink-60)]">
              Projects led or coordinated by Anvi Shah with previous practices,
              before founding Createch. Her role is named on every project.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-20">
            {earlier.map((project, i) => {
              const r = RHYTHM[i % RHYTHM.length];
              return (
                <Reveal
                  key={project.slug}
                  as="article"
                  className={`col-span-12 sm:col-span-6 ${r.span} ${r.drop}`}
                >
                  <ProjectCard project={project} sizes={r.sizes} />
                  <p className="caption mt-2 !tracking-[0.12em]">{project.role}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
