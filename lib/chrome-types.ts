/**
 * Site chrome — layout, copy overlays, and image *references*.
 *
 * Image BYTES never live here, in /tmp, or on Vercel Blob. Uploads go to
 * Railway (`CREATECH_API_URL`); this document only stores the IDs/URLs
 * Railway returned, plus slot assignments.
 */

export type ChromeNavLink = {
  href: string;
  label: string;
};

export type ChromeColours = {
  paper: string;
  paper2: string;
  ink: string;
  gold: string;
  goldDeep: string;
};

export type ChromeHero = {
  kicker: string;
  title: string;
  strap: string;
  lede: string;
  cta: string;
  ctaHref: string;
  /** Railway image id assigned to the hero slot; null = use the built-in frame. */
  imageId: string | null;
  /** Absolute URL from Railway. Never a data: URI or local filesystem path. */
  imageUrl: string | null;
  imageAlt: string;
};

export type ChromeContact = {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  headline: string;
  label: string;
};

/**
 * Optional SEO placeholders for the chrome band. Real SEO will later come
 * from WordPress (Layer 3) — keep these minimal and skip them when blank.
 */
export type ChromeSeo = {
  title: string;
  description: string;
  ogAlt: string;
};

export type ChromeImage = {
  id: string;
  url: string;
  alt: string;
  filename: string;
  width: number | null;
  height: number | null;
  order: number;
};

export type ChromeSlots = {
  hero: string | null;
  /** Ordered Railway image ids for homepage gallery positions. */
  gallery: string[];
};

export type ChromeConfig = {
  version: 1;
  colours: ChromeColours;
  nav: { links: ChromeNavLink[] };
  hero: ChromeHero;
  contact: ChromeContact;
  seo: ChromeSeo;
  images: {
    library: ChromeImage[];
    slots: ChromeSlots;
  };
  updatedAt: string | null;
};

export type ChromePersistenceKind = "blob" | "railway" | "local" | "defaults";

export type ChromePersistence = {
  kind: ChromePersistenceKind;
  durable: boolean;
  warning: string | null;
};

export const CHROME_CACHE_TAG = "chrome";
export const CHROME_BLOB_PATHNAME = "createch/chrome.json";
export const LOCAL_CHROME_FILE = "data/chrome.json";
// Routes on the Django backend (Createch-Arch-Backend, arch_media/urls.py).
// Both are admin routes: they require X-Admin-Key.
export const RAILWAY_CHROME_PATH = "/api/admin/chrome/";
export const RAILWAY_IMAGES_PATH = "/api/admin/media/";
export const RAILWAY_PIN_PATH = "/api/admin/pin/";
