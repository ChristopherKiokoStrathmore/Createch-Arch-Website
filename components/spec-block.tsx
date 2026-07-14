import { SECTOR_LABELS, type Project } from "@/content/seed";

/**
 * Spec block (Build prompt §3.3): dimension captions in a 2×3 grid —
 * Location, Area, Role, Team, Sector, Status/Year. Omitted fields
 * simply don't render a cell.
 */
export default function SpecBlock({ project }: { project: Project }) {
  const cells: { label: string; value: string }[] = [
    { label: "Location", value: `${project.location}, ${project.country}` },
  ];
  if (project.areaSqm)
    cells.push({ label: "Area", value: `${project.areaSqm.toLocaleString()} m²` });
  cells.push({ label: "Role", value: project.role });
  if (project.teamSize)
    cells.push({ label: "Team", value: `Team of ${project.teamSize}` });
  cells.push({ label: "Sector", value: SECTOR_LABELS[project.sector] });
  if (project.year)
    cells.push({ label: "Year", value: String(project.year) });

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3">
      {cells.map((c) => (
        <div key={c.label} className="border-l border-[var(--color-gold)] pl-3">
          <dt className="caption text-[var(--color-gold-deep)]">{c.label}</dt>
          <dd className="mt-1 text-[0.95rem] text-[var(--color-ink)]">
            {c.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
