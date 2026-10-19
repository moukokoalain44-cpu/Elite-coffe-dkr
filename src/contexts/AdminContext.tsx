import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCT_CATALOG, type Product } from "@/data/catalog";

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

export type Registration = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  message: string;
  status: RegistrationStatus;
  createdAt: string;
};

export type AdminOrder = {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  fulfillment: "pickup" | "delivery";
  status: OrderStatus;
};

export type SiteContent = {
  heroTitle: string;
  heroDescription: string;
  address: string;
  phone: string;
  hours: string;
  lunchOffer: string;
  aboutTitle: string;
  aboutText: string;
};

const seedRegistrations: Registration[] = [
  { id: "RES-1048", name: "Awa Ndiaye", phone: "+221 77 520 14 88", date: "2026-10-22", time: "12:30", guests: 4, occasion: "Déjeuner professionnel", message: "Une table au calme si possible.", status: "confirmed", createdAt: "2026-10-19T09:12:00" },
  { id: "RES-1047", name: "Mamadou Fall", phone: "+221 76 401 29 14", date: "2026-10-22", time: "19:00", guests: 2, occasion: "Table classique", message: "", status: "pending", createdAt: "2026-10-19T08:46:00" },
  { id: "RES-1046", name: "Fatou Seck", phone: "+221 78 214 66 02", date: "2026-10-23", time: "10:00", guests: 6, occasion: "Anniversaire", message: "Prévoir une petite attention.", status: "pending", createdAt: "2026-10-18T16:20:00" },
  { id: "RES-1045", name: "Ibrahima Ba", phone: "+221 70 889 32 10", date: "2026-10-20", time: "13:00", guests: 3, occasion: "Petit déjeuner", message: "", status: "cancelled", createdAt: "2026-10-18T11:04:00" },
  { id: "RES-1044", name: "Ndeye Sarr", phone: "+221 77 432 11 90", date: "2026-10-21", time: "18:30", guests: 8, occasion: "Événement privé", message: "Nous venons avec deux enfants.", status: "confirmed", createdAt: "2026-10-17T14:32:00" },
];

const seedOrders: AdminOrder[] = [
  { id: "CMD-7849", customer: "Aminata Diop", date: "2026-10-19", items: 3, total: 9500, fulfillment: "delivery", status: "preparing" },
  { id: "CMD-7848", customer: "Cheikh Kane", date: "2026-10-19", items: 2, total: 5000, fulfillment: "pickup", status: "confirmed" },
  { id: "CMD-7847", customer: "Sokhna Mbaye", date: "2026-10-18", items: 5, total: 14500, fulfillment: "delivery", status: "delivered" },
  { id: "CMD-7846", customer: "Ousmane Thiam", date: "2026-10-18", items: 1, total: 2500, fulfillment: "pickup", status: "pending" },
  { id: "CMD-7845", customer: "Marième Sow", date: "2026-10-17", items: 4, total: 11000, fulfillment: "delivery", status: "cancelled" },
];

const initialContent: SiteContent = {
  heroTitle: "Elite Coffee Dakar",
  heroDescription: "Cafés, cocktails, crêpes, sandwiches et petits déjeuners à la Cité Keur Gorgui.",
  address: "Cité Keur Gorgui, après la boutique Canal+",
  phone: "+221 33 824 96 93",
  hours: "Lundi–jeudi : 07h – 23h · Vendredi–dimanche : 07h – 00h",
  lunchOffer: "Formule déjeuner à 9 500 FCFA du lundi au vendredi",
  aboutTitle: "Un café qui rassemble",
  aboutText: "Un lieu chaleureux à Dakar pour ralentir, travailler, déjeuner et partager.",
};

type AdminContextValue = {
  registrations: Registration[];
  orders: AdminOrder[];
  products: Product[];
  content: SiteContent;
  addRegistration: (registration: Registration) => void;
  updateRegistration: (id: string, patch: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState(seedRegistrations);
  const [orders, setOrders] = useState(seedOrders);
  const [products, setProducts] = useState(PRODUCT_CATALOG);
  const [content, setContent] = useState(initialContent);
  const value = useMemo<AdminContextValue>(() => ({
    registrations,
    orders,
    products,
    content,
    addRegistration: (registration) => setRegistrations((items) => [registration, ...items]),
    updateRegistration: (id, patch) => setRegistrations((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
    deleteRegistration: (id) => setRegistrations((items) => items.filter((item) => item.id !== id)),
    updateOrderStatus: (id, status) => setOrders((items) => items.map((item) => item.id === id ? { ...item, status } : item)),
    updateProduct: (id, patch) => setProducts((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
    updateContent: (patch) => setContent((current) => ({ ...current, ...patch })),
  }), [registrations, orders, products, content]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used inside AdminProvider");
  return value;
}
