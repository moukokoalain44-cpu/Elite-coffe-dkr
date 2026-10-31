-- Harden the versioned policies so repository state matches the active Supabase security model.
-- This migration intentionally keeps create_reservation public and validated.

-- Admin-only table access.
drop policy if exists "admin_manage_menu_products" on public.menu_products;
create policy "admin_manage_menu_products"
on public.menu_products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
create policy "admin_manage_menu_categories"
on public.menu_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_manage_site_media_assets" on public.site_media_assets;
create policy "admin_manage_site_media_assets"
on public.site_media_assets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_customers" on public.customers;
create policy "admin_customers"
on public.customers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_contact_messages" on public.contact_messages;
create policy "admin_contact_messages"
on public.contact_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_followups" on public.reservation_followups;
create policy "admin_followups"
on public.reservation_followups
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_communication_campaigns" on public.communication_campaigns;
create policy "admin_communication_campaigns"
on public.communication_campaigns
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_orders" on public.orders;
create policy "admin_orders"
on public.orders
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_order_items" on public.order_items;
create policy "admin_order_items"
on public.order_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_reservations" on public.reservations;
drop policy if exists "admin_read_reservations" on public.reservations;
create policy "admin_read_reservations"
on public.reservations
for select
to authenticated
using (public.is_admin());

-- Public writes are constrained to safe business states.
drop policy if exists "insert_orders" on public.orders;
create policy "insert_orders"
on public.orders
for insert
to anon, authenticated
with check (
  status = 'pending'
  and subtotal >= 0
  and delivery_fee >= 0
  and total = subtotal + delivery_fee
  and (
    (fulfillment = 'pickup' and delivery_fee = 0)
    or (fulfillment = 'delivery' and nullif(btrim(address), '') is not null)
  )
);

drop policy if exists "insert_order_items" on public.order_items;
create policy "insert_order_items"
on public.order_items
for insert
to anon, authenticated
with check (price >= 0 and quantity > 0);

drop policy if exists "public_insert_customers" on public.customers;
create policy "public_insert_customers"
on public.customers
for insert
to anon, authenticated
with check (source = 'site');

drop policy if exists "public_insert_contact_messages" on public.contact_messages;
create policy "public_insert_contact_messages"
on public.contact_messages
for insert
to anon, authenticated
with check (status = 'new');

-- Reservation writes go through create_reservation(), not direct table inserts.
drop policy if exists "insert_reservations" on public.reservations;
revoke all on table public.reservations from anon, authenticated;
grant select on table public.reservations to authenticated;

-- Logs contain customer phone numbers and message bodies: admins only.
drop policy if exists "admin_reservation_message_log" on public.reservation_message_log;
create policy "admin_reservation_message_log"
on public.reservation_message_log
for select
to authenticated
using (public.is_admin());

drop policy if exists "admin_communication_delivery_log" on public.communication_delivery_log;
create policy "admin_communication_delivery_log"
on public.communication_delivery_log
for select
to authenticated
using (public.is_admin());

-- Storage writes are admin-only; public access is read-only for this public bucket.
drop policy if exists "admin_upload_site_media" on storage.objects;
create policy "admin_upload_site_media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin_update_site_media" on storage.objects;
create policy "admin_update_site_media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin_delete_site_media" on storage.objects;
create policy "admin_delete_site_media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "public_read_site_media" on storage.objects;
create policy "public_read_site_media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

-- Only the public reservation entry point remains callable anonymously.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke all on function public.update_reservation_status(uuid, text) from public, anon, authenticated;
grant execute on function public.update_reservation_status(uuid, text) to authenticated;
revoke all on function public.update_reservation_details(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.update_reservation_details(uuid, jsonb) to authenticated;
revoke all on function public.delete_reservation(uuid) from public, anon, authenticated;
grant execute on function public.delete_reservation(uuid) to authenticated;
revoke all on function public.send_ultramsg_message(text, text, uuid) from public, anon, authenticated;
grant execute on function public.send_ultramsg_message(text, text, uuid) to authenticated;
