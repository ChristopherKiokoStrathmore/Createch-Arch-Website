import { env } from "@/lib/env";
import "server-only";
import {
  RAILWAY_CHROME_PATH,
  RAILWAY_IMAGES_PATH,
} from "@/lib/chrome-types";
import {
  httpUrl,
  parseImageList,
  parseImageRecord,
  unwrapChromePayload,
} from "@/lib/chrome-validate";
import type { ChromeImage } from "@/lib/chrome-types";

const FETCH_MS = 15_000;

export function railwayConfigured(): boolean {
  return Boolean(env(process.env.CREATECH_API_URL) && env(process.env.ARCH_ADMIN_SECRET));
}

export function railwayBaseUrl(): string | undefined {
  const raw = env(process.env.CREATECH_API_URL);
  if (!raw) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function adminKey(): string | undefined {
  return env(process.env.ARCH_ADMIN_SECRET);
}

function join(path: string): string | undefined {
  const base = railwayBaseUrl();
  if (!base) return undefined;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function railwayFetch(
  path: string,
  init: RequestInit & { fresh?: boolean; tagged?: boolean } = {},
): Promise<Response> {
  const url = join(path);
  const key = adminKey();
  if (!url || !key) {
    throw new Error("Railway image API is not configured");
  }
  const { fresh, tagged, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("X-Admin-Key", key);
  const next: { tags?: string[]; revalidate?: number } | undefined = tagged
    ? { tags: ["chrome"], revalidate: 60 }
    : undefined;
  return fetch(url, {
    ...rest,
    headers,
    cache: fresh ? "no-store" : rest.cache,
    signal: rest.signal ?? AbortSignal.timeout(FETCH_MS),
    ...(next ? { next } : {}),
  });
}

export async function railwayGetChrome(
  fresh = false,
): Promise<unknown | null> {
  if (!railwayConfigured()) return null;
  try {
    const res = await railwayFetch(RAILWAY_CHROME_PATH, {
      method: "GET",
      fresh,
      tagged: !fresh,
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("[createch] railway chrome GET", res.status);
      return null;
    }
    const text = await res.text();
    if (!text) return null;
    try {
      return unwrapChromePayload(JSON.parse(text));
    } catch {
      return null;
    }
  } catch (err) {
    console.error("[createch] railway chrome GET failed", err);
    return null;
  }
}

export async function railwayPutChrome(chrome: unknown): Promise<boolean> {
  if (!railwayConfigured()) return false;
  const res = await railwayFetch(RAILWAY_CHROME_PATH, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chrome),
    fresh: true,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Railway chrome save failed (${res.status})${text ? `: ${text.slice(0, 180)}` : ""}`,
    );
  }
  return true;
}

export async function railwayListImages(fresh = true): Promise<ChromeImage[]> {
  if (!railwayConfigured()) return [];
  try {
    const res = await railwayFetch(RAILWAY_IMAGES_PATH, {
      method: "GET",
      fresh,
    });
    if (!res.ok) return [];
    const json: unknown = await res.json().catch(() => null);
    return parseImageList(json);
  } catch (err) {
    console.error("[createch] railway images GET failed", err);
    return [];
  }
}

export async function railwayUploadImage(file: File): Promise<ChromeImage> {
  if (!railwayConfigured()) {
    throw new Error("CREATECH_API_URL and ARCH_ADMIN_SECRET are required to upload images");
  }
  const body = new FormData();
  body.append("file", file, file.name);
  const res = await railwayFetch(RAILWAY_IMAGES_PATH, {
    method: "POST",
    body,
    fresh: true,
  });
  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }
  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "error" in json
        ? String((json as { error: unknown }).error)
        : text) || `Upload failed (${res.status})`;
    throw new Error(msg.slice(0, 300));
  }
  const parsed = parseImageRecord(json) ?? parseImageRecord(
    json && typeof json === "object" ? (json as { image?: unknown }).image : null,
  );
  if (!parsed || !httpUrl(parsed.url)) {
    throw new Error("Railway upload did not return an image id and http(s) URL");
  }
  return parsed;
}

export async function railwayDeleteImage(id: string): Promise<void> {
  if (!railwayConfigured()) return;
  const encoded = encodeURIComponent(id);
  const paths = [
    `${RAILWAY_IMAGES_PATH}${encoded}/`,
    `${RAILWAY_IMAGES_PATH}${encoded}`,
  ];
  for (const path of paths) {
    try {
      const res = await railwayFetch(path, { method: "DELETE", fresh: true });
      if (res.ok || res.status === 404) return;
    } catch {
      /* try the next form */
    }
  }
}
