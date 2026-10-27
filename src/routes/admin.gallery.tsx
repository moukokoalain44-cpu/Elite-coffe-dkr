import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, Image, Plus, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import {
  ADMIN_LOGIN_MEDIA_ID,
  DEFAULT_ADMIN_LOGIN_MEDIA,
  DEFAULT_SITE_MEDIA,
} from "@/hooks/use-site-media";
import { fetchSiteMedia, saveSiteMedia, type SiteMediaRow, uploadSiteMedia } from "@/lib/supabase";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

function keepLoginCover(rows: SiteMediaRow[]) {
  if (rows.some((item) => item.id === ADMIN_LOGIN_MEDIA_ID)) return rows;
  return [...rows, DEFAULT_ADMIN_LOGIN_MEDIA].sort(
    (first, second) => first.sort_order - second.sort_order,
  );
}

function GalleryAdminPage() {
  const [media, setMedia] = useState<SiteMediaRow[]>(DEFAULT_SITE_MEDIA);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [loginCoverPreview, setLoginCoverPreview] = useState<SiteMediaRow | null>(null);
  const [loginCoverFile, setLoginCoverFile] = useState<File | null>(null);
  const [loginCoverPreviewUrl, setLoginCoverPreviewUrl] = useState<string | null>(null);
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
        const withLoginCover = keepLoginCover(rows);
        setMedia(withLoginCover);
        setDraft((current) => ({ ...current, id: createGalleryKey(withLoginCover) }));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!loginCoverFile) {
      setLoginCoverPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(loginCoverFile);
    setLoginCoverPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [loginCoverFile]);

  const galleryMedia = useMemo(
    () => media.filter((item) => item.slot.startsWith("gallery-")),
    [media],
  );
  const loginCover =
    media.find((item) => item.id === ADMIN_LOGIN_MEDIA_ID) ?? DEFAULT_ADMIN_LOGIN_MEDIA;
  const displayedLoginCover = loginCoverPreview
    ? { ...loginCoverPreview, url: loginCoverPreviewUrl ?? loginCoverPreview.url }
    : loginCover;

  const update = (id: string, key: "url" | "alt_text", value: string) => {
    if (id === ADMIN_LOGIN_MEDIA_ID) {
      setLoginCoverFile(null);
      setLoginCoverPreview((current) => ({ ...(current ?? loginCover), [key]: value }));
      return;
    }
    setMedia((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

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
    if (item.id === ADMIN_LOGIN_MEDIA_ID) {
      setLoginCoverFile(file);
      setLoginCoverPreview({
        ...loginCover,
        label: "Visuel de connexion administrateur",
        media_type: "image",
      });
      return;
    }
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

  const previewLoginCoverFromGallery = (source: SiteMediaRow) => {
    const next: SiteMediaRow = {
      ...loginCover,
      label: "Visuel de connexion administrateur",
      slot: ADMIN_LOGIN_MEDIA_ID,
      media_type: "image",
      url: source.url,
      alt_text: source.alt_text || source.label,
      is_visible: true,
    };
    setLoginCoverFile(null);
    setLoginCoverPreview(next);
  };

  const saveLoginCoverPreview = async () => {
    if (!loginCoverPreview) return;
    setUploadingId("login-cover-save");
    try {
      const url = loginCoverFile
        ? await uploadSiteMedia(loginCoverFile, ADMIN_LOGIN_MEDIA_ID)
        : loginCoverPreview.url;
      const savedCover = { ...loginCoverPreview, url, media_type: "image" as const };
      await saveSiteMedia(savedCover);
      setMedia((items) =>
        items.some((item) => item.id === ADMIN_LOGIN_MEDIA_ID)
          ? items.map((item) => (item.id === ADMIN_LOGIN_MEDIA_ID ? savedCover : item))
          : [...items, savedCover],
      );
      setLoginCoverPreview(null);
      setLoginCoverFile(null);
      toast.success("Visuel de connexion mis à jour");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de définir ce visuel");
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
      setMedia((items) =>
        [...items, item].sort((first, second) => first.sort_order - second.sort_order),
      );
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
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#d85f82] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#bd496c]"
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
              la galerie publique. Vous pouvez aussi choisir son visuel de connexion.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {media.map((item) => {
            const isLoginCover = item.id === ADMIN_LOGIN_MEDIA_ID;
            const cardItem = isLoginCover ? displayedLoginCover : item;
            const isCurrentLoginSource =
              !isLoginCover && item.media_type === "image" && item.url === loginCover.url;
            const isPreviewedLoginSource =
              !isLoginCover &&
              item.media_type === "image" &&
              item.url === loginCoverPreview?.url &&
              item.url !== loginCover.url;
            return (
              <div key={item.id} className="rounded-2xl border border-[#eee8e8] bg-[#fdfbfc] p-4">
                <div className="flex gap-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#fbe9ef]">
                    {cardItem.media_type === "video" ? (
                      <video
                        src={cardItem.url}
                        muted
                        autoPlay
                        loop
                        className="size-full object-cover"
                      />
                    ) : (
                      <img
                        src={cardItem.url}
                        alt={cardItem.alt_text}
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c45d7d]">
                      {isLoginCover
                        ? loginCoverPreview
                          ? "Aperçu non enregistré"
                          : "Visuel connexion"
                        : item.media_type === "video"
                          ? "Vidéo"
                          : "Image"}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold">{cardItem.label}</h3>
                    <p className="text-xs text-[#93878d]">
                      {isLoginCover ? "Clé stable du visuel de connexion" : "Clé stable"}:{" "}
                      <code className="font-semibold text-[#5b4636]">{item.id}</code>
                    </p>
                  </div>
                </div>
                {isLoginCover && (
                  <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-xl bg-[#eee8e1]">
                    <img
                      src={displayedLoginCover.url}
                      alt={displayedLoginCover.alt_text}
                      className="size-full object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-[#211811]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                      {loginCoverPreview
                        ? "Aperçu avant enregistrement"
                        : "Visuel actuellement enregistré"}
                    </span>
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d85f82] bg-[#fff7f9] px-3 py-3 text-xs font-bold text-[#a5365f]">
                    <Upload size={14} />
                    {uploadingId === item.id ? "Import en cours…" : "Remplacer le média"}
                    <input
                      type="file"
                      accept={
                        cardItem.media_type === "video"
                          ? "video/mp4,video/webm,video/quicktime"
                          : "image/jpeg,image/png,image/webp,image/avif"
                      }
                      className="sr-only"
                      disabled={uploadingId !== null}
                      onChange={(event) => {
                        void replace(cardItem, event.target.files?.[0]);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <label className="block text-xs font-bold text-[#665b60]">
                    URL
                    <input
                      value={cardItem.url}
                      onChange={(event) => update(item.id, "url", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                    />
                  </label>
                  <label className="block text-xs font-bold text-[#665b60]">
                    Texte alternatif
                    <input
                      value={cardItem.alt_text}
                      onChange={(event) => update(item.id, "alt_text", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        isLoginCover && loginCoverPreview
                          ? void saveLoginCoverPreview()
                          : void save(item)
                      }
                      className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#291d22]"
                    >
                      <Save size={14} />
                      {isLoginCover && loginCoverPreview ? "Enregistrer l’aperçu" : "Enregistrer"}
                    </button>
                    {isLoginCover && loginCoverPreview && (
                      <button
                        type="button"
                        disabled={uploadingId !== null}
                        onClick={() => {
                          setLoginCoverPreview(null);
                          setLoginCoverFile(null);
                        }}
                        className="rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-xs font-bold text-[#665b60] transition hover:bg-[#f7f3ef] disabled:opacity-60"
                      >
                        Annuler l’aperçu
                      </button>
                    )}
                    {item.slot.startsWith("gallery-") && item.media_type === "image" && (
                      <button
                        type="button"
                        disabled={
                          uploadingId !== null || isCurrentLoginSource || isPreviewedLoginSource
                        }
                        onClick={() => previewLoginCoverFromGallery(item)}
                        className="flex items-center gap-2 rounded-xl border border-[#eadfce] bg-white px-3 py-2.5 text-xs font-bold text-[#715239] transition hover:border-[#bd946f] hover:bg-[#faf5ed] disabled:cursor-default disabled:opacity-70"
                      >
                        {isCurrentLoginSource || isPreviewedLoginSource ? (
                          <Check size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {isCurrentLoginSource
                          ? "Visuel de connexion actuel"
                          : isPreviewedLoginSource
                            ? "Aperçu sélectionné"
                            : "Prévisualiser pour la connexion"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto border-l border-[#eadfd4] bg-[#fcfbf9] p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-[#eee6dc] bg-white px-6 py-6 pr-14 text-left sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b25c72]">
              Galerie publique
            </p>
            <SheetTitle className="mt-1 font-display text-3xl font-bold text-[#2a211b]">
              Ajouter une image
            </SheetTitle>
            <SheetDescription className="text-sm leading-6 text-[#887b70]">
              Le panneau s’ouvre à côté de votre médiathèque. La clé stable relie l’image à la
              galerie publique.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 px-6 py-6 sm:px-8">
            <label className="block text-sm font-bold text-[#57483c]">
              Clé stable
              <input
                value={draft.id}
                onChange={(event) => setDraft({ ...draft, id: event.target.value })}
                onBlur={() =>
                  setDraft((current) => ({ ...current, id: normalizeGalleryKey(current.id) }))
                }
                className="mt-2 w-full rounded-xl border border-[#e6ddd2] bg-white px-3 py-3 font-mono text-sm outline-none transition focus:border-[#b07657] focus:ring-4 focus:ring-[#b07657]/10"
              />
              <span className="mt-1.5 block text-xs font-normal text-[#93877c]">
                Identifiant public, par exemple : gallery-5
              </span>
            </label>
            <label className="block text-sm font-bold text-[#57483c]">
              Nom de l’image
              <input
                value={draft.label}
                onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e6ddd2] bg-white px-3 py-3 font-normal outline-none transition focus:border-[#b07657] focus:ring-4 focus:ring-[#b07657]/10"
              />
            </label>
            <label className="block text-sm font-bold text-[#57483c]">
              Texte alternatif
              <input
                value={draft.alt_text}
                onChange={(event) => setDraft({ ...draft, alt_text: event.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e6ddd2] bg-white px-3 py-3 font-normal outline-none transition focus:border-[#b07657] focus:ring-4 focus:ring-[#b07657]/10"
              />
            </label>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d8b8a4] bg-[#fffaf5] px-5 py-6 text-center text-sm font-bold text-[#895c42] transition hover:border-[#b07657] hover:bg-[#fbf1e7]">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-[#a36b4b] shadow-sm">
                <Upload size={18} />
              </span>
              <span>{draft.file?.name ?? "Choisir une image depuis les fichiers"}</span>
              <span className="text-xs font-normal text-[#9a8b7c]">JPG, PNG, WebP ou AVIF</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, file: event.target.files?.[0] ?? null }))
                }
              />
            </label>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#ad9e90]">
              <span className="h-px flex-1 bg-[#e9e0d6]" />
              ou renseignez une URL
              <span className="h-px flex-1 bg-[#e9e0d6]" />
            </div>
            <label className="block text-sm font-bold text-[#57483c]">
              URL de l’image
              <input
                type="url"
                value={draft.url}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, url: event.target.value }))
                }
                placeholder="https://…"
                className="mt-2 w-full rounded-xl border border-[#e6ddd2] bg-white px-3 py-3 text-sm font-normal outline-none transition focus:border-[#b07657] focus:ring-4 focus:ring-[#b07657]/10"
              />
            </label>
          </div>

          <SheetFooter className="sticky bottom-0 flex-row border-t border-[#eee6dc] bg-white px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => setAdding(false)}
              disabled={uploadingId === "new-gallery-image"}
              className="rounded-xl border border-[#e8dfd5] px-4 py-3 text-sm font-semibold text-[#74665b] transition hover:bg-[#f8f4ef] disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => void addImage()}
              disabled={uploadingId === "new-gallery-image"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4b3021] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#352115] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {uploadingId === "new-gallery-image" ? "Ajout en cours…" : "Ajouter à la galerie"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
