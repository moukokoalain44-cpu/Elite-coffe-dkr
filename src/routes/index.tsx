import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Award,
  Clock,
  Coffee,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import {
  BRAND,
  CONTACT,
  FOOTER,
  INSTAGRAM,
  INSTAGRAM_REELS,
  MENU_SECTIONS,
  STATS,
} from "@/data/site";
import { type Product } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import { useMenuCatalog } from "@/hooks/use-menu-catalog";
import { useAdmin } from "@/contexts/AdminContext";
import { SiteHeader } from "@/components/SiteChrome";
import { formatCFA } from "@/lib/currency";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Elite Coffee — Restaurant, brunch & glacier à Dakar" },
      {
        name: "description",
        content:
          "Elite Coffee est un restaurant, brunch et glacier à Dakar, à l’entrée de la Cité Keur Gorgui : brunchs, plats généreux, cafés et desserts.",
      },
      { property: "og:title", content: "Elite Coffee — Restaurant, brunch & glacier à Dakar" },
      {
        property: "og:description",
        content:
          "Restaurant, brunch et glacier à l’entrée de la Cité Keur Gorgui : découvrez la carte, les horaires et réservez votre table.",
      },
    ],
  }),
  component: Index,
});

/* ---------- helpers ---------- */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e?.isIntersecting && (el.classList.add("is-visible"), io.disconnect()),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Pill({ icon, children, dark }: { icon?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${dark ? "bg-primary-foreground/10 text-primary-foreground" : "bg-secondary text-primary"}`}
    >
      {icon}
      {children}
    </span>
  );
}

function Stars({ n = 5, size = 16 }: { n?: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} className="fill-star text-star" />
      ))}
    </div>
  );
}

function SectionHead({ badge, title, sub }: { badge: ReactNode; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {badge}
      <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

const btn =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift`;
const btnOutline = `${btn} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
const card = "rounded-2xl bg-card shadow-soft";

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1600, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("fr-FR")}+</span>;
}

/* ---------- page ---------- */
function Index() {
  const { products } = useMenuCatalog();
  const { addItem } = useCart();
  const add = (name: string) => {
    const product = products.find((item) => item.name === name);
    if (!product) return;
    addItem(product);
    toast.success(`${name} ajouté au panier`);
  };
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <BestSellers products={products} onAdd={add} />
        <MenuFilter products={products} onAdd={add} />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const { content } = useAdmin();
  return (
    <section
      id="home"
      className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2"
    >
      <Reveal>
        <Pill icon={<Award size={14} />}>{BRAND.tagline} · Dakar</Pill>
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-foreground md:text-7xl">
          {content.heroTitle}
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">{content.heroDescription}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#menu" className={btnPrimary}>
            Commander en ligne <ArrowRight size={16} />
          </a>
          <a href="#menu" className={btnOutline}>
            Voir la carte
          </a>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          {CONTACT.hours.join(" · ")} · Brunch tous les jours de 09h à 17h
        </p>
      </Reveal>
      <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
        <a
          href="https://www.instagram.com/elitecoffee_dkr/p/Dbn08xcDcl4/"
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-[2rem] shadow-lift"
        >
          <img
            src="/assets/instagram/hero-brunch.jpg"
            alt="Nouvelle carte brunch publiée par Elite Coffee"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-primary/85 px-4 py-2 text-xs font-semibold text-primary-foreground">
            Voir la publication Instagram
          </span>
        </a>
      </Reveal>
    </section>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <Reveal className="grid grid-cols-1 divide-y divide-primary-foreground/15 rounded-2xl bg-primary py-4 text-center text-primary-foreground sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((s) => (
          <div key={s.label} className="px-6 py-5">
            <p className="font-display text-4xl font-bold md:text-5xl">{s.value}</p>
            <p className="mt-1 text-sm text-primary-foreground/75">{s.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function BestSellers({ products, onAdd }: { products: Product[]; onAdd: (n: string) => void }) {
  const picks = ["Café expresso", "Café glacé caramel", "Milkshake fruits rouges"]
    .map((name) => products.find((product) => product.name === name))
    .filter((product): product is Product => Boolean(product));
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <SectionHead
        badge={<Pill icon={<Heart size={14} />}>À la carte</Pill>}
        title="Les favoris de la maison"
        sub="Une sélection de boissons préparées à la commande, directement depuis notre carte."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {picks.map((b, index) => (
          <Reveal key={b.name}>
            <article
              className={`group h-full overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${index === 0 ? "bg-primary text-primary-foreground shadow-lift" : "bg-card text-card-foreground shadow-soft"}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={b.image}
                  alt={b.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {b.category}
                </span>
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{b.name}</h3>
                  <Stars size={13} />
                </div>
                <p
                  className={`mt-2 text-sm ${index === 0 ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                >
                  {b.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">{formatCFA(b.price)}</span>
                  <button
                    onClick={() => onAdd(b.name)}
                    className={`${btn} !py-2.5 ${index === 0 ? "bg-card text-primary hover:bg-secondary" : "bg-primary text-primary-foreground hover:shadow-lift"}`}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MenuFilter({ products, onAdd }: { products: Product[]; onAdd: (n: string) => void }) {
  const defaultSection = MENU_SECTIONS[0]!;
  const [section, setSection] = useState(defaultSection.label);
  const current = MENU_SECTIONS.find((item) => item.label === section) ?? defaultSection;
  const [cat, setCat] = useState(current.categories[0]!);
  const items = products.filter((product) => product.category === cat);
  const chooseSection = (label: string) => {
    const next = MENU_SECTIONS.find((item) => item.label === label) ?? defaultSection;
    setSection(next.label);
    setCat(next.categories[0]!);
  };
  return (
    <section id="menu" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHead
          badge={<Pill icon={<Coffee size={14} />}>Notre carte</Pill>}
          title="Découvrez notre carte"
          sub="Choisissez d’abord votre moment, puis la catégorie qui vous fait envie."
        />
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="rounded-3xl bg-card p-3 shadow-soft lg:sticky lg:top-28">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Par moment
            </p>
            {MENU_SECTIONS.map((item) => (
              <button
                key={item.label}
                onClick={() => chooseSection(item.label)}
                className={`block w-full rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-colors ${section === item.label ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              >
                {item.label}
              </button>
            ))}
          </aside>
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {current.categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCat(item)}
                  className={`${btn} !px-4 !py-2.5 text-xs ${cat === item ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground hover:bg-primary/10"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{current.intro}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((m) => (
                <article
                  key={m.id}
                  className={`${card} group flex items-center gap-4 p-4 transition-all hover:-translate-y-1 hover:shadow-lift`}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-foreground">{m.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {m.description || "Préparé à la commande."}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-primary">
                        {formatCFA(m.price)}
                      </span>
                      <button
                        aria-label={`Ajouter ${m.name}`}
                        onClick={() => onAdd(m.name)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="locations" className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
      <SectionHead
        badge={<Pill icon={<Instagram size={14} />}>{BRAND.handle}</Pill>}
        title="Une pause gourmande, en vrai"
        sub="Les images et les mots viennent des publications publiques d’Elite Coffee."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
        {INSTAGRAM.map((g) => (
          <a
            key={g.alt}
            href={g.source}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-2xl"
            aria-label={`Voir ${g.alt} sur Instagram`}
          >
            <img
              src={g.img}
              alt={g.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 grid place-items-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram className="text-primary-foreground" size={32} />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {INSTAGRAM_REELS.map((reel) => (
          <a
            key={reel.url}
            href={reel.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl bg-primary p-6 text-primary-foreground transition-transform hover:-translate-y-1"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Reel Instagram
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold">{reel.title}</h3>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/75">{reel.text}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
              Voir le reel <ArrowRight size={16} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

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
const input =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (v("name").length < 2) err["name"] = "Veuillez saisir votre nom";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) err["email"] = "Veuillez saisir un e-mail valide";
    if (v("subject").length < 2) err["subject"] = "Veuillez ajouter un objet";
    if (v("message").length < 10)
      err["message"] = "Le message doit contenir au moins 10 caractères";
    setErrors(err);
    if (Object.keys(err).length) {
      toast.error("Veuillez corriger les champs en surbrillance");
      return;
    }
    toast.success("Merci ! Nous vous répondrons sous 24 heures.");
    e.currentTarget.reset();
  };
  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Veuillez saisir un e-mail valide");
      return;
    }
    toast.success("Vous êtes inscrit !");
    e.currentTarget.reset();
  };
  const info = [
    { icon: Phone, label: "Téléphone", lines: CONTACT.phones },
    { icon: Mail, label: "E-mail", lines: [CONTACT.email] },
    { icon: MapPin, label: "Adresse", lines: [CONTACT.address, CONTACT.landmark] },
    { icon: Clock, label: "Horaires d'ouverture", lines: CONTACT.hours },
  ];
  return (
    <section id="contact" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHead
          badge={<Pill icon={<Mail size={14} />}>Contactez-nous</Pill>}
          title="Restons en contact"
          sub="Une question, un événement ou juste envie de dire bonjour ? Nous serions ravis de vous lire."
        />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <form onSubmit={submit} noValidate className={`${card} space-y-5 p-6 md:p-8`}>
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
              <button type="submit" className={`${btnPrimary} w-full sm:w-auto`}>
                Envoyer le message <ArrowRight size={16} />
              </button>
            </form>
          </Reveal>
          <Reveal className="space-y-6 lg:col-span-2">
            <div className={`${card} space-y-5 p-6 md:p-8`}>
              {info.map(({ icon: I, label, lines }) => (
                <div key={label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <I size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{label}</p>
                    {lines.map((l) => (
                      <p key={l} className="text-sm text-muted-foreground">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lift md:p-8">
              <h3 className="text-2xl font-bold">Rejoignez notre newsletter</h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Nouvelles boissons, spécialités de saison et offres réservées aux membres.
              </p>
              <form onSubmit={subscribe} className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  name="email"
                  type="email"
                  placeholder="Votre e-mail"
                  className="min-w-0 flex-1 rounded-full bg-primary-foreground/10 px-5 py-3 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/60 focus:ring-2 focus:ring-ring"
                />
                <button className={`${btn} bg-card text-primary hover:bg-secondary`}>
                  S'inscrire
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const hrefFor = (label: string) =>
    ({
      Carte: "#menu",
      Adresses: "#locations",
      Contact: "#contact",
      FAQ: "#contact",
      "Conditions d'utilisation": "/#contact",
      "Politique de confidentialité": "/#contact",
      Cookies: "/#contact",
    })[label] ?? "/#contact";
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <Coffee size={18} />
            </span>
            <span className="font-display text-xl font-bold">{BRAND.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/65">
            {BRAND.tagline} — à l’entrée de la Cité Keur Gorgui, Dakar.
          </p>
          <div className="mt-5 flex gap-4 text-sm font-semibold">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-background/70 transition-colors hover:text-accent"
            >
              Instagram
            </a>
            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-background/70 transition-colors hover:text-accent"
            >
              Facebook
            </a>
          </div>
        </div>
        {Object.entries(FOOTER).map(([h, links]) => (
          <div key={h}>
            <p className="font-semibold">{h}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a
                    href={hrefFor(l)}
                    className="text-sm text-background/65 transition-colors hover:text-accent"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10 py-6 text-center text-sm text-background/50">
        © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
