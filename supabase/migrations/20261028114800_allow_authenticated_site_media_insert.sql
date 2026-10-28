-- Storage API authenticates the admin session before applying this policy.
-- Keep the scope limited to the site-media bucket; public reads remain read-only.
drop policy if exists "admin_upload_site_media" on storage.objects;
drop policy if exists "admin_update_site_media" on storage.objects;
drop policy if exists "admin_delete_site_media" on storage.objects;

create policy "admin_upload_site_media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media');

create policy "admin_update_site_media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

create policy "admin_delete_site_media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media');
