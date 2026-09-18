"use server";

import { Resend } from "resend";
import { enquiryCopy, site } from "@/content";
import type { EnquiryState } from "./enquiry-state";

/**
 * Enquiry Server Action.
 *
 * Wired to <form action>, so it works with JavaScript disabled. Without
 * RESEND_API_KEY the action does not throw and does not pretend to succeed —
 * it tells the visitor to email directly.
 *
 * Env (see .env.example / README):
 *   RESEND_API_KEY       required to send
 *   ENQUIRY_TO_EMAIL     inbox (falls back to CONTACT_TO_EMAIL, then site.email)
 *   ENQUIRY_FROM_EMAIL   from-address on a Resend-verified domain
 *                        (falls back to MAIL_FROM)
 */
const TAB = 9;
const LINE_FEED = 10;
const CARRIAGE_RETURN = 13;
const SPACE = 32;
const DELETE = 127;

function clean(
  value: FormDataEntryValue | null,
  max: number,
  singleLine = true
): string {
  if (typeof value !== "string") return "";

  const kept = Array.from(value).filter((char) => {
    const code = char.charCodeAt(0);
    if (code === DELETE) return false;
    if (code >= SPACE) return true;
    if (code === TAB) return true;
    return !singleLine && (code === LINE_FEED || code === CARRIAGE_RETURN);
  });

  return kept.join("").trim().slice(0, max);
}

/** Blank Vercel dashboard values arrive as "" — treat them as unset. */
function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot. A real person never sees this field; report success so bots
  // learn nothing from the difference.
  if (clean(formData.get("company"), 100) !== "") {
    return { status: "sent", message: "" };
  }

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 40);
  const message = clean(formData.get("message"), 5000, false);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please add your name.";
  if (!message) fieldErrors.message = "Please add a short message.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    fieldErrors.email = "That email address does not look right.";
  }
  if (phone && digits(phone).length < 7) {
    fieldErrors.phone = "That phone number does not look right.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const apiKey = env(process.env.RESEND_API_KEY);
  if (!apiKey) {
    return {
      status: "error",
      message: enquiryCopy.unconfigured,
    };
  }

  const to =
    env(process.env.ENQUIRY_TO_EMAIL) ??
    env(process.env.CONTACT_TO_EMAIL) ??
    site.email;
  const fromAddress =
    env(process.env.ENQUIRY_FROM_EMAIL) ??
    env(process.env.MAIL_FROM) ??
    "website@createch.co.ke";

  const body = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Phone:     ${phone || "—"}`,
    `Project:   ${clean(formData.get("projectType"), 120) || "—"}`,
    `Site:      ${clean(formData.get("location"), 200) || "—"}`,
    `Stage:     ${clean(formData.get("stage"), 120) || "—"}`,
    `Dates:     ${clean(formData.get("timeline"), 200) || "—"}`,
    "",
    message,
    "",
    "---",
    "Sent from the createch.co.ke enquiry form",
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Createch Architects website <${fromAddress}>`,
      to: [to],
      replyTo: email,
      subject: `Enquiry — ${name}`,
      text: body,
    });

    if (error) {
      console.error("[createch] resend error", error);
      return { status: "error", message: enquiryCopy.failed };
    }
  } catch (err) {
    console.error("[createch] enquiry failed", err);
    return { status: "error", message: enquiryCopy.failed };
  }

  return { status: "sent", message: "" };
}
