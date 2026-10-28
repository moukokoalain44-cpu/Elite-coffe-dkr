import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, Search, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { MENU_CATEGORIES, type MenuCategory } from "@/data/catalog";
import { useMenuCatalog } from "@/hooks/use-menu-catalog";
import { PageShell } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";
import { getOptimizedMenuImageUrl } from "@/lib/image-url";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { property: "og:title", content: "La carte | Elite Coffee" },
      {
        property: "og:description",
        content:
          "Brunch, cafés, plats, pizzas, jus et douceurs : découvrez la carte complète d’Elite Coffee à Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "La carte | Elite Coffee" },
      {
        name: "description",
        content:
          "Découvrez la carte complète d’Elite Coffee : petit déjeuner, brunch, plats, boissons et desserts.",
      },
    ],
  }),
  component: MenuPage,
});

const MENU_MOMENTS: { label: string; categories: MenuCategory[]; intro: string }[] = [
  {
    label: "Matin & brunch",
    categories: ["Petit déjeuner", "Formule déjeuner", "Pâtisseries et viennoiseries"],
    intro: "Commencer doucement, avec du café, des œufs et nos douceurs maison.",
  },
  {
    label: "À boire",
    categories: [
      "Cafés chauds",
      "Cafés glacés",
      "Infusions de thé",
      "Boissons chaudes",
      "Cocktails",
      "Smoothies",
      "Jus locaux",
      "Jus détox",
      "Milkshakes",
      "Boissons gazeuses",
      "Jus en brique",
    ],
    intro: "Des cafés de caractère et des boissons fraîches pour chaque envie.",
  },
  {
    label: "Déjeuner & dîner",
    categories: [
      "Entrées",
      "Cuisine du monde",
      "Viandes",
      "Volailles",
      "Poissons et fruits de mer",
      "Pâtes",
      "Pizzas",
    ],
    intro: "Une cuisine généreuse, entre recettes du monde, grillades et produits de la mer.",
  },
  {
    label: "Sur le pouce",
    categories: ["Crêpes", "Club sandwichs et paninis", "Toasts"],
    intro: "Des assiettes faciles à partager ou à savourer sur le pouce.",
  },
  {
    label: "La touche sucrée",
    categories: ["Desserts", "Plats du jour ponctuels"],
    intro: "Finir sur une note gourmande, avec une petite sélection selon les arrivages.",
  },
];

function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>("Petit déjeuner");
  const [query, setQuery] = useState("");
  const { products: menuProducts, isLoading: menuLoading, isRemote } = useMenuCatalog();
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const products = useMemo(
    () =>
      menuProducts.filter((product) => {
        const matchesCategory = product.category === category;
        const haystack = `${product.name} ${product.description}`.toLocaleLowerCase("fr");
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
      }),
    [category, menuProducts, normalizedQuery],
  );
  const activeMoment = MENU_MOMENTS.find((moment) => moment.categories.includes(category));
  const categoryCount = menuProducts.filter((product) => product.category === category).length;

  return (
    <PageShell
      eyebrow="Restaurant · Brunch · Glacier"
      title="La carte, pour tous les moments."
      description="Du café du matin au dîner, Elite Coffee rassemble une cuisine généreuse, des boissons fraîches et des douceurs à partager à Dakar."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-4 rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-lift md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              À la carte aujourd’hui
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              Une envie précise ? Trouvons-la.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/75">
              Parcourez les grands moments de la journée, puis choisissez une catégorie pour voir
              les produits et leurs tarifs.
            </p>
          </div>
          <div className="flex gap-6 border-t border-primary-foreground/15 pt-4 text-sm md:border-l md:border-t-0 md:pl-7 md:pt-0">
            <div>
              <strong className="block font-display text-2xl text-accent">
                {menuProducts.length}
              </strong>
              <span className="text-primary-foreground/65">produits</span>
            </div>
            <div>
              <strong className="block font-display text-2xl text-accent">
                {MENU_CATEGORIES.length}
              </strong>
              <span className="text-primary-foreground/65">catégories</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Moments de la carte"
          >
            {MENU_MOMENTS.map((moment) => {
              const active = moment.categories.includes(category);
              return (
                <button
                  key={moment.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(moment.categories[0]!)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground hover:bg-primary/10"}`}
                >
                  {moment.label}
                </button>
              );
            })}
          </div>
          <label className="flex min-w-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground md:w-72">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Rechercher dans la catégorie</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          {menuLoading
            ? "Synchronisation de la carte…"
            : isRemote
              ? "Carte synchronisée avec Supabase"
              : "Mode hors connexion"}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[230px_1fr] lg:items-start">
          <aside className="rounded-3xl bg-secondary/70 p-3 lg:sticky lg:top-28">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {activeMoment?.label}
            </p>
            <div className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
              {activeMoment?.categories.map((item) => {
                const count = menuProducts.filter((product) => product.category === item).length;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`flex shrink-0 items-center justify-between gap-4 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-colors lg:w-full ${category === item ? "bg-card text-primary shadow-soft" : "text-foreground/70 hover:bg-card/70"}`}
                  >
                    <span>{item}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {activeMoment?.label}
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold">{category}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{activeMoment?.intro}</p>
              </div>
              <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary sm:inline-flex">
                {categoryCount} choix
              </span>
            </div>
            {products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                <p className="font-display text-2xl font-bold">Aucun résultat</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Essayez un autre mot ou explorez la catégorie complète.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product, index) => (
                  <article
                    key={product.id}
                    className="group flex min-h-44 flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="flex gap-4 p-4">
                      <Link to="/menu/$id" params={{ id: product.id }} className="block shrink-0">
                        <img
                          src={getOptimizedMenuImageUrl(product.image, { width: 224, height: 224 })}
                          alt={product.name}
                          width={112}
                          height={112}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={index < 2 ? "high" : "auto"}
                          className="size-24 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105 sm:size-28"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <Link to="/menu/$id" params={{ id: product.id }}>
                            <h3 className="font-display text-xl font-bold leading-tight hover:text-accent">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="shrink-0 font-display text-lg font-bold text-primary">
                            {formatCFA(product.price)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">
                          {product.description || "Préparé à la commande par notre équipe."}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <Star size={13} className="fill-star text-star" />{" "}
                        {product.availabilityNote ? "À confirmer" : "Disponible"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
