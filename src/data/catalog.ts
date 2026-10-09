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
    "description": "Un expresso allongé à l'eau chaude, doux et équilibré.",
    "ingredients": ["café arabica", "eau chaude"],
    "brewingMethod": "Expresso allongé",
    "image": "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-2",
    "name": "Café au lait",
    "category": "Cafés chauds",
    "price": 2000,
    "description": "Un expresso onctueux noyé dans du lait chaud mousseux.",
    "ingredients": ["café arabica", "lait entier"],
    "brewingMethod": "Expresso + lait chaud",
    "image": "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-3",
    "name": "Café expresso",
    "category": "Cafés chauds",
    "price": 1500,
    "description": "Un shot d'expresso intense et corsé, servi en petite tasse.",
    "ingredients": ["café arabica"],
    "brewingMethod": "Machine expresso",
    "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-4",
    "name": "Cappuccino",
    "category": "Cafés chauds",
    "price": 2500,
    "description": "Expresso, lait chaud et mousse de lait crémeuse en proportion égale.",
    "ingredients": ["café arabica", "lait entier", "mousse de lait"],
    "brewingMethod": "Expresso + vapeur",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-5",
    "name": "Double expresso",
    "category": "Cafés chauds",
    "price": 3000,
    "description": "Double dose d'expresso pour les amateurs de café intense.",
    "ingredients": ["café arabica x2"],
    "brewingMethod": "Double shot machine expresso",
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-6",
    "name": "Café glacé",
    "category": "Cafés glacés",
    "price": 2000,
    "description": "Expresso refroidi sur glaçons, rafraîchissant et énergisant.",
    "ingredients": ["café arabica", "glace"],
    "brewingMethod": "Expresso sur glace",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-7",
    "name": "Café glacé vanille",
    "category": "Cafés glacés",
    "price": 2500,
    "description": "Café glacé sublimé par un sirop de vanille douce.",
    "ingredients": ["café arabica", "glace", "sirop de vanille"],
    "brewingMethod": "Expresso sur glace",
    "image": "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-8",
    "name": "Café glacé caramel",
    "category": "Cafés glacés",
    "price": 2500,
    "description": "Café glacé avec une touche de caramel fondant.",
    "ingredients": ["café arabica", "glace", "sirop de caramel"],
    "brewingMethod": "Expresso sur glace",
    "image": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-9",
    "name": "Thé noir aromatisé",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "Thé noir infusé aux arômes naturels, servi chaud.",
    "ingredients": ["thé noir", "arômes naturels"],
    "brewingMethod": "Infusion 4 min à 95°C",
    "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-10",
    "name": "Thé 4 fruits rouges",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "Infusion fruitée aux fraises, framboises, groseilles et cassis.",
    "ingredients": ["thé", "fraise", "framboise", "groseille", "cassis"],
    "brewingMethod": "Infusion 5 min à 90°C",
    "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-11",
    "name": "Thé vert",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "Thé vert délicat et antioxydant, légèrement herbacé.",
    "ingredients": ["thé vert"],
    "brewingMethod": "Infusion 3 min à 80°C",
    "image": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-12",
    "name": "Thé Elite",
    "category": "Infusions de thé",
    "price": 2000,
    "description": "Notre blend maison signature, mélange de thés et épices soigneusement sélectionnés.",
    "ingredients": ["thé", "épices", "fleurs séchées"],
    "brewingMethod": "Infusion 5 min",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-13",
    "name": "Chocolat chaud",
    "category": "Boissons chaudes",
    "price": 2500,
    "description": "Chocolat chaud onctueux préparé avec du cacao de qualité.",
    "ingredients": ["cacao", "lait entier", "sucre"],
    "brewingMethod": "Préparation artisanale",
    "image": "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-14",
    "name": "Cacao chaud",
    "category": "Boissons chaudes",
    "price": 2000,
    "description": "Boisson au cacao pure, chaude et réconfortante.",
    "ingredients": ["poudre de cacao", "lait", "sucre"],
    "brewingMethod": "Préparation artisanale",
    "image": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-15",
    "name": "Chocolat chaud à la vanille",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "Chocolat chaud enrichi d'arôme de vanille naturelle.",
    "ingredients": ["cacao", "lait", "vanille"],
    "brewingMethod": "Préparation artisanale",
    "image": "https://images.unsplash.com/photo-1610450949065-1f2841536c88?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-16",
    "name": "Chocolat chaud au caramel",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "Chocolat chaud avec coulis de caramel maison.",
    "ingredients": ["cacao", "lait", "caramel maison"],
    "brewingMethod": "Préparation artisanale",
    "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-17",
    "name": "Chocolat chaud à la cannelle",
    "category": "Boissons chaudes",
    "price": 3000,
    "description": "Chocolat chaud épicé à la cannelle pour les amateurs de saveurs orientales.",
    "ingredients": ["cacao", "lait", "cannelle"],
    "brewingMethod": "Préparation artisanale",
    "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-18",
    "name": "Virgin au choix",
    "category": "Cocktails",
    "price": 4000,
    "description": "Fraise / framboise / passion, citron vert, menthe, soda, glace",
    "ingredients": ["Fraise / framboise / passion", "citron vert", "menthe", "soda", "glace"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-19",
    "name": "Virgin colada",
    "category": "Cocktails",
    "price": 4000,
    "description": "Lait de coco, crème fraîche, ananas, glace",
    "ingredients": ["Lait de coco", "crème fraîche", "ananas", "glace"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-20",
    "name": "Elite",
    "category": "Cocktails",
    "price": 4000,
    "description": "Passion, fraise, mangue",
    "ingredients": ["Passion", "fraise", "mangue"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1494475673543-6a6a27143fc8?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-21",
    "name": "La branche",
    "category": "Cocktails",
    "price": 4000,
    "description": "Orange, ananas, lait de coco, grenadine",
    "ingredients": ["Orange", "ananas", "lait de coco", "grenadine"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-22",
    "name": "Meduse",
    "category": "Cocktails",
    "price": 3500,
    "description": "Mangue, orange, ananas, citron, grenadine",
    "ingredients": ["Mangue", "orange", "ananas", "citron", "grenadine"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-23",
    "name": "Douceurs des îles",
    "category": "Cocktails",
    "price": 3500,
    "description": "Fraise, goyave, mangue, ananas, citron",
    "ingredients": ["Fraise", "goyave", "mangue", "ananas", "citron"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-24",
    "name": "Florida",
    "category": "Cocktails",
    "price": 3500,
    "description": "Gingembre, bouye, bissap, ananas",
    "ingredients": ["Gingembre", "bouye", "bissap", "ananas"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-25",
    "name": "La Sénégalaise",
    "category": "Cocktails",
    "price": 3500,
    "description": "Goyave, bouye, bissap, grenadine",
    "ingredients": ["Goyave", "bouye", "bissap", "grenadine"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-26",
    "name": "Milkshake vanille",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake crémeux à la vanille, servi bien frais.",
    "ingredients": ["lait", "glace vanille", "sirop de vanille"],
    "brewingMethod": "Mixé",
    "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-27",
    "name": "Milkshake chocolat",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake intense au chocolat pour les gourmands.",
    "ingredients": ["lait", "glace chocolat", "cacao"],
    "brewingMethod": "Mixé",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-28",
    "name": "Milkshake coco",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake exotique à la noix de coco.",
    "ingredients": ["lait de coco", "glace coco", "noix de coco râpée"],
    "brewingMethod": "Mixé",
    "image": "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-29",
    "name": "Milkshake Kinder",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake fondant aux saveurs Kinder Bueno.",
    "ingredients": ["lait", "glace noisette", "Kinder Bueno"],
    "brewingMethod": "Mixé",
    "image": "https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-30",
    "name": "Milkshake fruits rouges",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake acidulé aux fruits rouges frais.",
    "ingredients": ["lait", "glace fruits rouges", "fraises", "framboises"],
    "brewingMethod": "Mixé",
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-31",
    "name": "Milkshake fraise",
    "category": "Milkshakes",
    "price": 3500,
    "description": "Milkshake onctueux à la fraise fraîche.",
    "ingredients": ["lait", "glace fraise", "coulis de fraise"],
    "brewingMethod": "Mixé",
    "image": "https://images.unsplash.com/photo-1502741383560-fe1e5f52b2e4?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-32",
    "name": "Coca-Cola",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "La classique boisson gazeuse sucrée.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-33",
    "name": "Sprite",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "Boisson gazeuse citron-lime fraîche et désaltérante.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-34",
    "name": "Coca Zéro",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "Le goût du Coca sans sucre.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-35",
    "name": "Fanta",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "Boisson gazeuse à l'orange pétillante.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-36",
    "name": "Tonic agrumes",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "Tonic aux saveurs d'agrumes, légèrement amer.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-37",
    "name": "Tonic citron",
    "category": "Boissons gazeuses",
    "price": 1500,
    "description": "Tonic citron rafraîchissant et légèrement acidulé.",
    "ingredients": [],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-38",
    "name": "Jus de mangue",
    "category": "Jus en brique",
    "price": 1500,
    "description": "Jus de mangue tropicale en brique, sucré et ensoleillé.",
    "ingredients": ["mangue"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-39",
    "name": "Jus de goyave",
    "category": "Jus en brique",
    "price": 1500,
    "description": "Jus de goyave en brique, doux et parfumé.",
    "ingredients": ["goyave"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1614777735417-4bf4a1d63fc6?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-40",
    "name": "Jus d'ananas",
    "category": "Jus en brique",
    "price": 1500,
    "description": "Jus d'ananas en brique, frais et acidulé.",
    "ingredients": ["ananas"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-41",
    "name": "Jus d'orange",
    "category": "Jus en brique",
    "price": 1500,
    "description": "Jus d'orange en brique, vitaminé et ensoleillé.",
    "ingredients": ["orange"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-42",
    "name": "Courgenettes de fruit de mer",
    "category": "Entrées",
    "price": 5000,
    "description": "Crevettes, calamars panés, sauce aïoli, laitue, tomate",
    "ingredients": ["Crevettes", "calamars panés", "sauce aïoli", "laitue", "tomate"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-43",
    "name": "Cigare de chèvre au miel",
    "category": "Entrées",
    "price": 4500,
    "description": "Feuille de brick, fromage de chèvre, feuille de menthe ciselée",
    "ingredients": ["Feuille de brick", "fromage de chèvre", "feuille de menthe ciselée"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-44",
    "name": "Salade niçoise",
    "category": "Entrées",
    "price": 4500,
    "description": "Salade fraîche niçoise avec thon, œufs, olives et légumes de saison.",
    "ingredients": ["laitue", "thon", "œufs", "olives", "tomates", "haricots verts"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-45",
    "name": "Salade de poulet pané sauce tartare",
    "category": "Entrées",
    "price": 5500,
    "description": "Salade, tomate, poulet pané, sauce tartare",
    "ingredients": ["Salade", "tomate", "poulet pané", "sauce tartare"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-46",
    "name": "Miettes de thon à la brunoise de légumes et crevettes",
    "category": "Entrées",
    "price": 5000,
    "description": "Salade, thon, carotte, pomme de terre, concombre, crevettes",
    "ingredients": ["Salade", "thon", "carotte", "pomme de terre", "concombre", "crevettes"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-47",
    "name": "Salade exotique",
    "category": "Entrées",
    "price": 4500,
    "description": "Maïs, crevettes, avocat, fruits exotiques, laitue, tomates",
    "ingredients": ["Maïs", "crevettes", "avocat", "fruits exotiques", "laitue", "tomates"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-48",
    "name": "Terrine de poisson coulis basilic",
    "category": "Entrées",
    "price": 4500,
    "description": "Terrine de poisson servie avec son coulis de tomate parfumé au basilic.",
    "ingredients": ["poisson", "tomate", "basilic"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-49",
    "name": "Méli-mélo de crevettes aux agrumes",
    "category": "Entrées",
    "price": 4500,
    "description": "Salade, crevettes, agrumes, tomate, vinaigrette à l'orange",
    "ingredients": ["Salade", "crevettes", "agrumes", "tomate", "vinaigrette à l'orange"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-50",
    "name": "Croissant au beurre",
    "category": "Pâtisseries",
    "price": 500,
    "description": "Croissant feuilleté pur beurre, doré et croustillant.",
    "ingredients": ["farine", "beurre", "levure"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-51",
    "name": "Pain au chocolat",
    "category": "Pâtisseries",
    "price": 600,
    "description": "Viennoiserie feuilletée garnie de deux barres de chocolat noir.",
    "ingredients": ["farine", "beurre", "chocolat noir"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-52",
    "name": "Croissant au jambon",
    "category": "Pâtisseries",
    "price": 1200,
    "description": "Croissant garni de jambon fondant.",
    "ingredients": ["croissant", "jambon"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-53",
    "name": "Feuilleté au poulet",
    "category": "Pâtisseries",
    "price": 1500,
    "description": "Feuilleté croustillant farci au poulet moelleux.",
    "ingredients": ["pâte feuilletée", "poulet"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1529473814998-077b4fec6770?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-54",
    "name": "Feuilleté à la viande",
    "category": "Pâtisseries",
    "price": 1500,
    "description": "Feuilleté croustillant farci à la viande hachée épicée.",
    "ingredients": ["pâte feuilletée", "viande hachée"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-55",
    "name": "Cake marbré",
    "category": "Pâtisseries",
    "price": 2500,
    "description": "Cake moelleux marbré vanille et chocolat, fait maison.",
    "ingredients": ["farine", "œufs", "beurre", "vanille", "chocolat"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-56",
    "name": "Gâteau d'anniversaire — part à 2 000 FCFA",
    "category": "Pâtisseries",
    "price": 2000,
    "description": "La part selon le choix",
    "ingredients": ["La part selon le choix"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-57",
    "name": "Gâteau d'anniversaire — part à 2 500 FCFA",
    "category": "Pâtisseries",
    "price": 2500,
    "description": "La part selon le choix",
    "ingredients": ["La part selon le choix"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-58",
    "name": "Omelette nature",
    "category": "Petit déjeuner",
    "price": 3000,
    "description": "Omelette moelleuse nature, préparée à la commande.",
    "ingredients": ["œufs", "beurre", "sel"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-59",
    "name": "Omelette jambon fromage",
    "category": "Petit déjeuner",
    "price": 4500,
    "description": "Omelette garnie de jambon et fromage fondu.",
    "ingredients": ["œufs", "jambon", "fromage"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-60",
    "name": "Omelette jambon",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "Omelette légère garnie de jambon.",
    "ingredients": ["œufs", "jambon"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-61",
    "name": "Omelette fromage",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "Omelette fondante au fromage.",
    "ingredients": ["œufs", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-62",
    "name": "Omelette aux légumes",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "Omelette colorée aux légumes frais de saison.",
    "ingredients": ["œufs", "poivrons", "tomates", "oignons"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-63",
    "name": "Œuf bouilli nature",
    "category": "Petit déjeuner",
    "price": 4000,
    "description": "Œuf cuit à la coque ou dur selon votre préférence.",
    "ingredients": ["œuf"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-64",
    "name": "Œuf sur le plat nature",
    "category": "Petit déjeuner",
    "price": 3500,
    "description": "Œuf au plat parfait, jaune coulant, servi nature.",
    "ingredients": ["œuf", "beurre"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-65",
    "name": "Œuf sur le plat jambon",
    "category": "Petit déjeuner",
    "price": 4000,
    "description": "Œuf au plat accompagné de tranches de jambon.",
    "ingredients": ["œuf", "jambon"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-66",
    "name": "Crêpe Américaine",
    "category": "Crêpes",
    "price": 4500,
    "description": "Cheddar, viande hachée, œuf, laitue, tomates, concombre",
    "ingredients": ["Cheddar", "viande hachée", "œuf", "laitue", "tomates", "concombre"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-67",
    "name": "Crêpe Parisienne",
    "category": "Crêpes",
    "price": 4000,
    "description": "Emmental, jambon, sauce maison, hot-dog, œuf sur le plat",
    "ingredients": ["Emmental", "jambon", "sauce maison", "hot-dog", "œuf sur le plat"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-68",
    "name": "Crêpe fermière",
    "category": "Crêpes",
    "price": 4000,
    "description": "Crème fraîche, poulet, laitue, tomate, fromage",
    "ingredients": ["Crème fraîche", "poulet", "laitue", "tomate", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-69",
    "name": "Crêpe Élite",
    "category": "Crêpes",
    "price": 5900,
    "description": "Sauce maison, viande hachée, poulet, laitue, fromage, œuf",
    "ingredients": ["Sauce maison", "viande hachée", "poulet", "laitue", "fromage", "œuf"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-70",
    "name": "Crêpe Suédoise",
    "category": "Crêpes",
    "price": 4900,
    "description": "Guacamole, omelette, légumes, saumon, laitue, tomates",
    "ingredients": ["Guacamole", "omelette", "légumes", "saumon", "laitue", "tomates"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-71",
    "name": "Club volaille",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain de mie, jambon de volaille, emmental, tomate, laitue, béchamel",
    "ingredients": ["Pain de mie", "jambon de volaille", "emmental", "tomate", "laitue", "béchamel"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-72",
    "name": "Panini Poulet",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, poulet, crème, fromage",
    "ingredients": ["Pain panini", "poulet", "crème", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-73",
    "name": "Panini viande",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, viande, crème, fromage",
    "ingredients": ["Pain panini", "viande", "crème", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-74",
    "name": "Panini jambon",
    "category": "Club sandwich",
    "price": 2500,
    "description": "Pain panini, jambon, crème, fromage",
    "ingredients": ["Pain panini", "jambon", "crème", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-75",
    "name": "Sandwich Américain",
    "category": "Club sandwich",
    "price": 2500,
    "description": "Pain, viande hachée, sauce cocktail, fromage, frites",
    "ingredients": ["Pain", "viande hachée", "sauce cocktail", "fromage", "frites"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-76",
    "name": "Panini le Pacifico",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, saumon fumé, crème, fromage",
    "ingredients": ["Pain panini", "saumon fumé", "crème", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-77",
    "name": "Panini le Milano",
    "category": "Club sandwich",
    "price": 3000,
    "description": "Pain panini, thon, crème, fromage",
    "ingredients": ["Pain panini", "thon", "crème", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-78",
    "name": "Big Avo",
    "category": "Toast",
    "price": 7500,
    "description": "Pain de mie, avocat, œuf poché, salade composée, pommes sautées, saumon fumé",
    "ingredients": ["Pain de mie", "avocat", "œuf poché", "salade composée", "pommes sautées", "saumon fumé"],
    "brewingMethod": "",
    "featured": true,
    "image": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-79",
    "name": "King Avo",
    "category": "Toast",
    "price": 7000,
    "description": "Pommes sautées, œuf poché, citron, salade composée, avocat, croissant au beurre, graines de sésame",
    "ingredients": ["Pommes sautées", "œuf poché", "citron", "salade composée", "avocat", "croissant au beurre", "graines de sésame"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=82"
  },
  {
    "id": "produit-80",
    "name": "Croque-monsieur",
    "category": "Toast",
    "price": 2500,
    "description": "Pain de mie, jambon, béchamel, fromage",
    "ingredients": ["Pain de mie", "jambon", "béchamel", "fromage"],
    "brewingMethod": "",
    "image": "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=900&q=82"
  }
];

export function getProduct(id: string) { return PRODUCT_CATALOG.find(product => product.id === id); }
