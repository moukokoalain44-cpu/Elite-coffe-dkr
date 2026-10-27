import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Edit3, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, AdminPagination, StatusBadge } from "@/components/AdminChrome";
import { useAdmin, type Registration, type RegistrationStatus } from "@/contexts/AdminContext";
import { updateReservationDetails, updateReservationStatus } from "@/lib/supabase";

function canTransition(from: RegistrationStatus, to: RegistrationStatus) {
  if (from === to) return true;
  if (from === "pending") return to === "confirmed" || to === "cancelled";
  if (from === "confirmed") return to === "cancelled";
  return false;
}

export const Route = createFileRoute("/admin/registrations")({ component: RegistrationsPage });
function RegistrationsPage() {
  const { registrations, addRegistration, updateRegistration, deleteRegistration } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | RegistrationStatus>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Registration | null>(null);
  const [exportDate, setExportDate] = useState("");
  const filtered = useMemo(
    () =>
      registrations.filter(
        (item) =>
          `${item.name} ${item.phone} ${item.email ?? ""} ${item.occasion}`
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
      toast.success("Réservation supprimée");
    }
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Relation client"
        title="Réservations"
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
            + Nouvelle réservation
          </button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e7e2e5] bg-white p-4 shadow-sm">
        <label className="text-sm font-bold text-[#665b60]">Télécharger la liste du</label>
        <input
          type="date"
          value={exportDate}
          onChange={(event) => setExportDate(event.target.value)}
          className="rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-2 text-sm outline-none focus:border-[#d85f82]"
        />
        <button
          onClick={() => void downloadReservationsPdf(registrations, exportDate)}
          className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Download size={16} /> Télécharger le PDF
        </button>
        <span className="text-xs text-[#93878d]">Document organisé pour l’équipe en salle.</span>
      </div>
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
                    {row.email && (
                      <span className="mt-1 block text-xs text-[#9b8d91]">{row.email}</span>
                    )}
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
                        const next = e.target.value as RegistrationStatus;
                        if (!canTransition(row.status, next)) {
                          toast.error("Ce statut ne peut plus être réouvert.");
                          return;
                        }
                        const persist =
                          row.id.length > 20
                            ? updateReservationStatus(row.id, next)
                            : Promise.resolve();
                        void persist
                          .then(() => {
                            updateRegistration(row.id, { status: next });
                            toast.success("Statut de la réservation mis à jour");
                          })
                          .catch(() => toast.error("Le statut n’a pas pu être enregistré."));
                      }}
                      className="rounded-lg border-0 bg-transparent p-0 text-xs font-bold outline-none"
                    >
                      <option value="pending" disabled={row.status !== "pending"}>
                        En attente
                      </option>
                      <option
                        value="confirmed"
                        disabled={row.status === "confirmed" || row.status === "cancelled"}
                      >
                        Confirmée
                      </option>
                      <option value="cancelled" disabled={row.status === "cancelled"}>
                        Annulée
                      </option>
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
                    Aucune réservation ne correspond à ces filtres.
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
          onSave={async (patch) => {
            const exists = registrations.some((item) => item.id === editing.id);
            if (exists && editing.id.length > 20) {
              try {
                await updateReservationDetails(editing.id, {
                  name: patch.name ?? editing.name,
                  phone: patch.phone ?? editing.phone,
                  email: patch.email ?? editing.email ?? "",
                  date: patch.date ?? editing.date,
                  time: patch.time ?? editing.time,
                  guests: patch.guests ?? editing.guests,
                  occasion: patch.occasion ?? editing.occasion,
                  message: patch.message ?? editing.message,
                });
              } catch {
                toast.error("Les modifications n’ont pas pu être enregistrées.");
                return;
              }
            }
            if (exists) updateRegistration(editing.id, patch);
            else addRegistration({ ...editing, ...patch });
            toast.success(exists ? "Réservation modifiée" : "Réservation créée");
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

async function downloadReservationsPdf(rows: Registration[], selectedDate: string) {
  const { jsPDF } = await import("jspdf");
  const reservations = rows
    .filter((row) => !selectedDate || row.date === selectedDate)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 16;
  const dateLabel = selectedDate || "toutes-les-dates";
  pdf.setFillColor(58, 45, 51);
  pdf.rect(0, 0, pageWidth, 28, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("Elite Coffee — Réservations", margin, 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(
    selectedDate ? `Service du ${selectedDate}` : "Liste complète des réservations",
    margin,
    20,
  );
  pdf.setTextColor(44, 37, 42);
  pdf.setFontSize(10);
  pdf.text(
    `Document préparé le ${new Date().toLocaleDateString("fr-FR")} · ${reservations.length} réservation(s)`,
    margin,
    39,
  );
  let y = 49;
  const columns: [number, number, number, number, number, number] = [16, 50, 88, 108, 126, 174];
  pdf.setFillColor(249, 242, 245);
  pdf.roundedRect(margin, y - 6, pageWidth - margin * 2, 10, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  ["Heure", "Client / téléphone", "Convives", "Occasion", "Statut"].forEach((label, index) =>
    pdf.text(label, columns[index]!, y),
  );
  y += 11;
  pdf.setFont("helvetica", "normal");
  if (!reservations.length) {
    pdf.setFontSize(11);
    pdf.text("Aucune réservation pour cette date.", margin, y);
  }
  for (const row of reservations) {
    if (y > 275) {
      pdf.addPage();
      y = 20;
    }
    pdf.setDrawColor(232, 224, 229);
    pdf.line(margin, y + 4, pageWidth - margin, y + 4);
    pdf.setFontSize(9);
    pdf.text(row.time || "—", columns[0], y);
    pdf.text(
      `${row.name || "Sans nom"} · ${row.phone || "Téléphone à compléter"}`.slice(0, 36),
      columns[1],
      y,
    );
    pdf.text(String(row.guests), columns[2], y);
    pdf.text((row.occasion || "Table classique").slice(0, 22), columns[3], y);
    pdf.text(
      row.status === "confirmed"
        ? "Confirmée"
        : row.status === "cancelled"
          ? "Annulée"
          : "En attente",
      columns[4],
      y,
    );
    if (row.message) {
      pdf.setTextColor(110, 98, 105);
      pdf.setFontSize(8);
      pdf.text(`Note : ${row.message}`.slice(0, 100), columns[1], y + 5);
      pdf.setTextColor(44, 37, 42);
      y += 5;
    }
    y += 11;
  }
  pdf.setFontSize(8);
  pdf.setTextColor(140, 128, 136);
  pdf.text("Document interne — vérifier les demandes en attente avant le service.", margin, 287);
  pdf.save(`elite-coffee-reservations-${dateLabel}.pdf`);
}

function RegistrationModal({
  registration,
  onClose,
  onSave,
}: {
  registration: Registration;
  onClose: () => void;
  onSave: (patch: Partial<Registration>) => void | Promise<void>;
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
              Fiche réservation
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
            Adresse e-mail
            <input
              type="email"
              autoComplete="email"
              value={draft.email ?? ""}
              onChange={(event) => field("email", event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm font-normal outline-none focus:border-[#d85f82]"
            />
          </label>
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
            onClick={() => void onSave(draft)}
            className="flex items-center gap-2 rounded-xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white"
          >
            <Check size={16} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
