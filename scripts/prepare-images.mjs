// scripts/prepare-images.mjs — Build prompt §Phase 1.2
//
// Walk assets-src/, convert HEIC→JPEG, auto-rotate, STRIP ALL EXIF/GPS
// (sharp copies no metadata unless asked — we never ask), resize to max
// 2400px long edge, quality backoff to stay < 450KB, write to
// assets-web/{slug}/, and emit assets-web/manifest.json.
//
// Run: node scripts/prepare-images.mjs
// Idempotent: overwrites assets-web each run.

import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import heicConvert from "heic-convert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "assets-web");

const MAX_EDGE = 2400;
const MAX_BYTES = 450 * 1024;
const QUALITY_LADDER = [82, 78, 74, 70, 66, 62, 58];
// If even the lowest quality busts the budget, shrink the long edge in steps.
const EDGE_FALLBACK = [2200, 2000, 1800];

// Source folder → project slug (Build prompt §4). Padel legacy + hires merge.
const FOLDER_TO_SLUG = {
  "00_Brand_and_Cover": "brand",
  "01_Networks_Padel_Village": "networks-padel-village",
  "networks-padel-village-hires": "networks-padel-village",
  "02_Le_Meridien_Zanzibar": "le-meridien-zanzibar",
  "03_Radisson_Abuja": "radisson-collection-abuja",
  "04_Tribe_Hotel_Nairobi": "tribe-hotel-nairobi",
  "05_Kwetu_Hilton_Curio": "kwetu-hilton-curio",
  "06_Village_Market": "village-market-trademark",
  "07_Kilima_Lodge_Serengeti": "kilima-lodge-serengeti",
  "08_Aga_Khan_Hospital": "aga-khan-childrens-hospital",
  "09_Orion_Park_Mumbai": "orion-park-mumbai",
  "10_Club_Mahindra_Himachal": "club-mahindra-theog",
  "11_Indian_Restaurant_Mumbai": "indian-restaurant-mumbai",
};

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".heic"]);

function sanitize(name) {
  const ext = path.extname(name);
  const base = name.slice(0, -ext.length);
  return (
    base
      .replace(/^Copy of /i, "")
      .replace(/[()]/g, "")
      .replace(/[^A-Za-z0-9_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") + ".jpg"
  );
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function toJpegBuffer(file, ext) {
  if (ext === ".heic") {
    const inputBuffer = await readFile(file);
    // heic-convert → full-quality JPEG buffer; sharp re-encodes below.
    return Buffer.from(
      await heicConvert({ buffer: inputBuffer, format: "JPEG", quality: 1 })
    );
  }
  return readFile(file);
}

async function encodeAtEdge(jpegBuffer, edge) {
  const base = sharp(jpegBuffer)
    .rotate()
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true });
  let last;
  for (const q of QUALITY_LADDER) {
    const buf = await base.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer();
    last = { buf, quality: q };
    if (buf.length <= MAX_BYTES) return { buf, quality: q, done: true };
  }
  return { ...last, done: false };
}

async function encodeUnderBudget(jpegBuffer) {
  // Prefer full MAX_EDGE; only shrink dimensions if quality alone can't fit.
  let result = await encodeAtEdge(jpegBuffer, MAX_EDGE);
  if (result.done) return result;
  for (const edge of EDGE_FALLBACK) {
    result = await encodeAtEdge(jpegBuffer, edge);
    if (result.done) return result;
  }
  return result; // best effort — should be under budget by 1800px/q58
}

async function main() {
  if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const manifest = [];
  const folders = await readdir(SRC, { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const slug = FOLDER_TO_SLUG[folder.name];
    if (!slug) {
      console.warn(`! skipping unmapped folder: ${folder.name}`);
      continue;
    }
    const files = (await walk(path.join(SRC, folder.name))).filter((f) =>
      IMG_EXT.has(path.extname(f).toLowerCase())
    );
    const outDir = path.join(OUT, slug);
    await mkdir(outDir, { recursive: true });

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const outName = sanitize(path.basename(file));
      const outPath = path.join(outDir, outName);
      try {
        const jpegBuffer = await toJpegBuffer(file, ext);
        // auto-rotate from EXIF (inside encoder), resize inside budget.
        const { buf, quality } = await encodeUnderBudget(jpegBuffer);
        await writeFile(outPath, buf);

        // Read back dimensions + confirm no EXIF survived.
        const meta = await sharp(buf).metadata();
        manifest.push({
          slug,
          file: `${slug}/${outName}`,
          source: path.relative(SRC, file).replace(/\\/g, "/"),
          width: meta.width,
          height: meta.height,
          bytes: buf.length,
          quality,
          hasExif: Boolean(meta.exif),
          role: meta.width >= 2000 ? "hero" : "gallery",
        });
        const kb = (buf.length / 1024).toFixed(0);
        console.log(
          `✓ ${slug}/${outName}  ${meta.width}x${meta.height}  ${kb}KB q${quality}`
        );
      } catch (err) {
        console.error(`✗ FAILED ${file}: ${err.message}`);
      }
    }
  }

  manifest.sort((a, b) => a.file.localeCompare(b.file));
  await writeFile(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  const withExif = manifest.filter((m) => m.hasExif).length;
  const over = manifest.filter((m) => m.bytes > MAX_BYTES).length;
  console.log(`\n— ${manifest.length} images written`);
  console.log(`— EXIF remaining: ${withExif} (must be 0)`);
  console.log(`— over 450KB: ${over}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
