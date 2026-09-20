import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectCard from "@/components/project-card";
import SectionIndex from "@/components/section-index";
import Reveal from "@/components/reveal";
import { projects, workCopy } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description: workCopy.metaDescription,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · Createch Architects",
    description: workCopy.metaDescription,
    url: "/work",
    type: "website",
  },
};

/**
 * Work index. Two honest groups:
 *   01  Createch Architects — projects delivered under the practice
 *   02  Selected earlier work — Anvi's role named on every card
 * Driven by `underCreatech`. Empty state if the seed has nothing yet;
 * placeholder entries are labelled, never passed off as completed work.
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
  const empty = byOrder.length === 0;
  const countries = new Set(byOrder.map((p) => p.country)).size;

  const title = empty
    ? workCopy.empty.title
    : `${byOrder.length} project${byOrder.length === 1 ? "" : "s"}, ${countries} ${countries === 1 ? "country" : "countries"}.`;

  return (
    <>
      <PageHeader
        eyebrow={workCopy.eyebrow}
        title={title}
        lede={empty ? workCopy.empty.lede : workCopy.lede}
      />

      {empty ? (
        <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <p className="max-w-[54ch] text-[var(--color-ink-60)]">
            {workCopy.empty.lede}
          </p>
        </section>
      ) : (
        <>
          {own.length > 0 && (
            <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
              <SectionIndex
                number={workCopy.own.number}
                label={workCopy.own.label}
              />
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
          )}

          {earlier.length > 0 && (
            <section className="bg-[var(--color-paper-2)]">
              <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
                <SectionIndex
                  number={workCopy.earlier.number}
                  label={workCopy.earlier.label}
                />
                <Reveal>
                  <p className="max-w-[62ch] text-[var(--color-ink-60)]">
                    {workCopy.earlier.lede}
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
                        <p className="caption mt-2 !tracking-[0.12em]">
                          {project.role}
                        </p>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
