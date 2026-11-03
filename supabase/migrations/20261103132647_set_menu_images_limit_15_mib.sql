-- Raise only the dedicated menu image bucket limit to 15 MiB.
-- Keep site-media settings and all Storage policies unchanged.
update storage.buckets
set file_size_limit = 15728640
where id = 'menu-images';
