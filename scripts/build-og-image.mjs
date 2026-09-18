// scripts/build-og-image.mjs
//
// Renders public/og.jpg — the 1200×630 card that appears when the site is
// pasted into WhatsApp, LinkedIn or Slack. The official mark sits on a paper
// plate so the charcoal C+A remains visible on the ink ground.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "og.jpg");
const LOGO = path.join(ROOT, "public/brand/createch-logo.png");
const W = 1200;
const H = 630;

const INK = "#111110";
const PAPER = "#faf7f2";
const GOLD = "#f5bf4f";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <g stroke="${GOLD}" fill="none" opacity="0.16">
    <path d="M0 470 L1200 470" stroke-width="1"/>
    <path d="M96 470 L96 300 L420 300 L420 470" stroke-width="1"/>
    <path d="M420 300 L700 300 L700 380 L1010 380" stroke-width="1"/>
    <path d="M1010 250 L1010 470" stroke-width="1"/>
  </g>
  <text x="220" y="148" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="28" letter-spacing="7">CREATECH ARCHITECTS</text>
  <text x="96" y="330" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="72">The art of layouts,</text>
  <text x="96" y="412" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="72">plans and spaces.</text>
  <rect x="96" y="500" width="120" height="2" fill="${GOLD}"/>
  <text x="96" y="558" fill="${PAPER}" fill-opacity="0.62"
        font-family="Helvetica, Arial, sans-serif" font-size="24" letter-spacing="3">
    Nairobi, Kenya &#183; Hospitality &#183; Architecture &#183; Interior Design
  </text>
</svg>`;

async function platedLogo() {
  const resized = await sharp(LOGO)
    .resize({ height: 112, withoutEnlargement: true })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const pad = 10;
  const w = (meta.width ?? 80) + pad * 2;
  const h = (meta.height ?? 112) + pad * 2;
  return sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 250, g: 247, b: 242, alpha: 1 },
    },
  })
    .composite([{ input: resized, left: pad, top: pad }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const plate = await platedLogo();
  const info = await sharp(base)
    .composite([{ input: plate, left: 96, top: 78 }])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(OUT);
  console.log(
    `og image: ${path.relative(process.cwd(), OUT)} ` +
      `${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
