import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, AdminPagination } from "@/components/AdminChrome";
import { formatCFA } from "@/lib/currency";
import { getOptimizedMenuImageUrl } from "@/lib/image-url";
import {
  createMenuCategory,
  createMenuProduct,
  deleteMenuCategory,
  deleteMenuProduct,
  fetchMenuCategories,
  fetchMenuProductsAdmin,
  removeMenuProductMedia,
  type MenuCategoryRow,
  type MenuProductInput,
  type MenuProductRow,
  updateMenuProduct,
  uploadMenuProductMedia,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin/catalog")({ component: CatalogPage });

type Draft = Omit<MenuProductRow, "id"> & { id?: string };
const blank = (category = "Nouvelle catégorie"): Draft => ({
  name: "",
  category,
  price: 0,
  description: "",
  price_options: [],
  availability_note: "Disponible sur place",
  featured: false,
  image_url: null,
  is_visible: true,
  sort_order: 0,
});

function CatalogPage() {
  const [products, setProducts] = useState<MenuProductRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<MenuCategoryRow[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const pageSize = 8;

  const refresh = async () => {
    try {
      const [items, groups] = await Promise.all([fetchMenuProductsAdmin(), fetchMenuCategories()]);
      setProducts(items);
      setCategoryRows(groups);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de charger la carte");
    }
  };
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const categories = useMemo(
    () => [...new Set([...categoryRows.map((item) => item.name), ...products.map((item) => item.category)])].sort(),
    [categoryRows, products],
  );
  const filtered = useMemo(
    () =>
      products.filter((item) => {
        const matchesText = `${item.name} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesText && (category === "Toutes" || item.category === category);
      }),
    [products, query, category],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const openDraft = (nextDraft: Draft) => {
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    setDraft(nextDraft);
  };

  const closeDraft = () => {
    setImagePreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return null;
    });
    setPendingImageFile(null);
    setDraft(null);
  };

  const save = async () => {
    if (!draft?.name.trim() || !draft.category.trim() || Number(draft.price) < 0) {
      toast.error("Renseignez le nom, la catégorie et un prix valide.");
      return;
    }
    setSaving(true);
    let uploadedImagePath: string | null = null;
    try {
      const { id: _id, ...draftFields } = draft;
      let imageUrl = draft.image_url;
      if (pendingImageFile && draft.id) {
        const uploaded = await uploadMenuProductMedia(pendingImageFile, draft.id);
        uploadedImagePath = uploaded.path;
        imageUrl = uploaded.publicUrl;
      }
      const payload: MenuProductInput = {
        ...draftFields,
        name: draft.name.trim(),
        category: draft.category.trim(),
        price: Number(draft.price),
        image_url: imageUrl,
      };
      const saved = draft.id
        ? await updateMenuProduct(draft.id, payload)
        : await createMenuProduct(payload);
      setProducts((current) =>
        draft.id
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current],
      );
      closeDraft();
      toast.success(draft.id ? "Modifications enregistrées" : "Plat ajouté à la carte", {
        description: pendingImageFile
          ? "L’image est enregistrée et sera visible sur la carte publique après synchronisation."
          : "Les informations du plat ont bien été enregistrées.",
      });
    } catch (error) {
      if (uploadedImagePath) {
        await removeMenuProductMedia(uploadedImagePath).catch(() => undefined);
      }
      toast.error(error instanceof Error ? error.message : "Impossible d’enregistrer le plat");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (item: MenuProductRow) => {
    if (!window.confirm(`Supprimer « ${item.name} » de la carte ?`)) return;
    try {
      await deleteMenuProduct(item.id);
      setProducts((current) => current.filter((row) => row.id !== item.id));
      toast.success("Plat supprimé");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de supprimer ce plat");
    }
  };
  const removeCategory = async (name: string) => {
    const items = products.filter((item) => item.category === name);
    if (items.length) {
      toast.error("Supprimez ou déplacez d’abord les plats de cette catégorie.");
      return;
    }
    setCategory("Toutes");
    toast.success("Catégorie retirée de la liste");
  };
  const selectImage = (file: File | undefined) => {
    if (!file || !draft) return;
    if (!draft.id) {
      toast.error("Enregistrez d’abord le plat avant d’ajouter une image.");
      return;
    }
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return localPreviewUrl;
    });
    setPendingImageFile(file);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Gestion de la carte"
        title="Menu & catégories"
        description="Ajoutez, modifiez ou retirez les plats réellement proposés sur place. Chaque changement est enregistré dans Supabase."
        action={
          <button
            onClick={() => openDraft(blank())}
            className="flex items-center gap-2 rounded-2xl bg-[#d85f82] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-14px_#d85f82]"
          >
            <Plus size={17} /> Nouveau plat
          </button>
        }
      />
      <div className="space-y-5">
        <AdminCard className="p-0">
          <button type="button" onClick={() => setCategoriesOpen((value) => !value)} className="flex w-full items-center justify-between px-5 py-4 text-left">
            <span><strong className="font-display text-xl">Catégories</strong><span className="ml-3 text-sm text-[#93878d]">{category === "Toutes" ? "Toutes les catégories" : category}</span></span>
            <ChevronDown size={19} className={`text-[#a5365f] transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
          </button>
          {categoriesOpen && <div className="flex flex-wrap gap-2 border-t border-[#eee8e8] px-5 py-4">
            <button onClick={() => { setCategory("Toutes"); setPage(1); setCategoriesOpen(false); }} className={`rounded-full px-3 py-2 text-sm font-semibold ${category === "Toutes" ? "bg-[#fbe9ef] text-[#a5365f]" : "bg-[#f4f3f4] text-[#756b72]"}`}>Toutes <span className="ml-1 text-xs">{products.length}</span></button>
            {categories.map((name) => <button key={name} onClick={() => { setCategory(name); setPage(1); setCategoriesOpen(false); }} className={`rounded-full px-3 py-2 text-sm font-semibold ${category === name ? "bg-[#fbe9ef] text-[#a5365f]" : "bg-[#f4f3f4] text-[#756b72]"}`}>{name} <span className="ml-1 text-xs">{products.filter((item) => item.category === name).length}</span></button>)}
          </div>}
        </AdminCard>
        <AdminCard className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-[#eee8e8] p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-[#e8e0e7] bg-white px-3 py-2.5 md:w-96">
              <Search size={17} className="text-[#9b8d91]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher un plat…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa0a5]"
              />
            </div>
            <span className="text-sm text-[#93878d]">{filtered.length} plats</span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-[#eee8e8] bg-[#fdfbfc]"
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
                    <div className="grid size-full place-items-center text-[#bd9eaa]">
                      <ImagePlus size={28} />
                    </div>
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[10px] font-bold ${product.is_visible ? "bg-white/90 text-[#428366]" : "bg-[#3f3639]/80 text-white"}`}
                  >
                    {product.is_visible ? "Visible" : "Masqué"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c45d7d]">
                    {product.category}
                  </p>
                  <h2 className="mt-1 truncate font-display text-lg font-bold">{product.name}</h2>
                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#81757b]">
                    {product.description || "Aucune description"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <strong className="text-[#a5365f]">{formatCFA(product.price)}</strong>
                    <span className="text-[11px] text-[#9b8d91]">
                      {product.availability_note || "Sur place"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-[#eee8e8] px-4 py-3">
                  <button
                    onClick={() => openDraft(product)}
                    className="flex items-center gap-1 text-xs font-bold text-[#a5365f]"
                  >
                    <Pencil size={13} /> Modifier
                  </button>
                  <button
                    onClick={() => void remove(product)}
                    className="rounded-lg p-2 text-[#b45f73] hover:bg-[#fbe9ef]"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <AdminPagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </AdminCard>
      </div>
      {draft && (
        <div className="fixed inset-0 z-[70] bg-[#2c2025]/30">
          <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-[#eadde2] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c45d7d]">
                  Édition de la carte
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold">
                  {draft.id ? "Modifier le plat" : "Ajouter un plat"}
                </h2>
              </div>
              <button onClick={closeDraft} className="rounded-xl p-2 hover:bg-[#f8f1f3]">
                <X size={19} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Nom du plat">
                <input
                  value={draft.name}
                  onChange={(event) => setField("name", event.target.value)}
                />
              </Field>
              <Field label="Catégorie">
                <input
                  list="menu-categories"
                  value={draft.category}
                  onChange={(event) => setField("category", event.target.value)}
                />
                <datalist id="menu-categories">
                  {categories.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
              <Field label="Prix en FCFA">
                <input
                  type="number"
                  min="0"
                  value={draft.price}
                  onChange={(event) => setField("price", Number(event.target.value))}
                />
              </Field>
              <Field label="Disponibilité">
                <input
                  value={draft.availability_note ?? ""}
                  onChange={(event) => setField("availability_note", event.target.value)}
                  placeholder="Disponible sur place"
                />
              </Field>
              <Field label="Description" wide>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setField("description", event.target.value)}
                />
              </Field>
              <Field label="Image du plat" wide>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d97897] bg-[#fff7f9] px-4 py-3 text-xs font-bold text-[#a5365f]">
                    <ImagePlus size={15} />{" "}
                    {pendingImageFile ? "Image prête à enregistrer" : "Télécharger une image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(event) => {
                        selectImage(event.target.files?.[0]);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {(imagePreviewUrl || draft.image_url) && (
                    <img
                      src={
                        imagePreviewUrl ||
                        (draft.image_url
                          ? getOptimizedMenuImageUrl(draft.image_url)
                          : undefined)
                      }
                      alt="Aperçu"
                      className="h-44 w-full rounded-2xl border border-[#eadde2] object-cover"
                    />
                  )}
                </div>
              </Field>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.is_visible}
                  onChange={(event) => setField("is_visible", event.target.checked)}
                />{" "}
                Visible sur la carte
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) => setField("featured", event.target.checked)}
                />{" "}
                Mettre en avant
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={closeDraft}
                className="rounded-xl border border-[#e8e0e7] px-4 py-3 text-sm font-bold text-[#776d72]"
              >
                Annuler
              </button>
              <button
                onClick={() => void save()}
                disabled={saving}
                className="rounded-xl bg-[#d85f82] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block text-sm font-bold text-[#665b60] ${wide ? "md:col-span-2" : ""}`}>
      {label}
      <div className="mt-2 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#e8e0e7] [&_input]:bg-[#fdfbfc] [&_input]:px-3.5 [&_input]:py-3 [&_input]:font-normal [&_input]:outline-none [&_input]:focus:border-[#d97897] [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#e8e0e7] [&_textarea]:bg-[#fdfbfc] [&_textarea]:px-3.5 [&_textarea]:py-3 [&_textarea]:font-normal [&_textarea]:outline-none">
        {children}
      </div>
    </label>
  );
}
