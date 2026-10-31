import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Image,
  MessageCircle,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import { useAdmin } from "@/contexts/AdminContext";
import { fetchCustomersAdminCount, fetchReservationMessageLogCount } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const { registrations, products } = useAdmin();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [followupCount, setFollowupCount] = useState<number | null>(null);
  useEffect(() => {
    const refresh = () =>
      Promise.all([fetchCustomersAdminCount(), fetchReservationMessageLogCount()])
        .then(([customers, messages]) => {
          setCustomerCount(customers);
          setFollowupCount(messages);
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
      label: "À confirmer",
      value: pending,
      detail: "réservations en attente",
      icon: CalendarDays,
      to: "/admin/registrations",
      tone: "bg-[#fbe9ef] text-[#b9456e]",
    },
    {
      label: "Carte active",
      value: products.length,
      detail: `${categories} catégories`,
      icon: Utensils,
      to: "/admin/catalog",
      tone: "bg-[#f1eff7] text-[#7a629b]",
    },
    {
      label: "Clients",
      value: customerCount ?? "—",
      detail: "contacts enregistrés",
      icon: Users,
      to: "/admin/clients",
      tone: "bg-[#f5f0e8] text-[#9b7140]",
    },
    {
      label: "Messages",
      value: followupCount ?? "—",
      detail: "journal automatique",
      icon: MessageCircle,
      to: "/admin/communication",
      tone: "bg-[#edf3f8] text-[#4a759b]",
    },
    {
      label: "Médias",
      value: "OK",
      detail: "galerie administrable",
      icon: Image,
      to: "/admin/gallery",
      tone: "bg-[#eef4f2] text-[#4d8973]",
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Pilotage Elite Coffee"
        title="Vue d’ensemble"
        description="Les signaux essentiels du restaurant, réunis dans un espace compact et actionnable."
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadfe2] bg-white/75 px-4 py-3 shadow-[0_10px_30px_-26px_rgba(91,56,38,.45)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#756b72]">
          <span className="size-2 rounded-full bg-[#4d9979] shadow-[0_0_0_4px_#e6f4ed]" />
          Données synchronisées automatiquement
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b29fa7]">
          Actualisation 30 s
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ label, value, detail, icon: Icon, to, tone }) => (
          <Link key={label} to={to} className="group">
            <AdminCard className="flex min-h-[124px] h-full flex-col justify-between p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#e1a8b9] hover:shadow-[0_18px_35px_-26px_rgba(91,56,38,.5)] md:p-3.5">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid size-9 place-items-center rounded-xl ${tone}`}>
                  <Icon size={17} />
                </span>
                <ChevronRight size={14} className="mt-1 text-[#c2b4ba] transition group-hover:translate-x-1 group-hover:text-[#b9456e]" />
              </div>
              <div className="mt-3 min-w-0">
                <p className="truncate text-[11px] font-semibold text-[#81757b]">{label}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <p className="font-display text-2xl font-bold leading-none text-[#2c252a]">{value}</p>
                  <span className="truncate text-[10px] text-[#9b8d91]">{detail}</span>
                </div>
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <AdminCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c45d7d]">À traiter</p>
              <h2 className="mt-1 font-display text-xl font-bold">Les prochaines actions</h2>
            </div>
            <span className="rounded-full bg-[#fbe9ef] px-2.5 py-1 text-[11px] font-bold text-[#b9456e]">
              {pending} priorité(s)
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {pending > 0 && (
              <ActionLink
                to="/admin/registrations"
                title="Réservations"
                text={`${pending} à confirmer`}
                icon={<CalendarDays size={16} />}
              />
            )}
            <ActionLink
              to="/admin/catalog"
              title="Carte publique"
              text={`${products.length} plats publiés`}
              icon={<CircleCheck size={16} />}
            />
            <ActionLink
              to="/admin/gallery"
              title="Médias"
              text="Vérifier les visuels"
              icon={<Image size={16} />}
            />
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c45d7d]">Accès rapide</p>
              <h2 className="mt-1 font-display text-xl font-bold">Actions fréquentes</h2>
            </div>
            <Utensils size={18} className="text-[#d85f82]" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <QuickLink to="/admin/catalog" text="Ajouter un plat" tone="bg-[#fdf4f6] text-[#a5365f]" />
            <QuickLink to="/admin/registrations" text="Voir les réservations" tone="bg-[#f4f3f4] text-[#665b60]" />
            <QuickLink to="/admin/communication" text="Ouvrir la communication" tone="bg-[#eef4f2] text-[#4d8973]" />
          </div>
        </AdminCard>
      </div>
    </>
  );
}

function ActionLink({
  to,
  title,
  text,
  icon,
}: {
  to: "/admin/registrations" | "/admin/catalog" | "/admin/gallery";
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-[#eee8e8] bg-[#fffdfd] px-3 py-3 transition hover:border-[#e1a8b9] hover:bg-[#fff8fa]"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#fbe9ef] text-[#b9456e]">{icon}</span>
      <span className="min-w-0">
        <strong className="block truncate text-xs">{title}</strong>
        <small className="mt-0.5 block truncate text-[11px] text-[#93878d]">{text}</small>
      </span>
    </Link>
  );
}

function QuickLink({
  to,
  text,
  tone,
}: {
  to: "/admin/catalog" | "/admin/registrations" | "/admin/communication";
  text: string;
  tone: string;
}) {
  return (
    <Link to={to} className={`rounded-xl px-3 py-2.5 text-xs font-bold transition hover:brightness-[.98] ${tone}`}>
      {text}
    </Link>
  );
}
