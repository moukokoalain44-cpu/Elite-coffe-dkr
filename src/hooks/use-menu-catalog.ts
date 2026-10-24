import { useEffect, useState } from "react";
import { fetchMenuProducts, type MenuProductRow } from "@/lib/supabase";
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
    fetchMenuProducts()
      .then((rows) => {
        if (!active || rows.length === 0) return;
        setProducts(rows.map(fromRemote));
        setIsRemote(true);
      })
      .catch((error: unknown) => {
        console.warn(
          "[Elite Coffee] Catalogue Supabase indisponible, fallback local utilisé.",
          error,
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, isLoading, isRemote };
}
