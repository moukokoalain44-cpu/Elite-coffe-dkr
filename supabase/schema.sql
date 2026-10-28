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
  email       text,
  date        date not null,
  time        time not null,
  guests      integer not null check (guests > 0),
  occasion    text,
  message     text,
  status      text not null default 'pending'
                check (status in ('pending','confirmed','cancelled'))
);
alter table public.reservations add column if not exists email text;

-- Une réservation confirmée peut seulement être annulée ; une réservation annulée
-- ne peut jamais être réouverte. Cette règle est appliquée côté serveur, pas seulement dans l'UI.
create or replace function public.enforce_reservation_status_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status = new.status then return new; end if;
  if old.status = 'pending' and new.status in ('confirmed', 'cancelled') then return new; end if;
  if old.status = 'confirmed' and new.status = 'cancelled' then return new; end if;
  raise exception 'Transition de réservation interdite: % -> %', old.status, new.status;
end;
$$;

drop trigger if exists reservations_status_transition on public.reservations;
create trigger reservations_status_transition
before update of status on public.reservations
for each row execute function public.enforce_reservation_status_transition();

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

-- ── CRM & communication ───────────────────────────────────
create table if not exists public.customers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text,
  phone           text not null,
  source          text not null default 'website',
  last_contact_at timestamptz
);
create unique index if not exists customers_phone_idx on public.customers(phone);
alter table public.customers enable row level security;
create policy "public_insert_customers" on public.customers for insert with check (true);
create policy "admin_customers" on public.customers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  customer_id uuid references public.customers(id) on delete set null,
  name        text not null,
  email       text,
  phone       text,
  subject     text not null,
  message     text not null,
  status      text not null default 'new'
);
alter table public.contact_messages enable row level security;
create policy "public_insert_contact_messages" on public.contact_messages for insert with check (true);
create policy "admin_contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists public.reservation_followups (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references public.reservations(id) on delete cascade,
  customer_id     uuid references public.customers(id) on delete set null,
  channel         text not null default 'whatsapp',
  kind            text not null default 'confirmation',
  scheduled_for   timestamptz not null default now(),
  status          text not null default 'pending',
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  unique (reservation_id, kind)
);
alter table public.reservation_followups enable row level security;
create policy "admin_followups" on public.reservation_followups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists public.communication_campaigns (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  audience          text not null default 'all',
  channel           text not null default 'whatsapp',
  message           text not null,
  status            text not null default 'draft',
  scheduled_for     timestamptz,
  sent_at           timestamptz,
  total_recipients  integer not null default 0
);
alter table public.communication_campaigns enable row level security;
create policy "admin_communication_campaigns" on public.communication_campaigns for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Journal des notifications automatiques de réservation.
create table if not exists public.reservation_message_log (
  id                  uuid primary key default gen_random_uuid(),
  reservation_id      uuid not null references public.reservations(id) on delete cascade,
  event_type          text not null check (event_type in ('request_received','confirmed','cancelled')),
  phone               text not null,
  message             text not null,
  ultramsg_request_id bigint,
  status              text not null default 'queued' check (status in ('queued','failed')),
  error_message       text,
  created_at          timestamptz not null default now()
);
alter table public.reservation_message_log enable row level security;
create policy "admin_reservation_message_log" on public.reservation_message_log for select to authenticated using (true);

create table if not exists public.communication_delivery_log (
  id                  uuid primary key default gen_random_uuid(),
  campaign_id         uuid references public.communication_campaigns(id) on delete set null,
  phone               text not null,
  message             text not null,
  ultramsg_request_id bigint,
  status              text not null default 'queued' check (status in ('queued','sent','delivered','read','failed')),
  error_message       text,
  created_at          timestamptz not null default now()
);
alter table public.communication_delivery_log enable row level security;
create policy "admin_communication_delivery_log" on public.communication_delivery_log for select to authenticated using (true);

create or replace function public.send_ultramsg_message(p_phone text, p_message text, p_campaign_id uuid default null)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public, vault, net
as $$
declare
  normalized_phone text;
  request_id bigint;
