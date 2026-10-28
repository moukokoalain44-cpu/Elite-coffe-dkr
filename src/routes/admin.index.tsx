import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Image, MessageCircle, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { useAdmin } from "@/contexts/AdminContext";
import { fetchCustomersAdmin, fetchReservationMessageLogs } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const { registrations, products } = useAdmin();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [followupCount, setFollowupCount] = useState<number | null>(null);
  useEffect(() => {
    const refresh = () => Promise.all([fetchCustomersAdmin(), fetchReservationMessageLogs()])
      .then(([customers, messages]) => {
        setCustomerCount(customers.length);
        setFollowupCount(messages.length);
      })
      .catch(() => {
        setCustomerCount(0);
        setFollowupCount(0);
      });
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const pending = registrations.filter((item) => item.status === "pending").length;
  const categories = new Set(products.map((item) => item.category)).size;
  const cards = [
    {
      label: "Réservations en attente",
      value: pending,
      text: "À confirmer depuis l’espace réservation",
      icon: CalendarDays,
      to: "/admin/registrations",
      tone: "bg-[#fbe9ef] text-[#b9456e]",
    },
    {
      label: "Plats sur la carte",
      value: products.length,
      text: `${categories} catégories actives`,
      icon: Utensils,
      to: "/admin/catalog",
      tone: "bg-[#f1eff7] text-[#7a629b]",
    },
    {
      label: "Visuels administrables",
      value: "Galerie",
      text: "Images et vidéo modifiables par clé stable",
      icon: Image,
      to: "/admin/content",
      tone: "bg-[#eef4f2] text-[#4d8973]",
    },
    {
      label: "Clients CRM",
      value: customerCount ?? "—",
      text: "Contacts issus des formulaires publics",
      icon: Users,
      to: "/admin/clients",
      tone: "bg-[#f5f0e8] text-[#9b7140]",
    },
    {
      label: "Messages automatiques",
      value: followupCount ?? "—",
      text: "Demandes, confirmations et annulations envoyées",
      icon: MessageCircle,
      to: "/admin/communication",
      tone: "bg-[#edf3f8] text-[#4a759b]",
    },
  ];
  return (
    <>
      <AdminPageHeader
        eyebrow="Pilotage Elite Coffee"
        title="Votre espace restaurant"
        description="Une vue simple et utile sur les réservations, la carte et les contenus publiés."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, text, icon: Icon, to, tone }) => (
          <Link key={label} to={to} className="group">
            <AdminCard className="h-full transition hover:-translate-y-1 hover:border-[#e1a8b9]">
              <div className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
                <Icon size={21} />
              </div>
              <p className="mt-5 text-sm text-[#81757b]">{label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{value}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#9b8d91]">
                <span>{text}</span>
                <ChevronRight size={16} className="transition group-hover:translate-x-1" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <AdminCard>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">À traiter aujourd’hui</h2>
              <p className="mt-1 text-sm text-[#93878d]">
                Les actions les plus utiles pour garder le site à jour.
              </p>
            </div>
            <span className="rounded-full bg-[#fbe9ef] px-3 py-1 text-xs font-bold text-[#b9456e]">
              {pending} priorité(s)
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {pending > 0 && (
              <ActionLink
                to="/admin/registrations"
                title="Répondre aux réservations en attente"
                text={`${pending} demande(s) attendent une confirmation`}
              />
            )}
            <ActionLink
              to="/admin/catalog"
              title="Vérifier la carte publiée"
              text={`${products.length} plats et boissons enregistrés`}
            />
            <ActionLink
              to="/admin/content"
              title="Actualiser la galerie"
              text="Remplacer un visuel ou le motion hero"
            />
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="font-display text-2xl font-bold">Raccourcis</h2>
          <div className="mt-5 grid gap-3">
            <Link
              to="/admin/catalog"
              className="rounded-2xl bg-[#fdf4f6] p-4 text-sm font-bold text-[#a5365f] hover:bg-[#fbe9ef]"
            >
              + Ajouter un plat
            </Link>
            <Link
              to="/admin/registrations"
              className="rounded-2xl bg-[#f4f3f4] p-4 text-sm font-bold text-[#665b60] hover:bg-[#eee9eb]"
            >
              Voir les réservations
            </Link>
            <Link
              to="/admin/content"
              className="rounded-2xl bg-[#eef4f2] p-4 text-sm font-bold text-[#4d8973] hover:bg-[#e2efeb]"
            >
              Gérer les médias
            </Link>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
function ActionLink({ to, title, text }: { to: string; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-[#eee8e8] p-4 hover:border-[#e1a8b9] hover:bg-[#fffafd]"
    >
      <span>
        <strong className="block text-sm">{title}</strong>
        <small className="mt-1 block text-xs text-[#93878d]">{text}</small>
      </span>
      <ChevronRight size={17} className="text-[#b9456e]" />
    </Link>
  );
}
