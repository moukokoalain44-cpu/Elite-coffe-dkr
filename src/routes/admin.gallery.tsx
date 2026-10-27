import { createFileRoute } from "@tanstack/react-router";
import { Image, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { DEFAULT_SITE_MEDIA } from "@/hooks/use-site-media";
import { fetchSiteMedia, saveSiteMedia, type SiteMediaRow, uploadSiteMedia } from "@/lib/supabase";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdminPage });

function GalleryAdminPage() {
  const [media, setMedia] = useState<SiteMediaRow[]>(DEFAULT_SITE_MEDIA);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  useEffect(() => { fetchSiteMedia().then((rows) => rows.length && setMedia(rows)).catch(() => undefined); }, []);
  const update = (id: string, key: "url" | "alt_text", value: string) => setMedia((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const save = async (item: SiteMediaRow) => { try { await saveSiteMedia(item); toast.success(`${item.label} mis à jour`); } catch { toast.error("Impossible d’enregistrer ce média"); } };
  const replace = async (item: SiteMediaRow, file: File | undefined) => {
    if (!file) return;
    setUploadingId(item.id);
    try { const url = await uploadSiteMedia(file, item.id); const next = { ...item, url, media_type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const) }; setMedia((items) => items.map((current) => current.id === item.id ? next : current)); await saveSiteMedia(next); toast.success(`${item.label} remplacé`); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Import impossible"); }
    finally { setUploadingId(null); }
  };
  return <><AdminPageHeader eyebrow="Galerie" title="Images & vidéos du site" description="Remplacez les visuels publics depuis un emplacement unique. Les clés stables restent inchangées." /><AdminCard><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#fbe9ef] text-[#a5365f]"><Image size={18} /></span><div><h2 className="font-display text-2xl font-bold">Médias administrables</h2><p className="mt-1 text-sm text-[#93878d]">Chaque visuel est ciblé par une clé stable comme hero-main ou gallery-1.</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2">{media.map((item) => <div key={item.id} className="rounded-2xl border border-[#eee8e8] bg-[#fdfbfc] p-4"><div className="flex gap-3"><div className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#fbe9ef]">{item.media_type === "video" ? <video src={item.url} muted autoPlay loop className="size-full object-cover" /> : <img src={item.url} alt={item.alt_text} className="size-full object-cover" />}</div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c45d7d]">{item.media_type === "video" ? "Vidéo" : "Image"}</p><h3 className="mt-1 font-display text-lg font-bold">{item.label}</h3><p className="text-xs text-[#93878d]">Clé stable : {item.id}</p></div></div><div className="mt-4 space-y-3"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#d85f82] bg-[#fff7f9] px-3 py-3 text-xs font-bold text-[#a5365f]"><Upload size={14} />{uploadingId === item.id ? "Import en cours…" : "Remplacer le média"}<input type="file" accept={item.media_type === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"} className="sr-only" disabled={uploadingId !== null} onChange={(event) => { void replace(item, event.target.files?.[0]); event.currentTarget.value = ""; }} /></label><label className="block text-xs font-bold text-[#665b60]">URL<input value={item.url} onChange={(event) => update(item.id, "url", event.target.value)} className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]" /></label><label className="block text-xs font-bold text-[#665b60]">Texte alternatif<input value={item.alt_text} onChange={(event) => update(item.id, "alt_text", event.target.value)} className="mt-1 w-full rounded-xl border border-[#e7e2e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#d85f82]" /></label><button onClick={() => void save(item)} className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-3 py-2 text-xs font-bold text-white"><Save size={14} /> Enregistrer</button></div></div>)}</div></AdminCard></>;
}
