-- Keep catalog writes bound to the real production back-office administrator.
-- Direct auth.uid() comparison avoids Storage/RLS helper-resolution differences.
drop policy if exists "menu_images_admin_insert" on storage.objects;
create policy "menu_images_admin_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'menu-images'
  and auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid
);

drop policy if exists "menu_images_admin_update" on storage.objects;
create policy "menu_images_admin_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'menu-images'
  and auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid
)
with check (
  bucket_id = 'menu-images'
  and auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid
);

drop policy if exists "menu_images_admin_delete" on storage.objects;
create policy "menu_images_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'menu-images'
  and auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid
);

drop policy if exists "admin_manage_menu_products" on public.menu_products;
create policy "admin_manage_menu_products"
on public.menu_products for all to authenticated
using (auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid)
with check (auth.uid() = 'bd732e63-b6f0-4460-ac9a-8f02449d7757'::uuid);
