// scripts/prepare-logo.mjs
//
// Derives web sizes, favicon and apple-touch from the official Createch mark.
// Source of truth: public/brand/createch-logo.png (transparent, not a new drawing).
//
// The file Chris sent is RGBA with a transparent field. Viewers that composite
// transparency on black make it look like a solid black background. We do not
// knock out the charcoal structure (#232020) — that is the C+A hexagon.

import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MASTER = path.join(ROOT, "public/brand/createch-logo.png");
const ATTACHMENT =
  "/home/ubuntu/.cursor/projects/workspace/assets/8575c6759692cb74255d97a9c804a3829b2dad2b173f8eb14cb3cf6ad6e2d521.png";

const PAPER = { r: 250, g: 247, b: 242, alpha: 1 };

function source() {
  if (existsSync(MASTER)) return MASTER;
  if (existsSync(ATTACHMENT)) return ATTACHMENT;
  throw new Error("Official logo PNG not found at public/brand/createch-logo.png");
}

async function letterboxOnPaper(input, size, paddingRatio = 0.14) {
  const inner = Math.round(size * (1 - paddingRatio * 2));
  const fitted = await sharp(input)
    .resize({
      width: inner,
      height: inner,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
  const fitMeta = await sharp(fitted).metadata();
  const left = Math.round((size - (fitMeta.width ?? inner)) / 2);
  const top = Math.round((size - (fitMeta.height ?? inner)) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: PAPER },
  })
    .composite([{ input: fitted, left, top }])
    .png();
}

async function main() {
  const src = source();
  const brandDir = path.join(ROOT, "public/brand");
  await mkdir(brandDir, { recursive: true });

  const master = MASTER;
  if (path.resolve(src) !== path.resolve(master)) {
    await copyFile(src, master);
  }

  const png = await sharp(master).png({ compressionLevel: 9 }).toBuffer();
  await sharp(png).toFile(master);

  await sharp(master)
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(path.join(brandDir, "createch-logo.webp"));

  for (const height of [320, 640]) {
    await sharp(master)
      .resize({ height, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(path.join(brandDir, `createch-logo-${height}.webp`));
  }

  await (await letterboxOnPaper(master, 64, 0.12)).toFile(
    path.join(ROOT, "app/icon.png")
  );
  await (await letterboxOnPaper(master, 180, 0.12)).toFile(
    path.join(ROOT, "app/apple-icon.png")
  );

  const meta = await sharp(master).metadata();
  console.log(
    `logo: ${meta.width}×${meta.height} → public/brand/ + app/icon.png + app/apple-icon.png`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
