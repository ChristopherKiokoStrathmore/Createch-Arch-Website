import { revalidatePath, revalidateTag } from "next/cache";
import { CHROME_CACHE_TAG } from "@/lib/chrome-types";

export function revalidateChrome(): void {
  revalidateTag(CHROME_CACHE_TAG, "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/studio");
  revalidatePath("/contact");
  revalidatePath("/work/[slug]", "page");
}
