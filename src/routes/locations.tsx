import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Adresses | Elite Coffee" },
      {
        name: "description",
        content: "Trouvez un comptoir Elite Coffee, ses horaires, son téléphone et son itinéraire.",
      },
    ],
  }),
  component: LocationsPage,
});

const locations = [
  {
    name: "Comptoir Central",
    address: "123 rue du Café, Dakar",
    phone: "+221 77 000 00 00",
    hours: ["Lun–Ven · 6h30–20h", "Sam–Dim · 7h30–21h"],
    note: "Notre adresse historique, avec la torréfaction juste derrière le comptoir.",
  },
  {
    name: "KeurGui Café",
    address: "48 avenue du Marché, Dakar",
    phone: "+221 77 000 00 01",
    hours: ["Tous les jours · 7h–19h"],
    note: "Une adresse lumineuse pour un café rapide, une pâtisserie ou une pause tranquille.",
  },
];

function LocationsPage() {
  const directions = (address: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  return (
    <PageShell
      eyebrow="Venez nous voir"
      title="Trouvez votre nouveau rendez-vous."
      description="Deux comptoirs, un accueil chaleureux. Passez pour un matin tranquille, un retrait rapide ou une pause bien méritée."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {locations.map((location) => (
            <article key={location.name} className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                  <MapPin />
                </span>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-primary">
                  Ouvert aujourd’hui
                </span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold">{location.name}</h2>
              <p className="mt-3 text-muted-foreground">{location.note}</p>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex gap-3">
                  <MapPin size={17} className="shrink-0 text-accent" />
                  {location.address}
                </p>
                <a href={`tel:${location.phone}`} className="flex gap-3 hover:text-accent">
                  <Phone size={17} className="shrink-0 text-accent" />
                  {location.phone}
                </a>
                <div className="flex gap-3">
                  <Clock3 size={17} className="shrink-0 text-accent" />
                  <span>
                    {location.hours.map((hour) => (
                      <span key={hour} className="block">
                        {hour}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => directions(location.address)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Navigation size={16} /> Itinéraire <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
        </div>
        <div className="relative mt-8 min-h-[360px] overflow-hidden rounded-[2rem] bg-primary shadow-lift">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1500&q=82"
            alt="Elite Coffee neighborhood"
            className="absolute inset-0 size-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-primary/45" />
          <div className="relative flex min-h-[360px] flex-col items-center justify-center px-6 text-center text-primary-foreground">
            <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
              <MapPin size={25} />
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold">La carte arrive bientôt.</h2>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/75">
              Utilisez le bouton Itinéraire d’une adresse : votre application de cartes s’ouvrira
              directement avec l’adresse prête.
            </p>
            <button
              type="button"
              onClick={() => toast("Choisissez une adresse ci-dessus pour ouvrir l’itinéraire.")}
              className="mt-6 rounded-full bg-card px-5 py-3 text-sm font-bold text-primary"
            >
              Comment ça marche
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
