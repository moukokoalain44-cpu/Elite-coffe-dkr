import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { fetchCustomersAdmin, type CustomerRow } from "@/lib/supabase";

export const Route = createFileRoute("/admin/clients")({ component: ClientsPage });

function ClientsPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const refresh = () =>
      fetchCustomersAdmin()
        .then(setCustomers)
        .catch(() => toast.error("Impossible de charger les clients."));
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const visible = useMemo(() => {
    const term = query.toLocaleLowerCase("fr").trim();
    return customers.filter(
      (item) =>
        !term ||
        `${item.name} ${item.email ?? ""} ${item.phone}`.toLocaleLowerCase("fr").includes(term),
    );
  }, [customers, query]);
  const whatsapp = (customer: CustomerRow) => {
    const phone = customer.phone.replace(/\D/g, "");
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${customer.name}, ici Elite Coffee. `)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const email = (customer: CustomerRow) => {
    if (!customer.email) {
      toast.error("Ce client n’a pas renseigné d’adresse e-mail.");
      return;
    }
    window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent("Elite Coffee — votre demande")}`;
  };
  return (
    <>
      <AdminPageHeader
        eyebrow="Relation client"
        title="Clients"
        description="Le répertoire rassemble les coordonnées laissées dans les réservations et formulaires du site."
        action={
          <div className="rounded-2xl border border-[#e7e2e5] bg-white px-5 py-3 text-sm">
            <strong>{customers.length}</strong> contact(s)
          </div>
        }
      />
      <AdminCard>
        <div className="relative max-w-xl">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8d91]"
            size={17}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, e-mail ou téléphone…"
            className="w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d85f82]"
          />
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[#eee8e8] text-xs uppercase tracking-wider text-[#93878d]">
              <tr>
                <th className="px-3 py-3">Client</th>
                <th className="px-3 py-3">Téléphone</th>
                <th className="px-3 py-3">E-mail</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((customer) => (
                <tr key={customer.id} className="border-b border-[#eee8e8] last:border-0">
                  <td className="px-3 py-4 font-bold">{customer.name}</td>
                  <td className="px-3 py-4">{customer.phone}</td>
                  <td className="px-3 py-4 text-[#93878d]">{customer.email || "—"}</td>
                  <td className="px-3 py-4 text-xs text-[#93878d]">{customer.source}</td>
                  <td className="px-3 py-4">
                    <button
                      onClick={() => whatsapp(customer)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#e8f7ed] px-3 py-2 text-xs font-bold text-[#237747]"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                    <button
                      onClick={() => email(customer)}
                      disabled={!customer.email}
                      className="ml-2 inline-flex items-center gap-2 rounded-xl bg-[#f3edf8] px-3 py-2 text-xs font-bold text-[#6d4d8d] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Mail size={14} /> E-mail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="grid place-items-center gap-2 py-16 text-sm text-[#93878d]">
              <UsersRound size={28} /> Aucun client trouvé.
            </div>
          )}
        </div>
      </AdminCard>
    </>
  );
}
