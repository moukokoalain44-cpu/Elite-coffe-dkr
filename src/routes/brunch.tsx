import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check, Clock3, Users } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/brunch")({
  head: () => ({
    meta: [
      { title: "Brunch du week-end | Elite Coffee" },
      { name: "description", content: "Réservez votre brunch gourmand du week-end chez Elite Coffee." },
    ],
  }),
  component: BrunchPage,
});

function BrunchPage() {
  return (
    <PageShell eyebrow="Le rendez-vous du week-end" title="Un brunch généreux, sans se presser." description="Chaque samedi et dimanche, retrouvez une formule fraîche, colorée et pensée pour partager un vrai moment autour de la table.">
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-[1fr_.9fr]">
          <div className="p-7 md:p-12">
            <span className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-foreground">Samedi & dimanche · 10h–15h</span>
            <h2 className="mt-7 font-display text-4xl font-bold md:text-6xl">La table est prête.</h2>
            <p className="mt-5 max-w-xl text-primary-foreground/75">Une formule brunch à <strong className="text-accent">12 500 FCFA</strong> : boisson chaude, jus frais, viennoiserie, œufs au choix, tartine gourmande et douceur maison.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/reserver" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground hover:-translate-y-0.5">Réserver une table <ArrowRight size={16} /></Link><Link to="/menu" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-3 font-bold text-primary-foreground hover:bg-primary-foreground/15">Voir la carte</Link></div>
          </div>
          <div className="min-h-[360px] bg-[url('https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=82')] bg-cover bg-center" aria-label="Brunch servi à table" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[{ icon: CalendarDays, title: "Sur réservation", text: "Choisissez votre créneau et nous préparons votre table." }, { icon: Clock3, title: "Service continu", text: "Profitez du brunch entre 10h et 15h, sans vous presser." }, { icon: Users, title: "À partager", text: "Une formule conviviale adaptée aux couples, familles et groupes." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl bg-card p-7 shadow-soft"><span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary"><Icon /></span><h3 className="mt-5 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
        </div>
        <div className="mt-10 rounded-3xl bg-secondary p-7 md:p-10"><h2 className="font-display text-3xl font-bold">Ce qui est inclus</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{["Café, thé ou chocolat chaud", "Jus frais du jour", "Œufs au choix et tartine", "Viennoiserie maison", "Dessert gourmand", "Option végétarienne sur demande"].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold"><Check size={17} className="text-accent" />{item}</p>)}</div></div>
      </section>
    </PageShell>
  );
}
