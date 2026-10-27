import type { SiteMediaRow } from "@/lib/supabase";

type MediaRendererProps = {
  media: Pick<SiteMediaRow, "media_type" | "url" | "alt_text">;
  className?: string;
  loading?: "eager" | "lazy";
  poster?: string;
};

export function MediaRenderer({ media, className, loading = "lazy", poster }: MediaRendererProps) {
  if (media.media_type === "video") {
    return (
      <video
        src={media.url}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt_text}
        className={className}
      />
    );
  }

  return <img src={media.url} alt={media.alt_text} loading={loading} className={className} />;
}
