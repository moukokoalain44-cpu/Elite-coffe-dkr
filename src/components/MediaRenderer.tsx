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

  const localWebpUrl = /^\/assets\/instagram\/[^/]+\.(?:jpe?g|png)$/i.test(media.url)
    ? media.url.replace(/\.(?:jpe?g|png)$/i, ".webp")
    : null;

  return (
    <picture className="block h-full w-full">
      {localWebpUrl && <source srcSet={localWebpUrl} type="image/webp" />}
      <img
        src={media.url}
        alt={media.alt_text}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
