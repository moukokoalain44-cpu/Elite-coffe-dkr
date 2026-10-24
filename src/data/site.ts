import { MENU_CATEGORIES, PRODUCT_CATALOG, type MenuCategory } from "./catalog";

export const BRAND = {
  name: "Elite Coffee",
  handle: "@elitecoffee_dkr",
  tagline: "Restaurant · Brunch · Glacier",
  instagram: "https://www.instagram.com/elitecoffee_dkr/?hl=fr",
  facebook: "https://www.facebook.com/p/Elite-Coffee-Restaurant-100062907903923/",
};

export const NAV = [
  { label: "Accueil", id: "home" },
  { label: "Carte", id: "menu" },
  { label: "À propos", id: "about" },
  { label: "Adresses", id: "locations" },
  { label: "Contact", id: "contact" },
];

export const STATS = [
  { value: "08h", label: "Ouverture tous les jours" },
  { value: "09h–17h", label: "Brunch tous les jours" },
  { value: "BRT", label: "À l’entrée de Keur Gorgui" },
];

export const BEST_SELLERS = PRODUCT_CATALOG.filter((p) =>
  ["Café expresso", "Café glacé caramel", "Milkshake fruits rouges"].includes(p.name),
).map((p) => ({
  name: p.name,
  desc: p.description,
  price: p.price,
  img: p.image,
  tag: p.category,
  featured: p.name === "Café expresso",
}));
export const CATEGORIES = MENU_CATEGORIES;
export type Category = MenuCategory;
export const MENU = PRODUCT_CATALOG.map((p) => ({
  name: p.name,
  category: p.category,
  price: p.price,
  img: p.image,
}));

export const MENU_SECTIONS: { label: string; categories: MenuCategory[]; intro: string }[] = [
  {
    label: "Matin & brunch",
    categories: ["Petit déjeuner", "Formule déjeuner", "Pâtisseries et viennoiseries"],
    intro: "Café, œufs, viennoiseries et formules généreuses pour bien commencer.",
  },
  {
    label: "À boire",
    categories: [
      "Cafés chauds",
      "Cafés glacés",
      "Infusions de thé",
      "Boissons chaudes",
      "Cocktails",
      "Smoothies",
      "Jus locaux",
      "Jus détox",
      "Milkshakes",
      "Boissons gazeuses",
      "Jus en brique",
    ],
    intro: "Cafés, jus, cocktails et boissons fraîches préparés à la commande.",
  },
  {
    label: "Déjeuner & dîner",
    categories: [
      "Entrées",
      "Cuisine du monde",
      "Viandes",
      "Volailles",
      "Poissons et fruits de mer",
      "Pâtes",
      "Pizzas",
    ],
    intro: "Une cuisine généreuse entre grillades, recettes du monde et produits de la mer.",
  },
  {
    label: "Sur le pouce",
    categories: ["Crêpes", "Club sandwichs et paninis", "Toasts"],
    intro: "Des recettes faciles à partager ou à savourer rapidement.",
  },
  {
    label: "La touche sucrée",
    categories: ["Desserts", "Plats du jour ponctuels"],
    intro: "Une fin gourmande et quelques suggestions selon les disponibilités.",
  },
];

export const INSTAGRAM_REELS = [
  {
    url: "https://www.instagram.com/elitecoffee_dkr/reel/DX45KTqsgVj/",
    title: "Comment nous trouver",
    text: "Depuis le rond-point de la Cité Keur Gorgui, retrouvez Elite Coffee pour bruncher, chiller et bien manger.",
  },
  {
    url: "https://www.instagram.com/elitecoffee_dkr/reel/DXAbjMaDSun/",
    title: "La référence brunch à Dakar",
    text: "Un lieu chaleureux où saveurs, convivialité et bonne ambiance se rencontrent.",
  },
];

export const ESPRESSO_IMG = "/assets/instagram/coffee-dessert.jpg";

export const INSTAGRAM = [
  {
    img: "/assets/instagram/hero-brunch.jpg",
    alt: "Nouvelle carte brunch Elite Coffee",
    source: "https://www.instagram.com/elitecoffee_dkr/p/Dbn08xcDcl4/",
  },
  {
    img: "/assets/instagram/brunch-table.jpg",
    alt: "Table brunch Elite Coffee",
    source: "https://www.instagram.com/elitecoffee_dkr/p/DeaRmE7jUDh/",
  },
  {
    img: "/assets/instagram/coffee-dessert.jpg",
    alt: "Café et douceur Elite Coffee",
    source: "https://www.instagram.com/elitecoffee_dkr/p/DdL1xfmjaDN/",
  },
  {
    img: "/assets/instagram/smoothie-video.jpg",
    alt: "Cappuccino et smoothie Elite Coffee",
    source: "https://www.instagram.com/elitecoffee_dkr/reel/Dbn145cNB0B/",
  },
  {
    img: "/assets/instagram/dessert-toast.jpg",
    alt: "Toast et dessert Elite Coffee",
    source: "https://www.instagram.com/elitecoffee_dkr/p/Dbfla7-ty29/",
  },
];

export const CONTACT = {
  phone: "+221 33 824 96 93",
  phones: ["+221 33 824 96 93", "+221 77 506 39 39", "+221 77 507 36 36"],
  email: "elitecoffee2021@gmail.com",
  address: "À l’entrée de la Cité Keur Gorgui, Dakar",
  landmark: "Sur la route du Collège Sacré-Cœur, près du BRT",
  hours: ["Lundi–jeudi : 08h – 23h", "Vendredi–dimanche : 08h – 00h"],
  website: "https://www.elite-coffee.eatbu.com",
  sourceNote:
    "Horaires et coordonnées vérifiés sur les canaux publics d’Elite Coffee en octobre 2026.",
};

export const FOOTER = {
  Explorer: ["Carte", "Adresses", "Traiteur"],
  Aide: ["FAQ", "Contact"],
  Légal: ["Politique de confidentialité", "Conditions d'utilisation", "Cookies"],
};
