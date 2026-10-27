import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCT_CATALOG, type Product } from "@/data/catalog";

export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export function canUpdateRegistrationStatus(from: RegistrationStatus, to: RegistrationStatus) {
  if (from === to) return true;
  if (from === "pending") return to === "confirmed" || to === "cancelled";
  if (from === "confirmed") return to === "cancelled";
  return false;
}

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
  {
    id: "RES-1048",
    name: "Awa Ndiaye",
    phone: "+221 77 520 14 88",
    date: "2026-10-22",
    time: "12:30",
    guests: 4,
    occasion: "Déjeuner professionnel",
    message: "Une table au calme si possible.",
    status: "confirmed",
    createdAt: "2026-10-19T09:12:00",
  },
  {
    id: "RES-1047",
    name: "Mamadou Fall",
    phone: "+221 76 401 29 14",
    date: "2026-10-22",
    time: "19:00",
    guests: 2,
    occasion: "Table classique",
    message: "",
    status: "pending",
    createdAt: "2026-10-19T08:46:00",
  },
  {
    id: "RES-1046",
    name: "Fatou Seck",
    phone: "+221 78 214 66 02",
    date: "2026-10-23",
    time: "10:00",
    guests: 6,
    occasion: "Anniversaire",
    message: "Prévoir une petite attention.",
    status: "pending",
    createdAt: "2026-10-18T16:20:00",
  },
  {
    id: "RES-1045",
    name: "Ibrahima Ba",
    phone: "+221 70 889 32 10",
    date: "2026-10-20",
    time: "13:00",
    guests: 3,
    occasion: "Petit déjeuner",
    message: "",
    status: "cancelled",
    createdAt: "2026-10-18T11:04:00",
  },
  {
    id: "RES-1044",
    name: "Ndeye Sarr",
    phone: "+221 77 432 11 90",
    date: "2026-10-21",
    time: "18:30",
    guests: 8,
    occasion: "Événement privé",
    message: "Nous venons avec deux enfants.",
    status: "confirmed",
    createdAt: "2026-10-17T14:32:00",
  },
];

const initialContent: SiteContent = {
  heroTitle: "Restaurant, brunch & glacier à Dakar",
  heroDescription:
    "Une cuisine généreuse, des brunchs gourmands et des pauses café à l’entrée de la Cité Keur Gorgui.",
  address: "À l’entrée de la Cité Keur Gorgui, sur la route du Collège Sacré-Cœur",
  phone: "+221 33 824 96 93",
  hours: "Lundi–jeudi : 08h – 23h · Vendredi–dimanche : 08h – 00h",
  lunchOffer: "Brunchs gourmands tous les jours de 09h à 17h",
  aboutTitle: "Une adresse qui rassemble",
  aboutText:
    "Un restaurant chaleureux à Dakar pour bruncher, déjeuner, prendre un café ou organiser un moment privé.",
};

type AdminContextValue = {
  registrations: Registration[];
  products: Product[];
  content: SiteContent;
  addRegistration: (registration: Registration) => void;
  updateRegistration: (id: string, patch: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState(seedRegistrations);
  const [products, setProducts] = useState(PRODUCT_CATALOG);
  const [content, setContent] = useState(initialContent);
  const value = useMemo<AdminContextValue>(
    () => ({
      registrations,
      products,
      content,
      addRegistration: (registration) => setRegistrations((items) => [registration, ...items]),
      updateRegistration: (id, patch) =>
        setRegistrations((items) =>
          items.map((item) => {
            if (item.id !== id) return item;
            if (patch.status && !canUpdateRegistrationStatus(item.status, patch.status)) return item;
            return { ...item, ...patch };
          }),
        ),
      deleteRegistration: (id) =>
        setRegistrations((items) => items.filter((item) => item.id !== id)),
      updateProduct: (id, patch) =>
        setProducts((items) =>
          items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        ),
      updateContent: (patch) => setContent((current) => ({ ...current, ...patch })),
    }),
    [registrations, products, content],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used inside AdminProvider");
  return value;
}
