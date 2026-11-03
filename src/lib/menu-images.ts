import { formatCatalogError } from "@/lib/catalog-admin";
import { supabase } from "@/lib/supabase";

export const MENU_IMAGES_BUCKET = "menu-images";
export const MAX_MENU_IMAGE_BYTES = 5 * 1024 * 1024;
export const MENU_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function extensionForType(type: string): string {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  return "webp";
}

export async function uploadMenuImage(file: File): Promise<string> {
  if (!MENU_IMAGE_MIME_TYPES.includes(file.type as (typeof MENU_IMAGE_MIME_TYPES)[number])) {
    throw new Error(
      `[uploadMenuImage] storage.objects (bucket=${MENU_IMAGES_BUCKET}, MIME): utilisez JPEG, PNG ou WebP.`,
    );
  }
  if (file.size > MAX_MENU_IMAGE_BYTES) {
    throw new Error(
      `[uploadMenuImage] storage.objects (bucket=${MENU_IMAGES_BUCKET}, SIZE): l’image dépasse 5 Mo.`,
    );
  }

  const path = `plats/${Date.now()}-${crypto.randomUUID()}.${extensionForType(file.type)}`;
  const { error } = await supabase.storage.from(MENU_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error)
    throw formatCatalogError(
      "uploadMenuImage",
      `storage.objects (bucket=${MENU_IMAGES_BUCKET})`,
      error,
    );
  return resolveMenuImageUrl(path);
}

export function resolveMenuImageUrl(source: string | null | undefined): string {
  if (!source) return "";
  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith("/")) return source;
  return supabase.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(source).data.publicUrl;
}

function getManagedObjectPath(source: string): string | null {
  const marker = `/storage/v1/object/public/${MENU_IMAGES_BUCKET}/`;
  if (source.includes(marker)) {
    try {
      return decodeURIComponent(source.split(marker).at(-1) || "") || null;
    } catch {
      return source.split(marker).at(-1) || null;
    }
  }
  if (source.startsWith("plats/")) return source;
  return null;
}

export async function deleteMenuImage(source: string | null | undefined): Promise<boolean> {
  if (!source) return false;
  const path = getManagedObjectPath(source);
  if (!path) return false;
  const { error } = await supabase.storage.from(MENU_IMAGES_BUCKET).remove([path]);
  if (error)
    throw formatCatalogError(
      "deleteMenuImage",
      `storage.objects (bucket=${MENU_IMAGES_BUCKET})`,
      error,
    );
  return true;
}
