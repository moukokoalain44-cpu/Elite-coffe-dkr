-- Keep the public menu synchronized immediately after an admin change.
alter table public.menu_products replica identity full;
alter publication supabase_realtime add table public.menu_products;

-- Restrict catalogue mutations to authenticated back-office sessions.
drop policy if exists "admin_manage_menu_products" on public.menu_products;
create policy "admin_manage_menu_products"
on public.menu_products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
create policy "admin_manage_menu_categories"
on public.menu_categories
for all
to authenticated
using (true)
with check (true);
