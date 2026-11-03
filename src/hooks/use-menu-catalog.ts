import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchMenuCategories,
  fetchMenuProducts,
  supabase,
  type MenuCategoryRow,
  type MenuProductRow,
} from "@/lib/supabase";
import { MENU_CATEGORIES, PRODUCT_CATALOG, type Product } from "@/data/catalog";

function fromRemote(row: MenuProductRow): Product {
  const fallback = PRODUCT_CATALOG.find((product) => product.id === row.id);
  return {
    ...(fallback ?? {
      id: row.id,
      image: "/assets/instagram/hero-brunch.jpg",
      ingredients: [],
      brewingMethod: "Préparé à la commande.",
    }),
    name: row.name,
    category: row.category as Product["category"],
    price: row.price,
    description: row.description,
    priceOptions: row.price_options ?? [],
    ...(row.availability_note ? { availabilityNote: row.availability_note } : {}),
    featured: row.featured,
    image: row.image_url ?? fallback?.image ?? "/assets/instagram/hero-brunch.jpg",
  };
}

const LOCAL_CATEGORIES: MenuCategoryRow[] = MENU_CATEGORIES.map((name, index) => ({
  id: name,
  name,
  description: null,
  sort_order: index,
  created_at: "",
}));

export function useMenuCatalog() {
  const [products, setProducts] = useState<Product[]>(PRODUCT_CATALOG);
  const [categories, setCategories] = useState<MenuCategoryRow[]>(LOCAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    let active = true;
    let lastSignature = "";

    const refresh = async (initial = false, notify = false) => {
      try {
        const [rows, categoryRows] = await Promise.all([
          fetchMenuProducts(),
          fetchMenuCategories().catch((error: unknown) => {
            console.warn("[MENU_PUBLIC_CATEGORIES_READ] menu_categories indisponible.", error);
            return [] as MenuCategoryRow[];
          }),
        ]);
        if (!active) return;

        const nextCategories = categoryRows.length
          ? categoryRows
          : [...new Set(rows.map((row) => row.category))].map((name, index) => ({
              id: name,
              name,
              description: null,
              sort_order: index,
              created_at: "",
            }));
        const signature = JSON.stringify({ rows, categories: nextCategories });
        const hasChanged = Boolean(lastSignature && lastSignature !== signature);
        lastSignature = signature;
        setProducts(rows.map(fromRemote));
        setCategories(nextCategories);
        setIsRemote(true);
        if (notify && hasChanged) {
          toast.success("La carte a été mise à jour", {
            description: "Les dernières modifications sont maintenant affichées.",
          });
        }
      } catch (error: unknown) {
        console.warn(
          "[Elite Coffee] Catalogue Supabase indisponible, fallback local utilisé.",
          error,
        );
      } finally {
        if (active && initial) setIsLoading(false);
      }
    };

    void refresh(true);
    const channel = supabase
      .channel("public-menu-catalog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_products" },
        () => void refresh(false, true),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        () => void refresh(false, true),
      )
      .subscribe();
    const timer = window.setInterval(() => void refresh(), 15_000);

    return () => {
      active = false;
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, []);

  return { products, categories, isLoading, isRemote };
}
