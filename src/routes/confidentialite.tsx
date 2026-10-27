import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/confidentialite")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Données personnelles"
      title="Votre confiance, notre priorité."
      description="Voici quelles informations sont utilisées lorsque vous contactez Elite Coffee ou demandez une réservation."
    >
      <section className="mx-auto max-w-5xl space-y-5 px-4 pb-20 md:px-6">
        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">Qui traite vos données ?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Le responsable du traitement indiqué pour ce site est Elite Coffee, à l’entrée de la
            Cité Keur Gorgui, sur la route du Collège Sacré-Cœur, Dakar. Pour toute question ou
            demande concernant vos données, écrivez à{" "}
            <a className="font-semibold text-primary underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            .
          </p>
        </article>

        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">Quelles données et pourquoi ?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Pour une réservation, nous recueillons votre nom, votre numéro de téléphone, votre
            adresse e-mail, la date, l’heure, le nombre de personnes, le motif et, si vous le
            souhaitez, un message. Ces informations servent à recevoir la demande, vérifier les
            disponibilités et vous contacter au sujet de cette réservation. Une demande n’inscrit
            pas à la newsletter et n’autorise pas l’envoi de publicités.
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Le traitement est limité à la réponse à votre demande et à l’organisation du service
            sollicité. Le numéro de téléphone est utilisé pour les messages WhatsApp automatiques de
            réception, de confirmation ou d’annulation lorsque le système de réservation les
            déclenche.
          </p>
        </article>

        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">
            Qui peut y accéder et combien de temps ?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Seules les personnes habilitées d’Elite Coffee et les prestataires techniques
            nécessaires au service peuvent accéder aux données : Supabase pour l’hébergement de la
            base de réservations, et UltraMsg/WhatsApp pour l’acheminement des notifications
            demandées. Ces coordonnées ne sont pas vendues.
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Les demandes sont conservées le temps nécessaire à leur traitement et à leur suivi, puis
            supprimées ou archivées uniquement si une obligation ou un besoin légitime le justifie.
            Le projet ne configure pas encore de purge automatique ni de durée chiffrée :
            l’exploitant doit fixer et appliquer cette durée selon les règles qui lui sont
            applicables.
          </p>
        </article>

        <article className="rounded-3xl bg-card p-6 shadow-soft md:p-9">
          <h2 className="font-display text-2xl font-bold">Vos droits</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Vous pouvez demander l’accès à vos informations, leur rectification ou leur suppression
            lorsque les règles applicables le permettent, et vous opposer à certains traitements.
            Contactez-nous à l’adresse indiquée ci-dessus. Selon votre lieu de résidence et le droit
            applicable, vous pouvez également saisir la{" "}
            <a
              className="underline"
              href="https://www.cdp.sn/particulier/comprendre-vos-droits"
              target="_blank"
              rel="noreferrer"
            >
              Commission des Données Personnelles du Sénégal
            </a>{" "}
            ou la{" "}
            <a className="underline" href="https://www.cnil.fr/" target="_blank" rel="noreferrer">
              CNIL
            </a>
            .
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            La police de caractères est fournie par Google Fonts ; le chargement de cette ressource
            peut transmettre des données techniques de connexion au fournisseur.
          </p>
        </article>

        <p className="rounded-2xl border border-border bg-secondary/70 p-5 text-sm leading-6 text-muted-foreground">
          Pour gérer vos choix de cookies, ouvrez les{" "}
          <Link to="/cookies" className="font-semibold text-primary underline">
            préférences cookies
          </Link>
          . Cette page décrit l’implémentation observée dans le site ; l’exploitant doit confirmer
          sa dénomination juridique, la base légale applicable et la durée exacte de conservation
          avant de revendiquer une conformité complète.
        </p>
      </section>
    </PageShell>
  );
}
