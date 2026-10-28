/**
 * Keeps public Storage URLs intact.
 *
 * Supabase Image Transformation is not enabled on every project plan and can
 * return a 404 for newly uploaded objects. The browser-side loading strategy
 * (lazy loading, priority hints and async decoding) still reduces the page
 * cost without replacing a valid object URL with an invalid render URL.
 */
export function getOptimizedMenuImageUrl(source: string): string {
  return source;
}
