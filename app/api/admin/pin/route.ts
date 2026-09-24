import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  adminCookieAttributes,
  adminCookieValue,
  isAdminAuthorized,
  isPinCorrect,
  resetPinCaches,
} from "@/lib/admin-auth";
import { railwayConfigured, railwaySetPin } from "@/lib/railway";

export const dynamic = "force-dynamic";

const PIN_MIN = 6;
const PIN_MAX = 64;

/**
 * Change the /admin PIN. The new PIN is hashed and stored on Railway; from
 * then on ADMIN_PIN in Vercel no longer opens /admin (ADMIN_SECRET_KEY still
 * does, as the recovery key). Every other open session is signed out.
 */
export async function PUT(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!railwayConfigured()) {
    return NextResponse.json(
      {
        error:
          "The PIN is stored on Railway. Set CREATECH_API_URL and ARCH_ADMIN_SECRET to change it here.",
      },
      { status: 503 },
    );
  }

  let current = "";
  let next = "";
  try {
    const body = (await req.json()) as { current?: unknown; next?: unknown };
    if (typeof body.current === "string") current = body.current;
    if (typeof body.next === "string") next = body.next;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Same cleaning the lock screen applies, so the PIN saved is the PIN typed.
  const clean = next.trim().replace(/[^\x20-\x7E]/g, "");
  if (clean !== next) {
    return NextResponse.json(
      { error: "Use plain letters, numbers and symbols, with no spaces at the ends." },
      { status: 400 },
    );
  }
  if (clean.length < PIN_MIN || clean.length > PIN_MAX) {
    return NextResponse.json(
      { error: `The new PIN must be ${PIN_MIN}–${PIN_MAX} characters.` },
      { status: 400 },
    );
  }

  const currentClean = current.trim().replace(/[^\x20-\x7E]/g, "");
  if (!(await isPinCorrect(req, currentClean))) {
    return NextResponse.json({ error: "Current PIN is wrong." }, { status: 401 });
  }

  try {
    await railwaySetPin(clean);
  } catch (err) {
    console.error("[createch] pin change failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not change the PIN" },
      { status: 502 },
    );
  }
  resetPinCaches();

  // Re-issue this browser's cookie under the new version so it stays signed in.
  const res = NextResponse.json({ ok: true });
  const token = await adminCookieValue();
  if (token) res.cookies.set(ADMIN_COOKIE, token, adminCookieAttributes(60 * 60 * 8));
  return res;
}
