import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock3, MapPin, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Elite Coffee" },
      {
        name: "description",
        content: "Choose pickup or delivery and complete your Elite Coffee order.",
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
  const fee = fulfillment === "delivery" ? 3.5 : 0;
  const total = subtotal + fee;
  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!lines.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (fulfillment === "delivery" && !address.trim()) {
      toast.error("Add a delivery address");
      return;
    }
    clearCart();
    toast.success("Order received — we’ll see you soon!");
  };
  return (
    <PageShell
      eyebrow="Checkout"
      title="One good choice away."
      description="Choose how you’d like to enjoy your order, then we’ll take care of the rest."
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
                <span className="text-xs font-bold uppercase tracking-widest">Recommended</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">Pickup</h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "pickup" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Ready in 5–10 minutes
              </p>
              <p className="mt-5 text-sm font-semibold">
                Skip the delivery fee and enjoy it while it’s fresh.
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
              <h2 className="mt-5 font-display text-2xl font-bold">Delivery</h2>
              <p
                className={`mt-1 text-sm ${fulfillment === "delivery" ? "text-primary-foreground/75" : "text-muted-foreground"}`}
              >
                Arrives in 20–35 minutes
              </p>
              <p className="mt-5 text-sm font-semibold">
                Stay cozy — we’ll bring your coffee to your door.
              </p>
            </button>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <h2 className="font-display text-2xl font-bold">Your details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Phone
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
                Delivery address
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
              <Check size={18} /> Place order · ${total.toFixed(2)}
            </button>
          </div>
        </form>
        <aside className="h-fit rounded-3xl bg-secondary p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Your bag</h2>
            <ShoppingBag className="text-primary" />
          </div>
          {!lines.length ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">Nothing here yet.</p>
              <Link
                to="/menu"
                className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                Browse menu
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
                      {line.size} · Qty {line.quantity}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">
                        ${(line.product.price * line.quantity).toFixed(2)}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, line.quantity - 1)}
                          className="underline"
                        >
                          Less
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-primary/15 pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>{fulfillment === "delivery" ? "Delivery" : "Pickup"}</span>
                  <span>{fee ? `$${fee.toFixed(2)}` : "Free"}</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
          >
            <ArrowLeft size={15} /> Continue shopping
          </Link>
        </aside>
      </section>
    </PageShell>
  );
}
