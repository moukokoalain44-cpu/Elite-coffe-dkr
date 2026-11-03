-- Retire les mutations du catalogue administrateur et les policies de son ancien
-- stockage d'images. Le bucket menu-images, vérifié vide, a ensuite été supprimé
-- manuellement via le Dashboard/API Storage (la suppression directe par SQL est bloquée).

-- Les produits restent publics lorsqu'ils sont visibles; les admins conservent la
-- lecture des produits masqués pour l'affichage de la rubrique Catalogue.
drop policy if exists "admin_manage_menu_products" on public.menu_products;
drop policy if exists "admin_read_menu_products" on public.menu_products;
create policy "admin_read_menu_products"
on public.menu_products for select to authenticated
using (public.is_admin());
revoke insert, update, delete on public.menu_products from anon, authenticated;

-- La taxonomie historique n'est plus utilisée par l'application. On conserve ses
-- 26 entrées et sa lecture publique, mais on retire son écriture depuis le client.
drop policy if exists "admin_manage_menu_categories" on public.menu_categories;
revoke insert, update, delete on public.menu_categories from anon, authenticated;

-- Aucun code applicatif ne téléverse désormais d'images de catalogue.
drop policy if exists "menu_images_admin_insert" on storage.objects;
drop policy if exists "menu_images_admin_update" on storage.objects;
drop policy if exists "menu_images_admin_delete" on storage.objects;
drop policy if exists "menu_images_read" on storage.objects;
