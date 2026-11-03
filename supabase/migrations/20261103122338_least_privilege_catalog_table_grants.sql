-- Remove inherited table-level grants that RLS does not cover (notably TRUNCATE).
-- Regrant only the operations needed by the public menu and admin editor.
revoke all privileges on table public.menu_products from public, anon, authenticated;
revoke all privileges on table public.menu_categories from public, anon, authenticated;

grant select on table public.menu_products to anon, authenticated;
grant insert, update, delete on table public.menu_products to authenticated;

grant select on table public.menu_categories to anon, authenticated;
grant insert, update, delete on table public.menu_categories to authenticated;

-- The public menu subscribes to category changes as well as product changes.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'menu_categories'
  ) then
    execute 'alter publication supabase_realtime add table public.menu_categories';
  end if;
end;
$$;
