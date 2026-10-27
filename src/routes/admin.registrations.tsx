import { createFileRoute } from "@tanstack/react-router";
import { Check, Edit3, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, AdminPagination, StatusBadge } from "@/components/AdminChrome";
import { useAdmin, type Registration, type RegistrationStatus } from "@/contexts/AdminContext";

export const Route = createFileRoute("/admin/registrations")({ component: RegistrationsPage });
function RegistrationsPage() {
  const { registrations, addRegistration, updateRegistration, deleteRegistration } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | RegistrationStatus>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Registration | null>(null);
  const filtered = useMemo(
    () =>
      registrations.filter(
        (item) =>
          `${item.name} ${item.phone} ${item.occasion}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "all" || item.status === status),
      ),
    [registrations, query, status],
  );
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const remove = (item: Registration) => {
    if (window.confirm(`Supprimer la réservation de ${item.name} ?`)) {
      deleteRegistration(item.id);
      toast.success("Inscription supprimée");
    }
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Relation client"
        title="Inscriptions"
        description="Gérez les demandes de réservation et gardez une vue claire sur les prochains services."
        action={
          <button
            onClick={() =>
              setEditing({
                id: `RES-${Date.now()}`,
                name: "",
                phone: "",
                date: "",
                time: "",
                guests: 2,
                occasion: "Table classique",
                message: "",
                status: "pending",
                createdAt: new Date().toISOString(),
              })
            }
            className="rounded-2xl bg-[#d85f82] px-4 py-3 text-sm font-bold text-white"
          >
            + Nouvelle inscription
          </button>
        }
      />
      <AdminCard className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-[#eee8e8] p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-[#e7e2e5] px-3 py-2.5 md:w-80">
            <Search size={17} className="text-[#9b8d91]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un client…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa098]"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setStatus(item);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-2 text-xs font-bold ${status === item ? "bg-[#3a2d33] text-white" : "bg-[#f4f3f4] text-[#756b72]"}`}
              >
                {item === "all"
                  ? "Toutes"
                  : item === "pending"
                    ? "En attente"
                    : item === "confirmed"
                      ? "Confirmées"
                      : "Annulées"}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#fdfbfc] text-[11px] uppercase tracking-[0.14em] text-[#a89aa2]">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date & heure</th>
                <th className="px-6 py-4">Convives</th>
                <th className="px-6 py-4">Occasion</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-[#f1ece7] hover:bg-[#fffaf6]">
                  <td className="px-6 py-4">
                    <strong>{row.name || "Sans nom"}</strong>
                    <span className="mt-1 block text-xs text-[#9b8d91]">
                      {row.phone || "Téléphone à compléter"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#665b60]">
                    {row.date} · {row.time}
                  </td>
                  <td className="px-6 py-4">{row.guests}</td>
                  <td className="px-6 py-4 text-[#665b60]">{row.occasion}</td>
                  <td className="px-6 py-4">
                    <select
                      value={row.status}
                      onChange={(e) => {
                        updateRegistration(row.id, {
                          status: e.target.value as RegistrationStatus,
                        });
                        toast.success("Statut mis à jour");
                      }}
                      className="rounded-lg border-0 bg-transparent p-0 text-xs font-bold outline-none"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(row)}
                        className="rounded-lg p-2 text-[#756b72] hover:bg-[#fbe9ef] hover:text-[#8c4f2d]"
                        aria-label="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => remove(row)}
                        className="rounded-lg p-2 text-[#a65b48] hover:bg-[#fff0ed]"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[#93878d]">
                    Aucune inscription ne correspond à ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          page={Math.min(page, totalPages)}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </AdminCard>
      {editing && (
        <RegistrationModal
          registration={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            const exists = registrations.some((item) => item.id === editing.id);
            if (exists) updateRegistration(editing.id, patch);
            else addRegistration({ ...editing, ...patch });
            toast.success(exists ? "Inscription modifiée" : "Inscription créée");
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
function RegistrationModal({
  registration,
  onClose,
  onSave,
}: {
  registration: Registration;
  onClose: () => void;
  onSave: (patch: Partial<Registration>) => void;
}) {
  const [draft, setDraft] = useState(registration);
  const field = (key: keyof Registration, value: string | number) =>
    setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#2c252a]/35 p-4">
      <div className="w-full max-w-xl rounded-[26px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c45d7d]">
              Fiche inscription
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              {registration.name || "Nouvelle demande"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-[#f4f3f4]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["name", "Nom complet"],
              ["phone", "Téléphone"],
              ["date", "Date"],
              ["time", "Heure"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-xs font-bold text-[#756b72]">
              {label}
              <input
                value={String(draft[key])}
                onChange={(e) => field(key, e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d85f82]"
              />
            </label>
          ))}
          <label className="text-xs font-bold text-[#756b72]">
            Convives
            <input
              type="number"
              min={1}
              value={draft.guests}
              onChange={(e) => field("guests", Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d85f82]"
            />
          </label>
          <label className="text-xs font-bold text-[#756b72]">
            Occasion
            <select
              value={draft.occasion}
              onChange={(e) => field("occasion", e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d85f82]"
            >
              <option>Table classique</option>
              <option>Petit déjeuner</option>
              <option>Anniversaire</option>
              <option>Déjeuner professionnel</option>
              <option>Brunch</option>
              <option>Événement privé</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block text-xs font-bold text-[#756b72]">
          Message
          <textarea
            value={draft.message}
            onChange={(e) => field("message", e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d85f82]"
          />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-sm font-bold text-[#756b72]"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white"
          >
            <Check size={16} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
