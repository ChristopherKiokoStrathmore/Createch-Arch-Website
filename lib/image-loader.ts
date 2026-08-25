/**
 * Custom image loader for the static export (next.config.ts).
 *
 * Next's own optimizer needs a Node server, which shared cPanel hosting does
 * not give us. Instead `scripts/build-image-variants.mjs` pre-renders every
 * file in public/images at each width in WIDTHS and writes it beside the
 * original as `<name>.<width>.webp`. This loader just addresses them.
 *
 * The script emits all three widths for every image without upscaling — a
 * 640px-wide original is simply re-encoded at 640 under all three names — so
 * the mapping is total and the loader never has to guess whether a file
 * exists. Anything outside /images (or an SVG, which has nothing to gain) is
 * passed through untouched.
 */
const WIDTHS = [640, 1280, 1920];

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith("/images/") || src.endsWith(".svg")) return src;

  const target = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${src.replace(/\.(jpe?g|png|webp)$/i, "")}.${target}.webp`;
}
