import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { CONTACT } from "@/data/site";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Adresses | Elite Coffee" },
      { property: "og:description", content: "Trouvez un comptoir Elite Coffee, ses horaires, son téléphone et son itinéraire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Adresses | Elite Coffee" },
      {
        name: "description",
        content: "Trouvez un comptoir Elite Coffee, ses horaires, son téléphone et son itinéraire.",
      },
    ],
  }),
  component: LocationsPage,
});

const locations = [{ name: "Elite Coffee — Cité Keur Gorgui", address: CONTACT.address, phone: CONTACT.phone, hours: CONTACT.hours, note: CONTACT.landmark }];

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
      title="Elite Coffee à Dakar."
      description="Retrouvez-nous à la Cité Keur Gorgui, après la boutique Canal+."
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
                  Cité Keur Gorgui
                </span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold">{location.name}</h2>
              <p className="mt-3 text-muted-foreground">{location.note}</p>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex gap-3">
                  <MapPin size={17} className="shrink-0 text-accent" />
                  {location.address}
                </p>
                {CONTACT.phones.map(phone => <a key={phone} href={`tel:${phone.replaceAll(" ", "")}`} className="flex gap-3 hover:text-accent"><Phone size={17} className="shrink-0 text-accent" />{phone}</a>)}
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
              <Button
                type="button"
                onClick={() => directions(location.address)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Navigation size={16} /> Itinéraire <ArrowUpRight size={15} />
              </Button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">{CONTACT.sourceNote}</p>
      </section>
    </PageShell>
  );
}
