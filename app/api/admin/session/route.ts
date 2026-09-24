import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  adminCookieAttributes,
  adminCookieValue,
  isAdminAuthorized,
  isPinCorrect,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured" },
      { status: 503 },
    );
  }
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin PIN is not configured on this deployment." },
      { status: 503 },
    );
  }

  let pin = "";
  try {
    const body = (await req.json()) as { pin?: unknown };
    if (typeof body.pin === "string") pin = body.pin;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const clean = pin.trim().replace(/[^\x20-\x7E]/g, "");
  if (!(await isPinCorrect(req, clean))) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const token = await adminCookieValue();
  if (!token) {
    return NextResponse.json(
      { error: "Admin PIN is not configured on this deployment." },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, adminCookieAttributes(60 * 60 * 8));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", adminCookieAttributes(0));
  return res;
}
