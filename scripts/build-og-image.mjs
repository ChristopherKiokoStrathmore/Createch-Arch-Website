// scripts/build-og-image.mjs
//
// Renders public/og.jpg — the 1200×630 card that appears when the site is
// pasted into WhatsApp, LinkedIn or Slack. WhatsApp is the primary sharing
// channel for this practice, so this is not decoration.
//
// Built with sharp at build time rather than next/og at request time, because
// the site is a static export with no server to render an ImageResponse.
//
// PROVISIONAL: the monogram here is the same placeholder as components/logo.tsx
// (GATE H0). Re-run this once the real logo SVG lands. Type is set in a system
// serif — Fraunces is not available to librsvg — which is why the wordmark is
// letterspaced caps rather than the display face.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "og.jpg");
const W = 1200;
const H = 630;

const INK = "#111110";
const PAPER = "#faf7f2";
const GOLD = "#f5bf4f";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>

  <!-- construction lines, the "from line to built" motif -->
  <g stroke="${GOLD}" fill="none" opacity="0.16">
    <path d="M0 470 L1200 470" stroke-width="1"/>
    <path d="M96 470 L96 300 L420 300 L420 470" stroke-width="1"/>
    <path d="M420 300 L700 300 L700 380 L1010 380" stroke-width="1"/>
    <path d="M1010 250 L1010 470" stroke-width="1"/>
  </g>

  <!-- monogram: hexagon + C + gold guides (placeholder, matches logo.tsx) -->
  <g transform="translate(96 92) scale(1.55)">
    <path d="M24 3 43.2 14v22L24 47 4.8 36V14Z" fill="none" stroke="${PAPER}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M24 3v44" stroke="${GOLD}" stroke-width="0.9" opacity="0.9"/>
    <path d="M4.8 14 43.2 36" stroke="${GOLD}" stroke-width="0.9" opacity="0.55"/>
    <path d="M30 18a8 8 0 1 0 0 12" fill="none" stroke="${PAPER}" stroke-width="2" stroke-linecap="round"/>
    <path d="M19 30h10" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round"/>
  </g>

  <text x="196" y="140" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" letter-spacing="7">CREATECH ARCHITECTS</text>

  <text x="96" y="330" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="72">Architecture for hospitality,</text>
  <text x="96" y="412" fill="${PAPER}" font-family="Georgia, 'Times New Roman', serif"
        font-size="72">from first line to final detail.</text>

  <rect x="96" y="500" width="120" height="2" fill="${GOLD}"/>
  <text x="96" y="558" fill="${PAPER}" fill-opacity="0.62"
        font-family="Helvetica, Arial, sans-serif" font-size="24" letter-spacing="3">
    Nairobi, Kenya &#183; Hospitality &#183; Architecture &#183; Interior Design
  </text>
</svg>`;

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  const info = await sharp(Buffer.from(svg))
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
