import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, Coffee, LayoutDashboard, LogOut, Menu, Package, Pencil, Search, Settings, ShoppingBag, Sparkles, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAdmin } from "@/contexts/AdminContext";

const nav = [
  { label: "Vue d’ensemble", to: "/admin", icon: LayoutDashboard },
  { label: "Analytics", to: "/admin/analytics", icon: Sparkles },
  { label: "Inscriptions", to: "/admin/registrations", icon: Users },
  { label: "Commandes", to: "/admin/orders", icon: ShoppingBag },
  { label: "Catalogue", to: "/admin/catalog", icon: Package },
  { label: "Contenu du site", to: "/admin/content", icon: Pencil },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-[#201a17]">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e8e0d7] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <span className="grid size-10 place-items-center rounded-2xl bg-[#5b3826] text-[#fffaf4]"><Coffee size={20} /></span>
              <span><strong className="font-display text-xl">Elite Coffee</strong><span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8894a]">Admin studio</span></span>
            </Link>
            <button className="rounded-xl p-2 hover:bg-[#f7f5f1] lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer la navigation"><X size={18} /></button>
          </div>
          <p className="mb-3 mt-10 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a69a90]">Pilotage</p>
          <nav className="space-y-1" aria-label="Navigation administrateur">
            {nav.map(({ label, to, icon: Icon }) => <AdminNavLink key={to} label={label} to={to} icon={<Icon size={18} />} onClick={() => setOpen(false)} />)}
          </nav>
          <div className="mt-auto space-y-1 border-t border-[#eee8e2] pt-5">
            <AdminNavLink label="Paramètres" to="/admin/settings" icon={<Settings size={18} />} onClick={() => setOpen(false)} />
            <Link to="/" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#a1462c] hover:bg-[#fff3ed]"><LogOut size={18} /> Quitter le back-office</Link>
          </div>
        </aside>
        {open && <button className="fixed inset-0 z-40 bg-[#201a17]/25 lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu" />}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e8e0d7] bg-[#f7f5f1]/90 px-5 backdrop-blur-md md:px-8">
            <div className="flex items-center gap-3"><button className="rounded-xl border border-[#e8e0d7] bg-white p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir la navigation"><Menu size={19} /></button><div className="hidden items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-sm text-[#9b9188] shadow-sm md:flex"><Search size={17} /><span>Rechercher dans le back-office</span><kbd className="ml-10 rounded-md bg-[#f7f5f1] px-2 py-1 text-[10px]">⌘ K</kbd></div></div>
            <div className="flex items-center gap-3"><button className="relative rounded-xl border border-[#e8e0d7] bg-white p-2.5 hover:border-[#d8894a]" aria-label="Notifications"><Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d8894a]" /></button><div className="hidden items-center gap-3 rounded-2xl border border-[#e8e0d7] bg-white px-3 py-2 sm:flex"><span className="grid size-8 place-items-center rounded-xl bg-[#f4e3d3] text-xs font-bold text-[#8c4f2d]">OA</span><span className="text-left leading-tight"><strong className="block text-sm">Oripio Studio</strong><small className="text-[11px] text-[#9b9188]">Super admin</small></span><ChevronDown size={15} className="text-[#9b9188]" /></div></div>
          </header>
          <main className="mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({ label, to, icon, onClick }: { label: string; to: string; icon: ReactNode; onClick: () => void }) {
  const location = useLocation();
  const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
  return <Link to={to} onClick={onClick} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${active ? "bg-[#ef5b2a] text-white shadow-[0_8px_20px_-12px_#ef5b2a]" : "text-[#6f655d] hover:bg-[#f7f5f1] hover:text-[#5b3826]"}`}>{icon}<span>{label}</span>{label === "Inscriptions" && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-[#f4e3d3] text-[#a75b35]"}`}>5</span>}</Link>;
}

export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c56d3c]">{eyebrow}</p><h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#82776e]">{description}</p></div>{action}</div>;
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`rounded-[22px] border border-[#ebe5df] bg-white p-5 shadow-[0_14px_40px_-30px_rgba(91,56,38,.35)] md:p-6 ${className}`}>{children}</section>; }

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { pending: "bg-[#fff3d9] text-[#a96918]", confirmed: "bg-[#e6f5ee] text-[#2d7a5c]", preparing: "bg-[#e8f1ff] text-[#376da8]", ready: "bg-[#e6f5ee] text-[#2d7a5c]", delivered: "bg-[#e6f5ee] text-[#2d7a5c]", cancelled: "bg-[#fff0ed] text-[#b14e36]" };
  const labels: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", preparing: "En préparation", ready: "Prête", delivered: "Livrée", cancelled: "Annulée" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status] ?? "bg-[#f4f1ed] text-[#776d65]"}`}>{labels[status] ?? status}</span>;
}

export function AdminOutlet() { return <AdminLayout />; }
