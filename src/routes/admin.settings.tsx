import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserRound } from "lucide-react";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });
function SettingsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Les accès et préférences du back-office Elite Coffee."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#fbe9ef] text-[#a5365f]">
              <UserRound size={20} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Profil administrateur</h2>
              <p className="text-sm text-[#93878d]">Compte principal du studio</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              Nom
              <input
                value="Oripio Studio"
                readOnly
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none"
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
              <p className="text-sm text-[#93878d]">
                Préparation de l’authentification super admin
              </p>
            </div>
          </div>
          <p className="mt-6 rounded-2xl bg-[#fff3d9] p-4 text-sm leading-6 text-[#8e681f]">
            L’interface d’administration est prête. Le branchement à Supabase Auth et aux règles RLS
            pourra être activé dans une phase dédiée sans modifier les écrans.
          </p>
        </AdminCard>
      </div>
    </>
  );
}
