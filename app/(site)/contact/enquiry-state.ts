/**
 * Shared shape for the enquiry form's action state.
 *
 * This lives outside actions.ts on purpose: a `"use server"` module may only
 * export async functions, so the type and the initial-state constant cannot sit
 * beside the action itself. Exporting `EMPTY_STATE` from there fails at module
 * evaluation with "a 'use server' file can only export async functions".
 */
export type EnquiryState = {
  status: "idle" | "sent" | "error";
  message: string;
  /** field name → problem, for inline messages */
  fieldErrors?: Record<string, string>;
};

export const EMPTY_STATE: EnquiryState = { status: "idle", message: "" };
