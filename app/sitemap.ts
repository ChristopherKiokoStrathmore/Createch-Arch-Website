import type { MetadataRoute } from "next";
import { projects } from "@/content/seed";
import { SITE_URL as BASE } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * Sitemap, served at /sitemap.xml.
 *
 * No trailing slashes: Vercel serves /work as the canonical address and would
 * redirect /work/ to it, so a sitemap advertising the slashed form would point
 * search engines at a redirect on every entry.
 *
 * Priorities encode how the practice actually wants to be found: the case
 * studies are the product, so they outrank everything except the homepage.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/studio`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const caseStudies: MetadataRoute.Sitemap = [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      changeFrequency: "yearly" as const,
      // the practice's own work ranks above coordinated prior-practice credits
      priority: p.underCreatech ? 0.9 : 0.8,
    }));

  return [...pages, ...caseStudies].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}
