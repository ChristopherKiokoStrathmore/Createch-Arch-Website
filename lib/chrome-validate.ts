import { DEFAULT_CHROME } from "@/lib/chrome-defaults";
import type {
  ChromeConfig,
  ChromeImage,
  ChromeNavLink,
} from "@/lib/chrome-types";

const HEX = /^#([0-9a-fA-F]{6})$/;
const MAX_SHORT = 200;
const MAX_LINE = 400;
const MAX_LEDE = 800;
const MAX_LIBRARY = 80;
const MAX_GALLERY = 24;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function str(value: unknown, fallback: string, max: number): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/\0/g, "").trim().slice(0, max);
}

function optionalStr(value: unknown, max: number): string {
  return str(value, "", max);
}

/** Django primary keys arrive as integers; the chrome document stores ids as strings. */
function idStr(value: unknown): string {
  if (typeof value === "number" && Number.isSafeInteger(value)) return String(value);
  return optionalStr(value, 120);
}

function hexColour(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return HEX.test(trimmed) ? trimmed.toLowerCase() : fallback;
}

function intOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const n = Number(value);
    return n > 0 ? n : null;
  }
  return null;
}

function intOrZero(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  if (typeof value === "string" && /^-?\d+$/.test(value)) {
    return Math.max(0, Number(value));
  }
  return 0;
}

/** http(s) only — never data: URIs (those would smuggle image bytes into JSON). */
export function httpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > 2000) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function safeHref(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, 200);
  if (!trimmed) return fallback;
  if (trimmed.startsWith("#") && !trimmed.startsWith("#/")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed.includes("://") || trimmed.toLowerCase().startsWith("/\\")) {
      return fallback;
    }
    return trimmed;
  }
  return fallback;
}

function navLinks(value: unknown): ChromeNavLink[] {
  const fallback = DEFAULT_CHROME.nav.links;
  if (!Array.isArray(value) || value.length === 0) return fallback.map((l) => ({ ...l }));
  const links: ChromeNavLink[] = [];
  for (const item of value.slice(0, 8)) {
    const rec = asRecord(item);
    if (!rec) continue;
    const href = safeHref(rec.href, "");
    const label = optionalStr(rec.label, 40);
    if (!href || !label) continue;
    links.push({ href, label });
  }
  return links.length > 0 ? links : fallback.map((l) => ({ ...l }));
}

export function parseImageRecord(raw: unknown, order = 0): ChromeImage | null {
  const rec = asRecord(raw);
  if (!rec) return null;
  const nested = asRecord(rec.image) ?? asRecord(rec.file);
  const src = nested ?? rec;
  const id = idStr(src.id ?? src.pk ?? src.uuid ?? rec.id);
  const url = httpUrl(src.url ?? src.src ?? src.public_url ?? src.image_url);
  if (!id || !url) return null;
  return {
    id,
    url,
    alt: optionalStr(src.alt ?? src.alt_text ?? rec.alt, MAX_LINE),
    filename: optionalStr(
      src.filename ?? src.name ?? src.original_name ?? rec.filename,
      MAX_SHORT,
    ),
    width: intOrNull(src.width),
    height: intOrNull(src.height),
    order: intOrZero(src.order ?? rec.order ?? order),
  };
}

export function parseImageList(raw: unknown): ChromeImage[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item, i) => parseImageRecord(item, i))
      .filter((item): item is ChromeImage => Boolean(item))
      .slice(0, MAX_LIBRARY);
  }
  const rec = asRecord(raw);
  if (!rec) return [];
  const list = rec.images ?? rec.results ?? rec.data ?? rec.files;
  return parseImageList(list);
}

function library(value: unknown): ChromeImage[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: ChromeImage[] = [];
  for (const [i, item] of value.entries()) {
    if (items.length >= MAX_LIBRARY) break;
    const parsed = parseImageRecord(item, i);
    if (!parsed || seen.has(parsed.id)) continue;
    seen.add(parsed.id);
    items.push({ ...parsed, order: i });
  }
  return items;
}

function gallerySlots(value: unknown, ids: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (out.length >= MAX_GALLERY) break;
    const id = optionalStr(item, 120);
    if (!id || !ids.has(id) || out.includes(id)) continue;
    out.push(id);
  }
  return out;
}

