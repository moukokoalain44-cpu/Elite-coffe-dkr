import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/menu/$id")({
  head: () => ({
    meta: [
      { title: "Product details | Elite Coffee" },
      {
        name: "description",
        content: "Customize your Elite Coffee order with size, milk and extras.",
      },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="p-10">Product not found</div>,
});

function ProductPage() {
  const { id } = useParams({ from: "/menu/$id" });
  const product = getProduct(id);
  const { addItem } = useCart();
  const [size, setSize] = useState<"Small" | "Medium" | "Large">("Medium");
  const [milk, setMilk] = useState<"Whole milk" | "Oat milk" | "Almond milk" | "Coconut milk">(
    "Whole milk",
  );
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  if (!product) throw notFound();
  const extraChoices = ["Extra shot", "Vanilla", "Cold foam"];
  const unitPrice =
    product.price + (size === "Large" ? 0.75 : size === "Small" ? -0.5 : 0) + extras.length * 0.5;
  const toggleExtra = (extra: string) =>
    setExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
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
            <ArrowLeft size={16} /> Back to menu
          </Link>
          <div className="mt-7 flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                {product.category}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold">Make it yours</h2>
            </div>
            <span className="font-display text-2xl font-bold text-primary">
              ${unitPrice.toFixed(2)}
            </span>
          </div>
          <div className="mt-8 space-y-6">
            <fieldset>
              <legend className="text-sm font-bold">Size</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["Small", "Medium", "Large"] as const).map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setSize(option)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${size === option ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                  >
                    {option}
                    {option === "Large" && (
                      <span className="block text-[10px] opacity-70">+$0.75</span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold">Milk</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["Whole milk", "Oat milk", "Almond milk", "Coconut milk"] as const).map(
                  (option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setMilk(option)}
                      className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold ${milk === option ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold">
                Extras <span className="font-normal text-muted-foreground">+$0.50 each</span>
              </legend>
              <div className="mt-2 space-y-2">
                {extraChoices.map((extra) => (
                  <label
                    key={extra}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-sm ${extras.includes(extra) ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <span>{extra}</span>
                    <input
                      type="checkbox"
                      checked={extras.includes(extra)}
                      onChange={() => toggleExtra(extra)}
                      className="size-4 accent-primary"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-3">
              <span className="text-sm font-semibold">Quantity</span>
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
                for (let i = 0; i < quantity; i += 1) addItem(product, { size, milk, extras });
                toast.success(`${quantity} ${product.name} added to cart`);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
            >
              <ShoppingBag size={18} /> Add to cart · ${(unitPrice * quantity).toFixed(2)}
            </button>
          </div>
          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <h3 className="font-bold">Ingredients</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex gap-2">
                    <Check size={15} className="mt-0.5 text-accent" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Brewing method</h3>
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
