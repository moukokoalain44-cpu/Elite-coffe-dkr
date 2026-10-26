import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check, Clock3, Users } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/brunch")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Brunch à Dakar | Elite Coffee" },
      {
        property: "og:description",
        content:
          "Brunchs gourmands tous les jours de 09h à 17h chez Elite Coffee, à l’entrée de la Cité Keur Gorgui à Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Brunch à Dakar | Elite Coffee" },
      {
        name: "description",
        content:
          "Brunchs gourmands tous les jours de 09h à 17h chez Elite Coffee, à l’entrée de la Cité Keur Gorgui à Dakar.",
      },
    ],
  }),
  component: BrunchPage,
});

function BrunchPage() {
  const brunchMedia = useSiteMedia().find((item) => item.id === "brunch-main");
  return (
    <PageShell
      eyebrow="Brunch · 09h–17h"
      title="Le brunch qui donne envie de rester."
      description="Des formules brunch gourmandes tous les jours, dans un cadre chaleureux à l’entrée de la Cité Keur Gorgui."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-[1fr_.9fr]">
          <div className="p-7 md:p-12">
            <span className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-foreground">
              Tous les jours · 09h–17h
            </span>
            <h2 className="mt-7 font-display text-4xl font-bold md:text-6xl">
              La table est prête.
            </h2>
            <p className="mt-5 max-w-xl text-primary-foreground/75">
              Venez pour un brunch généreux, restez pour l’ambiance, le café et les douceurs à
              partager.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/reserver"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-bold text-accent-foreground hover:-translate-y-0.5"
              >
                Réserver une table <ArrowRight size={16} />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-3 font-bold text-primary-foreground hover:bg-primary-foreground/15"
              >
                Voir la carte
              </Link>
            </div>
          </div>
          <img
            src={brunchMedia?.url}
            alt={brunchMedia?.alt_text ?? "Brunch servi à table"}
            className="min-h-[360px] w-full object-cover"
          />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Sur réservation",
              text: "Choisissez votre créneau et nous préparons votre table.",
            },
            {
              icon: Clock3,
              title: "Tous les jours",
              text: "Le brunch est servi tous les jours de 09h à 17h.",
            },
            {
              icon: Users,
              title: "À partager",
              text: "Une carte généreuse pour les matinées tranquilles, les déjeuners et les occasions spéciales.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl bg-card p-7 shadow-soft">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                <Icon />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-secondary p-7 md:p-10">
          <h2 className="font-display text-3xl font-bold">Pour tous les moments</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Brunch gourmand · tous les jours",
              "Cafés et lattés",
              "Smoothies et boissons fraîches",
              "Desserts à partager",
            ].map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm font-semibold">
                <Check size={17} className="text-accent" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
