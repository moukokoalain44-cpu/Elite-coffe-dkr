import { useEffect, useState } from "react";
import { fetchMenuProducts, supabase, type MenuProductRow } from "@/lib/supabase";
import { PRODUCT_CATALOG, type Product } from "@/data/catalog";

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

export function useMenuCatalog() {
  const [products, setProducts] = useState<Product[]>(PRODUCT_CATALOG);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = async (initial = false) => {
      try {
        const rows = await fetchMenuProducts();
        if (!active) return;
        setProducts(rows.map(fromRemote));
        setIsRemote(true);
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

    // Realtime rend la mise à jour instantanée quand la publication Supabase
    // est disponible. Le polling garantit le rafraîchissement même si Realtime
    // est momentanément indisponible ou bloqué par le réseau du visiteur.
    const channel = supabase
      .channel("public-menu-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_products" },
        () => void refresh(),
      )
      .subscribe();
    const timer = window.setInterval(() => void refresh(), 15_000);

    return () => {
      active = false;
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, []);

  return { products, isLoading, isRemote };
}
