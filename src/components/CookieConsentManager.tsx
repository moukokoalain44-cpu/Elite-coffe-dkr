import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OptionalChoices = { analytics: boolean; marketing: boolean };
type StoredChoice = OptionalChoices & { version: number; savedAt: number };

const STORAGE_KEY = "elite-cookie-choice";
const CONSENT_VERSION = 1;
const CHOICE_VALIDITY_MS = 183 * 24 * 60 * 60 * 1000;
export const OPEN_COOKIE_SETTINGS_EVENT = "elite-open-cookie-settings";

function readChoice(): StoredChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredChoice>;
    if (
      value.version !== CONSENT_VERSION ||
      typeof value.savedAt !== "number" ||
      Date.now() - value.savedAt > CHOICE_VALIDITY_MS ||
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean"
    ) {
      return null;
    }
    return value as StoredChoice;
  } catch {
    return null;
  }
}

export function CookieConsentManager() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [ready, setReady] = useState(false);
  const [savedChoice, setSavedChoice] = useState<StoredChoice | null>(null);
  const [draft, setDraft] = useState<OptionalChoices>({ analytics: false, marketing: false });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    setSavedChoice(choice);
    if (choice) setDraft({ analytics: choice.analytics, marketing: choice.marketing });
    setReady(true);
  }, []);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const saveChoice = (choice: OptionalChoices) => {
    const record: StoredChoice = {
      version: CONSENT_VERSION,
      savedAt: Date.now(),
      ...choice,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // The current choice still applies for this page view when storage is unavailable.
    }
    setDraft(choice);
    setSavedChoice(record);
    setSettingsOpen(false);
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {ready && !savedChoice && (
        <section
          aria-label="Choix des cookies"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl md:inset-x-6 md:bottom-6 md:p-6"
        >
          <h2 className="font-display text-xl font-bold">Votre confidentialité compte</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Le site ne charge actuellement aucun outil publicitaire ou de mesure d’audience. Vous
            pouvez mémoriser vos préférences facultatives et les modifier à tout moment. Les choix
            nécessaires au fonctionnement restent actifs.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <Link to="/cookies" className="underline underline-offset-2">
              En savoir plus sur les cookies
            </Link>
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => saveChoice({ analytics: true, marketing: true })}
              className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => saveChoice({ analytics: false, marketing: false })}
              className="min-h-11 rounded-xl border border-primary bg-background px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="min-h-11 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Personnaliser
            </button>
          </div>
        </section>
      )}

      {ready && savedChoice && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-24 right-3 z-[60] rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-lg hover:bg-secondary md:bottom-5 md:right-5"
        >
          Préférences cookies
        </button>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Préférences cookies</DialogTitle>
            <DialogDescription>
              Les choix sont enregistrés dans ce navigateur pendant six mois. Aucun outil de mesure
              d’audience ou de publicité n’est actuellement activé sur le site.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="flex items-start justify-between gap-5 rounded-xl border border-border p-4">
              <span>
                <span className="block text-sm font-semibold">Nécessaires</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Sécurité, connexion à l’administration et mémorisation de votre choix. Toujours
                  actifs.
                </span>
              </span>
              <input type="checkbox" checked disabled aria-label="Cookies nécessaires actifs" />
            </label>
            <label className="flex items-start justify-between gap-5 rounded-xl border border-border p-4">
              <span>
                <span className="block text-sm font-semibold">Mesure d’audience</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Aucun outil de mesure n’est actuellement chargé par le site.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.analytics}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, analytics: event.target.checked }))
                }
                aria-label="Autoriser les cookies de mesure d’audience"
              />
            </label>
            <label className="flex items-start justify-between gap-5 rounded-xl border border-border p-4">
              <span>
                <span className="block text-sm font-semibold">Publicité</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Aucun outil publicitaire n’est actuellement chargé par le site.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.marketing}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, marketing: event.target.checked }))
                }
                aria-label="Autoriser les cookies publicitaires"
              />
            </label>
          </div>
          <DialogFooter className="gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => saveChoice({ analytics: false, marketing: false })}
              className="min-h-11 rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-secondary"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => saveChoice(draft)}
              className="min-h-11 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer mon choix
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
