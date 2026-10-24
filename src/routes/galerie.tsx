import { createFileRoute } from "@tanstack/react-router";
import { Image } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/galerie")({ component: GalleryPage });
function GalleryPage() {
  const media = useSiteMedia().filter((item) => item.slot.startsWith("gallery-"));
  return (
    <PageShell
      eyebrow="Galerie"
      title="L’univers Elite Coffee."
      description="Découvrez l’ambiance, les assiettes et les moments qui font vivre notre adresse à Dakar."
    >
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Image size={18} className="text-accent" /> Images sélectionnées par l’équipe Elite Coffee
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {media.map((item) => (
            <figure key={item.id} className="group overflow-hidden rounded-2xl bg-card shadow-soft">
              <img
                src={item.url}
                alt={item.alt_text}
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <figcaption className="p-3 text-sm font-semibold">{item.alt_text}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
