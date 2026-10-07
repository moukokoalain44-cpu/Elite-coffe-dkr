import { MENU_CATEGORIES, PRODUCT_CATALOG, type MenuCategory } from "./catalog";
const u = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND = { name: "Elite Coffee", handle: "Elite Coffee" };

export const NAV = [
  { label: "Accueil", id: "home" },
  { label: "Carte", id: "menu" },
  { label: "À propos", id: "about" },
  { label: "Récompenses", id: "rewards" },
  { label: "Adresses", id: "locations" },
  { label: "Contact", id: "contact" },
];

export const STATS = [
  { value: "07h", label: "Ouverture tous les jours" },
  { value: "9 500 FCFA", label: "Formule déjeuner · lundi au vendredi" },
  { value: "Cité Keur Gorgui", label: "Dakar, Sénégal" },
];
export const BEST_SELLERS = PRODUCT_CATALOG.filter(p => ["Café expresso", "Café glacé caramel", "Milkshake fruits rouges"].includes(p.name)).map(p => ({ name: p.name, desc: p.description, price: p.price, img: p.image, tag: p.category, featured: p.name === "Café expresso" }));
export const CATEGORIES = MENU_CATEGORIES;
export type Category = MenuCategory;
export const MENU = PRODUCT_CATALOG.map(p => ({ name: p.name, category: p.category, price: p.price, img: p.image }));

export const ESPRESSO_IMG = u("photo-1511920170033-f8396924c348", 1000);

export const INSTAGRAM = [
  { img: u("photo-1534778101976-62847782c213", 600), alt: "Latte art" },
  { img: u("photo-1509440159596-0249088772ff", 600), alt: "Pâtisseries fraîches" },
  { img: u("photo-1554118811-1e0d58224f24", 600), alt: "Intérieur du café" },
  { img: u("photo-1447933601403-0c6688de566e", 600), alt: "Grains de café" },
  { img: u("photo-1495474472287-4d71bcdd2085", 600), alt: "Main tenant une tasse" },
  { img: u("photo-1497515114629-f71d768fd07c", 600), alt: "Latte dans une tasse rouge" },
];

export const CONTACT = {
  phone: "+221 33 824 96 93",
  phones: ["+221 33 824 96 93", "+221 77 506 39 39", "+221 77 507 36 36"],
  address: "Cité Keur Gorgui, Dakar, Sénégal",
  landmark: "Après la boutique Canal+",
  hours: ["Lundi–jeudi : 07h – 23h", "Vendredi–dimanche : 07h – 00h"],
  website: "https://www.elite-coffee.eatbu.com",
  sourceNote: "Coordonnées et horaires issus des infos pratiques de mars 2022 ; carte fournie de mai 2024.",
};

export const FOOTER = {
  Explorer: ["Carte", "Adresses", "Récompenses", "Traiteur"],
  Aide: ["Cartes cadeaux", "FAQ", "Contact"],
  Légal: ["Politique de confidentialité", "Conditions d'utilisation", "Cookies"],
};
