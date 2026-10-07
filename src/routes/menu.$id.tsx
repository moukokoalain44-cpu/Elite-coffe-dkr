import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";

export const Route = createFileRoute("/menu/$id")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Détails du produit | Elite Coffee" },
      { property: "og:description", content: "Découvrez les produits et les tarifs de la carte Elite Coffee à Dakar." },
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
  const { addItem } = useCart();
  const [size, setSize] = useState<"Petit" | "Moyen" | "Grand">("Moyen");
  const [milk, setMilk] = useState<"Lait entier" | "Lait d’avoine" | "Lait d’amande" | "Lait de coco">(
    "Lait entier",
  );
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
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
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-3">
              <span className="text-sm font-semibold">Quantité</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid size-9 place-items-center rounded-full bg-card"
                >
                  <Minus size={15} />
                </button>
                <span className="w-5 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="grid size-9 place-items-center rounded-full bg-card"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                for (let i = 0; i < quantity; i += 1) addItem(product);
                toast.success(`${quantity} ${product.name} ajouté au panier`);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
            >
              <ShoppingBag size={18} /> Ajouter au panier · {formatCFA(unitPrice * quantity)}
            </button>
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
