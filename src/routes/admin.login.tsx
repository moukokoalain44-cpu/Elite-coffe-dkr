import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Coffee, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAdminAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/admin/login")({ component: AdminLoginPage });

function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, loading, signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && session) {
    void navigate({ to: "/admin" });
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      await navigate({ to: "/admin" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de vous connecter.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f1] px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#776d65] hover:text-[#5b3826]"
        >
          <ArrowLeft size={16} /> Retour au site
        </Link>
        <section className="rounded-[28px] border border-[#ebe5df] bg-white p-7 shadow-[0_24px_70px_-35px_rgba(91,56,38,.45)] sm:p-10">
          <div className="mb-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#5b3826] text-[#fffaf4]">
              <Coffee size={26} />
            </span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[.22em] text-[#c56d3c]">
              Elite Coffee · Admin Studio
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-[#201a17]">
              Accéder au back-office
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#82776e]">
              Connectez-vous pour gérer la carte, les textes et les médias du site.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-[#5b3826]">
              Adresse e-mail
              <div className="relative mt-2">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a69a90]"
                />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@elitecoffee.sn"
                  className="w-full rounded-xl border border-[#e8e0d7] bg-[#fdfbf9] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8894a] focus:ring-2 focus:ring-[#d8894a]/15"
                />
              </div>
            </label>
            <label className="block text-sm font-semibold text-[#5b3826]">
              Mot de passe
              <div className="relative mt-2">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a69a90]"
                />
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-xl border border-[#e8e0d7] bg-[#fdfbf9] py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#d8894a] focus:ring-2 focus:ring-[#d8894a]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a69a90]"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-sm leading-5 text-[#b14e36]"
              >
                {error}
              </p>
            )}
            <button
              disabled={submitting || loading}
              type="submit"
              className="w-full rounded-xl bg-[#5b3826] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#422719] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-6 border-t border-[#eee8e2] pt-5 text-center text-xs leading-5 text-[#9b9188]">
            Les comptes administrateurs sont créés et gérés dans Supabase Auth. L’inscription
            publique est désactivée.
          </p>
        </section>
      </div>
    </main>
  );
}
