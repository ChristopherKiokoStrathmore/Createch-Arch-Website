/**
 * Project helpers. Keep image paths and the CMS-ready shape in one place so
 * a future headless source can swap `content/seed.ts` without touching cards.
 *
 * Files live at `public/images/{slug}/{file}.jpg` (committed originals) with
 * responsive WebP variants generated at build. That folder is the convention;
 * `public/projects/` is reserved if a CMS later wants a separate tree.
 */
import {
  TYPOLOGY_LABELS,
  type Project,
} from "@/content/seed";

export const IMAGE_ROOT = "/images";

export function projectCoverFile(project: Project): string | undefined {
  return project.cover ?? project.gallery[0]?.file;
}

export function projectImageSrc(file: string): string {
  return `${IMAGE_ROOT}/${file}`;
}

export function projectCoverSrc(project: Project): string | undefined {
  const file = projectCoverFile(project);
  return file ? projectImageSrc(file) : undefined;
}

export function projectTypologyLabel(project: Project): string {
  return TYPOLOGY_LABELS[project.typology];
}

/** Short description for listings — the brief is that line. */
export function projectDescription(project: Project): string {
  return project.description ?? project.brief;
}

export function isPlaceholderProject(project: Project): boolean {
  return Boolean(project.placeholder);
}

export function locationLine(project: Project): string {
  return `${project.location}, ${project.country}`;
}
