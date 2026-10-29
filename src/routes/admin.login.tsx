import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Coffee, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useAdminAuth } from "@/contexts/AuthContext";
import { DEFAULT_ADMIN_LOGIN_MEDIA, useSiteMedia } from "@/hooks/use-site-media";

export const Route = createFileRoute("/admin/login")({ component: AdminLoginPage });

function getLoginErrorMessage(cause: unknown) {
  const message = cause instanceof Error ? cause.message.toLowerCase() : "";
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials") ||
    message.includes("email or password") ||
    message.includes("invalid user credentials")
  ) {
    return "Adresse e-mail ou mot de passe incorrect. Vérifiez vos identifiants puis réessayez.";
  }
  if (message.includes("email not confirmed")) {
    return "Votre adresse e-mail n’est pas encore confirmée. Vérifiez votre boîte de réception avant de vous connecter.";
  }
  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Trop de tentatives de connexion. Patientez quelques instants avant de réessayer.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Connexion au service impossible. Vérifiez votre connexion Internet puis réessayez.";
  }
  return "Impossible de vous connecter pour le moment. Vérifiez vos identifiants puis réessayez.";
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, loading, signIn } = useAdminAuth();
  const media = useSiteMedia();
  const loginCover =
    media.find((item) => item.id === DEFAULT_ADMIN_LOGIN_MEDIA.id) ?? DEFAULT_ADMIN_LOGIN_MEDIA;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/admin" });
  }, [loading, navigate, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      await navigate({ to: "/admin" });
    } catch (cause) {
      setError(getLoginErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && session) return null;

  return (
    <main className="min-h-screen bg-[#f4f3f4] text-[#2c252a]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(460px,0.9fr)]">
        <section className="relative isolate flex min-h-[330px] flex-col justify-between overflow-hidden bg-[#3f3639] px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12">
          <img
            src={loginCover.url}
            alt=""
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#3f3639]/80 via-[#5b4c52]/45 to-[#2c252a]/85" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,rgba(216,95,130,.24),transparent_45%)]" />

          <Link
            to="/"
            className="group inline-flex w-fit items-center gap-3 rounded-full pr-4 transition hover:bg-white/10"
          >
            <span className="grid size-12 place-items-center overflow-hidden rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
              <img
                src="/assets/brand/elite-coffee-logo.png"
                alt=""
                className="size-full object-cover"
              />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold tracking-wide">
                Elite Coffee
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f3b4c7]">
                Admin studio
              </span>
            </span>
          </Link>

          <div className="max-w-2xl pb-2 pt-14 lg:pb-8 lg:pt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f8dce5] backdrop-blur-sm">
              <Coffee size={14} /> L’espace de l’équipe
            </span>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Le goût du détail,
              <span className="mt-1 block italic text-[#f4a9bf]">jusque dans la gestion.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              Retrouvez en un seul endroit les outils pour faire vivre votre boutique, votre carte
              et l’univers visuel d’Elite Coffee.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-white/65">
            <span className="size-1.5 rounded-full bg-[#d85f82]" />
            <span>Un espace réservé aux administrateurs</span>
          </div>
        </section>

        <section className="relative flex min-h-[620px] flex-col bg-white px-5 py-6 sm:px-10 sm:py-9 lg:min-h-screen lg:justify-center lg:px-14 xl:px-20">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#756b72] transition hover:bg-[#f4f3f4] hover:text-[#a5365f]"
          >
            <ArrowLeft size={16} /> Retour au site
          </Link>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12 lg:flex-none lg:py-0">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f0d9e1] bg-[#fff7f9] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#a5365f] shadow-sm">
                <ShieldCheck size={14} className="text-[#d85f82]" /> Accès sécurisé
              </span>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-[#2c252a] sm:text-[2.75rem]">
                Bon retour.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#81757b]">
                Connectez-vous pour accéder à votre espace de gestion.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-semibold text-[#665b60]">
                Adresse e-mail
                <span className="relative mt-2 block">
                  <Mail
                    size={17}
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b59da7]"
                  />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@elitecoffee.sn"
                    className="h-[54px] w-full rounded-2xl border border-[#e8e0e7] bg-white pl-11 pr-4 text-sm font-normal text-[#2c252a] shadow-[0_5px_20px_-16px_rgba(91,56,76,.25)] outline-none transition placeholder:text-[#b7aab0] focus:border-[#d85f82] focus:ring-4 focus:ring-[#d85f82]/10"
                  />
                </span>
              </label>

              <label className="block text-sm font-semibold text-[#665b60]">
                Mot de passe
                <span className="relative mt-2 block">
                  <LockKeyhole
                    size={17}
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b59da7]"
                  />
                  <input
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Votre mot de passe"
                    className="h-[54px] w-full rounded-2xl border border-[#e8e0e7] bg-white pl-11 pr-12 text-sm font-normal text-[#2c252a] shadow-[0_5px_20px_-16px_rgba(91,56,76,.25)] outline-none transition placeholder:text-[#b7aab0] focus:border-[#d85f82] focus:ring-4 focus:ring-[#d85f82]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[#a9969e] transition hover:bg-[#fbe9ef] hover:text-[#a5365f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d85f82]"
                    aria-label={
                      showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border border-[#edb7c7] bg-[#fff7f9] px-4 py-3 text-sm leading-5 text-[#a5365f]"
                >
                  {error}
                </p>
              )}

              <button
                disabled={submitting || loading}
                type="submit"
                className="group flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#d85f82] px-4 text-sm font-bold text-white shadow-[0_12px_24px_-14px_rgba(216,95,130,.75)] transition hover:-translate-y-0.5 hover:bg-[#b9456e] hover:shadow-[0_15px_30px_-14px_rgba(216,95,130,.85)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d85f82]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Connexion en cours…" : "Se connecter"}
                {!submitting && (
                  <ArrowLeft
                    size={16}
                    className="rotate-180 transition group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-7 flex items-start gap-3 border-t border-[#eee8e8] pt-5 text-xs leading-5 text-[#887d83]">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#d85f82]" />
              <p>
                Les comptes administrateurs sont gérés dans Supabase Auth. La création de compte
                publique est désactivée.
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] font-medium tracking-wide text-[#a89da2] lg:absolute lg:bottom-8 lg:left-0 lg:right-0">
            ELITE COFFEE <span className="px-1.5 text-[#e0b8c5]">·</span> ESPACE ADMINISTRATEUR
          </p>
        </section>
      </div>
    </main>
  );
}
