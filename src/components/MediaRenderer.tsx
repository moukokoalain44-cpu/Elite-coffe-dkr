import type { SiteMediaRow } from "@/lib/supabase";
import { Image as ImageIcon } from "lucide-react";

type MediaRendererProps = {
  media: Pick<SiteMediaRow, "media_type" | "url" | "alt_text">;
  className?: string;
  loading?: "eager" | "lazy";
  poster?: string;
};

export function MediaRenderer({ media, className, loading = "lazy", poster }: MediaRendererProps) {
  if (!media.url.trim()) {
    return (
      <div
        role="img"
        aria-label={`${media.alt_text} — média officiel à venir`}
        className={`grid place-content-center justify-items-center gap-2 overflow-hidden bg-secondary p-4 text-center text-muted-foreground ${className ?? ""}`}
      >
        <ImageIcon size={26} aria-hidden="true" />
        <span className="text-xs font-medium">Média officiel à venir</span>
      </div>
    );
  }

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

  return (
    <picture className="block h-full w-full">
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
