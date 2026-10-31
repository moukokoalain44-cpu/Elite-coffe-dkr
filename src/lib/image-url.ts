import { supabase } from "@/lib/supabase";

/**
 * Resolve both legacy public URLs and the Storage paths used by new uploads.
 * Do not use Supabase image transformations here: they are not enabled on
 * every project and can return a 404 for a newly uploaded object.
 */
export function getOptimizedMenuImageUrl(source: string): string {
  if (/^(https?:\/\/|data:|\/)/.test(source)) return source;
  return supabase.storage.from("site-media").getPublicUrl(source).data.publicUrl;
}
