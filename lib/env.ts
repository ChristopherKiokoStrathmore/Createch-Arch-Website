/**
 * Blank Vercel dashboard values arrive as "" — treat them as unset.
 * Shared by chrome persistence and admin auth. Enquiry keeps its own copy
 * so that form path stays untouched.
 */
export function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
