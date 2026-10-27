import { useEffect, useState } from "react";
import { fetchSiteMedia, type SiteMediaRow } from "@/lib/supabase";

export const ADMIN_LOGIN_MEDIA_ID = "admin-login-cover";

export const DEFAULT_ADMIN_LOGIN_MEDIA: SiteMediaRow = {
  id: ADMIN_LOGIN_MEDIA_ID,
  label: "Visuel de connexion administrateur",
  slot: ADMIN_LOGIN_MEDIA_ID,
  media_type: "image",
  url: "/assets/instagram/hero-brunch.jpg",
  alt_text: "Une table brunch chez Elite Coffee",
  is_visible: true,
  sort_order: 0,
};

export const DEFAULT_SITE_MEDIA: SiteMediaRow[] = [
  DEFAULT_ADMIN_LOGIN_MEDIA,
  {
    id: "hero-main",
    label: "Hero principal",
    slot: "hero",
    media_type: "video",
    url: "/assets/elite-coffee-hero.mp4",
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
  {
    id: "interior-1",
    label: "Espace favori 1",
    slot: "interior-1",
    media_type: "image",
    url: "/assets/instagram/brunch-table.jpg",
    alt_text: "Espace intérieur lumineux d’Elite Coffee",
    is_visible: true,
    sort_order: 10,
  },
  {
    id: "interior-2",
    label: "Espace favori 2",
    slot: "interior-2",
    media_type: "image",
    url: "/assets/instagram/coffee-dessert.jpg",
    alt_text: "Table conviviale chez Elite Coffee",
    is_visible: true,
    sort_order: 11,
  },
  {
    id: "interior-3",
    label: "Espace favori 3",
    slot: "interior-3",
    media_type: "image",
    url: "/assets/instagram/dessert-toast.jpg",
    alt_text: "Détail chaleureux de la salle Elite Coffee",
    is_visible: true,
    sort_order: 12,
  },
  {
    id: "about-interior",
    label: "Notre histoire — intérieur",
    slot: "about-interior",
    media_type: "image",
    url: "/assets/instagram/brunch-table.jpg",
    alt_text: "Intérieur chaleureux d’Elite Coffee",
    is_visible: true,
    sort_order: 5,
  },
  {
    id: "about-coffee",
    label: "Notre histoire — café",
    slot: "about-coffee",
    media_type: "image",
    url: "/assets/instagram/coffee-dessert.jpg",
    alt_text: "Café servi chez Elite Coffee",
    is_visible: true,
    sort_order: 6,
  },
  {
    id: "about-room",
    label: "Notre histoire — salle",
    slot: "about-room",
    media_type: "image",
    url: "/assets/instagram/dessert-toast.jpg",
    alt_text: "Salle d’Elite Coffee",
    is_visible: true,
    sort_order: 7,
  },
  {
    id: "brunch-main",
    label: "Page brunch",
    slot: "brunch-main",
    media_type: "image",
    url: "/assets/instagram/hero-brunch.jpg",
    alt_text: "Brunch Elite Coffee servi à table",
    is_visible: true,
    sort_order: 8,
  },
  {
    id: "bon-plan-brunch",
    label: "Bon plan — visuel brunch",
    slot: "bon-plan-brunch",
    media_type: "image",
    url: "/assets/instagram/brunch-table.jpg",
    alt_text: "Assiette de brunch Elite Coffee",
    is_visible: true,
    sort_order: 8.5,
  },
  {
    id: "reservation-main",
    label: "Page réservation",
    slot: "reservation-main",
    media_type: "image",
    url: "/assets/instagram/brunch-table.jpg",
    alt_text: "Table à réserver chez Elite Coffee",
    is_visible: true,
    sort_order: 9,
  },
];

export function mergeSiteMediaDefaults(rows: SiteMediaRow[]) {
  const merged = new Map(DEFAULT_SITE_MEDIA.map((item) => [item.id, item]));
  rows.forEach((item) => merged.set(item.id, item));
  return [...merged.values()].sort((first, second) => first.sort_order - second.sort_order);
}

export function useSiteMedia() {
  const [media, setMedia] = useState(DEFAULT_SITE_MEDIA);
  useEffect(() => {
    let active = true;
    fetchSiteMedia()
      .then((rows) => active && rows.length && setMedia(mergeSiteMediaDefaults(rows)))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  return media;
}
