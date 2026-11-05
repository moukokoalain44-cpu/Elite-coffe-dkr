import { createFileRoute } from "@tanstack/react-router";
import { Check, ImagePlus, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { useAdminAuth } from "@/contexts/AuthContext";
import { isInlineAvatarDataUri, saveAdminAvatarProfile } from "@/lib/admin-avatar";
import { uploadSiteMedia } from "@/lib/supabase";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { session, updateProfile } = useAdminAuth();
  const [name, setName] = useState("Oripio Studio");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);
  const previewObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!session || initialized.current) return;
    initialized.current = true;
    const metadata = session.user.user_metadata ?? {};
    const savedAvatar = String(metadata["avatar_url"] ?? "");
    setName(String(metadata["full_name"] ?? "Oripio Studio"));
    setAvatar(savedAvatar);
    setAvatarPreview(savedAvatar);
  }, [session]);

  useEffect(
    () => () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    },
    [],
  );

  const save = async () => {
    const displayName = name.trim() || "Administrateur";
    const existingAvatar = avatar;
    setSaving(true);

    try {
      const nextAvatar = await saveAdminAvatarProfile({
        name: displayName,
        avatar: existingAvatar,
        avatarFile,
        updateProfile,
        uploadFile: (file) => uploadSiteMedia(file, "admin-avatar"),
      });
      setName(displayName);
      setAvatar(nextAvatar);
      setAvatarFile(null);
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
        previewObjectUrl.current = null;
      }
      setAvatarPreview(nextAvatar);
      toast.success("Profil administrateur enregistré dans votre compte");
    } catch (error) {
      toast.error("Impossible d’enregistrer le profil administrateur", {
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
      });
    } finally {
      setSaving(false);
    }
  };

  const chooseAvatar = (file: File | undefined) => {
    if (!file) return;
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Format d’avatar non pris en charge", {
        description: "Choisissez une image JPEG, PNG, WebP ou AVIF.",
      });
      return;
    }

    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewObjectUrl.current);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Personnalisez l’identité affichée dans le back-office Elite Coffee."
        action={
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60"
          >
            <Check size={16} /> {saving ? "Enregistrement…" : "Enregistrer"}
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
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
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
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) => {
                    chooseAvatar(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-[#93878d]">
              L’image est stockée dans Storage; seul son URL est conservé dans le profil.
              {isInlineAvatarDataUri(avatar) &&
                " L’ancien avatar intégré sera migré lors de l’enregistrement."}
            </p>
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
            Le nom et l’avatar sont liés à votre compte administrateur. La session et les droits
            d’accès restent gérés par Supabase.
          </p>
        </AdminCard>
      </div>
    </>
  );
}
