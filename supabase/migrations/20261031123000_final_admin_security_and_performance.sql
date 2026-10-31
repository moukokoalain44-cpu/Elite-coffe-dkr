-- Final admin security and performance hardening.
-- The allowlist keeps authenticated customers separate from back-office administrators.
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
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins_read_admin_users" on public.admin_users;
create policy "admins_read_admin_users"
on public.admin_users
for select to authenticated
using (public.is_admin());

-- Existing production administrator. Add future administrators explicitly to this table.
insert into public.admin_users (user_id)
values ('bd732e63-b6f0-4460-ac9a-8f02449d7757')
on conflict (user_id) do nothing;

-- Indexes used by admin ordering and dashboard activity views.
create index if not exists reservations_status_date_time_idx
  on public.reservations (status, date, time);
create index if not exists customers_created_at_idx
  on public.customers (created_at desc);
create index if not exists reservation_message_log_created_at_idx
  on public.reservation_message_log (created_at desc);
create index if not exists communication_delivery_log_created_at_idx
  on public.communication_delivery_log (created_at desc);
create index if not exists communication_campaigns_created_at_idx
  on public.communication_campaigns (created_at desc);

-- Replace authenticated-wide admin access with the explicit administrator allowlist.
drop policy if exists "admin_orders" on public.orders;
create policy "admin_orders" on public.orders
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_order_items" on public.order_items;
create policy "admin_order_items" on public.order_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_reservations" on public.reservations;
create policy "admin_reservations" on public.reservations
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_customers" on public.customers;
create policy "admin_customers" on public.customers
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_contact_messages" on public.contact_messages;
create policy "admin_contact_messages" on public.contact_messages
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_followups" on public.reservation_followups;
create policy "admin_followups" on public.reservation_followups
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_communication_campaigns" on public.communication_campaigns;
drop policy if exists "admin_campaigns" on public.communication_campaigns;
create policy "admin_campaigns" on public.communication_campaigns
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_reservation_message_log" on public.reservation_message_log;
create policy "admin_reservation_message_log" on public.reservation_message_log
for select to authenticated using (public.is_admin());
drop policy if exists "admin_communication_delivery_log" on public.communication_delivery_log;
create policy "admin_communication_delivery_log" on public.communication_delivery_log
for select to authenticated using (public.is_admin());
drop policy if exists "admin_manage_menu_products" on public.menu_products;
create policy "admin_manage_menu_products" on public.menu_products
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
create policy "admin_manage_menu_categories" on public.menu_categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_manage_site_media_assets" on public.site_media_assets;
create policy "admin_manage_site_media_assets" on public.site_media_assets
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage remains publicly readable for published media, but only allowlisted admins
-- can write to the site-media bucket.
drop policy if exists "admin_upload_site_media" on storage.objects;
create policy "admin_upload_site_media" on storage.objects
for insert to authenticated
with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin_update_site_media" on storage.objects;
create policy "admin_update_site_media" on storage.objects
for update to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin_delete_site_media" on storage.objects;
create policy "admin_delete_site_media" on storage.objects
for delete to authenticated
using (bucket_id = 'site-media' and public.is_admin());
