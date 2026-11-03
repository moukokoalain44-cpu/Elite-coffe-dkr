import { supabase, type MenuCategoryRow, type MenuProductRow } from "@/lib/supabase";

export type AdminMenuProduct = MenuProductRow;
export type CategoryInput = Pick<MenuCategoryRow, "name" | "sort_order"> & {
  id?: string;
  description?: string | null;
};
export type ProductInput = Omit<MenuProductRow, "category_id"> & {
  category_id: string;
};

type SupabaseFailure = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

export function formatCatalogError(action: string, resource: string, failure: unknown): Error {
  const error = failure as SupabaseFailure;
  const code = error?.code || "UNKNOWN";
  const message = error?.message || String(failure || "Erreur inconnue");
  const extra = [error?.details, error?.hint].filter(Boolean).join(" | ");
  return new Error(`[${action}] ${resource} (${code}): ${message}${extra ? ` — ${extra}` : ""}`);
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function adminListCategories(): Promise<MenuCategoryRow[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("id,name,description,sort_order,created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw formatCatalogError("adminListCategories", "public.menu_categories", error);
  return (data ?? []) as MenuCategoryRow[];
}

export async function adminSaveCategory(input: CategoryInput): Promise<MenuCategoryRow> {
  const name = input.name.trim();
  if (!name)
    throw new Error(
      "[adminSaveCategory] public.menu_categories (VALIDATION): Le nom est obligatoire.",
    );

  let id = input.id;
  if (!id) {
    const base = slugify(name) || `categorie-${Date.now()}`;
    const existing = await adminListCategories();
    const used = new Set(existing.map((category) => category.id));
    id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
  }

  const { data, error } = await supabase
    .from("menu_categories")
    .upsert(
      {
        id,
        name,
        description: input.description?.trim() || null,
        sort_order: input.sort_order,
      },
      { onConflict: "id" },
    )
    .select("id,name,description,sort_order,created_at")
    .single();
  if (error) throw formatCatalogError("adminSaveCategory", "public.menu_categories", error);
  return data as MenuCategoryRow;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const { count, error: countError } = await supabase
    .from("menu_products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (countError)
    throw formatCatalogError("adminDeleteCategory", "public.menu_products", countError);
  if (count) {
    throw new Error(
      `[adminDeleteCategory] public.menu_categories (CATEGORY_IN_USE): ${count} produit(s) utilisent encore cette catégorie. Réaffectez-les avant de la supprimer.`,
    );
  }

  const { data, error } = await supabase
    .from("menu_categories")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw formatCatalogError("adminDeleteCategory", "public.menu_categories", error);
  if (!data)
    throw new Error(
      "[adminDeleteCategory] public.menu_categories (NO_ROW): aucune catégorie supprimée; vérifiez son identifiant et les droits admin.",
    );
}

export async function adminListProducts(): Promise<AdminMenuProduct[]> {
  const { data, error } = await supabase
    .from("menu_products")
    .select(
      "id,name,category,category_id,price,description,price_options,availability_note,featured,image_url,is_visible,sort_order",
    )
    .order("category_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw formatCatalogError("adminListProducts", "public.menu_products", error);
  return (data ?? []) as AdminMenuProduct[];
}

export async function adminSaveProduct(input: ProductInput): Promise<AdminMenuProduct> {
  const name = input.name.trim();
  if (!name)
    throw new Error(
      "[adminSaveProduct] public.menu_products (VALIDATION): Le nom est obligatoire.",
    );
  if (!input.category_id)
    throw new Error(
      "[adminSaveProduct] public.menu_products (VALIDATION): La catégorie est obligatoire.",
    );
  if (!Number.isInteger(input.price) || input.price < 0)
    throw new Error(
      "[adminSaveProduct] public.menu_products (VALIDATION): Le prix doit être un entier positif ou nul.",
    );

  const { data, error } = await supabase
    .from("menu_products")
    .upsert(
      {
        ...input,
        name,
        description: input.description.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select(
      "id,name,category,category_id,price,description,price_options,availability_note,featured,image_url,is_visible,sort_order",
    )
    .single();
  if (error) throw formatCatalogError("adminSaveProduct", "public.menu_products", error);
  return data as AdminMenuProduct;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { data, error } = await supabase
    .from("menu_products")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw formatCatalogError("adminDeleteProduct", "public.menu_products", error);
  if (!data)
    throw new Error(
      "[adminDeleteProduct] public.menu_products (NO_ROW): aucun produit supprimé; vérifiez son identifiant et les droits admin.",
    );
}
