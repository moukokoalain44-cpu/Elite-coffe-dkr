const SUPABASE_PUBLIC_OBJECT_PATH = "/storage/v1/object/public/";

/**
 * Requests a right-sized image from Supabase Storage while leaving external
 * sources (including the existing Unsplash fallbacks) untouched.
 */
export function getOptimizedMenuImageUrl(
  source: string,
  dimensions: { width: number; height: number },
): string {
  try {
    const url = new URL(source);
    if (!url.pathname.includes(SUPABASE_PUBLIC_OBJECT_PATH)) return source;

    url.pathname = url.pathname.replace(
      SUPABASE_PUBLIC_OBJECT_PATH,
      "/storage/v1/render/image/public/",
    );
    url.searchParams.set("width", String(dimensions.width));
    url.searchParams.set("height", String(dimensions.height));
    url.searchParams.set("resize", "cover");
    url.searchParams.set("quality", "78");
    return url.toString();
  } catch {
    return source;
  }
}
