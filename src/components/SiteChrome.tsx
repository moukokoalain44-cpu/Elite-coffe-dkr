import { Link } from "@tanstack/react-router";
import { X, Coffee } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Carte", "/menu"],
    ["Brunch", "/brunch"],
    ["Réserver", "/reserver"],
    ["Notre histoire", "/about"],
    ["Adresses", "/locations"],
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary"
          aria-label="Accueil Elite Coffee"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Coffee size={18} />
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-none">Elite Coffee</span>
            <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-accent sm:block">
              Restaurant · Brunch · Glacier
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-semibold text-foreground/75 transition-colors hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Ouvrir la navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full p-2 text-foreground hover:bg-secondary lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <span className="text-lg">☰</span>}
        </button>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-border bg-background px-4 py-3 lg:hidden"
          aria-label="Mobile navigation"
        >
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 font-semibold hover:bg-secondary"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-14 md:px-6 md:pb-16 md:pt-20">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[1.05] text-foreground md:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>
        </section>
        {children}
      </main>
      <footer className="border-t border-border bg-secondary/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <span>© {new Date().getFullYear()} Elite Coffee</span>
          <div className="flex gap-5">
            <Link to="/about" className="hover:text-primary">
              Notre histoire
            </Link>
            <Link to="/brunch" className="hover:text-primary">
              Brunch
            </Link>
            <Link to="/reserver" className="hover:text-primary">
              Réserver
            </Link>
            <Link to="/locations" className="hover:text-primary">
              Adresses
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
