export type MenuCategory = "Cafés chauds" | "Cafés glacés" | "Boissons signature" | "Pâtisseries";

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
  { id: "velvet-latte", name: "Latte Velours", category: "Cafés chauds", price: 3500, description: "Espresso double, lait micro-moussé et finition cacao tout en douceur.", ingredients: ["Espresso double", "Lait entier ou végétal", "Cacao", "Sirop de vanille"], brewingMethod: "Extraction espresso à 9 bars, puis lait texturé à la vapeur.", image: image("photo-1461023058943-07fcbe16d735"), featured: true },
  { id: "cortado-house", name: "Cortado Maison", category: "Cafés chauds", price: 3000, description: "Un espresso équilibré, coupé d’une touche de lait chaud pour révéler le grain.", ingredients: ["Espresso", "Lait chaud"], brewingMethod: "Espresso court servi dans une tasse préchauffée.", image: image("photo-1510591509098-f4fdc6d0ff04") },
  { id: "honey-oat-cappuccino", name: "Cappuccino avoine & miel", category: "Cafés chauds", price: 3750, description: "Cappuccino généreux au lait d’avoine, miel local et cannelle fraîche.", ingredients: ["Espresso", "Lait d’avoine", "Miel", "Cannelle"], brewingMethod: "Double espresso et mousse dense, finis au miel.", image: image("photo-1534778101976-62847782c213") },
  { id: "cold-brew-moka", name: "Cold Brew Moka", category: "Cafés glacés", price: 4000, description: "Infusion lente de 18 heures, chocolat noir et crème légère sur glace.", ingredients: ["Cold brew", "Chocolat noir", "Crème légère", "Glaçons"], brewingMethod: "Infusion à froid pendant 18 heures, filtrée lentement.", image: image("photo-1517701604599-bb29b565090c"), featured: true },
  { id: "iced-honey-latte", name: "Latte glacé au miel", category: "Cafés glacés", price: 3750, description: "Espresso glacé, lait soyeux et miel floral dans une version rafraîchissante.", ingredients: ["Espresso", "Lait", "Miel", "Glaçons"], brewingMethod: "Espresso refroidi rapidement et assemblé sur glace.", image: image("photo-1495474472287-4d71bcdd2085") },
  { id: "nitro-cold-brew", name: "Cold Brew Nitro", category: "Cafés glacés", price: 3500, description: "Cold brew infusé à l’azote, texture velours et finale cacao.", ingredients: ["Cold brew", "Azote alimentaire", "Cacao"], brewingMethod: "Cold brew infusé à l’azote au moment du service.", image: image("photo-1592663527359-cf6642f54cff") },
  { id: "spiced-maple-cloud", name: "Nuage érable & épices", category: "Boissons signature", price: 4250, description: "Notre création maison : espresso, érable, épices douces et mousse froide.", ingredients: ["Espresso", "Sirop d’érable", "Cardamome", "Mousse froide"], brewingMethod: "Espresso extrait à la commande, monté avec une mousse froide légère.", image: image("photo-1572442388796-11668a67e53d"), featured: true },
  { id: "coconut-matcha", name: "Nuage matcha coco", category: "Boissons signature", price: 4000, description: "Matcha cérémonial, coco crémeuse et mousse vanillée.", ingredients: ["Matcha cérémonial", "Lait de coco", "Vanille", "Mousse froide"], brewingMethod: "Matcha fouetté à la main puis versé sur lait de coco glacé.", image: image("photo-1515823064-d6e0c04616a7") },
  { id: "berry-sparkler", name: "Spritz espresso fruits rouges", category: "Boissons signature", price: 4500, description: "Espresso, fruits rouges et eau pétillante pour une signature vive.", ingredients: ["Espresso", "Fruits rouges", "Eau pétillante", "Citron"], brewingMethod: "Espresso refroidi puis assemblé délicatement sur les bulles.", image: image("photo-1541167760496-1628856ab772") },
  { id: "almond-croissant", name: "Croissant aux amandes", category: "Pâtisseries", price: 2750, description: "Feuilletage croustillant, crème d’amande et amandes grillées.", ingredients: ["Farine", "Beurre", "Amande", "Sucre"], brewingMethod: "Feuilleté et cuit chaque matin dans notre fournil partenaire.", image: image("photo-1509440159596-0249088772ff") },
  { id: "cardamom-roll", name: "Roulé matinal à la cardamome", category: "Pâtisseries", price: 3000, description: "Brioche roulée, cardamome fraîche et glaçage discret.", ingredients: ["Brioche", "Cardamome", "Beurre", "Sucre blond"], brewingMethod: "Pâte levée, roulée à la main puis dorée au four.", image: image("photo-1555507036-ab1f4038808a") },
  { id: "chocolate-cookie", name: "Cookie chocolat fleur de sel", category: "Pâtisseries", price: 2500, description: "Cookie moelleux au chocolat noir et fleur de sel.", ingredients: ["Chocolat noir", "Farine", "Beurre", "Fleur de sel"], brewingMethod: "Pâte reposée puis cuite pour conserver un cœur fondant.", image: image("photo-1499636136210-6f4ee915583e") },
];

export const MENU_CATEGORIES: MenuCategory[] = ["Cafés chauds", "Cafés glacés", "Boissons signature", "Pâtisseries"];

export function getProduct(id: string) {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}
