import { Link, Outlet, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Coffee,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Image,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useAdminAuth } from "@/contexts/AuthContext";

const nav = [
  { label: "Vue d’ensemble", to: "/admin", icon: LayoutDashboard },
  { label: "Réservations", to: "/admin/registrations", icon: Users },
  { label: "Catalogue", to: "/admin/catalog", icon: Package },
  { label: "Galerie", to: "/admin/gallery", icon: Image },
  { label: "Contenu", to: "/admin/content", icon: FileText },
];

const navGroups = [
  { label: "Pilotage", items: nav.slice(0, 3) },
  { label: "Gestion du restaurant", items: nav.slice(3) },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { session, loading, signOut } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileName, setProfileName] = useState("Oripio Studio");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { registrations } = useAdmin();
  const userEmail = session?.user.email ?? "Administrateur";
  const expanded = open || !collapsed || sidebarHovered;
  const results = query.trim()
    ? nav.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : [];
  const pendingReservations = registrations.filter((item) => item.status === "pending");
  useEffect(() => {
    setDarkMode(window.localStorage.getItem("elite-admin-theme") === "dark");
    setProfileName(window.localStorage.getItem("elite-admin-name") || "Oripio Studio");
    setProfileAvatar(window.localStorage.getItem("elite-admin-avatar") || "");
    const refreshProfile = () => {
      setProfileName(window.localStorage.getItem("elite-admin-name") || "Oripio Studio");
      setProfileAvatar(window.localStorage.getItem("elite-admin-avatar") || "");
    };
    window.addEventListener("elite-admin-profile-updated", refreshProfile);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("elite-admin-profile-updated", refreshProfile);
    };
  }, []);
  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/admin/login" });
  }, [loading, navigate, session]);
  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f3f4] text-sm text-[#756b72]">
        Vérification de votre session…
      </div>
    );
  }
  const handleSignOut = async () => {
    await signOut();
    await navigate({ to: "/admin/login" });
  };
  const toggleTheme = () =>
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("elite-admin-theme", next ? "dark" : "light");
      return next;
    });
  return (
    <div
      data-admin-theme={darkMode ? "dark" : "light"}
      className="h-screen overflow-hidden bg-[#f4f3f4] text-[#2c252a]"
    >
      <div className="flex h-screen min-h-0">
        <aside
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-[#e7e2e5] bg-white/95 px-5 py-6 shadow-[10px_0_35px_-28px_rgba(58,45,51,.55)] backdrop-blur-xl transition-[width,transform] duration-300 lg:static lg:translate-x-0 ${expanded ? "w-72" : "w-[88px]"} ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <img
                src="/assets/brand/elite-coffee-logo.png"
                alt="Elite Coffee"
                className="animate-elite-logo size-10 rounded-2xl object-cover shadow-sm"
              />
              {expanded && (
                <span>
                  <strong className="font-display text-xl">Elite Coffee</strong>
                  <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#d85f82]">
                    Admin studio
                  </span>
                </span>
              )}
            </Link>
            <button
              className="rounded-xl p-2 hover:bg-[#f4f3f4] lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Fermer la navigation"
            >
              <X size={18} />
            </button>
          </div>
          {expanded && (
            <p className="mb-3 mt-10 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a89aa2]">
              Pilotage
            </p>
          )}
          <nav className="space-y-4" aria-label="Navigation administrateur">
            {navGroups.map((group) => (
              <div key={group.label}>
                {expanded && (
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a89aa2]">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map(({ label, to, icon: Icon }) => (
                    <AdminNavLink
                      key={to}
                      label={label}
                      to={to}
                      icon={<Icon size={18} />}
                      onClick={() => setOpen(false)}
                      collapsed={!expanded}
                      count={
                        label === "Réservations"
                          ? registrations.filter((item) => item.status === "pending").length
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-auto space-y-1 border-t border-[#eee8e8] pt-5">
            <AdminNavLink
              label="Paramètres"
              to="/admin/settings"
              icon={<Settings size={18} />}
              onClick={() => setOpen(false)}
              collapsed={!expanded}
            />
            <button
              type="button"
              onClick={() => void handleSignOut()}
              title={!expanded ? "Quitter le back-office" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#a1462c] hover:bg-[#fff3ed] ${!expanded ? "justify-center" : ""}`}
            >
              <LogOut size={18} /> {expanded && "Quitter le back-office"}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={`hidden w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#756b72] hover:bg-[#f4f3f4] lg:flex ${collapsed ? "justify-center" : ""}`}
              title={!expanded ? "Déplier la barre latérale" : "Replier la barre latérale"}
            >
              {!expanded ? (
                <PanelLeftOpen size={18} />
              ) : (
                <>
                  <PanelLeftClose size={18} /> Replier la barre
                </>
              )}
            </button>
          </div>
        </aside>
        {open && (
          <button
            className="fixed inset-0 z-40 bg-[#2c252a]/25 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
        )}
        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e7e2e5] bg-[#f4f3f4]/90 px-5 backdrop-blur-md md:px-8">
            <div className="relative flex items-center gap-3">
              <button
                className="rounded-xl border border-[#e7e2e5] bg-white p-2 lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Ouvrir la navigation"
              >
                <Menu size={19} />
              </button>
              <div className="relative hidden items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-sm text-[#9b8d91] shadow-sm md:flex">
                <Search size={17} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher dans le back-office"
                  className="w-72 bg-transparent outline-none placeholder:text-[#9b8d91]"
                />
                <kbd className="ml-4 rounded-md bg-[#f4f3f4] px-2 py-1 text-[10px]">⌘ K</kbd>
                {results.length > 0 && (
                  <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-2xl border border-[#e7e2e5] bg-white p-2 shadow-xl">
                    {results.map((result) => (
                      <Link
                        key={result.to}
                        to={result.to}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#665b60] hover:bg-[#f4f3f4]"
                      >
                        <result.icon size={16} />
                        {result.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-[#e7e2e5] bg-white p-2.5 text-[#665b60] hover:border-[#d85f82]"
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative rounded-xl border border-[#e7e2e5] bg-white p-2.5 hover:border-[#d85f82]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                {pendingReservations.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#d85f82] px-1 text-[10px] font-bold text-white">
                    {pendingReservations.length}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-28 top-14 z-50 w-80 rounded-2xl border border-[#e7e2e5] bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#eee8e8] px-2 pb-3">
                    <strong className="text-sm">Notifications</strong>
                    <span className="text-xs text-[#9b8d91]">
                      {pendingReservations.length} en attente
                    </span>
                  </div>
                  {pendingReservations.length ? (
                    pendingReservations.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        to="/admin/registrations"
                        onClick={() => setNotificationsOpen(false)}
                        className="mt-2 block rounded-xl px-3 py-2.5 hover:bg-[#fbe9ef]"
                      >
                        <p className="text-sm font-bold">Réservation de {item.name}</p>
                        <p className="mt-1 text-xs text-[#9b8d91]">
                          {item.date} · {item.time} · {item.guests} personne(s)
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="px-2 py-5 text-center text-sm text-[#9b8d91]">
                      Aucune réservation en attente.
                    </p>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="hidden items-center gap-3 rounded-2xl border border-[#e7e2e5] bg-white px-3 py-2 text-left hover:border-[#d85f82] sm:flex"
                aria-expanded={profileOpen}
              >
                <span className="grid size-8 place-items-center overflow-hidden rounded-xl bg-[#fbe9ef] text-xs font-bold text-[#8c4f2d]">
                  {profileAvatar ? (
                    <img src={profileAvatar} alt="" className="size-full object-cover" />
                  ) : (
                    profileName.slice(0, 2).toUpperCase()
                  )}
                </span>
                <span className="leading-tight">
                  <strong className="block text-sm">{profileName}</strong>
                  <small className="text-[11px] text-[#9b8d91]">Super admin</small>
                </span>
                <ChevronDown
                  size={15}
                  className={`text-[#9b8d91] transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-[#e7e2e5] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#eee8e8] px-3 py-2">
                    <strong className="block max-w-[190px] truncate text-sm">{userEmail}</strong>
                    <span className="text-xs text-[#9b8d91]">Compte administrateur</span>
                  </div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#665b60] hover:bg-[#f4f3f4]"
                  >
                    <Settings size={16} /> Paramètres
                  </Link>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#665b60] hover:bg-[#f4f3f4]"
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}{" "}
                    {darkMode ? "Mode clair" : "Mode sombre"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#a1462c] hover:bg-[#fff3ed]"
                  >
                    <LogOut size={16} /> Quitter
                  </button>
                </div>
              )}
            </div>
          </header>
          <main className="mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({
  label,
  to,
  icon,
  onClick,
  collapsed,
  count,
}: {
  label: string;
  to: string;
  icon: ReactNode;
  onClick: () => void;
  collapsed?: boolean;
  count?: number | undefined;
}) {
  const location = useLocation();
  const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${collapsed ? "justify-center" : ""} ${active ? "bg-[#d85f82] text-white shadow-[0_8px_20px_-12px_#d85f82]" : "text-[#665b60] hover:bg-[#f4f3f4] hover:text-[#3a2d33]"}`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
      {!collapsed && count !== undefined && (
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-[#fbe9ef] text-[#a5365f]"}`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c45d7d]">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#82776e]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[22px] border border-[#ebe5df] bg-white p-5 shadow-[0_14px_40px_-30px_rgba(91,56,38,.35)] md:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#fff3d9] text-[#a96918]",
    confirmed: "bg-[#e6f5ee] text-[#2d7a5c]",
    preparing: "bg-[#e8f1ff] text-[#376da8]",
    ready: "bg-[#e6f5ee] text-[#2d7a5c]",
    delivered: "bg-[#e6f5ee] text-[#2d7a5c]",
    cancelled: "bg-[#fff0ed] text-[#b14e36]",
  };
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    preparing: "En préparation",
    ready: "Prête",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status] ?? "bg-[#f4f1ed] text-[#756b72]"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-[#eee8e8] px-5 py-4 text-sm">
      <span className="text-[#93878d]">
        Page <strong className="text-[#3a2d33]">{page}</strong> sur{" "}
        <strong className="text-[#3a2d33]">{totalPages}</strong>
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-xl border border-[#e7e2e5] px-3 py-2 font-bold text-[#756b72] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f4f3f4]"
        >
          Précédent
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`size-9 rounded-xl text-xs font-bold ${item === page ? "bg-[#3a2d33] text-white" : "text-[#756b72] hover:bg-[#f4f3f4]"}`}
          >
            {item}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-xl border border-[#e7e2e5] px-3 py-2 font-bold text-[#756b72] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f4f3f4]"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export function AdminOutlet() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/admin/login" ? <Outlet /> : <AdminLayout />;
}
