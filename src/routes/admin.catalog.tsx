import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  adminDeleteCategory,
  adminDeleteProduct,
  adminListCategories,
  adminListProducts,
  adminSaveCategory,
  adminSaveProduct,
  type AdminMenuProduct,
} from "@/lib/catalog-admin";
import { formatCFA } from "@/lib/currency";
import { getOptimizedMenuImageUrl } from "@/lib/image-url";
import {
  deleteMenuImage,
  MAX_MENU_IMAGE_BYTES,
  MENU_IMAGE_MIME_TYPES,
  uploadMenuImage,
} from "@/lib/menu-images";
import type { MenuCategoryRow } from "@/lib/supabase";

export const Route = createFileRoute("/admin/catalog")({ component: CatalogPage });

type PriceOptionForm = { label: string; price: string; minQuantity: string };
type ProductForm = {
  name: string;
  category_id: string;
  price: string;
  description: string;
  price_options: PriceOptionForm[];
  availability_note: string;
  featured: boolean;
  image_url: string | null;
  is_visible: boolean;
  sort_order: string;
};
type CategoryForm = { name: string; description: string; sort_order: string };

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#e8e0e7] bg-white px-3.5 py-2.5 text-sm text-[#34272d] outline-none transition focus:border-[#d85f82] focus:ring-2 focus:ring-[#d85f82]/15";
const labelClass = "block text-xs font-bold text-[#695c63]";

