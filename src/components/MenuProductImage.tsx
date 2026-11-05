import { Image as ImageIcon } from "lucide-react";

type MenuProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function MenuProductImage({ src, alt, className = "" }: MenuProductImageProps) {
  if (src?.trim()) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — image officielle à venir`}
      className={`grid place-content-center justify-items-center gap-2 overflow-hidden bg-[#f1eeea] p-3 text-center text-[#877d78] ${className}`}
    >
      <ImageIcon size={24} aria-hidden="true" />
      <span className="text-xs font-medium">Image officielle à venir</span>
    </div>
  );
}
