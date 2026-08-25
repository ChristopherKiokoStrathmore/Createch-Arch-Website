// scripts/build-image-variants.mjs
//
// Pre-renders the responsive variants that `lib/image-loader.ts` addresses.
// Next's image optimizer needs a Node server; the site ships as a static
// export to Apache, so the work moves to build time.
//
// For every raster file under public/images, writes `<name>.<width>.webp` at
// each width in WIDTHS. Originals are never upscaled — a 640px source is
// re-encoded at 640 under all three names — so the loader can address any
// width without checking whether a file exists.
//
// Idempotent: a variant newer than its source is left alone. Run it with
// `npm run images:variants`; `npm run build` does it for you.

import { readdir, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const WIDTHS = [640, 1280, 1920];
const QUALITY = 78;
const SOURCE = /\.(jpe?g|png)$/i;

/** Every raster original under public/images, recursively. */
async function sources(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await sources(full)));
    else if (SOURCE.test(entry.name)) out.push(full);
  }
  return out;
}

async function isStale(src, dest) {
  if (!existsSync(dest)) return true;
  const [a, b] = await Promise.all([stat(src), stat(dest)]);
  return a.mtimeMs > b.mtimeMs;
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error(`No ${path.relative(process.cwd(), ROOT)} — nothing to do.`);
    process.exit(0);
  }

  await mkdir(ROOT, { recursive: true });
  const files = await sources(ROOT);
  let written = 0;
  let skipped = 0;
  let bytes = 0;

  for (const file of files) {
    const base = file.replace(SOURCE, "");
    const meta = await sharp(file).metadata();

    for (const width of WIDTHS) {
      const dest = `${base}.${width}.webp`;
      if (!(await isStale(file, dest))) {
        skipped++;
        continue;
      }
      // never upscale: clamp to the source's own width
      const info = await sharp(file)
        .resize({ width: Math.min(width, meta.width ?? width), withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(dest);
      written++;
      bytes += info.size;
    }
  }

  console.log(
    `image variants: ${written} written, ${skipped} up to date, ` +
      `${files.length} sources, ${(bytes / 1024 / 1024).toFixed(1)} MB emitted`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
