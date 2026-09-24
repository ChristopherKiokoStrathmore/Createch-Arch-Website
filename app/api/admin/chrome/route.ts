import { NextResponse } from "next/server";
import { adminConfigured, isAdminAuthorized } from "@/lib/admin-auth";
import { chromePersistence, loadStoredChrome, saveChrome } from "@/lib/chrome-store";
import { railwayConfigured, railwayListImages } from "@/lib/railway";
import { revalidateChrome } from "@/lib/revalidate-chrome";
import type { ChromeImage } from "@/lib/chrome-types";

export const dynamic = "force-dynamic";

function mergeLibrary(
  library: ChromeImage[],
  remote: ChromeImage[],
): ChromeImage[] {
  const byId = new Map(library.map((img) => [img.id, img]));
  const out = [...library];
  for (const img of remote) {
    const existing = byId.get(img.id);
    if (!existing) {
      byId.set(img.id, img);
      out.push({ ...img, order: out.length });
    } else if (img.url && img.url !== existing.url) {
      existing.url = img.url;
      if (img.alt && !existing.alt) existing.alt = img.alt;
      if (img.width && !existing.width) existing.width = img.width;
      if (img.height && !existing.height) existing.height = img.height;
    }
  }
  return out.map((img, i) => ({ ...img, order: i }));
}

export async function GET(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chrome = await loadStoredChrome(true);
  try {
    const remote = await railwayListImages(true);
    if (remote.length > 0) {
      chrome.images.library = mergeLibrary(chrome.images.library, remote);
    }
  } catch {
    /* library in chrome JSON is enough */
  }

  return NextResponse.json({
    chrome,
    persistence: chromePersistence(),
    uploadsEnabled: railwayConfigured(),
  });
}

export async function PUT(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload =
    body && typeof body === "object" && "chrome" in body
      ? (body as { chrome: unknown }).chrome
      : body;

  try {
    const saved = await saveChrome(payload);
    revalidateChrome();
    return NextResponse.json({ ok: true, ...saved });
  } catch (err) {
    console.error("[createch] chrome save failed", err);
    const message =
      err instanceof Error ? err.message : "Failed to save chrome";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
