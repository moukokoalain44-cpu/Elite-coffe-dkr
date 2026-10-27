import { createFileRoute } from "@tanstack/react-router";
import { Image, Plus, Save, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { DEFAULT_SITE_MEDIA } from "@/hooks/use-site-media";
import { fetchSiteMedia, saveSiteMedia, type SiteMediaRow, uploadSiteMedia } from "@/lib/supabase";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdminPage });

function createGalleryKey(media: SiteMediaRow[]) {
  const used = new Set(media.map((item) => item.id));
  let index = 1;
  while (used.has(`gallery-${index}`)) index += 1;
  return `gallery-${index}`;
}

function normalizeGalleryKey(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.startsWith("gallery-") ? normalized : `gallery-${normalized}`;
}

function GalleryAdminPage() {
  const [media, setMedia] = useState<SiteMediaRow[]>(DEFAULT_SITE_MEDIA);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    id: createGalleryKey(DEFAULT_SITE_MEDIA),
    label: "Nouvelle image galerie",
    alt_text: "Image Elite Coffee",
    url: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchSiteMedia()
      .then((rows) => {
        if (!rows.length) return;
        setMedia(rows);
        setDraft((current) => ({ ...current, id: createGalleryKey(rows) }));
      })
      .catch(() => undefined);
  }, []);

  const galleryMedia = useMemo(
    () => media.filter((item) => item.slot.startsWith("gallery-")),
    [media],
  );

  const update = (id: string, key: "url" | "alt_text", value: string) =>
    setMedia((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));

  const save = async (item: SiteMediaRow) => {
    try {
      await saveSiteMedia(item);
      toast.success(`${item.label} mis à jour`);
    } catch {
      toast.error("Impossible d’enregistrer ce média");
    }
  };

  const replace = async (item: SiteMediaRow, file: File | undefined) => {
    if (!file) return;
    setUploadingId(item.id);
    try {
      const url = await uploadSiteMedia(file, item.id);
      const next = {
        ...item,
        url,
        media_type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      };
      setMedia((items) => items.map((current) => (current.id === item.id ? next : current)));
      await saveSiteMedia(next);
      toast.success(`${item.label} remplacé`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import impossible");
    } finally {
      setUploadingId(null);
    }
  };

  const addImage = async () => {
    const id = normalizeGalleryKey(draft.id);
    if (!draft.label.trim() || !draft.alt_text.trim()) {
      toast.error("Renseignez le nom et le texte alternatif de l’image.");
      return;
    }
    if (media.some((item) => item.id === id)) {
      toast.error(`La clé stable « ${id} » existe déjà.`);
      return;
    }
    if (!draft.file && !draft.url.trim()) {
      toast.error("Importez une image ou renseignez une URL.");
      return;
    }

    setUploadingId("new-gallery-image");
    try {
      const url = draft.file ? await uploadSiteMedia(draft.file, id) : draft.url.trim();
      const item: SiteMediaRow = {
        id,
        label: draft.label.trim(),
        slot: id,
        media_type: "image",
        url,
        alt_text: draft.alt_text.trim(),
        is_visible: true,
        sort_order: Math.max(0, ...galleryMedia.map((mediaItem) => mediaItem.sort_order)) + 1,
      };
      await saveSiteMedia(item);
      setMedia((items) => [...items, item].sort((a, b) => a.sort_order - b.sort_order));
      setDraft({
        id: createGalleryKey([...media, item]),
        label: "Nouvelle image galerie",
        alt_text: "Image Elite Coffee",
        url: "",
        file: null,
      });
      setAdding(false);
      toast.success("Image ajoutée à la galerie publique");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d’ajouter cette image");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Galerie"
        title="Images & vidéos du site"
        description="Remplacez les visuels publics depuis un emplacement unique. Les clés stables restent inchangées."
        action={
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#d85f82] px-4 py-3 text-sm font-bold text-white"
          >
            <Plus size={17} /> Ajouter une image
          </button>
        }
      />
      <AdminCard>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#fbe9ef] text-[#a5365f]">
            <Image size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Médias administrables</h2>
            <p className="mt-1 text-sm text-[#93878d]">
              Une image ajoutée avec une clé <strong>gallery-*</strong> apparaît automatiquement sur
              la galerie publique.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {media.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#eee8e8] bg-[#fdfbfc] p-4">
              <div className="flex gap-3">
                <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#fbe9ef]">
                  {item.media_type === "video" ? (
                    <video src={item.url} muted autoPlay loop className="size-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.alt_text} className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c45d7d]">
                    {item.media_type === "video" ? "Vidéo" : "Image"}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">{item.label}</h3>
                  <p className="text-xs text-[#93878d]">Clé stable : {item.id}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d85f82] bg-[#fff7f9] px-3 py-3 text-xs font-bold text-[#a5365f]">
                  <Upload size={14} />
                  {uploadingId === item.id ? "Import en cours…" : "Remplacer le média"}
                  <input
                    type="file"
                    accept={
                      item.media_type === "video"
                        ? "video/mp4,video/webm,video/quicktime"
                        : "image/jpeg,image/png,image/webp,image/avif"
                    }
                    className="sr-only"
                    disabled={uploadingId !== null}
                    onChange={(event) => {
                      void replace(item, event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                <label className="block text-xs font-bold text-[#665b60]">
                  URL
                  <input
                    value={item.url}
                    onChange={(event) => update(item.id, "url", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#665b60]">
                  Texte alternatif
                  <input
                    value={item.alt_text}
                    onChange={(event) => update(item.id, "alt_text", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                  />
                </label>
                <button
                  onClick={() => void save(item)}
                  className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-3 py-2 text-xs font-bold text-white"
                >
                  <Save size={14} /> Enregistrer
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
      {adding && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#2c252a]/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c45d7d]">
                  Galerie publique
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">Ajouter une image</h2>
                <p className="mt-2 text-sm text-[#93878d]">
                  La clé est préremplie et sera utilisée par la galerie publique.
                </p>
              </div>
              <button
                onClick={() => setAdding(false)}
                className="rounded-xl p-2 hover:bg-[#f4f3f4]"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-[#665b60]">
                Clé stable
                <input
                  value={draft.id}
                  onChange={(event) => setDraft({ ...draft, id: event.target.value })}
                  onBlur={() => setDraft({ ...draft, id: normalizeGalleryKey(draft.id) })}
                  className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-mono text-sm outline-none focus:border-[#d85f82]"
                />
                <span className="mt-1 block text-xs font-normal text-[#93878d]">
                  Exemple : gallery-5
                </span>
              </label>
              <label className="block text-sm font-bold text-[#665b60]">
                Nom de l’image
                <input
                  value={draft.label}
                  onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none focus:border-[#d85f82]"
                />
              </label>
              <label className="block text-sm font-bold text-[#665b60]">
                Texte alternatif
                <input
                  value={draft.alt_text}
                  onChange={(event) => setDraft({ ...draft, alt_text: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none focus:border-[#d85f82]"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d85f82] bg-[#fff7f9] px-3 py-4 text-sm font-bold text-[#a5365f]">
                <Upload size={17} />
                {draft.file?.name ?? "Choisir une image depuis les fichiers"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) =>
                    setDraft({ ...draft, file: event.target.files?.[0] ?? null })
                  }
                />
              </label>
              <div className="text-center text-xs text-[#93878d]">ou</div>
              <input
                value={draft.url}
                onChange={(event) => setDraft({ ...draft, url: event.target.value })}
                placeholder="https://…"
                className="w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm outline-none focus:border-[#d85f82]"
              />
              <button
                onClick={() => void addImage()}
                disabled={uploadingId === "new-gallery-image"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                <Plus size={16} />
                {uploadingId === "new-gallery-image"
                  ? "Ajout en cours…"
                  : "Ajouter à la galerie publique"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
