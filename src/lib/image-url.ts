import { resolveMenuImageUrl } from "@/lib/menu-images";

/** Resolve catalogue object paths to public menu-images URLs; leave external URLs intact. */
export function getOptimizedMenuImageUrl(source: string): string {
  return resolveMenuImageUrl(source);
}
