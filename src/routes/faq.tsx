import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
const faqs = [
  [
    "Faut-il réserver ?",
    "La réservation est conseillée pour les brunchs, les groupes et les événements. Contactez-nous depuis la page Réservation.",
  ],
  [
    "Proposez-vous la livraison ?",
    "Non. Elite Coffee accueille ses clients sur place et ne propose pas de service de livraison ou de commande en ligne.",
  ],
  ["Quels sont les horaires du brunch ?", "Le brunch est servi tous les jours de 09h à 17h."],
  [
    "Peut-on organiser un événement ?",
    "Oui, notre équipe peut étudier les demandes privées et professionnelles selon les disponibilités.",
  ],
];
export const Route = createFileRoute("/faq")({ component: FaqPage });
function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Les réponses aux questions fréquentes."
      description="Un repère simple avant votre venue chez Elite Coffee."
    >
      <section className="mx-auto max-w-4xl space-y-3 px-4 pb-24 md:px-6">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl bg-card p-5 shadow-soft">
            <summary className="flex cursor-pointer list-none items-center gap-3 font-display text-xl font-bold">
              <HelpCircle className="text-accent" size={20} />
              {q}
            </summary>
            <p className="mt-4 pl-8 text-sm leading-7 text-muted-foreground">{a}</p>
          </details>
        ))}
      </section>
    </PageShell>
  );
}
