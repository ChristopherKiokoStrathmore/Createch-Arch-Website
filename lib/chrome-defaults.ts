import {
  footerCopy,
  heroCopy,
  homeCopy,
  metadataCopy,
  nav,
  site,
} from "@/content/copy";
import { heroAlt } from "@/content/hero";
import type { ChromeConfig } from "@/lib/chrome-types";

/**
 * Defaults match the live site copy in `content/copy.ts` and the tokens in
 * `app/globals.css`. An empty admin store must not blank the public site.
 */
export const DEFAULT_CHROME: ChromeConfig = {
  version: 1,
  colours: {
    paper: "#faf7f2",
    paper2: "#f1ebe2",
    ink: "#111110",
    gold: "#f5bf4f",
    goldDeep: "#8f6a10",
  },
  nav: {
    links: nav.map((l) => ({ href: l.href, label: l.label })),
  },
  hero: {
    kicker: heroCopy.kicker,
    title: heroCopy.title,
    strap: heroCopy.strap,
    lede: heroCopy.lede,
    cta: heroCopy.cta,
    ctaHref: heroCopy.ctaHref,
    imageId: null,
    imageUrl: null,
    imageAlt: heroAlt,
  },
  contact: {
    email: site.email,
    phone: site.phone,
    whatsapp: site.whatsapp,
    location: site.location,
    headline: homeCopy.contact.headline,
    label: homeCopy.contact.label,
  },
  seo: {
    title: metadataCopy.title,
    description: metadataCopy.description,
    ogAlt: metadataCopy.ogAlt,
  },
  images: {
    library: [],
    slots: { hero: null, gallery: [] },
  },
  updatedAt: null,
};

export const DEFAULT_FOOTER_LABELS = {
  work: footerCopy.work,
  studio: footerCopy.studio,
  start: footerCopy.start,
} as const;
