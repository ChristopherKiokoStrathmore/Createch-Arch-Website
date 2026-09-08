import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * robots.txt. Everything is public — this is a portfolio, being indexed is the
 * point.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
