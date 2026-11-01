-- KeurGui accepts menu images with the standard 50 MB Storage limit.
-- The previous 10 MB limit rejected the 6.9 MB browser upload at the
-- effective Storage constraint in production.
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif']::text[]
where id = 'menu-images';
