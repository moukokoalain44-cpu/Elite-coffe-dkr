import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/cookies")({ component: CookiesPage });

function CookiesPage() {
  return (
    <PageShell
      eyebrow="Cookies et stockage local"
      title="Vous gardez la main."
      description="Cette page présente les traceurs et stockages utilisés par le site, et comment modifier vos préférences."
    >
      <section className="mx-auto max-w-5xl space-y-5 px-4 pb-20 md:px-6">
        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">Traceurs facultatifs</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            À la date de cette version, le code du site ne charge aucun outil publicitaire, pixel de
            suivi ou outil de mesure d’audience. Les catégories « mesure d’audience » et « publicité
            » restent donc inactives. Si de tels outils sont ajoutés, ils ne devront être chargés
            qu’après un choix positif et explicite, et le choix devra pouvoir être retiré aussi
            simplement.
          </p>
        </article>

        <article className="overflow-hidden rounded-3xl bg-card shadow-soft">
          <div className="border-b border-border p-6 md:p-9">
            <h2 className="font-display text-2xl font-bold">
              Stockages nécessaires ou de préférence
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Le site conserve les éléments indispensables à la sécurité, à l’authentification
              administrateur et au fonctionnement de l’interface. Ces éléments ne servent pas à
              suivre votre navigation à des fins publicitaires.
            </p>
          </div>
          <div className="divide-y divide-border">
            <div className="grid gap-2 p-6 md:grid-cols-[1fr_1fr_1.4fr] md:p-7">
              <strong>Préférence de cookies</strong>
              <span className="text-sm text-muted-foreground">Stockage local · 6 mois</span>
              <span className="text-sm leading-6 text-muted-foreground">
                Mémorise les choix nécessaires, audience et publicité dans ce navigateur afin de ne
                pas redemander votre préférence à chaque visite.
              </span>
            </div>
            <div className="grid gap-2 p-6 md:grid-cols-[1fr_1fr_1.4fr] md:p-7">
              <strong>Connexion administrateur</strong>
              <span className="text-sm text-muted-foreground">Stockage de session</span>
              <span className="text-sm leading-6 text-muted-foreground">
                Géré par Supabase Auth pour maintenir la session de l’administrateur et protéger
                l’accès au back-office. Ce stockage n’est utilisé que pour l’authentification.
              </span>
            </div>
            <div className="grid gap-2 p-6 md:grid-cols-[1fr_1fr_1.4fr] md:p-7">
              <strong>Interface d’administration</strong>
              <span className="text-sm text-muted-foreground">Cookie / stockage local</span>
              <span className="text-sm leading-6 text-muted-foreground">
                L’état de la barre latérale et le thème d’affichage peuvent être mémorisés pour
                retrouver vos préférences d’interface.
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">Modifier ou retirer votre choix</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Ouvrez « Préférences cookies » en bas de page ou depuis le bouton flottant pour revenir
            sur votre choix. Vous pouvez aussi effacer les données de site dans les réglages de
            votre navigateur. Le choix est conservé six mois ; il vous sera ensuite redemandé.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Les traceurs strictement nécessaires et les préférences d’interface ne requièrent pas le
            même consentement que des traceurs de publicité ou de suivi. Pour toute question,
            consultez la{" "}
            <a href="/confidentialite" className="font-semibold text-primary underline">
              politique de confidentialité
            </a>
            .
          </p>
        </article>
      </section>
    </PageShell>
  );
}
