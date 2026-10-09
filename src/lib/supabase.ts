import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Elite Coffee] Variables d'environnement Supabase manquantes.\n" +
      "Créez un fichier .env.local à la racine avec :\n" +
      "  VITE_SUPABASE_URL=https://xxxx.supabase.co\n" +
      "  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Crée une commande + ses lignes dans Supabase */
export async function createOrder(
  order: OrderInsert,
  items: Omit<OrderItemInsert, "order_id">[],
): Promise<string> {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const orderId = data.id as string;

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: orderId })));

  if (itemsError) throw new Error(itemsError.message);

  return orderId;
}

/** Crée une réservation dans Supabase */
export async function createReservation(
  reservation: ReservationInsert,
): Promise<string> {
  const { data, error } = await supabase
    .from("reservations")
    .insert(reservation)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}
