import { useEffect, useState } from "react";
import { fetchSiteMedia, type SiteMediaRow } from "@/lib/supabase";

export const ADMIN_LOGIN_MEDIA_ID = "admin-login-cover";

function pendingMedia(
  id: string,
  label: string,
  slot: string,
  media_type: SiteMediaRow["media_type"],
  sort_order: number,
  alt_text: string,
): SiteMediaRow {
  return {
    id,
    label,
    slot,
    media_type,
    url: "",
    alt_text,
    is_visible: false,
    sort_order,
  };
}

export const DEFAULT_ADMIN_LOGIN_MEDIA = pendingMedia(
  ADMIN_LOGIN_MEDIA_ID,
  "Visuel de connexion administrateur",
  ADMIN_LOGIN_MEDIA_ID,
  "image",
  0,
  "Visuel officiel de connexion administrateur à téléverser",
);

// Stable empty slots allow the admin to add official media without shipping
// demo, stock, or generated photos as public fallbacks.
export const DEFAULT_SITE_MEDIA: SiteMediaRow[] = [
  DEFAULT_ADMIN_LOGIN_MEDIA,
  pendingMedia("hero-main", "Hero principal", "hero", "video", 0, "Vidéo officielle à téléverser"),
  pendingMedia("gallery-1", "Galerie 1", "gallery-1", "image", 1, "Image officielle à téléverser"),
  pendingMedia("gallery-2", "Galerie 2", "gallery-2", "image", 2, "Image officielle à téléverser"),
  pendingMedia("gallery-3", "Galerie 3", "gallery-3", "image", 3, "Image officielle à téléverser"),
  pendingMedia("gallery-4", "Galerie 4", "gallery-4", "image", 4, "Image officielle à téléverser"),
  pendingMedia(
    "interior-1",
    "Espace favori 1",
    "interior-1",
    "image",
    10,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "interior-2",
    "Espace favori 2",
    "interior-2",
    "image",
    11,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "interior-3",
    "Espace favori 3",
    "interior-3",
    "image",
    12,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "about-interior",
    "Notre histoire — intérieur",
    "about-interior",
    "image",
    5,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "about-coffee",
    "Notre histoire — café",
    "about-coffee",
    "image",
    6,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "about-room",
    "Notre histoire — salle",
    "about-room",
    "image",
    7,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "brunch-main",
    "Page brunch",
    "brunch-main",
    "image",
    8,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "bon-plan-brunch",
    "Bon plan — visuel brunch",
    "bon-plan-brunch",
    "image",
    8.5,
    "Image officielle à téléverser",
  ),
  pendingMedia(
    "reservation-main",
    "Page réservation",
    "reservation-main",
    "image",
    9,
    "Image officielle à téléverser",
  ),
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
