import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations | Elite Coffee" },
      {
        name: "description",
        content: "Find an Elite Coffee bar, hours, phone number and directions.",
      },
    ],
  }),
  component: LocationsPage,
});

const locations = [
  {
    name: "Downtown Roastery",
    address: "123 Roast Street, Brewville, CA 90210",
    phone: "(555) 123-4567",
    hours: ["Mon–Fri · 6:30am–8pm", "Sat–Sun · 7:30am–9pm"],
    note: "Our original bar, with the roastery just behind the counter.",
  },
  {
    name: "Market & Main",
    address: "48 Market Avenue, Brewville, CA 90211",
    phone: "(555) 123-8920",
    hours: ["Every day · 7am–7pm"],
    note: "A bright neighborhood stop for quick coffee and pastry runs.",
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
      eyebrow="Come by"
      title="Find your everyday favorite."
      description="Two bars, one warm welcome. Stop in for a slow morning, a fast pickup or whatever your day needs."
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
                  Open today
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
                <Navigation size={16} /> Get directions <ArrowUpRight size={15} />
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
            <h2 className="mt-5 font-display text-3xl font-bold">A map is coming soon.</h2>
            <p className="mt-3 max-w-md text-sm text-primary-foreground/75">
              For now, use Get directions on any location card and your preferred maps app will open
              with the address ready.
            </p>
            <button
              type="button"
              onClick={() => toast("Choose a location above to get turn-by-turn directions.")}
              className="mt-6 rounded-full bg-card px-5 py-3 text-sm font-bold text-primary"
            >
              How it works
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
