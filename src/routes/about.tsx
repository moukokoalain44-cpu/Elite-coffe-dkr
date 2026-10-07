import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Leaf, Heart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
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
      title: "Care in every detail",
      copy: "From the way we welcome you to the way we dial in espresso, we choose intention over shortcuts.",
    },
    {
      icon: Leaf,
      title: "Sourcing with purpose",
      copy: "We work with small producers and transparent importers who make quality and stewardship part of the process.",
    },
    {
      icon: Users,
      title: "A table for everyone",
      copy: "Elite Coffee is built as a neighborhood ritual: a place to focus, catch up, celebrate or simply breathe.",
    },
  ];
  return (
    <PageShell
      eyebrow="Notre histoire"
      title="Le café peut être exigeant sans se prendre trop au sérieux."
      description="Elite Coffee est né d’une conviction simple : une tasse exceptionnelle doit être travaillée avec soin tout en restant chaleureuse."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=1000&q=82"
              alt="Barista preparing coffee"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <p className="text-lg leading-8 text-muted-foreground">
              We opened our first bar in 2015 with a small roaster, a big playlist and a conviction
              that coffee should make ordinary days feel a little more special. Today, we still
              roast in small batches, bake every morning and know many of our regulars by their
              usual order.
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our menu moves with the seasons, but the standard stays the same: honest ingredients,
              precise technique and hospitality that never feels rehearsed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Torréfié en petites quantités
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                <Check size={15} className="text-accent" /> Cuit chaque matin
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
            alt="Elite Coffee interior"
            className="aspect-[4/3] w-full rounded-3xl object-cover md:translate-y-10"
          />
          <div className="flex flex-col justify-center rounded-3xl bg-primary p-7 text-primary-foreground md:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Notre approvisionnement
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">Une origine que l’on peut raconter.</h2>
            <p className="mt-4 text-sm leading-6 text-primary-foreground/75">
              Our rotating single origins come from producers we can name, regions we can explain
              and harvests we can celebrate.
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
