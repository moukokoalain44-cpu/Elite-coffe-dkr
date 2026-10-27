import { createFileRoute } from "@tanstack/react-router";
import { Image } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { MediaRenderer } from "@/components/MediaRenderer";
import { useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/galerie")({ component: GalleryPage });
function GalleryPage() {
  const publicMedia = useSiteMedia().filter((item) => !item.id.startsWith("admin-"));
  const siteMedia = publicMedia.filter((item) => !item.slot.startsWith("gallery-"));
  const galleryMedia = publicMedia.filter((item) => item.slot.startsWith("gallery-"));

  const renderMediaGrid = (media: typeof publicMedia) => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {media.map((item) => (
        <figure key={item.id} className="group overflow-hidden rounded-2xl bg-card shadow-soft">
          <MediaRenderer
            media={item}
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <figcaption className="p-3 text-sm font-semibold">{item.alt_text}</figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <PageShell
      eyebrow="Galerie"
      title="L’univers Elite Coffee."
      description="Découvrez l’ambiance, les assiettes et les moments qui font vivre notre adresse à Dakar."
    >
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Image size={18} className="text-accent" /> Médias publics sélectionnés par l’équipe Elite
          Coffee
        </div>
        <div className="space-y-12">
          <section aria-labelledby="site-media-title">
            <h2 id="site-media-title" className="mb-5 font-display text-3xl font-bold">
              Médias du site
            </h2>
            {renderMediaGrid(siteMedia)}
          </section>
          <section aria-labelledby="gallery-media-title">
            <h2 id="gallery-media-title" className="mb-5 font-display text-3xl font-bold">
              Médias de la galerie
            </h2>
            {renderMediaGrid(galleryMedia)}
          </section>
        </div>
      </section>
    </PageShell>
  );
}
