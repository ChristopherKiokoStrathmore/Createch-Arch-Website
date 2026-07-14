import Link from "next/link";
import ParallaxImage from "./parallax-image";
import DimensionCaption from "./dimension-caption";
import { SECTOR_LABELS, type Project } from "@/content/seed";

/**
 * Project card (Build prompt §3.2). Image frame (4:3), serif title,
 * dimension caption (location · sector · year). Used in the editorial
 * rows of the Work index at varying column spans.
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
  const cover = project.heroImage ?? project.gallery[0]?.file;
  const items = [
    { label: "Location", value: `${project.location}` },
    { label: "Sector", value: SECTOR_LABELS[project.sector] },
  ];
  if (project.year) items.push({ label: "Year", value: String(project.year) });

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      {cover && (
        <ParallaxImage
          src={`/images/${cover}`}
          alt={project.title}
          aspect="4 / 3"
          parallax={false}
          sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
          priority={priority}
        />
      )}
      <h3 className="h3 mt-5 group-hover:text-[var(--color-gold-deep)]">
        {project.title}
      </h3>
      <DimensionCaption className="mt-3" items={items} />
    </Link>
  );
}
