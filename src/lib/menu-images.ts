import { formatCatalogError } from "@/lib/catalog-admin";
import { supabase } from "@/lib/supabase";

export const MENU_IMAGES_BUCKET = "menu-images";
export const MAX_MENU_IMAGE_BYTES = 15 * 1024 * 1024;
export const MENU_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export async function uploadMenuImage(file: File, productId?: string): Promise<string> {
  if (!MENU_IMAGE_MIME_TYPES.includes(file.type as (typeof MENU_IMAGE_MIME_TYPES)[number])) {
    throw new Error(
      `[uploadMenuImage] storage.objects (bucket=${MENU_IMAGES_BUCKET}, MIME): utilisez JPEG, PNG ou WebP.`,
    );
  }
  if (file.size > MAX_MENU_IMAGE_BYTES) {
    throw new Error(
      `[uploadMenuImage] storage.objects (bucket=${MENU_IMAGES_BUCKET}, SIZE): l’image dépasse 15 Mo.`,
    );
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (sessionError || !accessToken) {
    throw new Error("Votre session administrateur a expiré. Reconnectez-vous puis réessayez.");
  }

  const formData = new FormData();
  formData.append("image", file, file.name);
  if (productId) formData.append("productId", productId);

  const response = await fetch("/api/menu-images", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const result = (await response.json().catch(() => null)) as {
    path?: unknown;
    error?: unknown;
    details?: unknown;
  } | null;
  if (!response.ok) {
    const message =
      (typeof result?.details === "string" && result.details) ||
      (typeof result?.error === "string" && result.error) ||
      `HTTP ${response.status}`;
    throw new Error(`[uploadMenuImage] ${message}`);
  }
  if (typeof result?.path !== "string" || !result.path) {
    throw new Error("Le serveur n’a pas retourné le chemin de l’image téléversée.");
  }
  return resolveMenuImageUrl(result.path);
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
