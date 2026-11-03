-- Avoid overlapping permissive SELECT policies while keeping public reads and
-- admin-only writes for the menu. The site-media policies are not changed.

drop policy if exists "admin_manage_menu_products" on public.menu_products;
drop policy if exists "public_read_menu_products" on public.menu_products;
drop policy if exists "authenticated_read_menu_products" on public.menu_products;
drop policy if exists "admin_insert_menu_products" on public.menu_products;
drop policy if exists "admin_update_menu_products" on public.menu_products;
drop policy if exists "admin_delete_menu_products" on public.menu_products;

create policy "public_read_menu_products"
on public.menu_products for select to anon
using (is_visible = true);

create policy "authenticated_read_menu_products"
on public.menu_products for select to authenticated
using (is_visible = true or (select public.is_admin()));

create policy "admin_insert_menu_products"
on public.menu_products for insert to authenticated
with check (public.is_admin());

create policy "admin_update_menu_products"
on public.menu_products for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_delete_menu_products"
on public.menu_products for delete to authenticated
using (public.is_admin());

-- Categories are public reference data; restrict only their mutations.
drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
drop policy if exists "public_read_menu_categories" on public.menu_categories;
drop policy if exists "admin_insert_menu_categories" on public.menu_categories;
drop policy if exists "admin_update_menu_categories" on public.menu_categories;
drop policy if exists "admin_delete_menu_categories" on public.menu_categories;

create policy "public_read_menu_categories"
on public.menu_categories for select to anon, authenticated
using (true);

create policy "admin_insert_menu_categories"
on public.menu_categories for insert to authenticated
with check (public.is_admin());

create policy "admin_update_menu_categories"
on public.menu_categories for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_delete_menu_categories"
on public.menu_categories for delete to authenticated
using (public.is_admin());
