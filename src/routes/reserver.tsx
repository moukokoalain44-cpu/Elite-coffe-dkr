import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Check, Clock3, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/reserver")({
  head: () => ({
    meta: [
      { title: "Réserver une table | Elite Coffee" },
      { name: "description", content: "Réservez une table chez Elite Coffee pour un brunch, un café ou un moment à partager." },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  const [occasion, setOccasion] = useState("Table classique");
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    toast.success("Votre demande de réservation est enregistrée");
  };
  return (
    <PageShell eyebrow="Réservation" title="Gardons une place pour vous." description="Indiquez votre date, votre créneau et le nombre de personnes. Notre équipe vous confirme rapidement votre table.">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 md:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={submit} className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          {sent ? <div className="rounded-2xl bg-secondary p-6"><Check className="text-accent" size={30} /><h2 className="mt-4 font-display text-3xl font-bold">Demande bien reçue</h2><p className="mt-3 text-muted-foreground">Nous revenons vers vous par téléphone pour confirmer les disponibilités.</p><Link to="/menu" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground">Découvrir la carte</Link></div> : <>
            <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Nom complet<input required name="name" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal" /></label><label className="text-sm font-semibold">Téléphone<input required type="tel" name="phone" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal" /></label><label className="text-sm font-semibold">Date<input required type="date" name="date" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal" /></label><label className="text-sm font-semibold">Heure<input required type="time" name="time" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal" /></label><label className="text-sm font-semibold">Nombre de personnes<select value={"2"} onChange={() => undefined} name="guests" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal">{[1,2,3,4,5,6,7,8,10].map((n) => <option key={n}>{n}</option>)}</select></label><label className="text-sm font-semibold">Motif<select value={occasion} onChange={(event) => setOccasion(event.target.value)} name="occasion" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal"><option>Table classique</option><option>Brunch du week-end</option><option>Anniversaire</option><option>Déjeuner professionnel</option></select></label></div>
            <label className="mt-5 block text-sm font-semibold">Message ou demande particulière<textarea name="message" rows={4} placeholder="Chaise bébé, allergie, décoration…" className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 font-normal" /></label><button type="submit" className="mt-6 w-full rounded-full bg-primary px-5 py-4 font-bold text-primary-foreground hover:-translate-y-0.5">Demander cette réservation</button>
          </>}
        </form>
        <aside className="space-y-5"><div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-lift"><div className="h-64 bg-[url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=82')] bg-cover bg-center" /><div className="p-7"><p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Une table, un moment</p><h2 className="mt-3 font-display text-3xl font-bold">On s’occupe de l’ambiance.</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/75">Pour le brunch, précisez simplement l’occasion dans le formulaire afin que l’équipe prépare au mieux votre accueil.</p></div></div><div className="rounded-3xl bg-secondary p-6"><p className="flex gap-3 text-sm font-semibold"><CalendarDays className="shrink-0 text-accent" size={19} /> Réservations recommandées le week-end</p><p className="mt-4 flex gap-3 text-sm font-semibold"><Clock3 className="shrink-0 text-accent" size={19} /> Service de 10h à 22h</p><p className="mt-4 flex gap-3 text-sm font-semibold"><Users className="shrink-0 text-accent" size={19} /> Groupes jusqu’à 10 personnes</p></div></aside>
      </section>
    </PageShell>
  );
}
