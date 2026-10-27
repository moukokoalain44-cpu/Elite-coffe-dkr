import { createFileRoute } from "@tanstack/react-router";
import { Check, ImagePlus, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const [name, setName] = useState("Oripio Studio");
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    setName(localStorage.getItem("elite-admin-name") || "Oripio Studio");
    setAvatar(localStorage.getItem("elite-admin-avatar") || "");
  }, []);
  const save = () => {
    localStorage.setItem("elite-admin-name", name.trim() || "Administrateur");
    localStorage.setItem("elite-admin-avatar", avatar);
    window.dispatchEvent(new Event("elite-admin-profile-updated"));
    toast.success("Profil administrateur enregistré");
  };
  const chooseAvatar = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez une image");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Personnalisez l’identité affichée dans le back-office Elite Coffee."
        action={
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-2xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white"
          >
            <Check size={16} /> Enregistrer
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#fbe9ef] text-[#a5365f]">
              <UserRound size={20} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Profil administrateur</h2>
              <p className="text-sm text-[#93878d]">
                Nom et avatar visibles dans la barre supérieure.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-[#fbe9ef] text-lg font-bold text-[#a5365f]">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar administrateur"
                    className="size-full object-cover"
                  />
                ) : (
                  name.slice(0, 2).toUpperCase()
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d85f82] px-3 py-2.5 text-sm font-bold text-[#a5365f]">
                <ImagePlus size={16} /> Choisir un avatar
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    chooseAvatar(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            <label className="block text-sm font-bold">
              Nom affiché
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none focus:border-[#d85f82]"
              />
            </label>
            <label className="block text-sm font-bold">
              Rôle
              <input
                value="Super administrateur"
                readOnly
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none"
              />
            </label>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#e6f5ee] text-[#2e8b68]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Accès & sécurité</h2>
              <p className="text-sm text-[#93878d]">Compte authentifié par Supabase Auth.</p>
            </div>
          </div>
          <p className="mt-6 rounded-2xl bg-[#fff3d9] p-4 text-sm leading-6 text-[#8e681f]">
            Les préférences de profil sont conservées sur cet appareil. La session et les droits
            d’accès restent gérés par Supabase.
          </p>
        </AdminCard>
      </div>
    </>
  );
}
