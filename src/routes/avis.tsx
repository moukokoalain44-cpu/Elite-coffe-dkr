import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
const reviews = [
  [
    "Une adresse chaleureuse",
    "Le brunch est généreux, le service attentionné et l’endroit très agréable.",
    "Awa N.",
  ],
  ["Très bon moment", "Une belle pause café à Keur Gorgui, avec une carte variée.", "Mamadou F."],
  ["À refaire", "Les desserts et les boissons glacées sont nos favoris.", "Fatou S."],
];
export const Route = createFileRoute("/avis")({ component: ReviewsPage });
function ReviewsPage() {
  return (
    <PageShell
      eyebrow="Avis"
      title="Ce que nos clients partagent."
      description="Quelques mots de notre communauté de clients et d’habitués."
    >
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 md:grid-cols-3 md:px-6">
        {reviews.map(([title, text, author]) => (
          <article key={author} className="rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">“{text}”</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-accent">{author}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
