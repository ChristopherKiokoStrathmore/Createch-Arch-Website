import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * robots.txt. The portfolio is public; /admin is not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
