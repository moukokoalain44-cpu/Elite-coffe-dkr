import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, HelpCircle, Images, Info, Menu, MessageCircle, Utensils, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { WHATSAPP_CONTACT_URL } from "@/data/site";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/CookieConsentManager";

const navLinks = [
  ["Carte", "/menu"],
  ["Réservation", "/reserver"],
  ["Bon plan", "/bon-plan"],
  ["Galerie", "/galerie"],
  ["Infos", "/infos"],
  ["FAQ", "/faq"],
] as const;

const mobileLinks = [
  ["Carte", "/menu", Utensils],
  ["Galerie", "/galerie", Images],
  ["Réserver", "/reserver", BookOpen],
  ["Infos", "/infos", Info],
  ["FAQ", "/faq", HelpCircle],
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = (to: string) => pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="border-b border-white/15 bg-primary/88 text-primary-foreground shadow-[0_10px_35px_rgba(23,25,30,.28)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-5 md:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/assets/brand/elite-coffee-logo.png"
              alt="Elite Coffee"
              className="animate-elite-logo size-11 rounded-full border border-white/50 object-cover shadow-lg transition-transform group-hover:scale-105"
            />
            <span>
              <span className="block font-display text-lg font-bold leading-none tracking-tight sm:text-xl">
                Elite Coffee
              </span>
              <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.28em] text-accent sm:text-[9px]">
                Dakar
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 text-[13px] font-medium text-primary-foreground/70 md:flex">
            {navLinks.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                aria-current={active(to) ? "page" : undefined}
                className={`rounded-full px-3 py-2 hover:bg-primary-foreground/10 hover:text-primary-foreground ${active(to) ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/40" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={WHATSAPP_CONTACT_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-sm border border-[#6ed59a]/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#bdf3ce] transition-all hover:-translate-y-0.5 hover:bg-[#6ed59a]/15 sm:inline-flex"
            >
              <MessageCircle size={14} /> Nous contacter
            </a>
            <Link
              to="/reserver"
              className="hidden rounded-sm bg-accent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-[0_5px_16px_rgba(216,137,74,.18)] transition-all hover:-translate-y-0.5 hover:bg-primary-foreground sm:inline-flex"
            >
              Réserver une table
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-full p-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-accent md:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-white/15 bg-primary/95 px-4 py-4 shadow-[0_18px_35px_-22px_rgba(0,0,0,.8)] md:hidden">
            <div className="flex flex-col gap-1 text-sm font-medium text-primary-foreground/75">
              <Link
                to="/reserver"
                onClick={() => setMobileOpen(false)}
                className="mb-2 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary"
              >
                Réserver une table
              </Link>
              <a
                href={WHATSAPP_CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mb-2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#6ed59a]/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#bdf3ce]"
              >
                <MessageCircle size={15} /> Nous contacter
              </a>
              {navLinks.map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-3 py-3 hover:bg-primary-foreground/10 hover:text-primary-foreground ${active(to) ? "bg-accent/15 text-accent" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-primary/92 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-primary-foreground shadow-[0_-12px_40px_rgba(23,25,30,.35)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileLinks.map(([label, to, Icon]) => (
            <Link
              key={to}
              to={to}
              aria-current={active(to) ? "page" : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${active(to) ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/40" : "text-primary-foreground/60 hover:text-primary-foreground"}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-32 md:px-6 md:pb-16 md:pt-40">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] text-foreground md:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>
        </section>
        {children}
      </main>
      <footer className="border-t border-border bg-secondary/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <span>© {new Date().getFullYear()} Elite Coffee</span>
          <div className="flex flex-wrap gap-5">
            <Link to="/menu" className="hover:text-primary">
              Carte
            </Link>
            <Link to="/galerie" className="hover:text-primary">
              Galerie
            </Link>
            <Link to="/reserver" className="hover:text-primary">
              Réserver
            </Link>
            <Link to="/infos" className="hover:text-primary">
              Infos
            </Link>
            <Link to="/faq" className="hover:text-primary">
              FAQ
            </Link>
            <Link to="/confidentialite" className="hover:text-primary">
              Confidentialité
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
              className="text-left hover:text-primary"
            >
              Préférences cookies
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