function emptyProduct(categoryId = ""): ProductForm {
  return {
    name: "",
    category_id: categoryId,
    price: "",
    description: "",
    price_options: [],
    availability_note: "",
    featured: false,
    image_url: null,
    is_visible: true,
    sort_order: "0",
  };
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error || "Erreur inconnue");
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function newProductId(category: string, name: string): string {
  const base = slugify(`${category}-${name}`) || "menu-produit";
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${base}-${suffix}`;
}

function CatalogPage() {
  const [categories, setCategories] = useState<MenuCategoryRow[]>([]);
  const [products, setProducts] = useState<AdminMenuProduct[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastError, setLastError] = useState("");

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryRow | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: "",
    description: "",
    sort_order: "0",
  });
  const [savingCategory, setSavingCategory] = useState(false);

  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminMenuProduct | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      const [nextCategories, nextProducts] = await Promise.all([
        adminListCategories(),
        adminListProducts(),
      ]);
      setCategories(nextCategories);
      setProducts(nextProducts);
      setLastError("");
      setCategoryFilter((current) =>
        current === "Toutes" || nextCategories.some((item) => item.id === current)
          ? current
          : "Toutes",
      );
    } catch (error) {
      const message = errorText(error);
      setLastError(message);
      toast.error("Chargement du menu impossible", { description: message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!imagePreview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const filteredProducts = useMemo(() => {
    const text = query.trim().toLocaleLowerCase("fr");
    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.category_id);
      const matchesCategory = categoryFilter === "Toutes" || product.category_id === categoryFilter;
      const haystack =
        `${product.name} ${product.category} ${product.description} ${category?.name ?? ""}`.toLocaleLowerCase(
          "fr",
        );
      return matchesCategory && haystack.includes(text);
    });
  }, [categories, categoryFilter, products, query]);

  const productCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const groupedProducts = useMemo(
    () =>
      categories
        .filter((category) => categoryFilter === "Toutes" || category.id === categoryFilter)
        .map((category) => ({
          category,
          products: filteredProducts.filter((product) => product.category_id === category.id),
        }))
        .filter((group) => group.products.length > 0 || categoryFilter === group.category.id),
    [categories, categoryFilter, filteredProducts],
  );

  function openCategory(category?: MenuCategoryRow) {
    setEditingCategory(category ?? null);
    setCategoryForm(
      category
        ? {
            name: category.name,
            description: category.description ?? "",
            sort_order: String(category.sort_order),
          }
        : {
            name: "",
            description: "",
            sort_order: String(
              categories.length ? Math.max(...categories.map((item) => item.sort_order)) + 1 : 0,
            ),
          },
    );
    setCategoryDialogOpen(true);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCategory(true);
    try {
      await adminSaveCategory({
        ...(editingCategory ? { id: editingCategory.id } : {}),
        name: categoryForm.name,
        description: categoryForm.description,
        sort_order: Number(categoryForm.sort_order),
      });
      setCategoryDialogOpen(false);
      await loadData(false);
      toast.success(editingCategory ? "Catégorie mise à jour" : "Catégorie créée");
    } catch (error) {
      const message = errorText(error);
      setLastError(message);
      toast.error("Enregistrement de la catégorie impossible", { description: message });
    } finally {
      setSavingCategory(false);
    }
  }

  async function removeCategory(category: MenuCategoryRow) {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return;
    try {
      await adminDeleteCategory(category.id);
      await loadData(false);
      toast.success("Catégorie supprimée");
    } catch (error) {
      const message = errorText(error);
      setLastError(message);
      toast.error("Suppression de la catégorie impossible", { description: message });
    }
  }

  function openProduct(product?: AdminMenuProduct, categoryId?: string) {
    setEditingProduct(product ?? null);
    setImageFile(null);
    setProductForm(
      product
        ? {
            name: product.name,
            category_id: product.category_id,
            price: String(product.price),
            description: product.description,
            price_options: (product.price_options ?? []).map((option) => ({
              label: option.label,
              price: String(option.price),
              minQuantity: option.minQuantity ? String(option.minQuantity) : "",
            })),
            availability_note: product.availability_note ?? "",
            featured: product.featured,
            image_url: product.image_url,
            is_visible: product.is_visible,
            sort_order: String(product.sort_order),
          }
        : emptyProduct(categoryId ?? categories[0]?.id ?? ""),
    );
    setImagePreview(product?.image_url ? getOptimizedMenuImageUrl(product.image_url) : "");
    setProductSheetOpen(true);
  }

  function setPriceOption(index: number, field: keyof PriceOptionForm, value: string) {
    setProductForm((current) => ({
      ...current,
      price_options: current.price_options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option,
      ),
    }));
  }

  function handleImageChange(file: File | undefined) {
    if (!file) return;
    if (!MENU_IMAGE_MIME_TYPES.includes(file.type as (typeof MENU_IMAGE_MIME_TYPES)[number])) {
      toast.error("Format non pris en charge", {
        description: "Choisissez une image JPEG, PNG ou WebP.",
      });
      return;
    }
    if (file.size > MAX_MENU_IMAGE_BYTES) {
      toast.error("Image trop volumineuse", { description: "La limite est de 15 Mo." });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedCategory = categories.find((item) => item.id === productForm.category_id);
    if (!selectedCategory) {
      const message =
        "[adminSaveProduct] public.menu_products (CATEGORY_REQUIRED): choisissez une catégorie valide.";
      setLastError(message);
      toast.error(message);
      return;
    }

    const priceOptions: { label: string; price: number; minQuantity?: number }[] = [];
    for (const option of productForm.price_options) {
      if (!option.label.trim() && !option.price.trim() && !option.minQuantity.trim()) continue;
      const amount = Number(option.price);
      const minimum = option.minQuantity ? Number(option.minQuantity) : undefined;
      if (!option.label.trim() || !Number.isInteger(amount) || amount < 0) {
        const message =
          "[adminSaveProduct] public.menu_products (PRICE_OPTIONS): chaque option doit avoir un libellé et un prix entier positif ou nul.";
        setLastError(message);
        toast.error("Option de tarif incomplète", { description: message });
        return;
      }
      if (minimum !== undefined && (!Number.isInteger(minimum) || minimum < 1)) {
        const message =
          "[adminSaveProduct] public.menu_products (MIN_QUANTITY): la quantité minimale doit être un entier supérieur à 0.";
        setLastError(message);
        toast.error("Quantité minimale invalide", { description: message });
        return;
      }
      priceOptions.push({
        label: option.label.trim(),
        price: amount,
        ...(minimum ? { minQuantity: minimum } : {}),
      });
    }

    const amount = Number(productForm.price);
    if (!productForm.name.trim() || !Number.isInteger(amount) || amount < 0) {
      const message =
        "[adminSaveProduct] public.menu_products (VALIDATION): nom obligatoire et prix entier positif ou nul.";
      setLastError(message);
      toast.error("Vérifiez le nom et le tarif principal", { description: message });
      return;
    }

    setSavingProduct(true);
    const oldImage = editingProduct?.image_url ?? null;
    const productId = editingProduct?.id ?? newProductId(selectedCategory.name, productForm.name);
    let uploadedUrl: string | null = null;
    let databaseWriteAttempted = false;
    try {
      let nextImage = productForm.image_url;
      if (imageFile) {
        uploadedUrl = await uploadMenuImage(imageFile, productId);
        nextImage = uploadedUrl;
      }
      databaseWriteAttempted = true;
      await adminSaveProduct({
        id: productId,
        name: productForm.name,
        category: selectedCategory.name,
        category_id: selectedCategory.id,
        price: amount,
        description: productForm.description,
        price_options: priceOptions,
        availability_note: productForm.availability_note.trim() || null,
        featured: productForm.featured,
        image_url: nextImage,
        is_visible: productForm.is_visible,
        sort_order: Number(productForm.sort_order) || 0,
      });

      if (oldImage && oldImage !== nextImage) {
        try {
          await deleteMenuImage(oldImage);
        } catch (cleanupError) {
          console.error(
            "[adminSaveProduct][cleanup:deleteMenuImage] ancienne image non supprimée",
            cleanupError,
          );
          toast.warning("Produit enregistré, ancienne image conservée", {
            description: errorText(cleanupError),
          });
        }
      }

      setProductSheetOpen(false);
      setLastError("");
      await loadData(false);
      toast.success(editingProduct ? "Produit mis à jour" : "Produit ajouté à la carte");
    } catch (error) {
      let message = errorText(error);
      const databaseErrorCode = message.match(/\(([^)]+)\):/)?.[1];
      const databaseRejectedWrite = Boolean(databaseErrorCode && databaseErrorCode !== "UNKNOWN");
      if (uploadedUrl && (!databaseWriteAttempted || databaseRejectedWrite)) {
        try {
          await deleteMenuImage(uploadedUrl);
        } catch (cleanupError) {
          console.error(
            "[adminSaveProduct][rollback:deleteMenuImage] fichier orphelin",
            cleanupError,
          );
          message += `\n[rollback:deleteMenuImage] ${errorText(cleanupError)}`;
        }
      } else if (uploadedUrl) {
        console.warn(
          "[adminSaveProduct] résultat DB incertain; image conservée pour éviter une référence cassée.",
        );
        message +=
          "\n[image conservée] Résultat de sauvegarde incertain; vérifiez le produit avant de retenter l’ajout de cette photo.";
      }
      setLastError(message);
      console.error("[AdminMenu][adminSaveProduct] échec d’enregistrement", error);
      toast.error("Enregistrement du produit impossible", { description: message });
    } finally {
      setSavingProduct(false);
    }
  }

  async function removeProduct(product: AdminMenuProduct) {
    if (!window.confirm(`Supprimer « ${product.name} » de la carte ?`)) return;
    try {
      await adminDeleteProduct(product.id);
      let imageCleanupError = "";
      if (product.image_url) {
        try {
          await deleteMenuImage(product.image_url);
        } catch (cleanupError) {
          imageCleanupError = errorText(cleanupError);
          console.error(
            "[adminDeleteProduct][cleanup:deleteMenuImage] image conservée",
            cleanupError,
          );
        }
      }
      await loadData(false);
      if (imageCleanupError) {
        setLastError(imageCleanupError);
        toast.warning("Produit supprimé, image conservée dans Storage", {
          description: imageCleanupError,
        });
      } else {
        toast.success("Produit supprimé de la carte");
      }
    } catch (error) {
      const message = errorText(error);
      setLastError(message);
      console.error("[AdminMenu][adminDeleteProduct] échec de suppression", error);
      toast.error("Suppression du produit impossible", { description: message });
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Carte publique · Administration"
        title="Gestion du menu"
        description="Organisez les catégories et gérez chaque produit affiché sur la carte publique Elite Coffee."
      />
      <div className="space-y-5 pb-10">
        <AdminCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-xl font-bold text-[#34272d]">
                La carte, catégorie par catégorie
              </p>
              <p className="mt-1 text-sm text-[#93878d]">
                {products.length} produits · {categories.length} catégories · les changements
                alimentent le site public.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/menu"
                className="rounded-xl border border-[#e8e0e7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#695c63] hover:border-[#d85f82]"
              >
                Voir la carte publique
              </Link>
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e8e0e7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#695c63] hover:border-[#d85f82] disabled:opacity-50"
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Actualiser
              </button>
              <button
                type="button"
                onClick={() => openCategory()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d85f82]/25 bg-[#fbe9ef] px-3.5 py-2.5 text-sm font-bold text-[#a5365f] hover:bg-[#f7dbe5]"
              >
                <Plus size={16} /> Catégorie
              </button>
              <button
                type="button"
                onClick={() =>
                  openProduct(undefined, categoryFilter === "Toutes" ? undefined : categoryFilter)
                }
                disabled={!categories.length}
                className="inline-flex items-center gap-2 rounded-xl bg-[#a5365f] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#8f2e52] disabled:opacity-50"
              >
                <Plus size={16} /> Nouveau produit
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#eee8e8] pt-4 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-2 rounded-xl border border-[#e8e0e7] bg-white px-3 py-2.5 md:w-96">
              <Search size={17} className="text-[#9b8d91]" aria-hidden="true" />
              <span className="sr-only">Rechercher un produit ou une catégorie</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un produit ou une catégorie…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa0a5]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#81757b]">
              <span>Afficher</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-[#e8e0e7] bg-white px-3 py-2 text-sm text-[#34272d] outline-none focus:border-[#d85f82]"
                aria-label="Filtrer par catégorie"
              >
                <option value="Toutes">Toutes les catégories</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </AdminCard>

        {lastError && (
          <AdminCard className="border border-[#e7b4a7] bg-[#fff7f4]" aria-live="assertive">
            <p className="text-sm font-bold text-[#8c392c]">
              Blocage détecté — référence technique à transmettre
            </p>
            <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[#703b34]">
              {lastError}
            </pre>
          </AdminCard>
        )}

        {loading ? (
          <AdminCard className="grid min-h-48 place-items-center text-sm text-[#93878d]">
            <span className="flex items-center gap-2">
              <LoaderCircle size={18} className="animate-spin" /> Chargement du menu…
            </span>
          </AdminCard>
        ) : groupedProducts.length === 0 ? (
          <AdminCard className="p-10 text-center">
            <p className="font-display text-xl font-bold">Aucun produit trouvé</p>
            <p className="mt-2 text-sm text-[#93878d]">
              Essayez une autre recherche ou ajoutez un produit à cette catégorie.
            </p>
          </AdminCard>
        ) : (
          <div className="space-y-6">
            {groupedProducts.map(({ category, products: categoryProducts }) => (
              <section key={category.id} aria-labelledby={`menu-category-${slugify(category.id)}`}>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c45d7d]">
                      Catégorie · ordre {category.sort_order}
                    </p>
                    <h2
                      id={`menu-category-${slugify(category.id)}`}
                      className="font-display text-2xl font-bold text-[#34272d]"
                    >
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-1 max-w-2xl text-sm text-[#93878d]">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#fbe9ef] px-3 py-1 text-xs font-bold text-[#a5365f]">
                      {categoryFilter === "Toutes" && query
                        ? categoryProducts.length
                        : (productCountByCategory.get(category.id) ?? 0)}{" "}
                      produit{(productCountByCategory.get(category.id) ?? 0) === 1 ? "" : "s"}
                    </span>
                    <button
                      type="button"
                      onClick={() => openCategory(category)}
                      className="rounded-lg p-2 text-[#756b72] hover:bg-white hover:text-[#a5365f]"
                      aria-label={`Modifier la catégorie ${category.name}`}
                      title="Modifier la catégorie"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeCategory(category)}
                      className="rounded-lg p-2 text-[#a1462c] hover:bg-[#fff3ed]"
                      aria-label={`Supprimer la catégorie ${category.name}`}
                      title="Supprimer la catégorie"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openProduct(undefined, category.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#a5365f] shadow-sm hover:shadow"
                      aria-label={`Ajouter un produit à ${category.name}`}
                    >
                      <Plus size={14} /> Produit
                    </button>
                  </div>
                </div>

                {categoryProducts.length === 0 ? (
                  <AdminCard className="border-dashed py-6 text-center text-sm text-[#93878d]">
                    Aucun produit dans cette catégorie.{" "}
                    <button
                      type="button"
                      onClick={() => openProduct(undefined, category.id)}
                      className="font-bold text-[#a5365f] underline"
                    >
                      Ajouter le premier
                    </button>
                  </AdminCard>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <article
                        key={product.id}
                        className="overflow-hidden rounded-2xl border border-[#eee8e8] bg-white shadow-sm"
                      >
                        <div className="relative h-40 bg-[#f5edf0]">
                          {product.image_url ? (
                            <img
                              src={getOptimizedMenuImageUrl(product.image_url)}
                              alt={product.name}
                              width={640}
                              height={320}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div
                              className="grid size-full place-items-center text-[#bd9eaa]"
                              aria-label="Aucune image"
                            >
                              <ImagePlus size={28} />
                            </div>
                          )}
                          <span
                            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${product.is_visible ? "bg-white/90 text-[#428366]" : "bg-[#3f3639]/80 text-white"}`}
                          >
                            {product.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                            {product.is_visible ? "Visible" : "Masqué"}
                          </span>
                          {product.featured && (
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#a5365f]/90 px-2 py-1 text-[10px] font-bold text-white">
                              <Star size={11} fill="currentColor" /> À la une
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="truncate font-display text-lg font-bold">
                              {product.name}
                            </h3>
                            <span className="shrink-0 text-xs text-[#9b8d91]">
                              ordre {product.sort_order}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#81757b]">
                            {product.description || "Aucune description"}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <strong className="text-[#a5365f]">{formatCFA(product.price)}</strong>
                            <span className="text-right text-[11px] text-[#9b8d91]">
                              {product.price_options?.length
                                ? `${product.price_options.length} option(s) tarifaire(s)`
                                : product.availability_note || "Tarif principal"}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-[#f0ebee] pt-3">
                            <span className="text-[11px] text-[#9b8d91]">
                              {product.availability_note || "Disponibilité habituelle"}
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => openProduct(product)}
                                className="rounded-lg p-2 text-[#756b72] hover:bg-[#fbe9ef] hover:text-[#a5365f]"
                                aria-label={`Modifier ${product.name}`}
                                title="Modifier"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void removeProduct(product)}
                                className="rounded-lg p-2 text-[#a1462c] hover:bg-[#fff3ed]"
                                aria-label={`Supprimer ${product.name}`}
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[#eee8e8] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              Les produits liés suivent le nom de la catégorie sur la carte publique.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => void saveCategory(event)} className="space-y-4">
            <label className={labelClass}>
              Nom de la catégorie
              <input
                required
                maxLength={80}
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, name: event.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Description (facultatif)
              <textarea
                rows={3}
                maxLength={500}
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, description: event.target.value }))
                }
                className={`${inputClass} resize-y`}
              />
            </label>
            <label className={labelClass}>
              Ordre d’affichage
              <input
                type="number"
                step="1"
                value={categoryForm.sort_order}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, sort_order: event.target.value }))
                }
                className={inputClass}
              />
            </label>
            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCategoryDialogOpen(false)}
                className="rounded-xl border border-[#e8e0e7] px-4 py-2.5 text-sm font-semibold text-[#695c63]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={savingCategory}
                className="rounded-xl bg-[#a5365f] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {savingCategory ? "Enregistrement…" : "Enregistrer"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={productSheetOpen} onOpenChange={setProductSheetOpen}>
        <SheetContent className="flex w-full flex-col overflow-y-auto border-[#eee8e8] bg-[#fcfafb] p-0 sm:max-w-2xl">
          <SheetHeader className="border-b border-[#eee8e8] bg-white px-6 py-5 pr-14">
            <SheetTitle className="font-display text-xl">
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </SheetTitle>
            <SheetDescription>
              Les champs enregistrés alimentent directement la carte publique Elite Coffee.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={(event) => void saveProduct(event)} className="flex flex-1 flex-col">
            <div className="space-y-5 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Nom du produit
                  <input
                    required
                    maxLength={120}
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Catégorie
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, category_id: event.target.value }))
                    }
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Tarif principal (FCFA)
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, price: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Ordre dans la catégorie
                  <input
                    type="number"
                    step="1"
                    value={productForm.sort_order}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, sort_order: event.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <label className={labelClass}>
                Description
                <textarea
                  rows={3}
                  maxLength={1500}
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className={`${inputClass} resize-y`}
                />
              </label>

              <div className="rounded-2xl border border-[#eee8e8] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#34272d]">Tarifs complémentaires</p>
                    <p className="mt-1 text-xs text-[#93878d]">
                      Formats, bouteille, tailles ou prix selon quantité.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((current) => ({
                        ...current,
                        price_options: [
                          ...current.price_options,
                          { label: "", price: "", minQuantity: "" },
                        ],
                      }))
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-[#fbe9ef] px-2.5 py-2 text-xs font-bold text-[#a5365f]"
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
                {productForm.price_options.length === 0 ? (
                  <p className="mt-3 text-xs text-[#9b8d91]">Aucun tarif complémentaire.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {productForm.price_options.map((option, index) => (
                      <div
                        key={`price-option-${index}`}
                        className="grid gap-2 sm:grid-cols-[1fr_130px_130px_auto]"
                      >
                        <label className="sr-only" htmlFor={`option-label-${index}`}>
                          Libellé de l’option
                        </label>
                        <input
                          id={`option-label-${index}`}
                          placeholder="Libellé (PM, GM…)"
                          value={option.label}
                          onChange={(event) => setPriceOption(index, "label", event.target.value)}
                          className="rounded-lg border border-[#e8e0e7] px-3 py-2 text-sm outline-none focus:border-[#d85f82]"
                        />
                        <label className="sr-only" htmlFor={`option-price-${index}`}>
                          Prix de l’option
                        </label>
                        <input
                          id={`option-price-${index}`}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Prix FCFA"
                          value={option.price}
                          onChange={(event) => setPriceOption(index, "price", event.target.value)}
                          className="rounded-lg border border-[#e8e0e7] px-3 py-2 text-sm outline-none focus:border-[#d85f82]"
                        />
                        <label className="sr-only" htmlFor={`option-min-${index}`}>
                          Quantité minimale
                        </label>
                        <input
                          id={`option-min-${index}`}
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Qté min."
                          value={option.minQuantity}
                          onChange={(event) =>
                            setPriceOption(index, "minQuantity", event.target.value)
                          }
                          className="rounded-lg border border-[#e8e0e7] px-3 py-2 text-sm outline-none focus:border-[#d85f82]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm((current) => ({
                              ...current,
                              price_options: current.price_options.filter(
                                (_, optionIndex) => optionIndex !== index,
                              ),
                            }))
                          }
                          className="rounded-lg p-2 text-[#a1462c] hover:bg-[#fff3ed]"
                          aria-label="Retirer ce tarif"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Note de disponibilité
                  <input
                    maxLength={180}
                    value={productForm.availability_note}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        availability_note: event.target.value,
                      }))
                    }
                    placeholder="Ex. selon arrivage"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Photo du produit
                  <span className="mt-1.5 flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-[#d8c8d0] bg-white px-3 py-2.5 text-sm font-semibold text-[#695c63] hover:border-[#d85f82]">
                    <ImagePlus size={17} className="text-[#a5365f]" />
                    Choisir JPEG, PNG ou WebP
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => handleImageChange(event.target.files?.[0])}
                      className="sr-only"
                    />
                  </span>
                  <span className="mt-1 block text-[11px] font-normal text-[#9b8d91]">
                    Bucket menu-images · maximum 15 Mo.
                  </span>
                </label>
              </div>
              {imagePreview && (
                <div className="flex items-center gap-3 rounded-2xl border border-[#eee8e8] bg-white p-3">
                  <img
                    src={imagePreview}
                    alt="Aperçu de la photo du produit"
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {imageFile?.name ?? "Photo actuelle"}
                    </p>
                    <p className="text-xs text-[#93878d]">Affichée dans le menu public.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setProductForm((current) => ({ ...current, image_url: null }));
                    }}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-[#a1462c] hover:bg-[#fff3ed]"
                  >
                    Retirer
                  </button>
                </div>
              )}

              <div className="grid gap-3 rounded-2xl border border-[#eee8e8] bg-white p-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#695c63]">
                  <input
                    type="checkbox"
                    checked={productForm.is_visible}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        is_visible: event.target.checked,
                      }))
                    }
                    className="size-4 accent-[#a5365f]"
                  />
                  Visible sur la carte publique
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#695c63]">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, featured: event.target.checked }))
                    }
                    className="size-4 accent-[#a5365f]"
                  />
                  Mettre à la une
                </label>
              </div>
            </div>
            <SheetFooter className="mt-auto border-t border-[#eee8e8] bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => setProductSheetOpen(false)}
                className="rounded-xl border border-[#e8e0e7] px-4 py-2.5 text-sm font-semibold text-[#695c63]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={savingProduct || categories.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a5365f] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {savingProduct && <LoaderCircle size={15} className="animate-spin" />}
                {savingProduct
                  ? "Enregistrement…"
                  : editingProduct
                    ? "Enregistrer les modifications"
                    : "Ajouter à la carte"}
              </button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
