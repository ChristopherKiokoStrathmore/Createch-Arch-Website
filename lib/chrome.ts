import { cache } from "react";
import "server-only";
import { loadStoredChrome } from "@/lib/chrome-store";
import type { ChromeConfig } from "@/lib/chrome-types";

/**
 * Public read of site chrome. Deduped per request. Missing/empty admin
 * store falls back to the live copy in `content/copy.ts`.
 */
export const getChrome = cache(async (): Promise<ChromeConfig> => {
  return loadStoredChrome(false);
});
