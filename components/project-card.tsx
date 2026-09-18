import Link from "next/link";
import ParallaxImage from "./parallax-image";
import DimensionCaption from "./dimension-caption";
import { workCopy, type Project } from "@/content";
import {
  isPlaceholderProject,
  projectCoverSrc,
  projectTypologyLabel,
} from "@/lib/project";

/**
 * Project card. Image frame, serif title, location · typology · year.
 * Placeholder entries are labelled so they cannot be read as delivered work.
 */
export default function ProjectCard({
  project,
  sizes,
  priority = false,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
}) {
  const cover = projectCoverSrc(project);
  const items = [
    { label: "Location", value: project.location },
    { label: "Typology", value: projectTypologyLabel(project) },
  ];
  if (project.year) items.push({ label: "Year", value: String(project.year) });
  const demo = isPlaceholderProject(project);

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      {cover && (
        <ParallaxImage
          src={cover}
          alt={project.title}
          aspect="4 / 3"
          parallax={false}
          sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
          priority={priority}
        />
      )}
      {demo && (
        <p className="caption mt-4 !tracking-[0.14em] text-[var(--color-gold-deep)]">
          {workCopy.placeholderLabel}
        </p>
      )}
      <h3 className={`h3 group-hover:text-[var(--color-gold-deep)] ${demo ? "mt-2" : "mt-5"}`}>
        {project.title}
      </h3>
      <DimensionCaption className="mt-3" items={items} />
    </Link>
  );
}
