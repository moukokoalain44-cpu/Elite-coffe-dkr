-- Recreate the Storage policies explicitly for authenticated admin uploads.
-- The previous policies were present but the Storage API still rejected inserts
-- from authenticated sessions with AccessDenied.
drop policy if exists "admin_upload_site_media" on storage.objects;
drop policy if exists "admin_update_site_media" on storage.objects;
drop policy if exists "admin_delete_site_media" on storage.objects;
drop policy if exists "public_read_site_media" on storage.objects;

create policy "admin_upload_site_media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and auth.uid() is not null
);

create policy "admin_update_site_media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and auth.uid() is not null)
with check (bucket_id = 'site-media' and auth.uid() is not null);

create policy "admin_delete_site_media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and auth.uid() is not null);

create policy "public_read_site_media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');
