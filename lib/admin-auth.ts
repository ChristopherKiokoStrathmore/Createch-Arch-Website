import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

/**
 * Hobbies-style admin gate.
 *
 * The browser stores the PIN in sessionStorage and sends it as `X-Admin-Key`.
 * A successful login also sets an httpOnly cookie (HMAC of a session marker,
 * not the PIN itself) so subsequent same-origin fetches stay authed.
 *
 * Secrets: `ADMIN_SECRET_KEY` or `ADMIN_PIN` (either). Fail closed if unset.
 * Never hardcode a PIN.
 */
export const ADMIN_COOKIE = "createch_admin";
const COOKIE_PAYLOAD = "createch-admin-session-v1";
const WINDOW_MS = 5 * 60_000;
const MAX_FAILURES = 15;

function secrets(): string[] {
  return [env(process.env.ADMIN_SECRET_KEY), env(process.env.ADMIN_PIN)].filter(
    (s): s is string => Boolean(s),
  );
}

export function adminConfigured(): boolean {
  return secrets().length > 0;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const failures = new Map<string, { count: number; first: number }>();

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || "local";
}

function isBlocked(key: string): boolean {
  const rec = failures.get(key);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return rec.count >= MAX_FAILURES;
}

function recordFailure(key: string): void {
  const now = Date.now();
  const rec = failures.get(key);
  if (!rec || now - rec.first > WINDOW_MS) {
    failures.set(key, { count: 1, first: now });
  } else {
    rec.count += 1;
  }
}

function signingSecret(): string | undefined {
  return secrets()[0];
}

export function adminCookieValue(): string | undefined {
  const secret = signingSecret();
  if (!secret) return undefined;
  return createHmac("sha256", secret).update(COOKIE_PAYLOAD).digest("hex");
}

export function cookieMatches(value: string | undefined): boolean {
  const expected = adminCookieValue();
  if (!expected || !value) return false;
  return safeEqual(value, expected);
}

export function pinMatches(provided: string): boolean {
  if (!provided) return false;
  return secrets().some((s) => safeEqual(provided, s));
}

export function isAdminAuthorized(req: Request): boolean {
  if (!adminConfigured()) return false;

  const key = clientKey(req);
  if (isBlocked(key)) return false;

  const header = req.headers.get("x-admin-key") ?? "";
  if (header.length > 0 && pinMatches(header)) return true;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookie = cookieValue(cookieHeader, ADMIN_COOKIE);
  if (cookieMatches(cookie)) return true;

  recordFailure(key);
  return false;
}

export function cookieValue(header: string, name: string): string | undefined {
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return undefined;
}

export function adminCookieAttributes(maxAgeSeconds: number | 0) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
