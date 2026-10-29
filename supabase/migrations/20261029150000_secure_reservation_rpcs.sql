-- Réservations publiques et administratives via des RPC à privilèges étroits.
-- Toutes les fonctions SECURITY DEFINER fixent leur search_path et qualifient
-- les objets pour éviter toute substitution d’objet par un appelant.

-- Le contrôle admin est autonome pour les installations qui n'ont pas encore
-- récupéré la migration d'administration déployée séparément.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Seul ce point d'entrée public peut créer une réservation. Le statut reste
-- toujours pending, et le message/CRM automatique existant est déclenché par
-- l'INSERT normal dans reservations.
create or replace function public.create_reservation(
  p_name text,
  p_phone text,
  p_email text,
  p_date date,
  p_time time without time zone,
  p_guests integer,
  p_occasion text default null,
  p_message text default null,
  p_customer_source text default 'reservation'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := pg_catalog.btrim(coalesce(p_name, ''));
  v_phone text := pg_catalog.btrim(coalesce(p_phone, ''));
  v_email text := nullif(pg_catalog.btrim(coalesce(p_email, '')), '');
  v_occasion text := nullif(pg_catalog.btrim(coalesce(p_occasion, '')), '');
  v_message text := nullif(pg_catalog.btrim(coalesce(p_message, '')), '');
  v_reservation_id uuid;
begin
  if pg_catalog.char_length(v_name) < 2 or pg_catalog.char_length(v_name) > 120 then
    raise exception 'Nom invalide';
  end if;
  if pg_catalog.char_length(v_phone) > 30
     or v_phone !~ '^[+0-9(). -]+$'
     or pg_catalog.char_length(pg_catalog.regexp_replace(v_phone, '[^0-9]', '', 'g')) not between 6 and 18 then
    raise exception 'Téléphone invalide';
  end if;
  if v_email is not null and (
    pg_catalog.char_length(v_email) > 254
    or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ) then
    raise exception 'Adresse e-mail invalide';
  end if;
  if p_date is null or p_date < current_date then
    raise exception 'La date de réservation doit être aujourd’hui ou ultérieure';
  end if;
  if p_time is null then
    raise exception 'Heure de réservation requise';
  end if;
  if p_guests is null or p_guests < 1 or p_guests > 100 then
    raise exception 'Nombre de personnes invalide';
  end if;
  if v_occasion is not null and pg_catalog.char_length(v_occasion) > 100 then
    raise exception 'Motif trop long';
  end if;
  if v_message is not null and pg_catalog.char_length(v_message) > 2000 then
    raise exception 'Message trop long';
  end if;
  if p_customer_source not in ('reservation', 'buffet') then
    raise exception 'Source de réservation invalide';
  end if;

  insert into public.reservations (name, phone, email, date, time, guests, occasion, message)
  values (v_name, v_phone, v_email, p_date, p_time, p_guests, v_occasion, v_message)
  returning id into v_reservation_id;

  insert into public.customers (name, email, phone, source)
  values (v_name, v_email, v_phone, p_customer_source)
  on conflict (phone) do update
    set name = excluded.name,
        email = excluded.email,
        source = excluded.source;

  return v_reservation_id;
end;
$$;

revoke all on function public.create_reservation(text, text, text, date, time without time zone, integer, text, text, text) from public;
grant execute on function public.create_reservation(text, text, text, date, time without time zone, integer, text, text, text) to anon, authenticated;

create or replace function public.update_reservation_status(
  p_reservation_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_updated integer;
begin
  if not public.is_admin() then
    raise exception 'Authentification administrateur requise';
  end if;
  if p_reservation_id is null or p_status not in ('pending', 'confirmed', 'cancelled') then
    raise exception 'Réservation ou statut invalide';
  end if;

  update public.reservations
  set status = p_status
  where id = p_reservation_id;
  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    raise exception 'Réservation introuvable';
  end if;
end;
$$;

revoke all on function public.update_reservation_status(uuid, text) from public;
grant execute on function public.update_reservation_status(uuid, text) to authenticated;

create or replace function public.update_reservation_details(
  p_reservation_id uuid,
  p_details jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text;
  v_email text;
  v_updated integer;
begin
  if not public.is_admin() then
    raise exception 'Authentification administrateur requise';
  end if;
  if p_reservation_id is null or p_details is null or pg_catalog.jsonb_typeof(p_details) <> 'object' then
    raise exception 'Données de réservation invalides';
  end if;
  if not (p_details ?| array['name', 'phone', 'email', 'date', 'time', 'guests', 'occasion', 'message']) then
    raise exception 'Aucun champ à modifier';
  end if;
  if exists (
    select 1
    from pg_catalog.jsonb_object_keys(p_details) as supplied(key)
    where supplied.key not in ('name', 'phone', 'email', 'date', 'time', 'guests', 'occasion', 'message')
  ) then
    raise exception 'Champ de réservation non autorisé';
  end if;

  if p_details ? 'name' and (
    pg_catalog.jsonb_typeof(p_details -> 'name') <> 'string'
    or pg_catalog.char_length(pg_catalog.btrim(p_details ->> 'name')) not between 2 and 120
  ) then
    raise exception 'Nom invalide';
  end if;
  if p_details ? 'phone' then
    if pg_catalog.jsonb_typeof(p_details -> 'phone') <> 'string' then
      raise exception 'Téléphone invalide';
    end if;
    v_phone := pg_catalog.btrim(p_details ->> 'phone');
    if pg_catalog.char_length(v_phone) > 30
       or v_phone !~ '^[+0-9(). -]+$'
       or pg_catalog.char_length(pg_catalog.regexp_replace(v_phone, '[^0-9]', '', 'g')) not between 6 and 18 then
      raise exception 'Téléphone invalide';
    end if;
  end if;
  if p_details ? 'email' and pg_catalog.jsonb_typeof(p_details -> 'email') not in ('string', 'null') then
    raise exception 'Adresse e-mail invalide';
  end if;
  if p_details ? 'email' then
    v_email := nullif(pg_catalog.btrim(p_details ->> 'email'), '');
    if v_email is not null and (
      pg_catalog.char_length(v_email) > 254
      or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    ) then
      raise exception 'Adresse e-mail invalide';
    end if;
  end if;
  if p_details ? 'date' and pg_catalog.jsonb_typeof(p_details -> 'date') <> 'string' then
    raise exception 'Date invalide';
  end if;
  if p_details ? 'time' and pg_catalog.jsonb_typeof(p_details -> 'time') <> 'string' then
    raise exception 'Heure invalide';
  end if;
  if p_details ? 'guests' and (
    pg_catalog.jsonb_typeof(p_details -> 'guests') <> 'number'
    or (p_details ->> 'guests')::numeric < 1
    or (p_details ->> 'guests')::numeric > 100
    or (p_details ->> 'guests')::numeric <> pg_catalog.trunc((p_details ->> 'guests')::numeric)
  ) then
    raise exception 'Nombre de personnes invalide';
  end if;
  if p_details ? 'occasion' and (
    pg_catalog.jsonb_typeof(p_details -> 'occasion') not in ('string', 'null')
    or pg_catalog.char_length(coalesce(p_details ->> 'occasion', '')) > 100
  ) then
    raise exception 'Motif invalide';
  end if;
  if p_details ? 'message' and (
    pg_catalog.jsonb_typeof(p_details -> 'message') not in ('string', 'null')
    or pg_catalog.char_length(coalesce(p_details ->> 'message', '')) > 2000
  ) then
    raise exception 'Message invalide';
  end if;

  update public.reservations as reservation
  set name = case when p_details ? 'name' then pg_catalog.btrim(p_details ->> 'name') else reservation.name end,
      phone = case when p_details ? 'phone' then pg_catalog.btrim(p_details ->> 'phone') else reservation.phone end,
      email = case when p_details ? 'email' then nullif(pg_catalog.btrim(p_details ->> 'email'), '') else reservation.email end,
      date = case when p_details ? 'date' then (p_details ->> 'date')::date else reservation.date end,
      time = case when p_details ? 'time' then (p_details ->> 'time')::time else reservation.time end,
      guests = case when p_details ? 'guests' then (p_details ->> 'guests')::integer else reservation.guests end,
      occasion = case when p_details ? 'occasion' then nullif(pg_catalog.btrim(p_details ->> 'occasion'), '') else reservation.occasion end,
      message = case when p_details ? 'message' then nullif(pg_catalog.btrim(p_details ->> 'message'), '') else reservation.message end
  where reservation.id = p_reservation_id;
  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    raise exception 'Réservation introuvable';
  end if;
end;
$$;

revoke all on function public.update_reservation_details(uuid, jsonb) from public;
grant execute on function public.update_reservation_details(uuid, jsonb) to authenticated;

create or replace function public.delete_reservation(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  if not public.is_admin() then
    raise exception 'Authentification administrateur requise';
  end if;
  if p_reservation_id is null then
    raise exception 'Réservation invalide';
  end if;

  delete from public.reservations where id = p_reservation_id;
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'Réservation introuvable';
  end if;
end;
$$;

revoke all on function public.delete_reservation(uuid) from public;
grant execute on function public.delete_reservation(uuid) to authenticated;

-- Toute lecture est limitée aux vrais administrateurs. Les écritures passent
-- exclusivement par les fonctions ci-dessus (ou les triggers serveur).
drop policy if exists "insert_reservations" on public.reservations;
drop policy if exists "admin_reservations" on public.reservations;
create policy "admin_read_reservations"
  on public.reservations for select to authenticated
  using (public.is_admin());

revoke all on table public.reservations from anon, authenticated;
grant select on table public.reservations to authenticated;
