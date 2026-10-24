import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { CONTACT } from "@/data/site";
export const Route = createFileRoute("/infos")({ component: InfosPage });
function InfosPage() {
  const cards: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: MapPin, label: "Adresse", value: CONTACT.address },
    { icon: Phone, label: "Téléphone", value: CONTACT.phone },
    { icon: Mail, label: "E-mail", value: CONTACT.email },
    { icon: Clock3, label: "Horaires", value: CONTACT.hours.join(" · ") },
  ];
  return (
    <PageShell
      eyebrow="Infos pratiques"
      title="Retrouvez-nous à Dakar."
      description="Toutes les informations utiles pour préparer votre visite chez Elite Coffee."
    >
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <article key={label} className="rounded-3xl bg-card p-6 shadow-soft">
            <Icon className="text-accent" />
            <h2 className="mt-5 font-display text-2xl font-bold">{label}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
