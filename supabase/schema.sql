-- ============================================================
-- Elite Coffee — Schéma Supabase
-- Copiez-collez ce SQL dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- ── Commandes ──────────────────────────────────────────────
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  fulfillment   text not null check (fulfillment in ('pickup','delivery')),
  address       text,
  payment       text not null check (payment in ('wave','orange_money','cash')),
  subtotal      integer not null,   -- en FCFA
  delivery_fee  integer not null default 0,
  total         integer not null,
  status        text not null default 'pending'
                  check (status in ('pending','confirmed','preparing','ready','delivered','cancelled'))
);

-- ── Lignes de commande ─────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  text not null,
  name        text not null,
  price       integer not null,
  quantity    integer not null check (quantity > 0)
);

-- ── Réservations ───────────────────────────────────────────
create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  date        date not null,
  time        time not null,
  guests      integer not null check (guests > 0),
  occasion    text,
  message     text,
  status      text not null default 'pending'
                check (status in ('pending','confirmed','cancelled'))
);

-- ── RLS : accès public en écriture seulement ───────────────
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.reservations   enable row level security;

-- Tout le monde peut créer une commande / réservation
create policy "insert_orders"      on public.orders      for insert with check (true);
create policy "insert_order_items" on public.order_items for insert with check (true);
create policy "insert_reservations" on public.reservations for insert with check (true);

-- Seul l'admin (authenticated) peut lire / modifier
create policy "admin_orders"        on public.orders        for all using (auth.role() = 'authenticated');
create policy "admin_order_items"   on public.order_items   for all using (auth.role() = 'authenticated');
create policy "admin_reservations"  on public.reservations  for all using (auth.role() = 'authenticated');
