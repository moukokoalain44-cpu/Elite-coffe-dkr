# Elite Coffee

Site public et back-office de gestion du restaurant Elite Coffee.

## Développement local

Pré-requis : Node.js et pnpm.

```sh
git clone <url-du-depot>
cd Elite-coffe-dkr
pnpm install
pnpm dev
```

## Scripts

```sh
pnpm dev        # serveur de développement
pnpm build      # build de production
pnpm preview    # prévisualisation du build
pnpm typecheck  # vérification TypeScript
pnpm test       # tests Vitest
pnpm lint       # vérification ESLint
```

## Configuration

Créer un fichier `.env.local` avec les variables Supabase nécessaires :

```sh
VITE_SUPABASE_URL=https://<projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé-publique>
```

Le catalogue, les images, les réservations et les contenus administrables utilisent Supabase. Le back-office est accessible via `/admin`.
