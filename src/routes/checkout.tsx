import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock3,
  Loader2,
  MapPin,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";
import { createOrder } from "@/lib/supabase";

type Fulfillment = "pickup" | "delivery";
type Payment = "wave" | "orange_money" | "cash";

const PAYMENT_OPTIONS: { value: Payment; label: string; icon: string }[] = [
  { value: "wave", label: "Wave", icon: "🌊" },
  { value: "orange_money", label: "Orange Money", icon: "🟠" },
  { value: "cash", label: "Paiement à la réception", icon: "💵" },
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Commande en ligne | Elite Coffee" },
      {
        property: "og:description",
        content:
          "Choisissez le retrait ou la livraison et finalisez votre commande Elite Coffee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Commande en ligne | Elite Coffee" },
      {
        name: "description",
        content:
          "Choisissez le retrait ou la livraison et finalisez votre commande Elite Coffee.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [payment, setPayment] = useState<Payment>("wave");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const fee = fulfillment === "delivery" ? 2500 : 0;
  const total = subtotal + fee;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) {
      toast.error("Votre panier est vide");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      toast.error("Ajoutez une adresse de livraison");
      return;
    }
    setLoading(true);
    try {
      const id = await createOrder(
        {
          name,
          phone,
          fulfillment,
          address: address || undefined,
          payment,
          subtotal,
          delivery_fee: fee,
          total,
        },
        lines.map((l) => ({
          product_id: l.product.id,
          name: l.product.name,
          price: l.product.price,
          quantity: l.quantity,
        })),
      );
      setOrderId(id);
      setConfirmed(true);
      clearCart();
      toast.success("Commande enregistrée — à très vite !");
    } catch (err) {
      console.error(err);
      toast.error(
        "Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <PageShell
        eyebrow="Commande confirmée"
        title="On s'en occupe !"
        description="Votre commande a bien été enregistrée. Notre équipe vous contacte rapidement."
      >
        <section className="mx-auto max-w-xl px-4 pb-24 text-center">
          <div className="rounded-3xl bg-card p-10 shadow-soft">
            <span className="grid size-20 place-items-center rounded-full bg-accent/20 mx-auto">
              <Check className="text-accent" size={36} />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold">
              Commande reçue !
            </h2>
            {orderId && (
              <p className="mt-2 text-xs text-muted-foreground">
                Réf. : <code className="font-mono">{orderId.slice(0, 8).toUpperCase()}</code>
              </p>
            )}
            <p className="mt-4 text-muted-foreground">
              {fulfillment === "pickup"
                ? "Votre commande sera prête pour le retrait sur place."
                : "Notre livreur vous contactera pour confirmer l'heure de livraison."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground"
              >
                Commander à nouveau
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 font-bold"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Commande en ligne"
      title="Votre café, comme vous l'aimez."
      description="Choisissez votre mode de réception et nous nous occupons du reste."
    >
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 md:px-6 lg:grid-cols-[1.2fr_.8fr]">
        <form onSubmit={submit} className="space-y-6">
          {/* Retrait / Livraison */}
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
                <span className="text-xs font-bold uppercase tracking-widest">
                  Recommandé
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">
                Retrait sur place
              </h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "pickup" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Délai à confirmer auprès du restaurant
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
              <h2 className="mt-5 font-display text-2xl font-bold">
                Livraison
              </h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "delivery" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Disponibilité et délai à confirmer
              </p>
              <p className="mt-5 text-sm font-semibold">
                Restez confortablement chez vous, nous vous livrons.
              </p>
            </button>
          </div>

          {/* Paiement */}
          <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Smartphone size={22} className="text-primary" /> Mode de paiement
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPayment(opt.value)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    payment === opt.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <p className="mt-2 font-semibold text-sm">{opt.label}</p>
                </button>
              ))}
            </div>
            {(payment === "wave" || payment === "orange_money") && (
              <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                📱 Un lien de paiement{" "}
                <strong>
                  {payment === "wave" ? "Wave" : "Orange Money"}
                </strong>{" "}
                vous sera envoyé par SMS après confirmation de votre commande.
              </p>
            )}
          </div>

          {/* Coordonnées */}
          <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <h2 className="font-display text-2xl font-bold">
              Vos coordonnées
            </h2>
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
                  placeholder="Quartier, rue, repère…"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {loading ? "Envoi en cours…" : `Confirmer la commande · ${formatCFA(total)}`}
            </button>
          </div>
        </form>

        {/* Panier */}
        <aside className="h-fit rounded-3xl bg-secondary p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Votre panier</h2>
            <ShoppingBag className="text-primary" />
          </div>
          {!lines.length ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                Votre panier est encore vide.
              </p>
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
                      Qté {line.quantity}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">
                        {formatCFA(line.product.price * line.quantity)}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(index, line.quantity - 1)
                          }
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
                  <span>
                    {fulfillment === "delivery" ? "Livraison" : "Retrait"}
                  </span>
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
