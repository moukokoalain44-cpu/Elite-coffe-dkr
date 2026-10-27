import { createFileRoute } from "@tanstack/react-router";
import { Check, Image, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { useAdmin, type SiteContent } from "@/contexts/AdminContext";
import { DEFAULT_SITE_MEDIA } from "@/hooks/use-site-media";
import { fetchSiteMedia, saveSiteMedia, type SiteMediaRow, uploadSiteMedia } from "@/lib/supabase";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

function ContentPage() {
  const { content, updateContent } = useAdmin();
  const [draft, setDraft] = useState(content);
  const [media, setMedia] = useState<SiteMediaRow[]>(DEFAULT_SITE_MEDIA);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const change = (key: keyof SiteContent, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  useEffect(() => {
    fetchSiteMedia()
      .then((rows) => rows.length && setMedia(rows))
      .catch(() => undefined);
  }, []);
  const save = () => {
    updateContent(draft);
    setSaved(true);
    toast.success("Contenu enregistré");
  };
  const updateMedia = (id: string, key: "url" | "alt_text", value: string) =>
    setMedia((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const saveMedia = async (item: SiteMediaRow) => {
    try {
      await saveSiteMedia(item);
      toast.success(`${item.label} mis à jour`);
    } catch {
      toast.error("Impossible d'enregistrer ce média");
    }
  };
  const replaceMedia = async (item: SiteMediaRow, file: File | undefined) => {
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
      toast.success(`${item.label} remplacé depuis votre appareil`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible d'importer ce média");
    } finally {
      setUploadingId(null);
    }
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Édition"
        title="Contenu & médias"
        description="Modifiez les textes et les visuels du site sans toucher au code."
        action={
          <button
            onClick={save}
            disabled={saved}
            className="flex items-center gap-2 rounded-2xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} /> Enregistrer les textes
          </button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <AdminCard>
          <div className="flex items-start justify-between border-b border-[#eee8e8] pb-5">
            <div>
              <h2 className="font-display text-2xl font-bold">Messages principaux</h2>
              <p className="mt-1 text-sm text-[#93878d]">
                Ces textes alimentent l’accueil et les pages publiques.
              </p>
            </div>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#2e8b68]">
                <Check size={14} /> À jour
              </span>
            )}
          </div>
          <div className="mt-6 space-y-5">
            <Editor
              label="Titre hero"
              value={draft.heroTitle}
              onChange={(value) => change("heroTitle", value)}
            />
            <Editor
              label="Description hero"
              value={draft.heroDescription}
              onChange={(value) => change("heroDescription", value)}
              multiline
            />
            <Editor
              label="Offre brunch"
              value={draft.lunchOffer}
              onChange={(value) => change("lunchOffer", value)}
            />
            <Editor
              label="Titre À propos"
              value={draft.aboutTitle}
              onChange={(value) => change("aboutTitle", value)}
            />
            <Editor
              label="Texte À propos"
              value={draft.aboutText}
              onChange={(value) => change("aboutText", value)}
              multiline
            />
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="font-display text-2xl font-bold">Coordonnées & horaires</h2>
          <p className="mt-1 text-sm text-[#93878d]">
            Les informations affichées dans les pages de contact.
          </p>
          <div className="mt-6 space-y-5">
            <Editor
              label="Adresse"
              value={draft.address}
              onChange={(value) => change("address", value)}
            />
            <Editor
              label="Téléphone"
              value={draft.phone}
              onChange={(value) => change("phone", value)}
            />
            <Editor
              label="Horaires"
              value={draft.hours}
              onChange={(value) => change("hours", value)}
              multiline
            />
          </div>
        </AdminCard>
      </div>
      <AdminCard className="mt-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#fbe9ef] text-[#a5365f]">
            <Image size={18} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Médias du site</h2>
            <p className="mt-1 text-sm text-[#93878d]">
              Tous les visuels publics sont modifiables ici. Chaque média possède une clé stable
              (`hero-main`, `gallery-1`, etc.) qui ne change pas lorsque son URL est remplacée.
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
                  <p className="text-xs text-[#93878d]">Emplacement : {item.slot}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d85f82] bg-[#fffaf5] px-3 py-3 text-xs font-bold text-[#a5365f] transition hover:bg-[#fff3e8]">
                  <Upload size={14} />
                  {uploadingId === item.id ? "Import en cours…" : "Remplacer depuis mon ordinateur"}
                  <input
                    type="file"
                    accept={
                      item.media_type === "video"
                        ? "video/mp4,video/webm,video/quicktime"
                        : "image/jpeg,image/png,image/webp,image/avif"
                    }
                    disabled={uploadingId !== null}
                    onChange={(event) => {
                      void replaceMedia(item, event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                    className="sr-only"
                  />
                </label>
                <label className="block text-xs font-bold text-[#5f554e]">
                  URL du média
                  <input
                    value={item.url}
                    onChange={(event) => updateMedia(item.id, "url", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#5f554e]">
                  Texte alternatif
                  <input
                    value={item.alt_text}
                    onChange={(event) => updateMedia(item.id, "alt_text", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]"
                  />
                </label>
                <button
                  onClick={() => saveMedia(item)}
                  className="flex items-center gap-2 rounded-xl bg-[#d85f82] px-3 py-2 text-xs font-bold text-white"
                >
                  <Save size={14} /> Enregistrer ce média
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}

function Editor({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const Component = multiline ? "textarea" : "input";
  return (
    <label className="block text-sm font-bold text-[#5f554e]">
      {label}
      <Component
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={multiline ? 4 : undefined}
        className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3.5 py-3 text-sm font-normal leading-6 outline-none transition-colors focus:border-[#d85f82] focus:ring-2 focus:ring-[#fbe9ef]"
      />
    </label>
  );
}
