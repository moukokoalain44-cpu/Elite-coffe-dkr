-- Restore the Elite Coffee menu editor with a normalized category relation.
-- Keep menu_products.category as a compatibility field consumed by the public site.
-- The existing site-media bucket and its policies are intentionally untouched.

alter table public.menu_categories
  add column if not exists description text;

alter table public.menu_products
  add column if not exists category_id text;

-- Existing live data was audited: every product category has exactly one match.
update public.menu_products p
set category_id = c.id
from public.menu_categories c
where p.category_id is null
  and lower(btrim(c.name)) = lower(btrim(p.category));

do $$
begin
  if exists (
    select 1 from public.menu_products where category_id is null limit 1
  ) then
    raise exception 'CATALOG_CATEGORY_BACKFILL_FAILED: at least one menu_products.category has no matching menu_categories.name';
  end if;
end;
$$;

create unique index if not exists menu_categories_normalized_name_uidx
  on public.menu_categories (lower(btrim(name)));

alter table public.menu_products
  alter column category_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.menu_products'::regclass
      and conname = 'menu_products_category_id_fkey'
  ) then
    alter table public.menu_products
      add constraint menu_products_category_id_fkey
      foreign key (category_id) references public.menu_categories(id)
      on delete restrict not valid;
  end if;
end;
$$;

alter table public.menu_products validate constraint menu_products_category_id_fkey;
create index if not exists menu_products_category_id_sort_order_idx
  on public.menu_products (category_id, sort_order, id);

create or replace function public.sync_menu_product_category_fields()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  resolved_name text;
begin
  if tg_op = 'INSERT' then
    if new.category_id is not null then
      select name into resolved_name from public.menu_categories where id = new.category_id;
    else
      select id, name into new.category_id, resolved_name
      from public.menu_categories
      where lower(btrim(name)) = lower(btrim(new.category));
    end if;
  elsif new.category is distinct from old.category then
    select id, name into new.category_id, resolved_name
    from public.menu_categories
    where lower(btrim(name)) = lower(btrim(new.category));
  elsif new.category_id is distinct from old.category_id then
    select name into resolved_name from public.menu_categories where id = new.category_id;
  else
    return new;
  end if;

  if resolved_name is null then
    raise exception using
      errcode = '23503',
      message = 'CATALOG_CATEGORY_NOT_FOUND: choose an existing menu_categories.id or name';
  end if;

  new.category := resolved_name;
  return new;
end;
$$;

drop trigger if exists menu_products_sync_category_fields on public.menu_products;
create trigger menu_products_sync_category_fields
before insert or update of category, category_id on public.menu_products
for each row execute function public.sync_menu_product_category_fields();

create or replace function public.sync_menu_category_name_to_products()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.name is distinct from old.name then
    update public.menu_products
    set category = new.name, updated_at = now()
    where category_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists menu_categories_sync_product_names on public.menu_categories;
create trigger menu_categories_sync_product_names
after update of name on public.menu_categories
for each row execute function public.sync_menu_category_name_to_products();

-- Explicit table grants are required because a previous migration revoked writes.
revoke insert, update, delete on public.menu_products from anon, authenticated;
revoke insert, update, delete on public.menu_categories from anon, authenticated;
grant select on public.menu_products to anon, authenticated;
grant insert, update, delete on public.menu_products to authenticated;
grant select on public.menu_categories to anon, authenticated;
grant insert, update, delete on public.menu_categories to authenticated;

alter table public.menu_products enable row level security;
alter table public.menu_categories enable row level security;

drop policy if exists "public_read_menu_products" on public.menu_products;
create policy "public_read_menu_products"
on public.menu_products for select to anon, authenticated
using (is_visible = true);

drop policy if exists "admin_read_menu_products" on public.menu_products;
drop policy if exists "admin_manage_menu_products" on public.menu_products;
create policy "admin_manage_menu_products"
on public.menu_products for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public_read_menu_categories" on public.menu_categories;
create policy "public_read_menu_categories"
on public.menu_categories for select to anon, authenticated
using (true);

drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
create policy "admin_manage_menu_categories"
on public.menu_categories for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Dedicated public menu image bucket; keep the independent site-media library unchanged.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "menu_images_read" on storage.objects;
create policy "menu_images_read"
on storage.objects for select to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "menu_images_admin_insert" on storage.objects;
create policy "menu_images_admin_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists "menu_images_admin_update" on storage.objects;
create policy "menu_images_admin_update"
on storage.objects for update to authenticated
using (bucket_id = 'menu-images' and public.is_admin())
with check (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists "menu_images_admin_delete" on storage.objects;
create policy "menu_images_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'menu-images' and public.is_admin());
