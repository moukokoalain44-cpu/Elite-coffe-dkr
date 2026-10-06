import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X, Coffee, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const links = [
    ["Menu", "/menu"],
    ["Rewards", "/rewards"],
    ["Our story", "/about"],
    ["Locations", "/locations"],
  ] as const;
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary"
            aria-label="Elite Coffee home"
          >
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Coffee size={18} />
            </span>
            <span className="font-display text-xl font-bold">Elite Coffee</span>
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
          <div className="flex items-center gap-2">
            <Link
              to="/checkout"
              className="relative rounded-full p-2 text-foreground hover:bg-secondary"
              aria-label={`Open cart, ${itemCount} items`}
              onClick={() => setCartOpen(false)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Open cart drawer"
              onClick={() => setCartOpen(true)}
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift sm:inline-flex"
            >
              View cart
            </button>
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full p-2 text-foreground hover:bg-secondary lg:hidden"
            >
              {menuOpen ? <X size={21} /> : <span className="text-lg">☰</span>}
            </button>
          </div>
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, removeItem, updateQuantity } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-primary/25 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-5 shadow-lift">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Your order</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Shopping bag</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 hover:bg-secondary"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-3 font-semibold">Your bag is empty</p>
                <Link
                  to="/menu"
                  onClick={onClose}
                  className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Explore the menu
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((line, index) => (
                <div
                  key={`${line.product.id}-${index}`}
                  className="rounded-2xl bg-secondary/70 p-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={line.product.image}
                      alt=""
                      className="size-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="truncate font-bold">{line.product.name}</p>
                        <button
                          type="button"
                          aria-label={`Remove ${line.product.name}`}
                          onClick={() => {
                            removeItem(index);
                            toast.success("Removed from cart");
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {line.size} · {line.milk}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(index, line.quantity - 1)}
                            className="grid size-7 place-items-center rounded-full bg-card"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(index, line.quantity + 1)}
                            className="grid size-7 place-items-center rounded-full bg-card"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="font-display font-bold">
                          ${(line.product.price * line.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <strong className="font-display text-2xl">${subtotal.toFixed(2)}</strong>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
            >
              Checkout <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </aside>
    </div>
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
              Our story
            </Link>
            <Link to="/locations" className="hover:text-primary">
              Locations
            </Link>
            <Link to="/rewards" className="hover:text-primary">
              Rewards
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
