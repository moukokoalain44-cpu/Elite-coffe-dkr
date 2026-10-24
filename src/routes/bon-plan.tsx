import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
export const Route = createFileRoute("/bon-plan")({ component: GoodPlanPage });
function GoodPlanPage() {
  return (
    <PageShell
      eyebrow="Bon plan"
      title="Les moments à ne pas manquer."
      description="Les offres et rendez-vous gourmands de la maison, sans commande en ligne : profitez-en sur place."
    >
      <section className="mx-auto max-w-5xl px-4 pb-24 md:px-6">
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
      </section>
    </PageShell>
  );
}
