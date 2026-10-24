import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
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
