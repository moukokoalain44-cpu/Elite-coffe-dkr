export const MENU_CATEGORIES = ["Cafés chauds", "Cafés glacés", "Infusions de thé", "Boissons chaudes", "Cocktails", "Milkshakes", "Boissons gazeuses", "Jus en brique", "Entrées", "Pâtisseries", "Petit déjeuner", "Crêpes", "Club sandwich", "Toast"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];
export type Product = { id: string; name: string; category: MenuCategory; price: number; description: string; ingredients: string[]; brewingMethod: string; image: string; featured?: boolean };

// Transcription des cartes fournies par le restaurant. Photos illustratives.
export const PRODUCT_CATALOG: Product[] = [
  {
    "id": "produit-1",
    "name": "Café allongé",
    "category": "Cafés chauds",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-2",
    "name": "Café au lait",
    "category": "Cafés chauds",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-3",
    "name": "Café expresso",
    "category": "Cafés chauds",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-4",
    "name": "Cappuccino",
    "category": "Cafés chauds",
    "price": 2500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-5",
    "name": "Double expresso",
    "category": "Cafés chauds",
    "price": 3000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-6",
    "name": "Café glacé",
    "category": "Cafés glacés",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-7",
    "name": "Café glacé vanille",
    "category": "Cafés glacés",
    "price": 2500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-8",
    "name": "Café glacé caramel",
    "category": "Cafés glacés",
    "price": 2500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-9",
    "name": "Thé noir aromatisé",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-10",
    "name": "Thé 4 fruits rouges",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-11",
    "name": "Thé vert",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-12",
    "name": "Thé Elite",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-13",
    "name": "Chocolat chaud",
    "category": "Boissons chaudes",
    "price": 2500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-14",
    "name": "Cacao chaud",
    "category": "Boissons chaudes",
    "price": 2000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-15",
    "name": "Chocolat chaud à la vanille",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-16",
    "name": "Chocolat chaud au caramel",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-17",
    "name": "Chocolat chaud à la cannelle",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-18",
    "name": "Virgin au choix",
    "category": "Cocktails",
    "price": 4000,
    "description": "Fraise / framboise / passion, citron vert, menthe, soda, glace",
    "ingredients": [
      "Fraise / framboise / passion",
      "citron vert",
      "menthe",
      "soda",
      "glace"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-19",
    "name": "Virgin coloda",
    "category": "Cocktails",
    "price": 4000,
    "description": "Lait de coco, crème fraîche, ananas, glace",
    "ingredients": [
      "Lait de coco",
      "crème fraîche",
      "ananas",
      "glace"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-20",
    "name": "Elite",
    "category": "Cocktails",
    "price": 4000,
    "description": "Passion, fraise, mangue",
    "ingredients": [
      "Passion",
      "fraise",
      "mangue"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-21",
    "name": "La branche",
    "category": "Cocktails",
    "price": 4000,
    "description": "Orange, ananas, lait de coco, grenadine",
    "ingredients": [
      "Orange",
      "ananas",
      "lait de coco",
      "grenadine"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-22",
    "name": "Meduse",
    "category": "Cocktails",
    "price": 3500,
    "description": "Mangue, orange, ananas, citron, grenadine",
    "ingredients": [
      "Mangue",
      "orange",
      "ananas",
      "citron",
      "grenadine"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-23",
    "name": "Douceurs des îles",
    "category": "Cocktails",
    "price": 3500,
    "description": "Fraise, goyave, mangue, ananas, citron",
    "ingredients": [
      "Fraise",
      "goyave",
      "mangue",
      "ananas",
      "citron"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-24",
    "name": "Florida",
    "category": "Cocktails",
    "price": 3500,
    "description": "Gingembre, bouye, bissap, ananas",
    "ingredients": [
      "Gingembre",
      "bouye",
      "bissap",
      "ananas"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-25",
    "name": "La Sénégalaise",
    "category": "Cocktails",
    "price": 3500,
    "description": "Goyave, bouye, bissap, grenadine",
    "ingredients": [
      "Goyave",
      "bouye",
      "bissap",
      "grenadine"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-26",
    "name": "Milkshake vanille",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-27",
    "name": "Milkshake chocolat",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-28",
    "name": "Milkshake coco",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-29",
    "name": "Milkshake Kinder",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-30",
    "name": "Milkshake fruits rouges",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-31",
    "name": "Milkshake fraise",
    "category": "Milkshakes",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-32",
    "name": "Coca-Cola",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-33",
    "name": "Sprite",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-34",
    "name": "Coca Zéro",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-35",
    "name": "Fanta",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-36",
    "name": "Tonic agrumes",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-37",
    "name": "Tonic citron",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-38",
    "name": "Jus de mangue",
    "category": "Jus en brique",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-39",
    "name": "Jus de goyave",
    "category": "Jus en brique",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-40",
    "name": "Jus de ananas",
    "category": "Jus en brique",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-41",
    "name": "Jus de orange",
    "category": "Jus en brique",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-42",
    "name": "Courgenettes de fruit de mer",
    "category": "Entrées",
    "price": 5000,
    "description": "Crevettes, calamars panés, sauce aïoli, laitue, tomate",
    "ingredients": [
      "Crevettes",
      "calamars panés",
      "sauce aïoli",
      "laitue",
      "tomate"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-43",
    "name": "Cigare de chèvre au miel",
    "category": "Entrées",
    "price": 4500,
    "description": "Feuille de brick, fromage de chèvre, feuille de menthe ciselée",
    "ingredients": [
      "Feuille de brick",
      "fromage de chèvre",
      "feuille de menthe ciselée"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-44",
    "name": "Salade niçoise",
    "category": "Entrées",
    "price": 4500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-45",
    "name": "Salade de poulet pané sauce tartare",
    "category": "Entrées",
    "price": 5500,
    "description": "Salade, tomate, poulet pané, sauce tartare",
    "ingredients": [
      "Salade",
      "tomate",
      "poulet pané",
      "sauce tartare"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-46",
    "name": "Miettes de thon à la brunoise de légumes et crevettes",
    "category": "Entrées",
    "price": 5000,
    "description": "Salade, thon, carotte, pomme de terre, concombre, crevettes",
    "ingredients": [
      "Salade",
      "thon",
      "carotte",
      "pomme de terre",
      "concombre",
      "crevettes"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-47",
    "name": "Salade exotique",
    "category": "Entrées",
    "price": 4500,
    "description": "Maïs, crevettes, avocat, fruits exotiques, laitue, tomates",
    "ingredients": [
      "Maïs",
      "crevettes",
      "avocat",
      "fruits exotiques",
      "laitue",
      "tomates"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-48",
    "name": "Terrine de poisson avec son coulis de tomate parfumé au basilic",
    "category": "Entrées",
    "price": 4500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-49",
    "name": "Méli-mélo de crevettes aux agrumes",
    "category": "Entrées",
    "price": 4500,
    "description": "Salade, crevettes, agrumes, tomate, vinaigrette à l’orange",
    "ingredients": [
      "Salade",
      "crevettes",
      "agrumes",
      "tomate",
      "vinaigrette à l’orange"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-50",
    "name": "Croissant au beurre",
    "category": "Pâtisseries",
    "price": 500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-51",
    "name": "Pain au chocolat",
    "category": "Pâtisseries",
    "price": 600,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-52",
    "name": "Croissant au jambon",
    "category": "Pâtisseries",
    "price": 1200,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-53",
    "name": "Feuilleté au poulet",
    "category": "Pâtisseries",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-54",
    "name": "Feuilleté à la viande",
    "category": "Pâtisseries",
    "price": 1500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-55",
    "name": "Cake marbré",
    "category": "Pâtisseries",
    "price": 2500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-56",
    "name": "Gâteau d’anniversaire — part à 2 000 FCFA",
    "category": "Pâtisseries",
    "price": 2000,
    "description": "La part selon le choix",
    "ingredients": [
      "La part selon le choix"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-57",
    "name": "Gâteau d’anniversaire — part à 2 500 FCFA",
    "category": "Pâtisseries",
    "price": 2500,
    "description": "La part selon le choix",
    "ingredients": [
      "La part selon le choix"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-58",
    "name": "Omelette nature",
    "category": "Petit déjeuner",
    "price": 3000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-59",
    "name": "Omelette jambon fromage",
    "category": "Petit déjeuner",
    "price": 4500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-60",
    "name": "Omelette jambon",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-61",
    "name": "Omelette fromage",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-62",
    "name": "Omelette aux légumes",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-63",
    "name": "Œuf bouilli nature",
    "category": "Petit déjeuner",
    "price": 4000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-64",
    "name": "Œuf sur le plat nature",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-65",
    "name": "Œuf sur le plat jambon",
    "category": "Petit déjeuner",
    "price": 4000,
    "description": "",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-66",
    "name": "Crêpe Américaine",
    "category": "Crêpes",
    "price": 4500,
    "description": "Cheddar, viande hachée, œuf, laitue, tomates, concombre",
    "ingredients": [
      "Cheddar",
      "viande hachée",
      "œuf",
      "laitue",
      "tomates",
      "concombre"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-67",
    "name": "Crêpe Parisienne",
    "category": "Crêpes",
    "price": 4000,
    "description": "Emmental, jambon, sauce maison, hot-dog, œuf sur le plat",
    "ingredients": [
      "Emmental",
      "jambon",
      "sauce maison",
      "hot-dog",
      "œuf sur le plat"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-68",
    "name": "Crêpe fermière",
    "category": "Crêpes",
    "price": 4000,
    "description": "Crème fraîche, poulet, laitue, tomate, fromage",
    "ingredients": [
      "Crème fraîche",
      "poulet",
      "laitue",
      "tomate",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-69",
    "name": "Crêpe Élite",
    "category": "Crêpes",
    "price": 5900,
    "description": "Sauce maison, viande hachée, poulet, laitue, fromage, œuf",
    "ingredients": [
      "Sauce maison",
      "viande hachée",
      "poulet",
      "laitue",
      "fromage",
      "œuf"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-70",
    "name": "Crêpe Suédoise",
    "category": "Crêpes",
    "price": 4900,
    "description": "Guacamole, omelette, légumes, saumon, laitue, tomates",
    "ingredients": [
      "Guacamole",
      "omelette",
      "légumes",
      "saumon",
      "laitue",
      "tomates"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-71",
    "name": "Club volaille",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain de mie, jambon de volaille, emmental, tomate, laitue, béchamel",
    "ingredients": [
      "Pain de mie",
      "jambon de volaille",
      "emmental",
      "tomate",
      "laitue",
      "béchamel"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-72",
    "name": "Panini Poulet",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, poulet, crème, fromage",
    "ingredients": [
      "Pain panini",
      "poulet",
      "crème",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-73",
    "name": "Panini viande",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, viande, crème, fromage",
    "ingredients": [
      "Pain panini",
      "viande",
      "crème",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-74",
    "name": "Panini jambon",
    "category": "Club sandwich",
    "price": 2500,
    "description": "Pain panini, jambon, crème, fromage",
    "ingredients": [
      "Pain panini",
      "jambon",
      "crème",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-75",
    "name": "Sandwich Américain",
    "category": "Club sandwich",
    "price": 2500,
    "description": "Pain, viande hachée, sauce cocktail, fromage, frites",
    "ingredients": [
      "Pain",
      "viande hachée",
      "sauce cocktail",
      "fromage",
      "frites"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-76",
    "name": "Panini le Pacifico",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, saumon fumé, crème, fromage",
    "ingredients": [
      "Pain panini",
      "saumon fumé",
      "crème",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-77",
    "name": "Panini le Milano",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, thon, crème, fromage",
    "ingredients": [
      "Pain panini",
      "thon",
      "crème",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-78",
    "name": "Big Avo",
    "category": "Toast",
    "price": 7500,
    "description": "Pain de mie, avocat, œuf poché, salade composée, pommes sautées, saumon fumé",
    "ingredients": [
      "Pain de mie",
      "avocat",
      "œuf poché",
      "salade composée",
      "pommes sautées",
      "saumon fumé"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-79",
    "name": "King Avo",
    "category": "Toast",
    "price": 7000,
    "description": "Pommes sautées, œuf poché, citron, salade composée, avocat, croissant au beurre, graines de sésame",
    "ingredients": [
      "Pommes sautées",
      "œuf poché",
      "citron",
      "salade composée",
      "avocat",
      "croissant au beurre",
      "graines de sésame"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-80",
    "name": "Croque-monsieur",
    "category": "Toast",
    "price": 2500,
    "description": "Pain de mie, jambon, béchamel, fromage",
    "ingredients": [
      "Pain de mie",
      "jambon",
      "béchamel",
      "fromage"
    ],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  }
];

export function getProduct(id: string) { return PRODUCT_CATALOG.find(product => product.id === id); }
