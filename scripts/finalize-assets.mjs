// scripts/finalize-assets.mjs
// Collect every image referenced by content/seed.ts + content/hero.ts,
// emit content/image-dimensions.json (committed — gallery layout needs
// intrinsic sizes at build time, and the manifest is gitignored), and
// copy just those keepers from assets-web/ into public/images/ (committed).

import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WEB = path.join(ROOT, "assets-web");
const PUB = path.join(ROOT, "public", "images");

const seed = await readFile(path.join(ROOT, "content", "seed.ts"), "utf8");
const hero = await readFile(path.join(ROOT, "content", "hero.ts"), "utf8");
const text = seed + "\n" + hero;

// match "slug/filename.jpg" (also inside "/images/slug/file.jpg")
const refs = new Set();
for (const m of text.matchAll(/([a-z0-9-]+\/[A-Za-z0-9._-]+\.jpg)/g)) {
  refs.add(m[1].replace(/^images\//, ""));
}
// images referenced from components (static paths, not via seed)
const EXTRA_REFS = ["founder/Anvi_Shah_Profile.jpg"];
for (const r of EXTRA_REFS) refs.add(r);

const manifest = JSON.parse(
  await readFile(path.join(WEB, "manifest.json"), "utf8")
);
const dimByFile = Object.fromEntries(
  manifest.map((m) => [m.file, [m.width, m.height]])
);

const dims = {};
const missing = [];
let copied = 0;
let bytes = 0;

for (const file of [...refs].sort()) {
  const srcPath = path.join(WEB, file);
  if (!existsSync(srcPath)) {
    missing.push(file);
    continue;
  }
  dims[file] = dimByFile[file] ?? null;
  const destPath = path.join(PUB, file);
  await mkdir(path.dirname(destPath), { recursive: true });
  await copyFile(srcPath, destPath);
  const { size } = await import("node:fs").then((fs) =>
    fs.promises.stat(destPath)
  );
  bytes += size;
  copied++;
}

await writeFile(
  path.join(ROOT, "content", "image-dimensions.json"),
  JSON.stringify(dims, null, 0) + "\n"
);

console.log(`referenced: ${refs.size}`);
console.log(`copied to public/images: ${copied} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
console.log(`dimensions written: ${Object.keys(dims).length}`);
if (missing.length) {
  console.error(`\n!! MISSING from assets-web (${missing.length}):`);
  missing.forEach((f) => console.error("   " + f));
  process.exit(1);
}
