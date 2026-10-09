import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Check, Clock3, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CONTACT } from "@/data/site";
import { PageShell } from "@/components/SiteChrome";
import { createReservation } from "@/lib/supabase";

export const Route = createFileRoute("/reserver")({
  head: () => ({
    meta: [
      {
        property: "og:title",
        content: "Réserver une table | Elite Coffee",
      },
      {
        property: "og:description",
        content:
          "Réservez une table chez Elite Coffee pour un brunch, un café ou un moment à partager.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Réserver une table | Elite Coffee" },
      {
        name: "description",
        content:
          "Réservez une table chez Elite Coffee pour un brunch, un café ou un moment à partager.",
      },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  const [occasion, setOccasion] = useState("Table classique");
  const [guests, setGuests] = useState("2");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setLoading(true);
    try {
      const id = await createReservation({
        name: data.get("name") as string,
        phone: data.get("phone") as string,
        date: data.get("date") as string,
        time: data.get("time") as string,
        guests: parseInt(guests),
        occasion,
        message: (data.get("message") as string) || undefined,
      });
      setReservationId(id);
      setSent(true);
      toast.success("Votre demande de réservation est enregistrée");
    } catch (err) {
      console.error(err);
      toast.error(
        "Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Réservation"
      title="Gardons une place pour vous."
      description="Indiquez votre date, votre créneau et le nombre de personnes. Notre équipe vous confirme rapidement votre table."
    >
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 md:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <form
          onSubmit={submit}
          className="rounded-3xl bg-card p-6 shadow-soft md:p-9"
        >
          {sent ? (
            <div className="rounded-2xl bg-secondary p-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-accent/20 mx-auto">
                <Check className="text-accent" size={28} />
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold">
                Demande bien reçue
              </h2>
              {reservationId && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Réf. :{" "}
                  <code className="font-mono">
                    {reservationId.slice(0, 8).toUpperCase()}
                  </code>
                </p>
              )}
              <p className="mt-3 text-muted-foreground">
                Nous revenons vers vous par téléphone pour confirmer les
                disponibilités.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground"
                >
                  Découvrir la carte
                </Link>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary border border-border px-5 py-3 font-bold"
                >
                  Nouvelle réservation
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  Nom complet
                  <input
                    required
                    name="name"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Téléphone
                  <input
                    required
                    type="tel"
                    name="phone"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Date
                  <input
                    required
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Heure
                  <input
                    required
                    type="time"
                    name="time"
                    min="07:00"
                    max="22:00"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Nombre de personnes
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    name="guests"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "personne" : "personnes"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold">
                  Motif
                  <select
                    value={occasion}
                    onChange={(event) => setOccasion(event.target.value)}
                    name="occasion"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                  >
                    <option>Table classique</option>
                    <option>Petit déjeuner</option>
                    <option>Anniversaire</option>
                    <option>Déjeuner professionnel</option>
                    <option>Brunch</option>
                    <option>Événement privé</option>
                  </select>
                </label>
              </div>
              <label className="mt-5 block text-sm font-semibold">
                Message ou demande particulière
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Chaise bébé, allergie, décoration…"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none ring-ring focus:ring-2"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {loading ? "Envoi en cours…" : "Demander cette réservation"}
              </button>
            </>
          )}
        </form>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-lift">
            <div
              className="h-64 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=82')",
              }}
            />
            <div className="p-7">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Une table, un moment
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                On s'occupe de l'ambiance.
              </h2>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                Pour connaître les disponibilités, contactez-nous au{" "}
                {CONTACT.phone}.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-secondary p-6">
            <p className="flex gap-3 text-sm font-semibold">
              <CalendarDays className="shrink-0 text-accent" size={19} />
              Réservations recommandées le week-end
            </p>
            <p className="mt-4 flex gap-3 text-sm font-semibold">
              <Clock3 className="shrink-0 text-accent" size={19} />
              {CONTACT.hours.join(" · ")}
            </p>
            <p className="mt-4 flex gap-3 text-sm font-semibold">
              <Users className="shrink-0 text-accent" size={19} />
              Pour les groupes de +10 personnes, contactez-nous directement
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
