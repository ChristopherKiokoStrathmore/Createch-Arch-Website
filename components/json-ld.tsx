import { SECTOR_LABELS, siteSettings, type Project } from "@/content/seed";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://createch.co.ke";

/**
 * Structured data (Build prompt §5, Phase 5).
 *
 * Two jobs. `OrganizationJsonLd` sits in the root layout and tells search
 * engines the practice is a real business in Nairobi — for a local studio that
 * is what surfaces it in "architect in Nairobi" searches at all. `ProjectJsonLd`
 * marks each case study as a CreativeWork so the project pages can appear as
 * work rather than as loose prose.
 *
 * Attribution integrity (§0) carries into the markup: `creator` is only the
 * practice for projects delivered under it. On earlier work the practice is
 * `contributor` and Anvi is the named creator, which is the truthful claim.
 */
function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "Createch Architects",
  url: BASE,
  email: siteSettings.email,
  telephone: siteSettings.phone,
  description:
    "Nairobi-based architecture and interior design practice for hospitality, food and beverage, lifestyle spaces and high-end residential projects.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  founder: {
    "@type": "Person",
    name: "Anvi Shah",
    jobTitle: "Founder & Principal Architect",
  },
  areaServed: ["Kenya", "Tanzania", "Nigeria", "India"],
  knowsAbout: [
    "Hospitality architecture",
    "Interior design",
    "Restaurant and bar design",
    "Hotel and lodge design",
  ],
};

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          ORGANIZATION,
          {
            "@type": "ProfessionalService",
            "@id": `${BASE}/#practice`,
            name: "Createch Architects",
            url: BASE,
            parentOrganization: { "@id": `${BASE}/#organization` },
            email: siteSettings.email,
            telephone: siteSettings.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
            areaServed: ["Kenya", "Tanzania", "Nigeria", "India"],
          },
          {
            "@type": "WebSite",
            "@id": `${BASE}/#website`,
            url: BASE,
            name: "Createch Architects",
            publisher: { "@id": `${BASE}/#organization` },
            inLanguage: "en",
          },
        ],
      }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  const cover = project.heroImage ?? project.gallery[0]?.file;
  const anvi = { "@type": "Person" as const, name: "Anvi Shah" };

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${BASE}/work/${project.slug}/#project`,
        name: project.title,
        url: `${BASE}/work/${project.slug}`,
        description: project.seoDescription,
        abstract: project.brief,
        genre: SECTOR_LABELS[project.sector],
        image: cover ? `${BASE}/images/${cover}` : undefined,
        locationCreated: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: project.location,
            addressCountry: project.country,
          },
        },
        // only claim authorship of the practice's own work
        creator: project.underCreatech ? { "@id": `${BASE}/#organization` } : anvi,
        contributor: project.underCreatech ? anvi : { "@id": `${BASE}/#organization` },
        creditText: project.underCreatech
          ? `Createch Architects — ${project.role}`
          : `Anvi Shah — ${project.role}, with a previous practice`,
        isPartOf: { "@id": `${BASE}/#website` },
      }}
    />
  );
}