function deepMerge(
  base: Record<string, unknown>,
  over: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(over)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    const b = base[key];
    const o = over[key];
    if (
      o &&
      typeof o === "object" &&
      !Array.isArray(o) &&
      b &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      result[key] = deepMerge(
        b as Record<string, unknown>,
        o as Record<string, unknown>,
      );
    } else if (o !== undefined) {
      result[key] = o;
    }
  }
  return result;
}

/**
 * Merge a stored (possibly partial) document onto defaults and scrub anything
 * that must not reach CSS, href, or <img src>.
 */
export function normalizeChrome(raw: unknown): ChromeConfig {
  const rec = asRecord(raw);
  const merged = rec
    ? (deepMerge(
        DEFAULT_CHROME as unknown as Record<string, unknown>,
        rec,
      ) as unknown as ChromeConfig)
    : structuredClone(DEFAULT_CHROME);

  const d = DEFAULT_CHROME;
  const images = library(
    asRecord(merged.images)?.library ?? asRecord(rec?.images)?.library,
  );
  const ids = new Set(images.map((img) => img.id));

  const slotsRec = asRecord(asRecord(merged.images)?.slots);
  let heroId = optionalStr(slotsRec?.hero ?? merged.hero?.imageId, 120) || null;
  if (heroId && !ids.has(heroId)) heroId = null;
  const gallery = gallerySlots(slotsRec?.gallery, ids);

  const heroImage = heroId ? images.find((img) => img.id === heroId) : undefined;

  const chrome: ChromeConfig = {
    version: 1,
    colours: {
      paper: hexColour(merged.colours?.paper, d.colours.paper),
      paper2: hexColour(merged.colours?.paper2, d.colours.paper2),
      ink: hexColour(merged.colours?.ink, d.colours.ink),
      gold: hexColour(merged.colours?.gold, d.colours.gold),
      goldDeep: hexColour(merged.colours?.goldDeep, d.colours.goldDeep),
    },
    nav: { links: navLinks(merged.nav?.links) },
    hero: {
      kicker: str(merged.hero?.kicker, d.hero.kicker, MAX_SHORT),
      title: str(merged.hero?.title, d.hero.title, MAX_LINE),
      strap: str(merged.hero?.strap, d.hero.strap, MAX_LINE),
      lede: str(merged.hero?.lede, d.hero.lede, MAX_LEDE),
      cta: str(merged.hero?.cta, d.hero.cta, 80),
      ctaHref: safeHref(merged.hero?.ctaHref, d.hero.ctaHref),
      imageId: heroId,
      imageUrl: heroImage?.url ?? null,
      imageAlt: str(
        merged.hero?.imageAlt || heroImage?.alt,
        d.hero.imageAlt,
        MAX_LINE,
      ),
    },
    contact: {
      email: str(merged.contact?.email, d.contact.email, MAX_SHORT),
      phone: str(merged.contact?.phone, d.contact.phone, 40),
      whatsapp: str(merged.contact?.whatsapp, d.contact.whatsapp, 24).replace(
        /\D/g,
        "",
      ),
      location: str(merged.contact?.location, d.contact.location, MAX_SHORT),
      headline: str(merged.contact?.headline, d.contact.headline, MAX_LINE),
      label: str(merged.contact?.label, d.contact.label, 40),
    },
    seo: {
      title: optionalStr(merged.seo?.title, 70) || d.seo.title,
      description: optionalStr(merged.seo?.description, 180) || d.seo.description,
      ogAlt: optionalStr(merged.seo?.ogAlt, MAX_LINE) || d.seo.ogAlt,
    },
    images: {
      library: images.map((img, i) => ({ ...img, order: i })),
      slots: { hero: heroId, gallery },
    },
    updatedAt:
      typeof merged.updatedAt === "string" && merged.updatedAt.length < 40
        ? merged.updatedAt
        : null,
  };

  return chrome;
}

export function unwrapChromePayload(raw: unknown): unknown {
  const rec = asRecord(raw);
  if (!rec) return raw;
  if (asRecord(rec.chrome)) return rec.chrome;
  if (asRecord(rec.data) && !Array.isArray(rec.data)) return rec.data;
  return rec;
}
