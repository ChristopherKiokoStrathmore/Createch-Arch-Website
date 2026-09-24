import { NextResponse } from "next/server";
import { adminConfigured, isAdminAuthorized } from "@/lib/admin-auth";
import { loadStoredChrome, saveChrome } from "@/lib/chrome-store";
import { railwayConfigured, railwayDeleteImage, railwayListImages, railwayUploadImage } from "@/lib/railway";
import { revalidateChrome } from "@/lib/revalidate-chrome";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

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
  if (!railwayConfigured()) {
    const chrome = await loadStoredChrome(true);
    return NextResponse.json({
      images: chrome.images.library,
      warning:
        "CREATECH_API_URL / ARCH_ADMIN_SECRET are not set. Listing chrome library IDs/URLs only — uploads are disabled.",
    });
  }
  const images = await railwayListImages(true);
  return NextResponse.json({ images });
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!railwayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image uploads require CREATECH_API_URL and ARCH_ADMIN_SECRET. Bytes are not stored on Vercel.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file") ?? form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image file" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is larger than 12 MB" }, { status: 400 });
  }
  const type = file.type || "application/octet-stream";
  if (type && !ALLOWED.has(type) && !type.startsWith("image/")) {
    return NextResponse.json({ error: "That file type is not an image" }, { status: 400 });
  }

  try {
    const image = await railwayUploadImage(file);
    const chrome = await loadStoredChrome(true);
    if (!chrome.images.library.some((item) => item.id === image.id)) {
      chrome.images.library.push({
        ...image,
        order: chrome.images.library.length,
      });
      await saveChrome(chrome);
      revalidateChrome();
    }
    return NextResponse.json({ image });
  } catch (err) {
    console.error("[createch] image upload failed", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  }

  try {
    await railwayDeleteImage(id);
  } catch (err) {
    console.error("[createch] railway image delete", err);
  }

  const chrome = await loadStoredChrome(true);
  chrome.images.library = chrome.images.library.filter((img) => img.id !== id);
  if (chrome.images.slots.hero === id) chrome.images.slots.hero = null;
  chrome.images.slots.gallery = chrome.images.slots.gallery.filter((g) => g !== id);
  if (chrome.hero.imageId === id) {
    chrome.hero.imageId = null;
    chrome.hero.imageUrl = null;
  }
  await saveChrome(chrome);
  revalidateChrome();
  return NextResponse.json({ ok: true });
}
