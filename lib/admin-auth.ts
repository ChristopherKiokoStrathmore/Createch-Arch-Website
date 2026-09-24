import { createHash, createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";
import {
  railwayConfigured,
  railwayGetPinState,
  railwayVerifyPin,
  type RailwayPinState,
} from "@/lib/railway";

/**
 * Hobbies-style admin gate.
 *
 * The browser stores the PIN in sessionStorage and sends it as `X-Admin-Key`.
 * A successful login also sets an httpOnly cookie (HMAC of a session marker,
 * not the PIN itself) so subsequent same-origin fetches stay authed.
 *
 * Which PINs open /admin:
 * - `ADMIN_SECRET_KEY` always — the recovery key. Keep it long and offline.
 * - The PIN stored (hashed) on Railway, once someone has set one from /admin.
 * - `ADMIN_PIN` only until then. Changing the PIN from /admin retires it, so
 *   an old PIN left in the Vercel dashboard stops working.
 * If Railway is configured but unreachable, only the recovery key works.
 * Without Railway (local dev), both env values work as before.
 *
 * Never hardcode a PIN.
 */
export const ADMIN_COOKIE = "createch_admin";
const COOKIE_PAYLOAD = "createch-admin-session-v1";
const WINDOW_MS = 5 * 60_000;
const MAX_FAILURES = 15;
// Railway hashes PINs deliberately slowly, so cache what it tells us.
const STATE_TTL_MS = 30_000;
const VERIFY_TTL_MS = 60_000;

function recoveryKey(): string | undefined {
  return env(process.env.ADMIN_SECRET_KEY);
}

function bootstrapPin(): string | undefined {
  return env(process.env.ADMIN_PIN);
}

function secrets(): string[] {
  return [recoveryKey(), bootstrapPin()].filter((s): s is string => Boolean(s));
}

export function adminConfigured(): boolean {
  return secrets().length > 0 || railwayConfigured();
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

// --------------------------------------------------------------- PIN state

type PinMode =
  | { kind: "local" }
  | { kind: "unreachable" }
  | { kind: "railway"; state: RailwayPinState };

let stateCache: { mode: PinMode; at: number } | null = null;
const verified = new Map<string, { version: number; at: number }>();

async function pinMode(): Promise<PinMode> {
  if (!railwayConfigured()) return { kind: "local" };
  if (stateCache && Date.now() - stateCache.at < STATE_TTL_MS) return stateCache.mode;
  const state = await railwayGetPinState();
  const mode: PinMode = state ? { kind: "railway", state } : { kind: "unreachable" };
  // Don't cache an outage; retry on the next request.
  stateCache = state ? { mode, at: Date.now() } : null;
  return mode;
}

/** Call after the PIN changes so this instance stops trusting the old one at once. */
export function resetPinCaches(): void {
  stateCache = null;
  verified.clear();
}

function digest(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

export async function pinMatches(provided: string): Promise<boolean> {
  if (!provided) return false;
  const recovery = recoveryKey();
  if (recovery && safeEqual(provided, recovery)) return true;

  const mode = await pinMode();
  if (mode.kind === "unreachable") return false;
  if (mode.kind === "local" || !mode.state.set) {
    const pin = bootstrapPin();
    return Boolean(pin && safeEqual(provided, pin));
  }

  const key = digest(provided);
  const hit = verified.get(key);
  if (hit && hit.version === mode.state.version && Date.now() - hit.at < VERIFY_TTL_MS) {
    return true;
  }
  const result = await railwayVerifyPin(provided);
  if (result?.ok) {
    verified.set(key, { version: result.version, at: Date.now() });
    return true;
  }
  return false;
}

// ------------------------------------------------------------------ cookie

/**
 * With Railway, sign with ARCH_ADMIN_SECRET — a server-only value no editor
 * ever types — so knowing a retired ADMIN_PIN cannot forge a session.
 */
function signingSecret(): string | undefined {
  if (railwayConfigured()) return env(process.env.ARCH_ADMIN_SECRET);
  return secrets()[0];
}

/** The PIN version is signed in, so changing the PIN signs out every other session. */
export async function adminCookieValue(): Promise<string | undefined> {
  const secret = signingSecret();
  if (!secret) return undefined;
  const mode = await pinMode();
  if (mode.kind === "unreachable") return undefined;
  const version = mode.kind === "railway" ? mode.state.version : 0;
  return createHmac("sha256", secret)
    .update(`${COOKIE_PAYLOAD}:${version}`)
    .digest("hex");
}

export async function cookieMatches(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await adminCookieValue();
  if (!expected) return false;
  return safeEqual(value, expected);
}

export async function isAdminAuthorized(req: Request): Promise<boolean> {
  if (!adminConfigured()) return false;

  const key = clientKey(req);
  if (isBlocked(key)) return false;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookie = cookieValue(cookieHeader, ADMIN_COOKIE);
  if (await cookieMatches(cookie)) return true;

  const header = req.headers.get("x-admin-key") ?? "";
  if (header.length > 0 && (await pinMatches(header))) return true;

  recordFailure(key);
  return false;
}

/** Checks a typed PIN on its own — no cookie — and counts a wrong one as a failure. */
export async function isPinCorrect(req: Request, pin: string): Promise<boolean> {
  const key = clientKey(req);
  if (isBlocked(key)) return false;
  if (await pinMatches(pin)) return true;
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
