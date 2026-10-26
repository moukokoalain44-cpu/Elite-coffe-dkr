import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Award, BookOpen, Coffee, Heart, Star } from "lucide-react";
import { BRAND, CONTACT, FOOTER, MENU_SECTIONS, STATS } from "@/data/site";
import { type Product } from "@/data/catalog";
import { useMenuCatalog } from "@/hooks/use-menu-catalog";
import { useSiteMedia } from "@/hooks/use-site-media";
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
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <DishShowcase products={products} />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const { content } = useAdmin();
  const siteMedia = useSiteMedia();
  const media = siteMedia.find((item) => item.id === "hero-main");
  const posterMedia = siteMedia.find((item) => item.id === "gallery-1");
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollOffset(Math.min(window.scrollY, 360));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollProgress = Math.min(scrollOffset / 180, 1);
  return (
    <section
      id="home"
      className="relative isolate min-h-[42rem] overflow-hidden bg-primary text-primary-foreground md:min-h-[48rem]"
    >
      <video
        src={media?.url}
        poster={posterMedia?.url ?? "/assets/instagram/hero-brunch.jpg"}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 size-full object-cover object-center transition-transform duration-300"
        style={{
          filter: `blur(${Math.round(scrollProgress * 5)}px)`,
          transform: `translate3d(0, ${scrollProgress * 18}px, 0) scale(${1.02 + scrollProgress * 0.035})`,
        }}
        aria-label={media?.alt_text ?? "Ambiance Elite Coffee"}
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(91,56,38,.52)_0%,rgba(91,56,38,.2)_42%,rgba(32,26,23,.82)_100%)]" />
      <div className="relative z-20 mx-auto flex min-h-[42rem] max-w-7xl items-center justify-center px-5 pb-20 pt-32 text-center md:min-h-[48rem] md:px-8 md:pb-24">
        <Reveal className="flex max-w-4xl flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-primary-foreground/85 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(216,137,74,.18)]" />
            {BRAND.tagline} · Dakar
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-5xl font-bold leading-none tracking-[-.06em] text-primary-foreground sm:text-6xl md:text-8xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/75 sm:text-lg">
            {content.heroDescription}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="/reserver"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[.16em] text-primary shadow-[0_8px_20px_rgba(216,137,74,.22)] transition hover:-translate-y-0.5 hover:bg-primary-foreground"
            >
              <BookOpen size={15} /> Réserver une table
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/35 bg-primary/20 px-6 py-3 text-xs font-bold uppercase tracking-[.16em] text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/10"
            >
              <ArrowRight size={15} /> Voir la carte
            </a>
          </div>
        </Reveal>
      </div>
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

function DishShowcase({ products }: { products: Product[] }) {
  const [slides, setSlides] = useState<Product[]>([]);
  useEffect(() => {
    if (!products.length) return;
    const choose = () => {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setSlides(shuffled.slice(0, 3));
    };
    choose();
    const timer = window.setInterval(choose, 4200);
    return () => window.clearInterval(timer);
  }, [products]);
  const visible = slides.length ? slides : products.slice(0, 3);
  return (
    <section id="plats" className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <SectionHead
        badge={<Pill icon={<Heart size={14} />}>À la carte</Pill>}
        title="Découvrez nos plats"
        sub="Trois envies, trois images de la carte, renouvelées au fil du temps."
      />
      <div className="flex snap-x gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {visible.map((dish, index) => (
          <Reveal key={`${dish.id}-${index}`} className="min-w-[78vw] snap-center md:min-w-0">
            <article className="group relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground shadow-lift">
              <img
                src={dish.image}
                alt={dish.name}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-primary">
                  {dish.category}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold">{dish.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-primary-foreground/75">
                  {dish.description || "Préparé à la commande."}
                </p>
                <p className="mt-4 font-display text-xl font-bold">{formatCFA(dish.price)}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const media = useSiteMedia().filter((item) => item.id.startsWith("gallery-"));
  return (
    <section id="locations" className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
      <SectionHead
        badge={<Pill icon={<Coffee size={14} />}>Notre univers</Pill>}
        title="Une pause gourmande, en vrai"
        sub="Une adresse chaleureuse pour bruncher, déjeuner, prendre un café ou partager une douceur."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {media.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl">
            <img
              src={item.url}
              alt={item.alt_text}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
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

function Footer() {
  const hrefFor = (label: string) =>
    ({
      Carte: "#menu",
      Adresses: "#locations",
      Contact: "/infos",
      FAQ: "/faq",
      "Conditions d'utilisation": "/infos",
      "Politique de confidentialité": "/infos",
      Cookies: "/infos",
    })[label] ?? "/infos";
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
