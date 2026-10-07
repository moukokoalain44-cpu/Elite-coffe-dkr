import { createFileRoute } from "@tanstack/react-router";
import { Gift, LockKeyhole, Sparkles, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Récompenses | Elite Coffee" },
      {
        name: "description",
        content: "Suivez vos points, vos avantages et vos offres personnalisées Elite Coffee.",
      },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const points = 680;
  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggedIn(true);
    toast.success("Bienvenue, vos récompenses sont prêtes");
  };
  return (
    <PageShell
      eyebrow="Elite rewards"
      title="The little things add up."
      description="Earn points on every cup, unlock thoughtful perks, and get offers that feel made for you."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        {!loggedIn ? (
          <div className="grid overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-[1fr_.8fr]">
            <div className="p-7 md:p-12">
              <span className="inline-flex rounded-full bg-primary-foreground/10 p-3">
                <LockKeyhole size={22} />
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold">Votre café, vos avantages.</h2>
              <p className="mt-4 max-w-md text-primary-foreground/75">
                Sign in with a mock rewards account to preview your points dashboard. No account or
                payment details required.
              </p>
              <form onSubmit={login} className="mt-8 max-w-md">
                <label className="text-sm font-semibold">
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border-0 bg-card px-4 py-3 text-foreground outline-none ring-accent focus:ring-2"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground hover:-translate-y-0.5"
                >
                  Preview my rewards
                </button>
              </form>
            </div>
            <div className="relative hidden min-h-[360px] overflow-hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82"
                alt="Coffee being poured"
                className="absolute inset-0 size-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-primary/40" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-3xl bg-primary p-7 text-primary-foreground md:p-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                      Espace membre
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-bold">
                      Hi, {email.split("@")[0]}.
                    </h2>
                  </div>
                  <Trophy className="text-accent" size={30} />
                </div>
                <div className="mt-10 flex items-end justify-between">
                  <div>
                    <span className="font-display text-6xl font-bold">{points}</span>
                    <span className="ml-2 text-primary-foreground/75">points</span>
                  </div>
                  <span className="text-sm font-semibold">320 to next reward</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-foreground/15">
                  <div className="h-full w-[68%] rounded-full bg-accent" />
                </div>
                <p className="mt-3 text-sm text-primary-foreground/70">
                  Free signature drink at 1,000 points.
                </p>
              </div>
              <div className="rounded-3xl bg-card p-7 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                    <Gift />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">
                      Avantage anniversaire
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold">Une douceur pour vous</h3>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  Ajoutez votre date d’anniversaire pour recevoir une pâtisserie offerte ce mois-là.
                </p>
                <button
                  type="button"
                  onClick={() => toast.success("Avantage anniversaire saved to your profile")}
                  className="mt-6 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
                >
                  Ajouter mon anniversaire
                </button>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl bg-card p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">Historique des récompenses</h3>
                  <Star className="fill-star text-star" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["Cold Brew Moka", "+58 pts", "Today"],
                    ["Latte Caramel", "+52 pts", "Jun 18"],
                    ["Free pastry redeemed", "-100 pts", "Jun 10"],
                  ].map(([label, value, date]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-border pb-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">{date}</p>
                      </div>
                      <span className="font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-secondary p-7">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-accent" />
                  <h3 className="font-display text-2xl font-bold">For you</h3>
                </div>
                <div className="mt-5 rounded-2xl bg-card p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">
                    This week only
                  </p>
                  <h4 className="mt-2 text-xl font-bold">Taille supérieure offerte</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Make any hot coffee a Large on us. Just show this offer at checkout.
                  </p>
                  <button
                    type="button"
                    onClick={() => toast.success("Offer saved")}
                    className="mt-4 text-sm font-bold text-primary underline"
                  >
                    Enregistrer l’offre
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
