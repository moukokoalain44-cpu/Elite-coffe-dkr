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

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  global: {
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  },
});

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
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  message?: string;
};

export type ReservationRow = Omit<ReservationInsert, "email"> & {
  email: string | null;
  id: string;
  created_at: string;
  status: "pending" | "confirmed" | "cancelled";
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

export async function createReservation(
  reservation: ReservationInsert,
  customerSource: "reservation" | "buffet" = "reservation",
): Promise<string> {
  const { data, error } = await supabase.rpc("create_reservation", {
    p_name: reservation.name,
    p_phone: reservation.phone,
    p_email: reservation.email,
    p_date: reservation.date,
    p_time: reservation.time,
    p_guests: reservation.guests,
    p_occasion: reservation.occasion ?? null,
    p_message: reservation.message ?? null,
    p_customer_source: customerSource,
  });

  if (error) throw new Error(error.message);
  return data as string;
}

export async function fetchReservationsAdmin(): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("id,created_at,name,phone,email,date,time,guests,occasion,message,status")
    .order("date", { ascending: true })
    .order("time", { ascending: true })
    .limit(1000);
  if (error) throw new Error(error.message);
  return (data ?? []) as ReservationRow[];
}

export async function updateReservationStatus(id: string, status: ReservationRow["status"]) {
  const { error } = await supabase.rpc("update_reservation_status", {
    p_reservation_id: id,
    p_status: status,
  });
  if (error) throw new Error(error.message);
}

export type ReservationDetailsUpdate = Partial<
  Pick<
    ReservationInsert,
    "name" | "phone" | "email" | "date" | "time" | "guests" | "occasion" | "message"
  >
>;

export async function updateReservationDetails(id: string, details: ReservationDetailsUpdate) {
  const { error } = await supabase.rpc("update_reservation_details", {
    p_reservation_id: id,
    p_details: details,
  });
  if (error) throw new Error(error.message);
}

export async function deleteReservation(id: string) {
  const { error } = await supabase.rpc("delete_reservation", {
    p_reservation_id: id,
  });
  if (error) throw new Error(error.message);
}

export type CustomerInput = { name: string; email?: string; phone: string; source: string };
export type CustomerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  created_at: string;
  last_contact_at: string | null;
};

export async function registerCustomer(customer: CustomerInput) {
  const result =
    customer.phone === "non renseigné"
      ? await supabase.from("customers").insert(customer)
      : await supabase.from("customers").upsert(customer, { onConflict: "phone" });
  const { error } = result;
  if (error && !error.message.toLowerCase().includes("duplicate")) throw new Error(error.message);
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw new Error(error.message);
}

export async function fetchCustomersAdmin(): Promise<CustomerRow[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id,name,email,phone,source,created_at,last_contact_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return (data ?? []) as CustomerRow[];
}

