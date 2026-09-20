import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import "server-only";
import { env } from "@/lib/env";
import { DEFAULT_CHROME } from "@/lib/chrome-defaults";
import {
  CHROME_BLOB_PATHNAME,
  CHROME_CACHE_TAG,
  LOCAL_CHROME_FILE,
  type ChromeConfig,
  type ChromePersistence,
} from "@/lib/chrome-types";
import { normalizeChrome } from "@/lib/chrome-validate";
import {
  railwayConfigured,
  railwayGetChrome,
  railwayPutChrome,
} from "@/lib/railway";

function blobConfigured(): boolean {
  return Boolean(
    env(process.env.BLOB_READ_WRITE_TOKEN) || env(process.env.BLOB_STORE_ID),
  );
}

export function chromePersistence(): ChromePersistence {
  if (blobConfigured()) {
    return { kind: "blob", durable: true, warning: null };
  }
  if (railwayConfigured()) {
    return {
      kind: "railway",
      durable: true,
      warning: null,
    };
  }
  const onVercel = Boolean(env(process.env.VERCEL));
  return {
    kind: "local",
    durable: !onVercel,
    warning: onVercel
      ? "No Vercel Blob token and no Railway chrome API — this save will not survive the next deploy. Set BLOB_READ_WRITE_TOKEN (or connect a Blob store) or CREATECH_API_URL + ARCH_ADMIN_SECRET."
      : `Saving to ${LOCAL_CHROME_FILE} on this machine. Connect Blob or Railway before production.`,
  };
}

function localPath(): string {
  return path.join(process.cwd(), "data", "chrome.json");
}

async function readLocal(): Promise<unknown | null> {
  try {
    const raw = await readFile(localPath(), "utf8");
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function writeLocal(chrome: ChromeConfig): Promise<void> {
  const file = localPath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(chrome, null, 2), "utf8");
}

async function readBlob(fresh: boolean): Promise<unknown | null> {
  if (!blobConfigured()) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({
      prefix: CHROME_BLOB_PATHNAME,
      limit: 20,
    });
    const hit =
      blobs.find((b) => b.pathname === CHROME_BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    const res = await fetch(hit.url, {
      ...(fresh
        ? { cache: "no-store" as const }
        : { next: { tags: [CHROME_CACHE_TAG], revalidate: 60 } }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch (err) {
    console.error("[createch] blob chrome read failed", err);
    return null;
  }
}

async function writeBlob(chrome: ChromeConfig): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(CHROME_BLOB_PATHNAME, JSON.stringify(chrome, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
}

/**
 * Load chrome JSON from the first store that has it.
 * Bytes of photographs are never read from here — only layout + image IDs/URLs.
 */
export async function loadStoredChrome(fresh = false): Promise<ChromeConfig> {
  const blob = await readBlob(fresh);
  if (blob) return normalizeChrome(blob);

  const railway = await railwayGetChrome(fresh);
  if (railway) return normalizeChrome(railway);

  const local = await readLocal();
  if (local) return normalizeChrome(local);

  return structuredClone(DEFAULT_CHROME);
}

export async function saveChrome(input: unknown): Promise<{
  chrome: ChromeConfig;
  persistence: ChromePersistence;
}> {
  const chrome = normalizeChrome(input);
  chrome.updatedAt = new Date().toISOString();
  const persistence = chromePersistence();

  if (persistence.kind === "blob") {
    await writeBlob(chrome);
    return { chrome, persistence };
  }
  if (persistence.kind === "railway") {
    await railwayPutChrome(chrome);
    return { chrome, persistence };
  }

  try {
    await writeLocal(chrome);
  } catch (err) {
    console.error("[createch] local chrome write failed", err);
    throw new Error(
      "Could not persist chrome. Configure @vercel/blob (BLOB_READ_WRITE_TOKEN) or Railway (CREATECH_API_URL + ARCH_ADMIN_SECRET). /tmp is not used.",
    );
  }
  return { chrome, persistence };
}
