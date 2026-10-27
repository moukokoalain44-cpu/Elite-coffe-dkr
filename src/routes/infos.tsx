import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";
import { CONTACT } from "@/data/site";
import { createContactMessage, registerCustomer } from "@/lib/supabase";

export const Route = createFileRoute("/infos")({ component: InfosPage });
const input =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function InfosPage() {
  const cards: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: MapPin, label: "Adresse", value: `${CONTACT.address} — ${CONTACT.landmark}` },
    { icon: Phone, label: "Téléphone", value: CONTACT.phones.join(" · ") },
    { icon: Mail, label: "E-mail", value: CONTACT.email },
    { icon: Clock3, label: "Horaires", value: CONTACT.hours.join(" · ") },
  ];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const next: Record<string, string> = {};
    if (value("name").length < 2) next["name"] = "Veuillez saisir votre nom";
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) next["email"] = "Veuillez saisir un e-mail valide";
    if (value("subject").length < 2) next["subject"] = "Veuillez ajouter un objet";
    if (value("message").length < 10)
      next["message"] = "Le message doit contenir au moins 10 caractères";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Veuillez corriger les champs en surbrillance");
      return;
    }

    try {
      await Promise.all([
        registerCustomer({
          name: value("name"),
          email: value("email"),
          phone: value("phone") || "non renseigné",
          source: "contact",
        }),
        createContactMessage({
          name: value("name"),
          email: value("email"),
          phone: value("phone"),
          subject: value("subject"),
          message: value("message"),
        }),
      ]);
      toast.success("Merci ! Nous vous répondrons sous 24 heures.");
      form.reset();
    } catch {
      toast.error(
        "Votre message n’a pas pu être enregistré. Réessayez ou contactez-nous par téléphone.",
      );
    }
  };

  return (
    <PageShell
      eyebrow="Infos pratiques"
      title="Retrouvez-nous à Dakar."
      description="Toutes les informations utiles pour préparer votre visite chez Elite Coffee."
    >
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value }) => (
            <article key={label} className="rounded-3xl bg-card p-6 shadow-soft">
              <Icon className="text-accent" />
              <h2 className="mt-5 font-display text-2xl font-bold">{label}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-accent">
              Contactez-nous
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold">Restons en contact</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Une question, un événement ou juste envie de dire bonjour ? Nous serions ravis de vous
              lire.
            </p>
            <form
              onSubmit={submit}
              noValidate
              className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-soft md:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom complet" error={errors["name"]}>
                  <input name="name" className={input} placeholder="Marie Dupont" />
                </Field>
                <Field label="E-mail" error={errors["email"]}>
                  <input
                    name="email"
                    type="email"
                    className={input}
                    placeholder="marie@email.com"
                  />
                </Field>
                <Field label="Téléphone (facultatif)">
                  <input name="phone" type="tel" className={input} placeholder="+221 …" />
                </Field>
                <Field label="Objet" error={errors["subject"]}>
                  <input
                    name="subject"
                    className={input}
                    placeholder="Comment pouvons-nous aider ?"
                  />
                </Field>
              </div>
              <Field label="Message" error={errors["message"]}>
                <textarea
                  name="message"
                  rows={5}
                  className={input}
                  placeholder="Dites-nous en plus..."
                />
              </Field>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Envoyer le message
              </button>
              <p className="text-xs leading-5 text-muted-foreground">
                Votre adresse e-mail et votre message servent à répondre à votre demande. Consultez
                la{" "}
                <Link to="/confidentialite" className="underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </form>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-primary p-7 text-primary-foreground shadow-lift">
              <h3 className="font-display text-3xl font-bold">Une envie, une question ?</h3>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                Appelez-nous directement ou passez nous voir à l’entrée de la Cité Keur Gorgui.
              </p>
              <p className="mt-5 font-semibold">{CONTACT.phones.join(" · ")}</p>
            </div>
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lift">
              <h3 className="text-2xl font-bold">Newsletter bientôt disponible</h3>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                L’inscription en ligne n’est pas encore activée. Aucune adresse ne sera collectée à
                des fins promotionnelles par ce formulaire.
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-4 inline-flex rounded-full bg-card px-5 py-3 text-sm font-semibold text-primary"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