export async function fetchCustomersAdminCount(): Promise<number> {
  const { count, error } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export type CommunicationCampaign = {
  id: string;
  name: string;
  audience: string;
  channel: string;
  message: string;
  status: string;
  scheduled_for: string | null;
  total_recipients: number;
  created_at: string;
};

export async function fetchCommunicationCampaigns(): Promise<CommunicationCampaign[]> {
  const { data, error } = await supabase
    .from("communication_campaigns")
    .select("id,name,audience,channel,message,status,scheduled_for,total_recipients,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as CommunicationCampaign[];
}

export type CommunicationDeliveryLog = {
  id: string;
  campaign_id: string | null;
  phone: string;
  message: string;
  ultramsg_request_id: number | null;
  status: "queued" | "sent" | "delivered" | "read" | "failed";
  created_at: string;
};
export async function fetchCommunicationDeliveryLogs(): Promise<CommunicationDeliveryLog[]> {
  const { data, error } = await supabase
    .from("communication_delivery_log")
    .select("id,campaign_id,phone,message,ultramsg_request_id,status,created_at")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []) as CommunicationDeliveryLog[];
}

export async function saveCommunicationCampaign(input: {
  id?: string;
  name: string;
  audience: string;
  channel: string;
  message: string;
  status: string;
  scheduled_for?: string | null;
  total_recipients?: number;
}) {
  const { data, error } = await supabase
    .from("communication_campaigns")
    .upsert(input)
    .select("id,name,audience,channel,message,status,scheduled_for,total_recipients,created_at")
    .single();
  if (error) throw new Error(error.message);
  return data as CommunicationCampaign;
}

export async function sendUltramsgMessage(input: {
  phone: string;
  message: string;
  campaignId?: string | null;
}) {
  const { data, error } = await supabase.rpc("send_ultramsg_message", {
    p_phone: input.phone,
    p_message: input.message,
    p_campaign_id: input.campaignId ?? null,
  });
  if (error) throw new Error(error.message);
  return data as number;
}

export async function createReservationFollowup(input: {
  reservation_id: string;
  customer_id?: string;
  kind: string;
  scheduled_for?: string;
}) {
  const { error } = await supabase
    .from("reservation_followups")
    .upsert(
      { ...input, channel: "whatsapp", status: "pending" },
      { onConflict: "reservation_id,kind" },
    );
  if (error) throw new Error(error.message);
}

export type ReservationFollowup = {
  id: string;
  reservation_id: string;
  kind: string;
  channel: string;
  scheduled_for: string;
  status: string;
  sent_at: string | null;
};
export async function fetchReservationFollowups(): Promise<ReservationFollowup[]> {
  const { data, error } = await supabase
    .from("reservation_followups")
    .select("id,reservation_id,kind,channel,scheduled_for,status,sent_at")
    .order("scheduled_for", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as ReservationFollowup[];
}
export async function markFollowupSent(id: string) {
  const { error } = await supabase
    .from("reservation_followups")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export type ReservationMessageLog = {
  id: string;
  reservation_id: string;
  event_type: "request_received" | "confirmed" | "cancelled";
  phone: string;
  message: string;
  ultramsg_request_id: number | null;
  status: "queued" | "failed";
  error_message: string | null;
  created_at: string;
};
export async function fetchReservationMessageLogs(): Promise<ReservationMessageLog[]> {
  const { data, error } = await supabase
    .from("reservation_message_log")
    .select(
      "id,reservation_id,event_type,phone,message,ultramsg_request_id,status,error_message,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as ReservationMessageLog[];
}

export async function fetchReservationMessageLogCount(): Promise<number> {
  const { count, error } = await supabase
    .from("reservation_message_log")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
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

async function optimizeImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || typeof window === "undefined") return file;

  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.decoding = "async";
    image.src = sourceUrl;
    await image.decode();

    const maxDimension = 2000;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82),
    );
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
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
  const preparedFile = await optimizeImageForUpload(file);
  if (!allowed.includes(preparedFile.type))
    throw new Error("Format non pris en charge. Utilisez JPG, PNG, WebP, MP4, WebM ou MOV.");
  if (preparedFile.size > 50 * 1024 * 1024) throw new Error("Le fichier dépasse la limite de 50 Mo.");
  const extension = preparedFile.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `site/${mediaKey}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, preparedFile, {
    cacheControl: "31536000",
    contentType: preparedFile.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

/** Téléverse une image avant la sauvegarde du produit, comme le parcours KeurGui. */
export async function uploadMenuProductMedia(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) throw new Error("Utilisez une image JPG, PNG, WebP ou AVIF.");
  if (file.size > 10 * 1024 * 1024) throw new Error("L’image dépasse la limite de 10 Mo.");

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(`Session Supabase invalide : ${sessionError.message}`);
  let session = sessionData.session;
  if (!session) throw new Error("Session administrateur absente. Reconnectez-vous au back-office.");

  if ((session.expires_at ?? 0) * 1000 <= Date.now() + 30_000) {
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.error || !refreshed.data.session) {
      throw new Error("Session administrateur expirée. Reconnectez-vous au back-office.");
    }
    session = refreshed.data.session;
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw new Error(`Vérification administrateur impossible : ${adminError.message}`);
  if (!isAdmin) throw new Error("Accès administrateur requis pour téléverser une image.");

  const extension = (file.name.split(".").pop() ?? "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `plats/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension || "jpg"}`;
  const { error } = await supabase.storage.from("menu-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(`Téléversement de l’image impossible : ${error.message}`);
  return path;
}

export async function removeMenuProductMedia(path: string) {
  const { error } = await supabase.storage.from("menu-images").remove([path]);
  if (error) throw new Error(error.message);
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
