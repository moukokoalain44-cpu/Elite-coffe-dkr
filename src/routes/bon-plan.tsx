import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";
import { createReservation, registerCustomer } from "@/lib/supabase";

export const Route = createFileRoute("/bon-plan")({ component: GoodPlanPage });

function GoodPlanPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const reservation = {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? "").trim(),
        date: String(data.get("date") ?? ""),
        time: String(data.get("time") ?? ""),
        guests: Number(data.get("guests") ?? 2),
        occasion: "Buffet Elite Coffee",
        ...(String(data.get("message") ?? "").trim()
          ? { message: String(data.get("message") ?? "").trim() }
          : {}),
      } satisfies Parameters<typeof createReservation>[0];
      const id = await createReservation(reservation);
      await Promise.allSettled([
        registerCustomer({
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone,
          source: "buffet",
        }),
      ]);
      setSent(true);
      toast.success("Votre demande pour le buffet est enregistrée");
    } catch {
      toast.error("Impossible d’enregistrer votre demande. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageShell
      eyebrow="Bon plan"
      title="Les moments à ne pas manquer."
      description="Les offres et rendez-vous gourmands de la maison, sans commande en ligne : profitez-en sur place."
    >
      <section className="mx-auto max-w-5xl space-y-8 px-4 pb-24 md:px-6">
        <article className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-lift md:p-12">
          <Sparkles className="text-accent" />
          <h2 className="mt-6 font-display text-4xl font-bold">Brunch tous les jours</h2>
          <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/75">
            De 09h à 17h, retrouvez nos formules brunch, cafés, œufs, viennoiseries et douceurs dans
            une ambiance chaleureuse.
          </p>
          <Link
            to="/reserver"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-primary"
          >
            Réserver une table <ArrowRight size={16} />
          </Link>
        </article>
        <article className="grid gap-8 rounded-[2rem] bg-card p-6 shadow-soft md:grid-cols-[.9fr_1.1fr] md:p-10">
          <div>
            <Users className="text-accent" size={28} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[.24em] text-accent">
              Événement gourmand
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold">Buffet Elite Coffee</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Réservez votre place pour nos buffets et partagez un moment généreux autour d’une
              sélection de plats et de douceurs.
            </p>
            <p className="mt-5 text-sm font-semibold text-primary">
              Les disponibilités sont confirmées par notre équipe.
            </p>
          </div>
          <div>
            {sent ? (
              <div className="grid min-h-64 place-items-center rounded-2xl bg-secondary p-8 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-accent/20">
                  <Check className="text-accent" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">Demande bien reçue</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nous vous contacterons pour confirmer le buffet.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 text-sm font-bold text-primary underline"
                >
                  Faire une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display text-2xl font-bold">Réserver pour le buffet</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Nom complet
                    <input
                      required
                      name="name"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Téléphone
                    <input
                      required
                      type="tel"
                      name="phone"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Adresse e-mail
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      name="email"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Date
                    <input
                      required
                      type="date"
                      name="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Heure
                    <input
                      required
                      type="time"
                      name="time"
                      min="09:00"
                      max="21:00"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    />
                  </label>
                </div>
                <label className="block text-sm font-semibold">
                  Nombre de personnes
                  <select
                    name="guests"
                    defaultValue="2"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "personne" : "personnes"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold">
                  Précision ou demande particulière
                  <textarea
                    name="message"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus:ring-2"
                    placeholder="Allergie, groupe, occasion…"
                  />
                </label>
                <p className="text-xs leading-5 text-muted-foreground">
                  Vos coordonnées servent à traiter et confirmer cette demande, sans inscription à
                  la newsletter.{" "}
                  <Link to="/confidentialite" className="underline">
                    En savoir plus
                  </Link>
                  .
                </p>
                <button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-bold text-primary-foreground disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {loading ? "Envoi en cours…" : "Demander une place au buffet"}
                </button>
              </form>
            )}
          </div>
        </article>
      </section>
    </PageShell>
  );
}
