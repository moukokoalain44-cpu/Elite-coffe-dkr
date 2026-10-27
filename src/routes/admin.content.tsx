import { createFileRoute } from "@tanstack/react-router";
import { Check, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { useAdmin, type SiteContent } from "@/contexts/AdminContext";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

function ContentPage() {
  const { content, updateContent } = useAdmin();
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(true);
  const change = (key: keyof SiteContent, value: string) => { setDraft((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = () => { updateContent(draft); setSaved(true); toast.success("Textes enregistrés"); };
  return <><AdminPageHeader eyebrow="Contenu" title="Textes du site" description="Modifiez les messages, coordonnées et horaires. Pour les images et vidéos, utilisez la rubrique Galerie." action={<button onClick={save} disabled={saved} className="flex items-center gap-2 rounded-2xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Save size={16} /> Enregistrer les textes</button>} /><div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><AdminCard><div className="flex items-start justify-between border-b border-[#eee8e8] pb-5"><div><h2 className="font-display text-2xl font-bold">Messages principaux</h2><p className="mt-1 text-sm text-[#93878d]">Ces textes alimentent l’accueil et les pages publiques.</p></div>{saved && <span className="flex items-center gap-1 text-xs font-bold text-[#2e8b68]"><Check size={14} /> À jour</span>}</div><div className="mt-6 space-y-5"><Editor label="Titre hero" value={draft.heroTitle} onChange={(value) => change("heroTitle", value)} /><Editor label="Description hero" value={draft.heroDescription} onChange={(value) => change("heroDescription", value)} multiline /><Editor label="Offre brunch" value={draft.lunchOffer} onChange={(value) => change("lunchOffer", value)} /><Editor label="Titre À propos" value={draft.aboutTitle} onChange={(value) => change("aboutTitle", value)} /><Editor label="Texte À propos" value={draft.aboutText} onChange={(value) => change("aboutText", value)} multiline /></div></AdminCard><AdminCard><h2 className="font-display text-2xl font-bold">Coordonnées & horaires</h2><p className="mt-1 text-sm text-[#93878d]">Les informations affichées dans les pages publiques.</p><div className="mt-6 space-y-5"><Editor label="Adresse" value={draft.address} onChange={(value) => change("address", value)} /><Editor label="Téléphone" value={draft.phone} onChange={(value) => change("phone", value)} /><Editor label="Horaires" value={draft.hours} onChange={(value) => change("hours", value)} multiline /></div></AdminCard></div></>;
}
function Editor({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) { const Component = multiline ? "textarea" : "input"; return <label className="block text-sm font-bold text-[#665b60]">{label}<Component value={value} onChange={(event) => onChange(event.target.value)} rows={multiline ? 4 : undefined} className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3.5 py-3 text-sm font-normal leading-6 outline-none focus:border-[#d85f82] focus:ring-2 focus:ring-[#fbe9ef]" /></label>; }
