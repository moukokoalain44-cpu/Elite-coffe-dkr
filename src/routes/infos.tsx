import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";
import { CONTACT } from "@/data/site";

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
  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
    toast.success("Merci ! Nous vous répondrons sous 24 heures.");
    event.currentTarget.reset();
  };
  const subscribe = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Veuillez saisir un e-mail valide");
      return;
    }
    toast.success("Vous êtes inscrit !");
    event.currentTarget.reset();
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
                  <input name="phone" className={input} placeholder="+221 …" />
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
              <h3 className="text-2xl font-bold">Rejoignez notre newsletter</h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Nouvelles boissons, spécialités de saison et offres réservées aux membres.
              </p>
              <form onSubmit={subscribe} className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  name="email"
                  type="email"
                  placeholder="Votre e-mail"
                  className="min-w-0 flex-1 rounded-full bg-primary-foreground/10 px-5 py-3 text-sm outline-none placeholder:text-primary-foreground/60"
                />
                <button className="rounded-full bg-card px-5 py-3 text-sm font-semibold text-primary">
                  S’inscrire
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
