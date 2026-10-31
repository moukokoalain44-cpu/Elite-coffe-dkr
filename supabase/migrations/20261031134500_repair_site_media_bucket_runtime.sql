-- The production project had the catalog Storage policies but the bucket itself was missing.
-- Keep the runtime bucket contract explicit for existing and fresh environments.
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
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin_upload_site_media" on storage.objects;
create policy "admin_upload_site_media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin_update_site_media" on storage.objects;
create policy "admin_update_site_media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin_delete_site_media" on storage.objects;
create policy "admin_delete_site_media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "public_read_site_media" on storage.objects;
create policy "public_read_site_media"
on storage.objects for select to public
using (bucket_id = 'site-media');
