export const MENU_CATEGORIES = [
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
  "Formule déjeuner",
  "Plats du jour ponctuels",
  "Pâtisseries et viennoiseries",
  "Petit déjeuner",
  "Entrées",
  "Cuisine du monde",
  "Viandes",
  "Volailles",
  "Poissons et fruits de mer",
  "Pâtes",
  "Pizzas",
  "Crêpes",
  "Club sandwichs et paninis",
  "Toasts",
  "Desserts",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export type PriceOption = {
  label: string;
  price: number;
  minQuantity?: number;
};

export type Product = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  priceOptions?: PriceOption[];
  availabilityNote?: string;
  featured?: boolean;
};

export type MenuEntry = Omit<Product, "id">;

const entry = (
  category: MenuCategory,
  name: string,
  price: number,
  description = "",
  options?: PriceOption[],
  availabilityNote?: string,
): MenuEntry => ({
  name,
  category,
  price,
  description,
  ...(options ? { priceOptions: options } : {}),
  ...(availabilityNote ? { availabilityNote } : {}),
});

export const MENU_ENTRIES: MenuEntry[] = [
  // Cafés et thés
  entry("Cafés chauds", "Café allongé", 1500),
  entry("Cafés chauds", "Café au lait", 2000),
  entry("Cafés chauds", "Café expresso", 1500),
  entry("Cafés chauds", "Cappucino", 2500),
  entry("Cafés chauds", "Double expresso", 3000),
  entry("Cafés glacés", "Café glacé", 2000),
  entry("Cafés glacés", "Café glacé vanille", 2500),
  entry("Cafés glacés", "Café glacé caramel", 2500),
  entry("Infusions de thé", "Thé Noir aromatisé", 2000),
  entry("Infusions de thé", "Thé 4 fruits rouge", 2000),
  entry("Infusions de thé", "Thé vert", 2000),
  entry("Infusions de thé", "Thé Elite", 2000),
  entry("Boissons chaudes", "Chocolat chaud", 2500),
  entry("Boissons chaudes", "Cacao chaud", 2000),
  entry("Boissons chaudes", "Chocolat chaud à la vanille", 3000),
  entry("Boissons chaudes", "Chocolat chaud au caramel", 3000),
  entry("Boissons chaudes", "Chocolat chaud à la cannelle", 3000),

  // Cocktails, smoothies et jus
  entry(
    "Cocktails",
    "Virgin au choix",
    4000,
    "Fraise, framboise, passion, citron vert, menthe, soda, glaçons.",
  ),
  entry("Cocktails", "Virgin colada", 4000, "Lait de coco, crème fraîche, ananas, glaçons."),
  entry("Cocktails", "Elite", 4000, "Passion, fraise, mangue."),
  entry("Cocktails", "La branche", 4000, "Orange, ananas, lait de coco, grenadine."),
  entry("Cocktails", "Meduse", 3500, "Mangue, orange, ananas, citron, grenadine."),
  entry("Cocktails", "Douceurs des iles", 3500, "Fraise, goyave, mangue, ananas, citron."),
  entry("Cocktails", "Florida", 3500, "Gingembre, bouye, bissap, ananas."),
  entry("Cocktails", "La Sénégalaise", 3500, "Goya, bouye, bissap, grenadine."),
  entry("Smoothies", "Victoria", 4500, "Purée de fraise, framboise, ananas, basilic."),
  entry("Smoothies", "Diangoma", 4500, "Fruits rouges, bissap, menthe, citron, goyave."),
  entry("Smoothies", "Fresh over", 4500, "Passion, ananas, banane, menthe."),
  entry("Smoothies", "Légu", 4500, "Mangue, passion, ananas, menthe."),
  entry("Smoothies", "Aube Passion", 4500, "Passion, ananas, mangue, citron."),
  entry("Smoothies", "Sligo River", 4500, "Fraise, banane, lait, chantilly."),
  entry("Smoothies", "Smoothie du jour", 5000),
  entry("Jus locaux", "Bouye", 1000),
  entry("Jus locaux", "Bissap", 1000),
  entry("Jus locaux", "Gingembre", 1500),
  entry("Jus locaux", "Tamarin", 1500),
  entry("Jus locaux", "Jus de citron", 2000),
  entry("Jus locaux", "Jus d’orange pressé", 3000),
  entry("Jus locaux", "Jus de pamplemousse pressé", 3000),
  entry("Jus locaux", "Corossol", 1500),
  entry("Jus locaux", "Ditakh", 1500),
  entry("Jus détox", "Délice", 4000, "Pomme, concombre, gingembre, menthe."),
  entry("Jus détox", "Teranga", 3500, "Betterave, ananas, carotte, pastèque."),
  entry("Jus détox", "Tima", 3500, "Carotte, gingembre, ananas, pastèque, citron."),
  entry("Milkshakes", "Milkshake vanille", 3500),
  entry("Milkshakes", "Milkshake chocolat", 3500),
  entry("Milkshakes", "Milkshake coco", 3500),
  entry("Milkshakes", "Milkshake Kinder", 3500),
  entry("Milkshakes", "Milkshake fruits rouges", 3500),
  entry("Milkshakes", "Milkshake fraise", 3500),
  entry("Boissons gazeuses", "Coca-Cola", 1500),
  entry("Boissons gazeuses", "Sprite", 1500),
  entry("Boissons gazeuses", "Coca zéro", 1500),
  entry("Boissons gazeuses", "Fanta", 1500),
  entry("Boissons gazeuses", "Tonic agrumes", 1500),
  entry("Boissons gazeuses", "Tonic citron", 1500),
  entry("Jus en brique", "Jus en brique — mangue", 1500),
  entry("Jus en brique", "Jus en brique — goyave", 1500),
  entry("Jus en brique", "Jus en brique — ananas", 1500),
  entry("Jus en brique", "Jus en brique — orange", 1500),

  // Formules, pâtisseries et petit déjeuner
  entry(
    "Formule déjeuner",
    "Formule déjeuner (lundi–vendredi)",
    9500,
    "Entrée, plat du jour au choix, dessert et ataya offert.",
    undefined,
    "Offre figurant sur le highlight Instagram (environ 41 semaines lors de la consultation) ; confirmer la disponibilité.",
  ),
  entry(
    "Plats du jour ponctuels",
    "Paella (offre exceptionnelle)",
    6500,
    "Plat cité comme exceptionnel sur le visuel de la formule déjeuner.",
    undefined,
    "Offre ponctuelle publiée sur le highlight Instagram ; disponibilité à confirmer auprès du restaurant.",
  ),
  entry(
    "Plats du jour ponctuels",
    "Soup Kandja (offre exceptionnelle)",
    6000,
    "Plat cité comme exceptionnel sur le visuel de la formule déjeuner.",
    undefined,
    "Offre ponctuelle publiée sur le highlight Instagram ; disponibilité à confirmer auprès du restaurant.",
  ),
  entry("Pâtisseries et viennoiseries", "Croissant au beurre", 500),
  entry("Pâtisseries et viennoiseries", "Pain au chocolat", 600),
  entry("Pâtisseries et viennoiseries", "Croissant au jambon", 1200),
  entry("Pâtisseries et viennoiseries", "Feuilleté au poulet", 1500),
  entry("Pâtisseries et viennoiseries", "Feuilleté à la viande", 1500),
  entry("Pâtisseries et viennoiseries", "Cake marbré", 2500),
  entry(
    "Pâtisseries et viennoiseries",
    "Gâteau d’anniversaire (part)",
    2000,
    "Prix par part selon le choix.",
    [
      { label: "Choix au tarif 2 000 FCFA", price: 2000 },
      { label: "Choix au tarif 2 500 FCFA", price: 2500 },
    ],
  ),
  entry("Petit déjeuner", "Omelette nature", 3000),
  entry("Petit déjeuner", "Omelette jambon fromage", 4500),
  entry("Petit déjeuner", "Omelette jambon", 3500),
  entry("Petit déjeuner", "Omelette fromage", 3500),
  entry("Petit déjeuner", "Omelette aux légumes", 3500),
  entry("Petit déjeuner", "Œuf bouilli nature", 4000),
  entry("Petit déjeuner", "Œuf sur le plat nature", 3500),
  entry("Petit déjeuner", "Œuf sur le plat jambon", 4000),

  // Entrées et cuisine du monde
  entry(
    "Entrées",
    "Croquettes de fruits de mer",
    5000,
    "Crevettes, calamars panés, sauce à l’ail, laitue, tomate.",
  ),
  entry(
    "Entrées",
    "Cigare de chèvre au miel",
    4500,
    "Feuille de brick, fromage de chèvre, menthe ciselée.",
  ),
  entry("Entrées", "Salade niçoise", 4500),
  entry(
    "Entrées",
    "Salade de poulet pané sauce tartare",
    5500,
    "Salade, tomate, poulet pané, sauce tartare.",
  ),
  entry(
    "Entrées",
    "Miettes de thon à la brunoise de légumes et crevettes",
    5000,
    "Salade, thon, câpres, pomme de terre, concombre, crevettes.",
  ),
  entry(
    "Entrées",
    "Salade exotique",
    4500,
    "Maïs, crevettes, avocat, fruits exotiques, laitue, tomates.",
  ),
  entry("Entrées", "Terrine de poisson avec son coulis de tomate parfumé au basilic", 4500),
  entry(
    "Entrées",
    "Méli-Mélo de crevettes aux agrumes",
    4500,
    "Salade, crevettes, agrumes, tomate, vinaigrette à l’orange.",
  ),
  entry("Cuisine du monde", "Couscous Poulet", 7500, "Poulet, petits pois, raisins secs, légumes."),
  entry("Cuisine du monde", "Couscous Viande", 8500, "Viande, petits pois, raisins secs, légumes."),
  entry(
    "Cuisine du monde",
    "Tajine Poulet",
    7500,
    "Poulet, citron, pois chiches, olives, légumes.",
  ),
  entry("Cuisine du monde", "Tajine Viande", 8500, "Viande, légumes, pruneaux, pois chiches."),

  // Viandes, volailles, poissons et fruits de mer
  entry("Viandes", "Filet de bœuf grillé, sauce béarnaise", 12000),
  entry("Viandes", "Médaillon de bœuf", 12500),
  entry("Viandes", "Brochette de bœuf aux herbes fraîches", 9000),
  entry("Viandes", "Côte de veau à l’ail confit", 11000),
  entry("Viandes", "Mixte grillé", 14000),
  entry("Viandes", "Entrecôte de veau", 12000),
  entry("Viandes", "Bavette de bœuf à l’échalote", 9500),
  entry("Viandes", "Brochette Mix", 13000),
  entry("Volailles", "Brochette de poulet", 7500),
  entry("Volailles", "Escalope de poulet milanaise", 7500),
  entry("Volailles", "Poulet braisé aux herbes fraîches", 6500),
  entry("Volailles", "Émincé de volaille", 7000),
  entry("Volailles", "Pigeons aux petits pois", 15000),
  entry("Poissons et fruits de mer", "Crevettes ou calamars sautés à l’ail et à la crème", 9500),
  entry("Poissons et fruits de mer", "Gambas grillé, sauce provençale", 12000),
  entry("Poissons et fruits de mer", "Portion de Thiof braisé", 11000),
  entry("Poissons et fruits de mer", "Brochette de lotte", 7000),
  entry("Poissons et fruits de mer", "Lotte caramélisée", 9500),
  entry("Poissons et fruits de mer", "Dorade frites", 10000),
  entry("Poissons et fruits de mer", "Parillada de la mer, sauce aïoli", 15000),

  // Pâtes et pizzas
  entry("Pâtes", "Tagliatelle au pesto", 6500, "Tagliatelles, pesto, tomate cerise, fromage."),
  entry("Pâtes", "Tagliatelle aux fruits de mer", 8500),
  entry("Pâtes", "Spaghetti bolognaise", 7000),
  entry("Pâtes", "Linguine au poulet crème", 6500),
  entry("Pâtes", "Lasagne de bœuf aux brocolis", 10000),
  entry("Pizzas", "Pizza Reine", 4000, "", [
    { label: "PM", price: 4000 },
    { label: "GM", price: 6000 },
  ]),
  entry("Pizzas", "Pizza Margherita", 3000, "", [
    { label: "PM", price: 3000 },
    { label: "GM", price: 5000 },
  ]),
  entry("Pizzas", "Pizza Thon", 3500, "", [
    { label: "PM", price: 3500 },
    { label: "GM", price: 5000 },
  ]),
  entry("Pizzas", "Pizza Fruits de mer", 5000, "", [
    { label: "PM", price: 5000 },
    { label: "GM", price: 7000 },
  ]),
  entry("Pizzas", "Pizza Bolognaise", 4000, "", [
    { label: "PM", price: 4000 },
    { label: "GM", price: 6000 },
  ]),
  entry("Pizzas", "Pizza Fermière", 4000, "", [
    { label: "PM", price: 4000 },
    { label: "GM", price: 6000 },
  ]),
  entry("Pizzas", "Pizza Hawaïenne", 4000, "", [
    { label: "PM", price: 4000 },
    { label: "GM", price: 6000 },
  ]),
  entry("Pizzas", "Pizza 4 Fromages", 5000, "", [
    { label: "PM", price: 5000 },
    { label: "GM", price: 7000 },
  ]),
  entry("Pizzas", "Pizza Végétarienne", 4000, "", [
    { label: "PM", price: 4000 },
    { label: "GM", price: 6000 },
  ]),
  entry("Pizzas", "Pizza Élite", 6000, "", [
    { label: "PM", price: 6000 },
    { label: "GM", price: 8000 },
  ]),

  // Crêpes, sandwiches et toasts
  entry(
    "Crêpes",
    "Crêpe Américaine",
    4500,
    "Cheddar, viande hachée, œuf, laitue, tomates, concombre.",
  ),
  entry(
    "Crêpes",
    "Crêpe Parisienne",
    4000,
    "Emmental, jambon, sauce maison, hot dog, œuf sur le plat.",
  ),
  entry("Crêpes", "Crêpe fermière", 4000, "Crème fraîche, poulet, laitue, tomate, fromage."),
  entry(
    "Crêpes",
    "Crêpe Élite",
    5900,
    "Sauce maison, viande hachée, poulet, laitue, fromage, œuf.",
  ),
  entry("Crêpes", "Crêpe Suédoise", 4900, "Guacamole, omelette, légumes, saumon, laitue, tomates."),
  entry(
    "Club sandwichs et paninis",
    "Club volaille",
    3000,
    "Pain de mie, jambon de volaille, Emmental, tomate, laitue, béchamel.",
  ),
  entry("Club sandwichs et paninis", "Panini Poulet", 3000, "Pain panini, poulet, crème, fromage."),
  entry("Club sandwichs et paninis", "Panini viande", 3000, "Pain panini, viande, crème, fromage."),
  entry("Club sandwichs et paninis", "Panini jambon", 2500, "Pain panini, jambon, crème, fromage."),
  entry(
    "Club sandwichs et paninis",
    "Sandwich Américain",
    2500,
    "Pain, viande hachée, sauce cocktail, fromage, frites.",
  ),
  entry(
    "Club sandwichs et paninis",
    "Panini le Pacio",
    3000,
    "Pain panini, saumon fumé, crème, fromage.",
  ),
  entry(
    "Club sandwichs et paninis",
    "Panini le Milano",
    3000,
    "Pain panini, thon, crème, fromage.",
  ),
  entry(
    "Toasts",
    "Big Avo",
    7500,
    "Pain de mie, avocat, œuf poché, salade composée, pommes sautées, saumon fumé.",
  ),
  entry(
    "Toasts",
    "King Avo",
    7000,
    "Pommes sautées, œuf poché, citron, salade composée, avocat, croissant au beurre, graines de sésame.",
  ),
  entry("Toasts", "Croque-monsieur", 2500, "Pain de mie, jambon, béchamel, fromage."),

  // Desserts et glaces
  entry("Desserts", "Crème brûlée", 4000),
  entry("Desserts", "Moelleux au chocolat", 4000, "Avec sa boule de glace."),
  entry("Desserts", "Flan caramel", 3000),
  entry("Desserts", "Crêpes Nutella", 4000),
  entry("Desserts", "Crêpes Nutella avec boule de glace", 6000),
  entry("Desserts", "Assiette de fruits", 3500),
  entry("Desserts", "Brownie au chocolat avec sa boule de glace", 4000),
  entry("Desserts", "Coupe de glace", 5000, "Parfum plus de fruits (graphie du visuel)."),
  entry("Desserts", "Crêpe à la banane", 4500, "Banane, Nutella."),
  entry(
    "Desserts",
    "Glaces (par boule)",
    1500,
    "À partir de 2 boules, le menu affiche 1 000 FCFA par boule.",
    [
      { label: "1 boule", price: 1500 },
      { label: "2 boules ou plus · prix par boule", price: 1000, minQuantity: 2 },
    ],
  ),
];

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const idCounts = new Map<string, number>();

export const PRODUCT_CATALOG: Product[] = MENU_ENTRIES.map((item) => {
  const baseId = slugify(`${item.category}-${item.name}`);
  const count = (idCounts.get(baseId) ?? 0) + 1;
  idCounts.set(baseId, count);
  return {
    ...item,
    id: count === 1 ? baseId : `${baseId}-${count}`,
    price: item.priceOptions?.[0]?.price ?? item.price,
  };
});

export function getProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}
