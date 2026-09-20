import { DEFAULT_FOOTER_LABELS } from "@/lib/chrome-defaults";
import type { ChromeConfig } from "@/lib/chrome-types";

export function navLabel(
  chrome: ChromeConfig,
  href: string,
  fallback: string,
): string {
  return chrome.nav.links.find((l) => l.href === href)?.label ?? fallback;
}

export function footerLabels(chrome: ChromeConfig) {
  return {
    work: navLabel(chrome, "/work", DEFAULT_FOOTER_LABELS.work),
    studio: navLabel(chrome, "/studio", DEFAULT_FOOTER_LABELS.studio),
    start: navLabel(chrome, "/contact", DEFAULT_FOOTER_LABELS.start),
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) {
    return `rgba(17, 17, 16, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isRemoteSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
