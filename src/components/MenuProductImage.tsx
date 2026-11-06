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
      className={`grid place-content-center justify-items-center gap-1 overflow-hidden bg-[#f1eeea] p-1 text-center text-[#877d78] sm:gap-2 sm:p-3 ${className}`}
    >
      <ImageIcon size={24} className="size-4 shrink-0 sm:size-6" aria-hidden="true" />
      <span className="max-w-full break-words text-[9px] font-medium leading-tight sm:text-xs sm:leading-normal">
        Image officielle à venir
      </span>
    </div>
  );
}
