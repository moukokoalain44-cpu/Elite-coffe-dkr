import { MENU_CATEGORIES, MENU_ENTRIES, type MenuCategory, type MenuEntry } from "./menu-data";

export { MENU_CATEGORIES };
export type { MenuCategory };

export type Product = MenuEntry & {
  id: string;
  image: string;
  ingredients: string[];
  brewingMethod: string;
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
    image: "",
    ingredients: descriptionParts,
    brewingMethod: item.category.includes("Café")
      ? "Préparé à la commande par notre équipe barista."
      : "Préparé à la commande.",
  };
});

export function getProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}
