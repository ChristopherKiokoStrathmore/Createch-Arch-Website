import Link from "next/link";
import CinematicImage from "./cinematic-image";
import DimensionCaption from "./dimension-caption";
import Reveal from "./reveal";
import { workCopy, type Project } from "@/content";
import {
  isPlaceholderProject,
  locationLine,
  projectCoverSrc,
  projectDescription,
  projectImageSrc,
  projectTypologyLabel,
} from "@/lib/project";

/**
 * Featured work: large cinematic frame, two supporting plates, brief.
 * Empty/placeholder-aware so a missing cover never invents a building.
 */
export default function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="max-w-[54ch] text-[var(--color-ink-60)]">
        {workCopy.empty.lede}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-28 md:gap-44">
      {projects.map((project, i) => {
        const hero = projectCoverSrc(project);
        const coverFile = project.cover ?? project.gallery[0]?.file;
        const support = project.gallery
          .filter((g) => g.file !== coverFile)
          .slice(0, 2);
        const demo = isPlaceholderProject(project);
        return (
          <article key={project.slug} className="grid grid-cols-12 gap-x-6 gap-y-8">
            <Reveal className="col-span-12 md:col-span-8" as="figure">
              {hero && (
                <CinematicImage
                  src={hero}
                  alt={project.title}
                  aspect="16 / 10"
                  priority={i === 0}
                  sizes="(min-width: 768px) 66vw, 100vw"
                />
              )}
            </Reveal>

            <div className="col-span-12 flex flex-col justify-end md:col-span-4">
              <Reveal>
                {demo && (
                  <p className="caption mb-3 !tracking-[0.14em] text-[var(--color-gold-deep)]">
                    {workCopy.placeholderLabel}
                  </p>
                )}
                <DimensionCaption
                  items={[
                    { label: "Location", value: locationLine(project) },
                    { label: "Typology", value: projectTypologyLabel(project) },
                    { label: "Role", value: project.role },
                  ]}
                />
              </Reveal>
              <Reveal index={1}>
                <h3 className="mt-5 font-serif text-[2rem] leading-[1.08] md:text-[2.25rem]">
                  {project.title}
                </h3>
                <p className="mt-4 text-[var(--color-ink-60)]">
                  {projectDescription(project)}
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="group mt-7 inline-block w-fit text-[0.95rem] font-medium"
                >
                  Read the case study
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>

            {support.map((img, j) => (
              <Reveal
                key={img.file}
                as="figure"
                index={j}
                className={
                  j === 0
                    ? "col-span-6 md:col-span-4 md:col-start-5 md:-mt-20"
                    : "col-span-6 md:col-span-3"
                }
              >
                <CinematicImage
                  src={projectImageSrc(img.file)}
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
