/**
 * The absolute origin this site is served from.
 *
 * `process.env.NEXT_PUBLIC_SITE_URL ?? "https://createch.co.ke"` is not enough,
 * and the failure mode is nasty: an environment variable that *exists with no
 * value* in the Vercel dashboard arrives as `""`, which `??` happily passes
 * through — and `new URL("")` throws ERR_INVALID_URL while Next collects page
 * data. Locally the variable is simply absent, the fallback fires, and the
 * build is green, so the breakage only ever appears on Vercel.
 *
 * So: trim, treat blank as absent, tolerate a bare host or a trailing slash
 * (both are easy things to paste into a dashboard field), and refuse anything
 * that still is not a valid absolute http(s) URL rather than exploding.
 *
 * NEXT_PUBLIC_* is inlined at BUILD time — changing it needs a redeploy, and
 * the reference below must stay a literal `process.env.NEXT_PUBLIC_SITE_URL`
 * for the bundler to substitute it at all.
 */
const CANONICAL_ORIGIN = "https://createch.co.ke";

function normalize(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  // a dashboard field often holds "createch.co.ke" rather than a full URL
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // origin drops any path, query or trailing slash the value carried
    return url.origin;
  } catch {
    return null;
  }
}

/** Origin with no trailing slash, e.g. `https://createch.co.ke`. */
export const SITE_URL =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ?? CANONICAL_ORIGIN;

/** Same value as a `URL`, for `metadataBase`. */
export const SITE_ORIGIN = new URL(SITE_URL);
