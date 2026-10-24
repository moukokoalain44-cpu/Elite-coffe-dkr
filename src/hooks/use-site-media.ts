import { useEffect, useState } from "react";
import { fetchSiteMedia, type SiteMediaRow } from "@/lib/supabase";

export const DEFAULT_SITE_MEDIA: SiteMediaRow[] = [
  {
    id: "hero",
    label: "Hero animé",
    slot: "hero",
    media_type: "video",
    url: "/__l5e/assets-v1/1c2f8a68-5cbc-4e0a-88a3-bdc54888cb45/hero.mp4",
    alt_text: "Ambiance Elite Coffee",
    is_visible: true,
    sort_order: 0,
  },
  {
    id: "gallery-1",
    label: "Galerie 1",
    slot: "gallery-1",
    media_type: "image",
    url: "/assets/instagram/hero-brunch.jpg",
    alt_text: "Brunch Elite Coffee",
    is_visible: true,
    sort_order: 1,
  },
  {
    id: "gallery-2",
    label: "Galerie 2",
    slot: "gallery-2",
    media_type: "image",
    url: "/assets/instagram/brunch-table.jpg",
    alt_text: "Table brunch Elite Coffee",
    is_visible: true,
    sort_order: 2,
  },
  {
    id: "gallery-3",
    label: "Galerie 3",
    slot: "gallery-3",
    media_type: "image",
    url: "/assets/instagram/coffee-dessert.jpg",
    alt_text: "Café et dessert Elite Coffee",
    is_visible: true,
    sort_order: 3,
  },
  {
    id: "gallery-4",
    label: "Galerie 4",
    slot: "gallery-4",
    media_type: "image",
    url: "/assets/instagram/dessert-toast.jpg",
    alt_text: "Dessert Elite Coffee",
    is_visible: true,
    sort_order: 4,
  },
];

export function useSiteMedia() {
  const [media, setMedia] = useState(DEFAULT_SITE_MEDIA);
  useEffect(() => {
    let active = true;
    fetchSiteMedia()
      .then((rows) => active && rows.length && setMedia(rows))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  return media;
}
