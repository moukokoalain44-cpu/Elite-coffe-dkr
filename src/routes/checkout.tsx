import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock3, MapPin, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Commande en ligne | Elite Coffee" },
      {
        name: "description",
        content: "Choisissez le retrait ou la livraison et finalisez votre commande Elite Coffee.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const fee = fulfillment === "delivery" ? 2500 : 0;
  const total = subtotal + fee;
  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!lines.length) {
      toast.error("Votre panier est vide");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      toast.error("Ajoutez une adresse de livraison");
      return;
    }
    clearCart();
    toast.success("Commande enregistrée — à très vite !");
  };
  return (
    <PageShell
      eyebrow="Commande en ligne"
      title="Votre café, comme vous l’aimez."
      description="Choisissez votre mode de réception et nous nous occupons du reste."
    >
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 md:px-6 lg:grid-cols-[1.2fr_.8fr]">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setFulfillment("pickup")}
              className={`rounded-3xl border p-5 text-left transition-all ${fulfillment === "pickup" ? "border-primary bg-primary text-primary-foreground shadow-lift" : "border-border bg-card hover:border-primary"}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent/20">
                  <MapPin size={21} />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">Recommandé</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">Retrait sur place</h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "pickup" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Prêt en 5–10 minutes
              </p>
              <p className="mt-5 text-sm font-semibold">
                Évitez les frais de livraison et dégustez-le tout frais.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("delivery")}
              className={`rounded-3xl border p-5 text-left transition-all ${fulfillment === "delivery" ? "border-primary bg-primary text-primary-foreground shadow-lift" : "border-border bg-card hover:border-primary"}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent/20">
                  <Truck size={21} />
                </span>
                <Clock3 size={18} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">Livraison</h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "delivery" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Arrive en 20–35 minutes
              </p>
              <p className="mt-5 text-sm font-semibold">
                Restez confortablement chez vous, nous vous livrons.
              </p>
            </button>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <h2 className="font-display text-2xl font-bold">Vos coordonnées</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Nom complet
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Téléphone
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
            </div>
            {fulfillment === "delivery" && (
              <label className="mt-4 block text-sm font-semibold">
                Adresse de livraison
                <textarea
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
            )}
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Check size={18} /> Confirmer la commande · {formatCFA(total)}
            </button>
          </div>
        </form>
        <aside className="h-fit rounded-3xl bg-secondary p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Votre panier</h2>
            <ShoppingBag className="text-primary" />
          </div>
          {!lines.length ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">Votre panier est encore vide.</p>
              <Link
                to="/menu"
                className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                Voir la carte
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {lines.map((line, index) => (
                <div key={`${line.product.id}-${index}`} className="flex gap-3">
                  <img
                    src={line.product.image}
                    alt=""
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{line.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {line.size} · Qté {line.quantity}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">
                        {formatCFA(line.product.price * line.quantity)}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, line.quantity - 1)}
                          className="underline"
                        >
                          Moins
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="underline"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-primary/15 pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatCFA(subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>{fulfillment === "delivery" ? "Livraison" : "Retrait"}</span>
                  <span>{fee ? formatCFA(fee) : "Gratuit"}</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCFA(total)}</span>
                </div>
              </div>
            </div>
          )}
          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
          >
            <ArrowLeft size={15} /> Continuer mes achats
          </Link>
        </aside>
      </section>
    </PageShell>
  );
}
