import { MENU_CATEGORIES, MENU_ENTRIES, type MenuCategory, type MenuEntry } from "./menu-data";

export { MENU_CATEGORIES };
export type { MenuCategory };

export type Product = MenuEntry & {
  id: string;
  image: string;
  ingredients: string[];
  brewingMethod: string;
};

const CATEGORY_IMAGES: Record<MenuCategory, string> = {
  "Cafés chauds":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82",
  "Cafés glacés":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82",
  "Infusions de thé":
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=82",
  "Boissons chaudes":
    "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=900&q=82",
  Cocktails:
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=82",
  Smoothies:
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=82",
  "Jus locaux":
    "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=82",
  "Jus détox":
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=900&q=82",
  Milkshakes:
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=82",
  "Boissons gazeuses":
    "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=82",
  "Jus en brique":
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=82",
  "Formule déjeuner":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
  "Plats du jour ponctuels":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
  "Pâtisseries et viennoiseries":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82",
  "Petit déjeuner":
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=82",
  Entrées:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
  "Cuisine du monde":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=82",
  Viandes:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
  Volailles:
    "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82",
  "Poissons et fruits de mer":
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=82",
  Pâtes:
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=82",
  Pizzas:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=82",
  Crêpes:
    "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=900&q=82",
  "Club sandwichs et paninis":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=82",
  Toasts:
    "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=82",
  Desserts:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=82",
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const idCounts = new Map<string, number>();

export const PRODUCT_CATALOG: Product[] = MENU_ENTRIES.map((item) => {
  const baseId = slugify(`${item.category}-${item.name}`);
  const count = (idCounts.get(baseId) ?? 0) + 1;
  idCounts.set(baseId, count);
  const descriptionParts = item.description
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    ...item,
    id: count === 1 ? baseId : `${baseId}-${count}`,
    price: item.priceOptions?.[0]?.price ?? item.price,
    image: CATEGORY_IMAGES[item.category],
    ingredients: descriptionParts,
    brewingMethod: item.category.includes("Café")
      ? "Préparé à la commande par notre équipe barista."
      : "Préparé à la commande.",
  };
});

export function getProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}
