export type MenuCategory = "Hot Coffee" | "Iced Coffee" | "Signature Drinks" | "Pastries";

export type Product = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  ingredients: string[];
  brewingMethod: string;
  image: string;
  featured?: boolean;
};

const image = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "velvet-latte",
    name: "Velvet Latte",
    category: "Hot Coffee",
    price: 5.25,
    description: "Espresso double, lait micro-moussé et finition cacao tout en douceur.",
    ingredients: ["Espresso double", "Lait entier ou végétal", "Cacao", "Sirop de vanille"],
    brewingMethod: "Extraction espresso à 9 bars, puis lait texturé à la vapeur.",
    image: image("photo-1461023058943-07fcbe16d735"),
    featured: true,
  },
  {
    id: "cortado-house",
    name: "Cortado House",
    category: "Hot Coffee",
    price: 4.5,
    description: "Un espresso équilibré, coupé d’une touche de lait chaud pour révéler le grain.",
    ingredients: ["Espresso", "Lait chaud"],
    brewingMethod: "Espresso court, servi dans une petite tasse préchauffée.",
    image: image("photo-1510591509098-f4fdc6d0ff04"),
  },
  {
    id: "honey-oat-cappuccino",
    name: "Honey Oat Cappuccino",
    category: "Hot Coffee",
    price: 5.5,
    description: "Cappuccino généreux au lait d’avoine, miel local et cannelle fraîche.",
    ingredients: ["Espresso", "Lait d’avoine", "Miel", "Cannelle"],
    brewingMethod: "Double espresso et mousse dense, finis au miel.",
    image: image("photo-1534778101976-62847782c213"),
  },
  {
    id: "cold-brew-moka",
    name: "Cold Brew Moka",
    category: "Iced Coffee",
    price: 5.75,
    description: "Infusion lente de 18 heures, chocolat noir et crème légère sur glace.",
    ingredients: ["Cold brew", "Chocolat noir", "Crème légère", "Glaçons"],
    brewingMethod: "Infusion à froid pendant 18 heures, filtrée lentement.",
    image: image("photo-1517701604599-bb29b565090c"),
    featured: true,
  },
  {
    id: "iced-honey-latte",
    name: "Iced Honey Latte",
    category: "Iced Coffee",
    price: 5.5,
    description:
      "Espresso glacé, lait soyeux et miel floral dans une version ultra rafraîchissante.",
    ingredients: ["Espresso", "Lait", "Miel", "Glaçons"],
    brewingMethod: "Espresso refroidi rapidement et assemblé sur glace.",
    image: image("photo-1495474472287-4d71bcdd2085"),
  },
  {
    id: "nitro-cold-brew",
    name: "Nitro Cold Brew",
    category: "Iced Coffee",
    price: 5.25,
    description: "Cold brew infusé à l’azote, texture velours et finale cacao.",
    ingredients: ["Cold brew", "Azote alimentaire", "Cacao"],
    brewingMethod: "Cold brew infusé à l’azote au moment du service.",
    image: image("photo-1592663527359-cf6642f54cff"),
  },
  {
    id: "spiced-maple-cloud",
    name: "Spiced Maple Cloud",
    category: "Signature Drinks",
    price: 6.5,
    description: "Notre création maison : espresso, érable, épices douces et mousse froide.",
    ingredients: ["Espresso", "Sirop d’érable", "Cardamome", "Mousse froide"],
    brewingMethod: "Espresso extrait à la commande, monté avec une mousse froide légère.",
    image: image("photo-1572442388796-11668a67e53d"),
    featured: true,
  },
  {
    id: "coconut-matcha",
    name: "Coconut Matcha Cloud",
    category: "Signature Drinks",
    price: 6.25,
    description: "Matcha cérémonial, coco crémeuse et mousse vanillée, sans caféine forte.",
    ingredients: ["Matcha cérémonial", "Lait de coco", "Vanille", "Mousse froide"],
    brewingMethod: "Matcha fouetté à la main puis versé sur lait de coco glacé.",
    image: image("photo-1515823064-d6e0c04616a7"),
  },
  {
    id: "berry-sparkler",
    name: "Berry Espresso Spritz",
    category: "Signature Drinks",
    price: 6.75,
    description: "Espresso, fruits rouges et eau pétillante pour une signature vive et inattendue.",
    ingredients: ["Espresso", "Fruits rouges", "Eau pétillante", "Citron"],
    brewingMethod: "Espresso refroidi puis assemblé délicatement sur les bulles.",
    image: image("photo-1541167760496-1628856ab772"),
  },
  {
    id: "almond-croissant",
    name: "Croissant aux amandes",
    category: "Pastries",
    price: 4.25,
    description: "Feuilletage croustillant, crème d’amande et amandes grillées.",
    ingredients: ["Farine", "Beurre", "Amande", "Sucre"],
    brewingMethod: "Feuilleté et cuit chaque matin dans notre fournil partenaire.",
    image: image("photo-1509440159596-0249088772ff"),
  },
  {
    id: "cardamom-roll",
    name: "Cardamom Morning Roll",
    category: "Pastries",
    price: 4.5,
    description: "Brioche roulée, cardamome fraîche et glaçage discret au sucre blond.",
    ingredients: ["Brioche", "Cardamome", "Beurre", "Sucre blond"],
    brewingMethod: "Pâte levée, roulée à la main puis dorée au four.",
    image: image("photo-1555507036-ab1f4038808a"),
  },
  {
    id: "chocolate-cookie",
    name: "Sea Salt Chocolate Cookie",
    category: "Pastries",
    price: 3.75,
    description: "Cookie moelleux au chocolat noir, éclats de cacao et fleur de sel.",
    ingredients: ["Chocolat noir", "Farine", "Beurre", "Fleur de sel"],
    brewingMethod: "Pâte reposée puis cuite pour conserver un cœur fondant.",
    image: image("photo-1499636136210-6f4ee915583e"),
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  "Hot Coffee",
  "Iced Coffee",
  "Signature Drinks",
  "Pastries",
];

export function getProduct(id: string) {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}
