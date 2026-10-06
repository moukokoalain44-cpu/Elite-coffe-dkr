import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MENU_CATEGORIES, PRODUCT_CATALOG, type MenuCategory } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu | Elite Coffee" },
      {
        name: "description",
        content:
          "Explorez les cafés chauds, iced coffee, créations signature et pâtisseries d’Elite Coffee.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>("Hot Coffee");
  const { addItem } = useCart();
  const products = PRODUCT_CATALOG.filter((product) => product.category === category);
  return (
    <PageShell
      eyebrow="The menu"
      title="Made for your moment."
      description="From first sip to last bite, every item is made with thoughtful ingredients and a little more care than necessary."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div
          className="flex flex-wrap gap-2 border-b border-border pb-5"
          role="tablist"
          aria-label="Menu categories"
        >
          {MENU_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${category === item ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground hover:bg-primary/10"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <Link to="/menu/$id" params={{ id: product.id }} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                      Guest favorite
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to="/menu/$id" params={{ id: product.id }}>
                      <h2 className="font-display text-2xl font-bold hover:text-accent">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Star size={14} className="fill-star text-star" /> Crafted daily
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(product);
                      toast.success(`${product.name} added to cart`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl bg-primary p-6 text-primary-foreground sm:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/10">
              <ShoppingBag />
            </span>
            <div>
              <p className="font-display text-xl font-bold">Know what you want?</p>
              <p className="text-sm text-primary-foreground/70">
                Build your order and choose pickup or delivery.
              </p>
            </div>
          </div>
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-bold text-primary hover:bg-secondary"
          >
            Go to checkout <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
