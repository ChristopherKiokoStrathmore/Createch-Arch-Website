import Link from "next/link";
import ParallaxImage from "./parallax-image";
import DimensionCaption from "./dimension-caption";
import Reveal from "./reveal";
import { SECTOR_LABELS, type Project } from "@/content/seed";

/**
 * Featured work (Build prompt §3.1, S2 + law #4): a large 8-col image with
 * two supporting 4-col images offset below, dimension caption, two-line
 * summary, and a link to the case study. Accepts an ARRAY so a second
 * featured project drops in with no layout change.
 */
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-24 md:gap-36">
      {projects.map((project, i) => {
        const hero = project.heroImage ?? project.gallery[0]?.file;
        const support = project.gallery
          .filter((g) => g.file !== hero)
          .slice(0, 2);
        return (
          <article key={project.slug} className="grid grid-cols-12 gap-x-6 gap-y-8">
            {/* large image — 8 cols */}
            <Reveal className="col-span-12 md:col-span-8" as="figure">
              {hero && (
                <ParallaxImage
                  src={`/images/${hero}`}
                  alt={project.title}
                  aspect="16 / 10"
                  priority={i === 0}
                  sizes="(min-width: 768px) 66vw, 100vw"
                />
              )}
            </Reveal>

            {/* text column — 4 cols, aligned to the large image */}
            <Reveal
              className="col-span-12 flex flex-col justify-end md:col-span-4"
              index={1}
            >
              <DimensionCaption
                items={[
                  { label: "Location", value: `${project.location}, ${project.country}` },
                  { label: "Sector", value: SECTOR_LABELS[project.sector] },
                  { label: "Role", value: project.role },
                ]}
              />
              <h3 className="h3 mt-5 font-serif text-[1.75rem]">{project.title}</h3>
              <p className="mt-3 text-[var(--color-ink-60)]">{project.brief}</p>
              <Link
                href={`/work/${project.slug}`}
                className="group mt-6 inline-block w-fit text-[0.95rem] font-medium"
              >
                Read the case study
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>

            {/* two supporting images — offset below, 4 cols each */}
            {support.map((img, j) => (
              <Reveal
                key={img.file}
                as="figure"
                index={j + 1}
                className={
                  j === 0
                    ? "col-span-6 md:col-span-4 md:col-start-5 md:-mt-16"
                    : "col-span-6 md:col-span-4"
                }
              >
                <ParallaxImage
                  src={`/images/${img.file}`}
                  alt={img.alt}
                  aspect="4 / 3"
                  parallax={false}
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
              </Reveal>
            ))}
          </article>
        );
      })}
    </div>
  );
}
