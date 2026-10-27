import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Leaf, Heart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTACT } from "@/data/site";
import { PageShell } from "@/components/SiteChrome";
import { MediaRenderer } from "@/components/MediaRenderer";
import { useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Notre histoire | Elite Coffee" },
      {
        property: "og:description",
        content:
          "Découvrez Elite Coffee : restaurant, brunch et glacier à l’entrée de la Cité Keur Gorgui à Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Notre histoire | Elite Coffee" },
      {
        name: "description",
        content:
          "Découvrez Elite Coffee : restaurant, brunch et glacier à l’entrée de la Cité Keur Gorgui à Dakar.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const media = useSiteMedia();
  const aboutInterior = media.find((item) => item.id === "about-interior");
  const aboutCoffee = media.find((item) => item.id === "about-coffee");
  const aboutRoom = media.find((item) => item.id === "about-room");
  const values: { icon: LucideIcon; title: string; copy: string }[] = [
    {
      icon: Heart,
      title: "À l’entrée de Keur Gorgui",
      copy: "Une adresse facile à retrouver sur la route du Collège Sacré-Cœur, près du BRT.",
    },
    {
      icon: Leaf,
      title: "Une cuisine généreuse",
      copy: "Brunchs, plats du jour, grillades, fruits de mer, pizzas, desserts et boissons.",
    },
    {
      icon: Users,
      title: "Du brunch au dîner",
      copy: "Ouvert de 08h à 23h du lundi au jeudi, puis jusqu’à minuit du vendredi au dimanche.",
    },
  ];
  return (
    <PageShell
      eyebrow="Notre histoire"
      title="Une adresse gourmande à Dakar."
      description="Restaurant, brunch et glacier à l’entrée de la Cité Keur Gorgui, sur la route du Collège Sacré-Cœur."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            {aboutInterior && (
              <MediaRenderer
                media={aboutInterior}
                className="aspect-[4/5] w-full object-cover"
              />
            )}
          </div>
          <div className="lg:pl-8">
            <p className="text-lg leading-8 text-muted-foreground">
              {CONTACT.address} — {CONTACT.landmark}.
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Découvrez une cuisine généreuse et diversifiée : brunchs gourmands, plats du jour,
              grillades, fruits de mer, pizzas et desserts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Restaurant · brunch · glacier
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Terrasse · événements privés
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
          {aboutCoffee && (
            <MediaRenderer
              media={aboutCoffee}
              className="aspect-[4/3] w-full rounded-3xl object-cover"
            />
          )}
          {aboutRoom && (
            <MediaRenderer
              media={aboutRoom}
              className="aspect-[4/3] w-full rounded-3xl object-cover md:translate-y-10"
            />
          )}
          <div className="flex flex-col justify-center rounded-3xl bg-primary p-7 text-primary-foreground md:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Notre carte</p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Du brunch aux grandes occasions.
            </h2>
            <p className="mt-4 text-sm leading-6 text-primary-foreground/75">
              Brunchs gourmands proposés tous les jours de 09h à 17h, avec aussi une carte variée
              pour déjeuner, dîner ou partager un dessert.
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
