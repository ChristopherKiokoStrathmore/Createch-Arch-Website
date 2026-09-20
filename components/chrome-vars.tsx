import type { ChromeConfig } from "@/lib/chrome-types";
import { hexToRgba } from "@/lib/chrome-utils";

/**
 * Apply editor colours over the Tailwind tokens in globals.css.
 * Only mounted on the public site — /admin keeps the baked defaults so a
 * bad colour save cannot lock the editor.
 */
export default function ChromeVars({ chrome }: { chrome: ChromeConfig }) {
  const { paper, paper2, ink, gold, goldDeep } = chrome.colours;
  const css = `:root{--color-paper:${paper};--color-paper-2:${paper2};--color-ink:${ink};--color-ink-60:${hexToRgba(ink, 0.64)};--color-gold:${gold};--color-gold-deep:${goldDeep};--color-line:${hexToRgba(ink, 0.14)};}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
