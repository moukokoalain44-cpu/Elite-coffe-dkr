import { createFileRoute } from "@tanstack/react-router";
import { Gift, LockKeyhole, Sparkles, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Récompenses | Elite Coffee" },
      { property: "og:description", content: "Renseignez-vous auprès d’Elite Coffee à Dakar sur les offres actuellement disponibles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Récompenses | Elite Coffee" },
      {
        name: "description",
        content: "Renseignez-vous auprès d’Elite Coffee à Dakar sur les offres actuellement disponibles.",
      },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return <PageShell eyebrow="Récompenses" title="Les avantages Elite Coffee." description="Contactez le restaurant pour connaître les offres et avantages actuellement disponibles."><section className="mx-auto max-w-7xl px-4 pb-20 md:px-6"><a href="tel:+221338249693" className="font-semibold text-primary">+221 33 824 96 93</a></section></PageShell>;
}
