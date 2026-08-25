import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CinematicImage from "@/components/cinematic-image";
import Gallery from "@/components/gallery";
import SpecBlock from "@/components/spec-block";
import SectionIndex from "@/components/section-index";
import { ProjectJsonLd } from "@/components/json-ld";
import Reveal from "@/components/reveal";
import dims from "@/content/image-dimensions.json";
import { SECTOR_LABELS, projects, projectBySlug } from "@/content/seed";

const DIMS = dims as Record<string, number[]>;

/** Every project is known at build time; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const cover = project.heroImage ?? project.gallery[0]?.file;
  const wh = cover ? DIMS[cover] : undefined;

  return {
    title: project.title,
    description: project.seoDescription,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} · Createch Architects`,
      description: project.seoDescription,
      url: `/work/${project.slug}`,
      type: "article",
      images: cover
        ? [
            {
              url: `/images/${cover}`,
              width: wh?.[0],
              height: wh?.[1],
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}

/**
 * Case study (Build prompt §3.3). The narrative runs brief → constraint →
 * move → outcome, which is the shape of an architectural argument: what was
 * asked, what made it hard, what was done about it, what it became. Optional
 * fields simply drop out, so the thinner legacy entries degrade to a brief
 * and a gallery rather than rendering empty headings.
 */
const NARRATIVE = [
  { key: "constraint", label: "The constraint" },
  { key: "move", label: "The move" },
  { key: "outcome", label: "The outcome" },
] as const;

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const cover = project.heroImage ?? project.gallery[0]?.file;
  // the cover already leads the page — don't show it twice in the plates
  const plates = project.gallery.filter((g) => g.file !== cover);

  const byOrder = [...projects].sort((a, b) => a.order - b.order);
  const idx = byOrder.findIndex((p) => p.slug === project.slug);
  const next = byOrder[(idx + 1) % byOrder.length];

  return (
    <article>
      <ProjectJsonLd project={project} />

      {/* title block */}
      <header className="gutter mx-auto max-w-[90rem] pt-32 md:pt-44">
        <Link
          href="/work"
          className="group caption !tracking-[0.12em] inline-block text-[var(--color-ink)]"
        >
          <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Work
        </Link>
        <p className="kicker mt-8 mb-4">
          {SECTOR_LABELS[project.sector]} · {project.location}, {project.country}
        </p>
        <h1 className="h-display max-w-[20ch]">{project.title}</h1>
      </header>

      {/* cover */}
      {cover && (
        <div className="gutter mx-auto mt-12 max-w-[90rem] md:mt-16">
          <CinematicImage
            src={`/images/${cover}`}
            alt={project.title}
            aspect="16 / 9"
            priority
            eager
            sizes="(min-width: 1440px) 1312px, 100vw"
          />
        </div>
      )}

      {/* specification */}
      <section className="gutter mx-auto max-w-[90rem] py-16 md:py-24">
        <Reveal>
          <SpecBlock project={project} />
        </Reveal>
      </section>

      {/* narrative */}
      <section className="bg-[var(--color-paper-2)]">
        <div className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number="01" label="The project" />

          <Reveal>
            <p className="h2 max-w-[26ch] font-serif">{project.brief}</p>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {NARRATIVE.map(({ key, label }, i) => {
              const body = project[key];
              if (!body) return null;
              return (
                <Reveal key={key} index={i}>
                  <h2 className="caption !tracking-[0.14em] text-[var(--color-gold-deep)]">
                    {label}
                  </h2>
                  <p className="mt-3 text-[var(--color-ink-60)]">{body}</p>
                </Reveal>
              );
            })}
          </div>

          {project.accolade && (
            <Reveal index={1}>
              <p className="mt-16 max-w-[46ch] border-l-2 border-[var(--color-gold)] pl-5 font-serif text-[1.25rem] leading-[1.4] md:text-[1.5rem]">
                {project.accolade}
              </p>
            </Reveal>
          )}

          {!project.underCreatech && (
            <Reveal index={2}>
              <p className="caption mt-14 max-w-[62ch] !normal-case !tracking-normal">
                Delivered by Anvi Shah as {project.role} with a previous
                practice, before founding Createch Architects.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* plates */}
      {plates.length > 0 && (
        <section className="gutter mx-auto max-w-[90rem] py-20 md:py-28">
          <SectionIndex number="02" label="Images" />
          <Gallery images={plates} />
        </section>
      )}

      {/* next */}
      <section className="gutter mx-auto max-w-[90rem] border-t border-[var(--color-line)] py-16 md:py-20">
        <p className="caption">Next project</p>
        <Link href={`/work/${next.slug}`} className="group mt-3 inline-block">
          <span className="h2 font-serif transition-colors group-hover:text-[var(--color-gold-deep)]">
            {next.title}
          </span>
          <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>
    </article>
  );
}
