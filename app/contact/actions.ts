"use server";

import { Resend } from "resend";
import { siteSettings } from "@/content/seed";
import type { EnquiryState } from "./enquiry-state";

/**
 * Enquiry Server Action (Phase 4, Vercel deployment).
 *
 * Runs on Vercel as a Server Function. Because it is wired to <form action>,
 * it also works with JavaScript disabled — React posts the form natively and
 * Next runs the action server-side, so the no-JS path needs no separate
 * endpoint.
 *
 * Degradation is deliberate: with no RESEND_API_KEY the action does not throw
 * and does not pretend to succeed. It says email is not configured and points
 * the visitor at the address, which stays visible on the page for exactly this
 * reason.
 */
const TAB = 9;
const LINE_FEED = 10;
const CARRIAGE_RETURN = 13;
const SPACE = 32;
const DELETE = 127;

/**
 * Drop control characters while keeping the whitespace a message legitimately
 * contains. `singleLine` additionally strips newlines, for the values that end
 * up in a subject or Reply-To.
 */
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

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Report success so the bot learns nothing from the difference.
  if (clean(formData.get("company"), 100) !== "") {
    return { status: "sent", message: "" };
  }

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  const message = clean(formData.get("message"), 5000, false);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please add your name.";
  if (!message) fieldErrors.message = "Please add a short message.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    fieldErrors.email = "That email address does not look right.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message:
        "The form isn't connected to email yet, so this didn't send. Please write to us directly.",
    };
  }

  const body = [
    `Name:      ${name}`,
    `Email:     ${email}`,
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
      // must be an address on a domain verified in Resend, or delivery fails
      from: `Createch Architects website <${process.env.MAIL_FROM ?? "website@createch.co.ke"}>`,
      to: [process.env.CONTACT_TO_EMAIL ?? siteSettings.email],
      replyTo: email,
      subject: `Enquiry — ${name}`,
      text: body,
    });

    if (error) {
      console.error("[createch] resend error", error);
      return { status: "error", message: "That didn't go through." };
    }
  } catch (err) {
    console.error("[createch] enquiry failed", err);
    return { status: "error", message: "That didn't go through." };
  }

  return { status: "sent", message: "" };
}
