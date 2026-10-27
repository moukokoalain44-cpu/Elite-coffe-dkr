import { createClient } from "@supabase/supabase-js";

const configuredSupabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
// Supabase JS attend l’URL racine du projet, pas l’URL REST `/rest/v1/`.
// Cette normalisation garde la connexion compatible avec l’environnement Vercel existant.
const supabaseUrl = configuredSupabaseUrl?.replace(/\/rest\/v1\/?$/, "");
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Elite Coffee] Variables d'environnement Supabase manquantes.\n" +
      "Créez un fichier .env.local à la racine avec :\n" +
      "  VITE_SUPABASE_URL=https://xxxx.supabase.co\n" +
      "  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export type MenuProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  price_options: { label: string; price: number; minQuantity?: number }[];
  availability_note: string | null;
  featured: boolean;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

export async function fetchMenuProducts(): Promise<MenuProductRow[]> {
  const { data, error } = await supabase
    .from("menu_products")
    .select(
      "id,name,category,price,description,price_options,availability_note,featured,image_url,is_visible,sort_order",
    )
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as MenuProductRow[];
}

const MENU_COLUMNS =
  "id,name,category,price,description,price_options,availability_note,featured,image_url,is_visible,sort_order";

export async function fetchMenuProductsAdmin(): Promise<MenuProductRow[]> {
  const { data, error } = await supabase
    .from("menu_products")
    .select(MENU_COLUMNS)
    .order("category")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuProductRow[];
}

export type MenuProductInput = Omit<MenuProductRow, "id"> & { id?: string };

export async function createMenuProduct(input: MenuProductInput): Promise<MenuProductRow> {
  const { data, error } = await supabase
    .from("menu_products")
    .insert(input)
    .select(MENU_COLUMNS)
    .single();
  if (error) throw new Error(error.message);
  return data as MenuProductRow;
}

export async function updateMenuProduct(id: string, patch: Partial<MenuProductInput>) {
  const { data, error } = await supabase
    .from("menu_products")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(MENU_COLUMNS)
    .single();
  if (error) throw new Error(error.message);
  return data as MenuProductRow;
}

export async function deleteMenuProduct(id: string) {
  const { error } = await supabase.from("menu_products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type OrderInsert = {
  name: string;
  phone: string;
  fulfillment: "pickup" | "delivery";
  address?: string;
  payment: "wave" | "orange_money" | "cash";
  subtotal: number;
  delivery_fee: number;
  total: number;
};

export type OrderItemInsert = {
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type ReservationInsert = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  message?: string;
};

export async function createOrder(
  order: OrderInsert,
  items: Omit<OrderItemInsert, "order_id">[],
): Promise<string> {
  const { data, error } = await supabase.from("orders").insert(order).select("id").single();

  if (error) throw new Error(error.message);

  const orderId = data.id as string;
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: orderId })));

  if (itemsError) throw new Error(itemsError.message);
  return orderId;
}

export async function createReservation(reservation: ReservationInsert): Promise<string> {
  const { data, error } = await supabase
    .from("reservations")
    .insert(reservation)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

export type SiteMediaRow = {
  id: string;
  label: string;
  slot: string;
  media_type: "image" | "video";
  url: string;
  alt_text: string;
  is_visible: boolean;
  sort_order: number;
};

export async function fetchSiteMedia(): Promise<SiteMediaRow[]> {
  const { data, error } = await supabase
    .from("site_media_assets")
    .select("id,label,slot,media_type,url,alt_text,is_visible,sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SiteMediaRow[];
}

export async function saveSiteMedia(media: SiteMediaRow) {
  const { error } = await supabase.from("site_media_assets").upsert(media, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function uploadSiteMedia(file: File, mediaKey: string) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];
  if (!allowed.includes(file.type))
    throw new Error("Format non pris en charge. Utilisez JPG, PNG, WebP, MP4, WebM ou MOV.");
  if (file.size > 50 * 1024 * 1024) throw new Error("Le fichier dépasse la limite de 50 Mo.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `site/${mediaKey}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export async function uploadMenuProductMedia(file: File, productId: string) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) throw new Error("Utilisez une image JPG, PNG, WebP ou AVIF.");
  if (file.size > 10 * 1024 * 1024) throw new Error("L’image dépasse la limite de 10 Mo.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `menu/${productId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("site-media")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export type MenuCategoryRow = { id: string; name: string; sort_order: number };

export async function fetchMenuCategories(): Promise<MenuCategoryRow[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("id,name,sort_order")
    .order("sort_order")
    .order("name")
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuCategoryRow[];
}

export async function createMenuCategory(name: string): Promise<MenuCategoryRow> {
  const id = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const { data, error } = await supabase
    .from("menu_categories")
    .insert({ id, name })
    .select("id,name,sort_order")
    .single();
  if (error) throw new Error(error.message);
  return data as MenuCategoryRow;
}

export async function deleteMenuCategory(id: string) {
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