begin
  if auth.uid() is null then raise exception 'Authentification administrateur requise'; end if;
  if nullif(trim(p_phone), '') is null or nullif(trim(p_message), '') is null then raise exception 'Téléphone et message requis'; end if;
  normalized_phone := regexp_replace(p_phone, '[^0-9+]', '', 'g');
  select net.http_post(
    url := 'https://api.ultramsg.com/' || (select decrypted_secret from vault.decrypted_secrets where name = 'ultramsg_instance_id') || '/messages/chat',
    body := jsonb_build_object('token', (select decrypted_secret from vault.decrypted_secrets where name = 'ultramsg_token'), 'to', normalized_phone, 'body', p_message),
    headers := '{"Content-Type":"application/json"}'::jsonb,
    timeout_milliseconds := 5000
  ) into request_id;
  insert into public.communication_delivery_log(campaign_id,phone,message,ultramsg_request_id,status)
  values (p_campaign_id,normalized_phone,p_message,request_id,'queued');
  return request_id;
exception when others then
  insert into public.communication_delivery_log(campaign_id,phone,message,status,error_message)
  values (p_campaign_id,normalized_phone,p_message,'failed',sqlerrm);
  raise;
end;
$$;
revoke all on function public.send_ultramsg_message(text,text,uuid) from public;
grant execute on function public.send_ultramsg_message(text,text,uuid) to authenticated;

-- Les deux secrets `ultramsg_instance_id` et `ultramsg_token` sont stockés dans Vault.
create extension if not exists pg_net;
create or replace function public.queue_reservation_whatsapp()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, vault, net
as $$
declare
  event_type text;
  notification text;
  request_id bigint;
  normalized_phone text;
begin
  if tg_op = 'INSERT' then
    event_type := 'request_received';
    notification := format('Bonjour %s, nous avons bien reçu votre demande de réservation chez Elite Coffee pour le %s à %s. Notre équipe revient vers vous rapidement.', new.name, new.date, new.time);
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status and new.status = 'confirmed' then
    event_type := 'confirmed';
    notification := format('Bonjour %s, votre réservation chez Elite Coffee pour le %s à %s est confirmée pour %s personne(s). À bientôt !', new.name, new.date, new.time, new.guests);
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status and new.status = 'cancelled' then
    event_type := 'cancelled';
    notification := format('Bonjour %s, nous sommes désolés, nous ne pouvons pas confirmer votre réservation chez Elite Coffee pour le %s à %s. Contactez-nous pour trouver un autre créneau.', new.name, new.date, new.time);
  else
    return coalesce(new, old);
  end if;
  normalized_phone := regexp_replace(new.phone, '[^0-9+]', '', 'g');
  begin
    select net.http_post(
      url := 'https://api.ultramsg.com/' || (select decrypted_secret from vault.decrypted_secrets where name = 'ultramsg_instance_id') || '/messages/chat',
      body := jsonb_build_object('token', (select decrypted_secret from vault.decrypted_secrets where name = 'ultramsg_token'), 'to', normalized_phone, 'body', notification),
      headers := '{"Content-Type":"application/json"}'::jsonb,
      timeout_milliseconds := 5000
    ) into request_id;
    insert into public.reservation_message_log(reservation_id,event_type,phone,message,ultramsg_request_id,status)
    values (new.id,event_type,normalized_phone,notification,request_id,'queued');
  exception when others then
    insert into public.reservation_message_log(reservation_id,event_type,phone,message,status,error_message)
    values (new.id,event_type,normalized_phone,notification,'failed',sqlerrm);
  end;
  return coalesce(new, old);
end;
$$;
revoke all on function public.queue_reservation_whatsapp() from public;
drop trigger if exists reservations_whatsapp_automation on public.reservations;
create trigger reservations_whatsapp_automation
after insert or update of status on public.reservations
for each row execute function public.queue_reservation_whatsapp();

-- ── Catalogue public ────────────────────────────────────────
create table if not exists public.menu_products (
  id                text primary key,
  name              text not null,
  category          text not null,
  price             integer not null check (price >= 0),
  description       text not null default '',
  price_options     jsonb not null default '[]'::jsonb,
  availability_note text,
  featured          boolean not null default false,
  image_url         text,
  is_visible        boolean not null default true,
  sort_order        integer not null default 0,
  updated_at        timestamptz not null default now()
);

alter table public.menu_products enable row level security;
create policy "public_read_menu_products" on public.menu_products for select using (is_visible = true);
create policy "admin_manage_menu_products" on public.menu_products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create index if not exists menu_products_category_order_idx on public.menu_products (category, sort_order);

create table if not exists public.site_media_assets (
  id text primary key,
  label text not null,
  slot text not null unique,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  url text not null,
  alt_text text not null default '',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.site_media_assets enable row level security;
create policy "public_read_site_media_assets" on public.site_media_assets for select using (is_visible = true);
create policy "admin_manage_site_media_assets" on public.site_media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Stockage des médias du site et des images de plats ─────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
