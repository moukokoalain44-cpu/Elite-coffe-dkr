import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Leaf, Heart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTACT } from "@/data/site";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Notre histoire | Elite Coffee" },
      { property: "og:description", content: "Découvrez Elite Coffee : des produits choisis, une hospitalité sincère et un meilleur café au quotidien." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Notre histoire | Elite Coffee" },
      {
        name: "description",
        content:
          "Découvrez Elite Coffee : des produits choisis, une hospitalité sincère et un meilleur café au quotidien.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values: { icon: LucideIcon; title: string; copy: string }[] = [
    {
      icon: Heart,
      title: "À la Cité Keur Gorgui",
      copy: "Retrouvez Elite Coffee à Dakar, après la boutique Canal+.",
    },
    {
      icon: Leaf,
      title: "Une carte variée",
      copy: "Cafés, thés, cocktails, milkshakes, entrées, crêpes, sandwiches et toasts.",
    },
    {
      icon: Users,
      title: "Du matin au soir",
      copy: "Ouvert du lundi au jeudi de 07h à 23h et du vendredi au dimanche de 07h à minuit.",
    },
  ];
  return (
    <PageShell
      eyebrow="Notre histoire"
      title="Elite Coffee, à Dakar."
      description="Un café et restaurant à la Cité Keur Gorgui, après la boutique Canal+."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=1000&q=82"
              alt="Café — photo d’illustration"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <p className="text-lg leading-8 text-muted-foreground">
              {CONTACT.address} — {CONTACT.landmark}.
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Découvrez nos boissons, petits déjeuners et plats à la carte, avec les prix en FCFA.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Cafés & boissons
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Petit déjeuner & déjeuner
              </span>
            </div>
          </div>
        </div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-3xl bg-card p-7 shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                <Icon size={22} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=700&q=82"
            alt="Coffee beans"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=82"
            alt="Intérieur de café — photo d’illustration"
            className="aspect-[4/3] w-full rounded-3xl object-cover md:translate-y-10"
          />
          <div className="flex flex-col justify-center rounded-3xl bg-primary p-7 text-primary-foreground md:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Notre carte
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">Du café au déjeuner.</h2>
            <p className="mt-4 text-sm leading-6 text-primary-foreground/75">
              Formule déjeuner à 9 500 FCFA du lundi au vendredi : entrée, plat du jour au choix, dessert et ataya offert.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
          >
            Goûter notre histoire <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </PageShell>
  );
}
