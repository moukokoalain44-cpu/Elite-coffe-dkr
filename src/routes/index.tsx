import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowRight, Award, Check, Clock, Coffee, Heart, Instagram, Mail, MapPin, Menu, Phone, Search, ShoppingBag, Star, X,
} from "lucide-react";
import heroVideo from "@/assets/hero.mp4.asset.json";
import {
  AVATARS, BEST_SELLERS, BRAND, CATEGORIES, CONTACT, ESPRESSO_IMG, FOOTER, INSTAGRAM, MENU, NAV, REVIEWS, STATS, type Category,
} from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Coffee — Crafted Specialty Coffee, Perfected Daily" },
      { name: "description", content: "Award-winning specialty coffee since 2015. Order online, explore our menu and join our rewards." },
      { property: "og:title", content: "Elite Coffee — Crafted Coffee, Perfected Daily" },
      { property: "og:description", content: "Award-winning specialty coffee since 2015. Order online and explore our menu." },
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
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add("is-visible"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Pill({ icon, children, dark }: { icon?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${dark ? "bg-primary-foreground/10 text-primary-foreground" : "bg-secondary text-primary"}`}>
      {icon}{children}
    </span>
  );
}

function Stars({ n = 5, size = 16 }: { n?: number; size?: number }) {
  return <div className="flex gap-0.5">{Array.from({ length: n }).map((_, i) => <Star key={i} size={size} className="fill-star text-star" />)}</div>;
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

const btn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
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
      if (!e.isIntersecting) return;
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
  return <span ref={ref}>{v.toLocaleString()}+</span>;
}

/* ---------- page ---------- */
function Index() {
  const [cart, setCart] = useState(2);
  const add = (name: string) => { setCart((c) => c + 1); toast.success(`${name} added to cart`); };
  return (
    <div className="min-h-screen bg-background">
      <Navbar cart={cart} />
      <main>
        <Hero />
        <Stats />
        <BestSellers onAdd={add} />
        <MenuFilter onAdd={add} />
        <Espresso />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Navbar({ cart }: { cart: number }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <a href="#home" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Coffee size={18} /></span>
          <span className="font-display text-xl font-bold text-primary">{BRAND.name}</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent">{n}</a>)}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <button aria-label="Search" className="hidden rounded-full p-2 text-foreground transition-colors hover:bg-secondary sm:block"><Search size={20} /></button>
          <button aria-label="Cart" className="relative rounded-full p-2 text-foreground transition-colors hover:bg-secondary">
            <ShoppingBag size={20} />
            <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cart}</span>
          </button>
          <a href="#contact" className="hidden text-sm font-semibold text-foreground hover:text-accent md:block">Sign In</a>
          <a href="#menu" className={`${btnPrimary} hidden !px-5 !py-2.5 sm:inline-flex`}>Order Now</a>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-full p-2 text-foreground hover:bg-secondary lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
          {NAV.map((n) => <a key={n} onClick={() => setOpen(false)} href={`#${n.toLowerCase()}`} className="block rounded-lg px-3 py-2.5 font-medium text-foreground hover:bg-secondary">{n}</a>)}
          <a href="#menu" onClick={() => setOpen(false)} className={`${btnPrimary} mt-3 w-full`}>Order Now</a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2">
      <Reveal>
        <Pill icon={<Award size={14} />}>Award-Winning Coffee Since 2015</Pill>
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-foreground md:text-7xl">
          Crafted Coffee, <span className="italic text-accent">Perfected</span> Daily
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
          Ethically sourced beans, roasted in small batches and poured by baristas who obsess over every detail — from bean to cup.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#menu" className={btnPrimary}>Order Online <ArrowRight size={16} /></a>
          <a href="#menu" className={btnOutline}>View Menu</a>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {AVATARS.map((a) => <img key={a} src={a} alt="" className="h-11 w-11 rounded-full border-2 border-background object-cover" />)}
          </div>
          <div>
            <Stars />
            <p className="mt-1 text-sm font-semibold text-foreground">1,500+ Happy Customers</p>
          </div>
        </div>
      </Reveal>
      <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="overflow-hidden rounded-[2rem] shadow-lift">
          <video src={heroVideo.url} autoPlay muted loop playsInline className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className={`${card} animate-float absolute -right-2 top-8 flex items-center gap-3 p-3 pr-5 md:-right-6`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><Heart size={18} /></span>
          <div><p className="text-xs text-muted-foreground">Best Seller</p><p className="text-sm font-bold text-foreground">Caramel Latte</p></div>
        </div>
        <div className={`${card} animate-float-delayed absolute -left-2 bottom-10 flex items-center gap-3 p-3 pr-5 md:-left-6`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Star size={18} className="fill-star text-star" /></span>
          <div><p className="text-sm font-bold text-foreground">4.9</p><p className="text-xs text-muted-foreground">1,250 Reviews</p></div>
        </div>
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
            <p className="font-display text-4xl font-bold md:text-5xl"><CountUp to={s.value} /></p>
            <p className="mt-1 text-sm text-primary-foreground/75">{s.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function BestSellers({ onAdd }: { onAdd: (n: string) => void }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <SectionHead badge={<Pill icon={<Heart size={14} />}>Customer Favorites</Pill>} title="Our Best Sellers" sub="The drinks our regulars can't stop ordering — handcrafted with care, every single time." />
      <div className="grid gap-6 md:grid-cols-3">
        {BEST_SELLERS.map((b) => (
          <Reveal key={b.name}>
            <article className={`group h-full overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${b.featured ? "bg-primary text-primary-foreground shadow-lift" : "bg-card text-card-foreground shadow-soft"}`}>
              <div className="relative overflow-hidden rounded-xl">
                <img src={b.img} alt={b.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{b.tag}</span>
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{b.name}</h3>
                  <span className="flex items-center gap-1 text-sm font-semibold"><Star size={14} className="fill-star text-star" />{b.rating}</span>
                </div>
                <p className={`mt-2 text-sm ${b.featured ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{b.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">${b.price.toFixed(2)}</span>
                  <button onClick={() => onAdd(b.name)} className={`${btn} !py-2.5 ${b.featured ? "bg-card text-primary hover:bg-secondary" : "bg-primary text-primary-foreground hover:shadow-lift"}`}>Add to Cart</button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MenuFilter({ onAdd }: { onAdd: (n: string) => void }) {
  const [cat, setCat] = useState<Category>("Espresso");
  const items = MENU.filter((m) => m.category === cat);
  return (
    <section id="menu" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHead badge={<Pill icon={<Coffee size={14} />}>Our Menu</Pill>} title="Choose Your Coffee" sub="From bold espresso to slow-steeped cold brew — find your perfect cup." />
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`${btn} !py-2.5 ${cat === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground hover:bg-primary/10"}`}>{c}</button>
          ))}
        </div>
        <div key={cat} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {items.map((m) => (
            <article key={m.name} className={`${card} group flex items-center gap-4 p-4 transition-all hover:-translate-y-1 hover:shadow-lift`}>
              <img src={m.img} alt={m.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-foreground">{m.name}</h3>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-primary">${m.price.toFixed(2)}</span>
                  <button aria-label={`Add ${m.name}`} onClick={() => onAdd(m.name)} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">+</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Espresso() {
  return (
    <section id="rewards" className="bg-primary py-20 text-primary-foreground md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <Reveal>
          <Pill dark icon={<Award size={14} />}>Our Craft</Pill>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Espresso Perfection</h2>
          <p className="mt-5 max-w-lg text-primary-foreground/75">Every shot is pulled on our hand-tuned Italian machines, dialed in each morning for the richest crema and balanced sweetness.</p>
          <ul className="mt-8 space-y-4">
            {["Single-origin beans roasted weekly in-house", "Precision 9-bar extraction, 25–30 second shots", "Certified baristas with 1,000+ hours of training"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"><Check size={14} /></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a href="#menu" className={`${btn} mt-10 bg-card text-primary hover:bg-secondary`}>Explore Menu <ArrowRight size={16} /></a>
        </Reveal>
        <Reveal>
          <img src={ESPRESSO_IMG} alt="Espresso machine pulling a shot" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
        </Reveal>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <SectionHead badge={<Pill icon={<Star size={14} className="fill-star text-star" />}>Rated 4.9/5</Pill>} title="What Our Customers Say" />
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <Reveal key={r.name}>
            <figure className={`${card} flex h-full flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-lift`}>
              <Stars />
              <blockquote className="mt-5 flex-1 text-foreground/85">"{r.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <img src={r.avatar} alt={r.name} className="h-12 w-12 rounded-full object-cover" />
                <div><p className="font-semibold text-foreground">{r.name}</p><p className="text-sm text-muted-foreground">{r.role}</p></div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="locations" className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
      <SectionHead badge={<Pill icon={<Instagram size={14} />}>{BRAND.handle}</Pill>} title="Follow Our Journey" sub="Moments from our bar, our roastery and our community." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {INSTAGRAM.map((g) => (
          <a key={g.alt} href="#" className="group relative overflow-hidden rounded-2xl">
            <img src={g.img} alt={g.alt} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram className="text-primary-foreground" size={32} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30";

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (v("name").length < 2) err.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) err.email = "Please enter a valid email";
    if (v("subject").length < 2) err.subject = "Please add a subject";
    if (v("message").length < 10) err.message = "Message should be at least 10 characters";
    setErrors(err);
    if (Object.keys(err).length) return toast.error("Please fix the highlighted fields");
    toast.success("Thanks! We'll get back to you within 24 hours.");
    e.currentTarget.reset();
  };
  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email");
    toast.success("You're subscribed!");
    e.currentTarget.reset();
  };
  const info = [
    { icon: Mail, label: "Email", lines: [CONTACT.email] },
    { icon: Phone, label: "Phone", lines: [CONTACT.phone] },
    { icon: MapPin, label: "Address", lines: [CONTACT.address] },
    { icon: Clock, label: "Opening Hours", lines: CONTACT.hours },
  ];
  return (
    <section id="contact" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHead badge={<Pill icon={<Mail size={14} />}>Contact Us</Pill>} title="Get In Touch" sub="Questions, catering or just want to say hi? We'd love to hear from you." />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <form onSubmit={submit} noValidate className={`${card} space-y-5 p-6 md:p-8`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" error={errors["name"]}><input name="name" className={input} placeholder="Jane Doe" /></Field>
                <Field label="Email" error={errors["email"]}><input name="email" type="email" className={input} placeholder="jane@email.com" /></Field>
                <Field label="Phone (optional)"><input name="phone" className={input} placeholder="(555) 000-0000" /></Field>
                <Field label="Subject" error={errors["subject"]}><input name="subject" className={input} placeholder="How can we help?" /></Field>
              </div>
              <Field label="Message" error={errors["message"]}><textarea name="message" rows={5} className={input} placeholder="Tell us more..." /></Field>
              <button type="submit" className={`${btnPrimary} w-full sm:w-auto`}>Send Message <ArrowRight size={16} /></button>
            </form>
          </Reveal>
          <Reveal className="space-y-6 lg:col-span-2">
            <div className={`${card} space-y-5 p-6 md:p-8`}>
              {info.map(({ icon: I, label, lines }) => (
                <div key={label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><I size={18} /></span>
                  <div className="min-w-0"><p className="font-semibold text-foreground">{label}</p>{lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lift md:p-8">
              <h3 className="text-2xl font-bold">Join Our Newsletter</h3>
              <p className="mt-2 text-sm text-primary-foreground/75">New drinks, seasonal specials and member-only offers.</p>
              <form onSubmit={subscribe} className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input name="email" type="email" placeholder="Your email" className="min-w-0 flex-1 rounded-full bg-primary-foreground/10 px-5 py-3 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/60 focus:ring-2 focus:ring-ring" />
                <button className={`${btn} bg-card text-primary hover:bg-secondary`}>Subscribe</button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground"><Coffee size={18} /></span>
            <span className="font-display text-xl font-bold">{BRAND.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/65">Crafted coffee, perfected daily. Roasting with care since 2015.</p>
        </div>
        {Object.entries(FOOTER).map(([h, links]) => (
          <div key={h}>
            <p className="font-semibold">{h}</p>
            <ul className="mt-4 space-y-2.5">{links.map((l) => <li key={l}><a href="#" className="text-sm text-background/65 transition-colors hover:text-accent">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10 py-6 text-center text-sm text-background/50">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
    </footer>
  );
}
