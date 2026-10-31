import { createFileRoute } from "@tanstack/react-router";
import { Image, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/SiteChrome";
import { MediaRenderer } from "@/components/MediaRenderer";
import { useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/galerie")({ component: GalleryPage });
function GalleryPage() {
  const media = useSiteMedia().filter((item) => !item.id.startsWith("admin-"));
  const [selectedMedia, setSelectedMedia] = useState<(typeof media)[number] | null>(null);

  useEffect(() => {
    if (!selectedMedia) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMedia(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedMedia]);

  const frameClasses = (index: number) => {
    const layouts = [
      "md:col-span-2 md:row-span-2",
      "md:row-span-1",
      "md:row-span-2",
      "md:col-span-2 md:row-span-1",
      "md:row-span-2",
      "md:col-span-2 md:row-span-2",
      "md:row-span-1",
    ];
    return layouts[index % layouts.length];
  };

  return (
    <PageShell
      eyebrow="Galerie"
      title="L’univers Elite Coffee."
      description="Découvrez l’ambiance, les assiettes et les moments qui font vivre notre adresse à Dakar."
    >
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Image size={18} className="text-accent" /> Tous les médias publics d’Elite Coffee
        </div>
        <div className="grid grid-cols-2 gap-4 md:auto-rows-[9rem] md:grid-flow-dense md:grid-cols-4">
          {media.map((item, index) => (
            <figure
              key={item.id}
              className={`group min-h-52 overflow-hidden rounded-2xl bg-card shadow-soft md:min-h-0 ${frameClasses(index)}`}
            >
              {item.media_type === "image" || item.media_type === "video" ? (
                <button
                  type="button"
                  onClick={() => setSelectedMedia(item)}
                  className="block h-full w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  aria-label={`${item.media_type === "video" ? "Agrandir la vidéo" : "Agrandir l’image"} : ${item.alt_text}`}
                >
                  <MediaRenderer
                    media={item}
                    className="h-full min-h-52 w-full object-cover transition duration-500 group-hover:scale-105 md:min-h-0"
                  />
                </button>
              ) : (
                <MediaRenderer
                  media={item}
                  className="h-full min-h-52 w-full object-cover transition duration-500 group-hover:scale-105 md:min-h-0"
                />
              )}
              <figcaption className="p-3 text-sm font-semibold">{item.alt_text}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      {selectedMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedMedia.alt_text}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c252a]/90 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedMedia(null)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8 md:top-8"
            aria-label="Fermer l’image agrandie"
          >
            <X size={22} />
          </button>
          <div className="flex max-h-full max-w-6xl flex-col items-center gap-4" onClick={(event) => event.stopPropagation()}>
            {selectedMedia.media_type === "video" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={selectedMedia.alt_text}
                className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt_text}
                className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            )}
            <p className="text-center text-sm font-medium text-white/90">{selectedMedia.alt_text}</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
