const u = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND = { name: "Elite Coffee", handle: "@elitecoffee" };

export const NAV = [
  { label: "Accueil", id: "home" },
  { label: "Carte", id: "menu" },
  { label: "À propos", id: "about" },
  { label: "Récompenses", id: "rewards" },
  { label: "Adresses", id: "locations" },
  { label: "Avis", id: "reviews" },
  { label: "Contact", id: "contact" },
];

export const STATS = [
  { value: 1250, label: "Avis clients" },
  { value: 3500, label: "Commandes ce mois-ci" },
  { value: 150, label: "Articles à la carte" },
];

export const BEST_SELLERS = [
  { name: "Création Signature", desc: "Notre mélange maison avec une mousse veloutée, du miel et une pointe de cannelle.", price: 6.5, rating: 4.9, tag: "Spécial", featured: true, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80" },
  { name: "Latte Caramel", desc: "Espresso onctueux, lait vapeur et caramel au beurre fait maison.", price: 5.25, rating: 4.8, tag: "Populaire", img: u("photo-1461023058943-07fcbe16d735") },
  { name: "Cold Brew Moka", desc: "Infusion à froid de 18 heures, chocolat noir et une touche de crème.", price: 5.75, rating: 4.9, tag: "Glacé", img: u("photo-1517701604599-bb29b565090c") },
];

export const CATEGORIES = ["Espresso", "Latte", "Cappuccino", "Cold Brew"] as const;
export type Category = (typeof CATEGORIES)[number];

export const MENU: { name: string; category: Category; price: number; img: string }[] = [
  { name: "Espresso Classique", category: "Espresso", price: 3.0, img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80" },
  { name: "Doppio", category: "Espresso", price: 3.75, img: u("photo-1579992357154-faf4bde95b3d") },
  { name: "Macchiato", category: "Espresso", price: 4.0, img: u("photo-1485808191679-5f86510681a2") },
  { name: "Latte Vanille", category: "Latte", price: 5.0, img: u("photo-1570968915860-54d5c301fa9f") },
  { name: "Latte Avoine-Miel", category: "Latte", price: 5.5, img: u("photo-1541167760496-1628856ab772") },
  { name: "Latte Matcha", category: "Latte", price: 5.25, img: u("photo-1515823064-d6e0c04616a7") },
  { name: "Cappuccino Classique", category: "Cappuccino", price: 4.5, img: u("photo-1534778101976-62847782c213") },
  { name: "Cappuccino Cannelle", category: "Cappuccino", price: 4.75, img: u("photo-1509042239860-f550ce710b93") },
  { name: "Cappuccino Sec", category: "Cappuccino", price: 4.5, img: u("photo-1572286258217-215cf8e7e0d2") },
  { name: "Cold Brew Original", category: "Cold Brew", price: 4.5, img: u("photo-1461023058943-07fcbe16d735") },
  { name: "Cold Brew Nitro", category: "Cold Brew", price: 5.25, img: u("photo-1517701604599-bb29b565090c") },
  { name: "Cold Brew Crème Salée", category: "Cold Brew", price: 5.5, img: u("photo-1592663527359-cf6642f54cff") },
];

export const ESPRESSO_IMG = u("photo-1511920170033-f8396924c348", 1000);

export const REVIEWS = [
  { quote: "Le latte caramel est irréel. Chaque visite est un petit rituel que j'attends toute la semaine.", name: "Sarah Mitchell", role: "Cliente fidèle", avatar: u("photo-1494790108377-be9c29b7d6f2") },
  { quote: "Le meilleur espresso de la ville, sans hésiter. Les baristas soignent vraiment chaque tasse.", name: "James Carter", role: "Amateur de café", avatar: u("photo-1507003211169-0a1dd7228f2d") },
  { quote: "Endroit chaleureux, commande en ligne rapide, et le cold brew moka m'a sauvée pendant mes examens.", name: "Emily Chen", role: "Étudiante", avatar: u("photo-1438761681033-6461ffad8d8d") },
];

export const AVATARS = REVIEWS.map((r) => r.avatar).concat(u("photo-1500648767791-00dcc994a43e", 120));

export const INSTAGRAM = [
  { img: u("photo-1534778101976-62847782c213", 600), alt: "Latte art" },
  { img: u("photo-1509440159596-0249088772ff", 600), alt: "Pâtisseries fraîches" },
  { img: u("photo-1554118811-1e0d58224f24", 600), alt: "Intérieur du café" },
  { img: u("photo-1447933601403-0c6688de566e", 600), alt: "Grains de café" },
  { img: u("photo-1495474472287-4d71bcdd2085", 600), alt: "Main tenant une tasse" },
  { img: u("photo-1497515114629-f71d768fd07c", 600), alt: "Latte dans une tasse rouge" },
];

export const CONTACT = {
  email: "hello@elitecoffee.com",
  phone: "(555) 123-4567",
  address: "123 Roast Street, Brewville, CA 90210",
  hours: ["Lun–Ven : 6h30 – 20h", "Sam–Dim : 7h30 – 21h"],
};

export const FOOTER = {
  Explorer: ["Carte", "Adresses", "Récompenses", "Traiteur"],
  Aide: ["Cartes cadeaux", "FAQ", "Contact"],
  Légal: ["Politique de confidentialité", "Conditions d'utilisation", "Cookies"],
};
