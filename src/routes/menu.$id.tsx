import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { getProduct } from "@/data/catalog";
import { PageShell } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";

export const Route = createFileRoute("/menu/$id")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Détails du produit | Elite Coffee" },
      {
        property: "og:description",
        content: "Découvrez les produits et les tarifs de la carte Elite Coffee à Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Détails du produit | Elite Coffee" },
      {
        name: "description",
        content: "Découvrez les produits et les tarifs de la carte Elite Coffee à Dakar.",
      },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="p-10">Produit introuvable</div>,
});

function ProductPage() {
  const { id } = useParams({ from: "/menu/$id" });
  const product = getProduct(id);
  if (!product) throw notFound();
  const unitPrice = product.price;
  return (
    <PageShell eyebrow={product.category} title={product.name} description={product.description}>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 md:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] bg-secondary shadow-lift">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
          />
        </div>
        <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={16} /> Retour à la carte
          </Link>
          <div className="mt-7 flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                {product.category}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold">Votre sélection</h2>
            </div>
            <span className="font-display text-2xl font-bold text-primary">
              {formatCFA(unitPrice)}
            </span>
          </div>
          <div className="mt-8 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
            Produit disponible sur place. Pour connaître les disponibilités du jour, contactez
            directement le restaurant.
          </div>
          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <h3 className="font-bold">Ingrédients</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex gap-2">
                    <Check size={15} className="mt-0.5 text-accent" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div hidden={!product.brewingMethod}>
              <h3 className="font-bold">Méthode de préparation</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {product.brewingMethod}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
