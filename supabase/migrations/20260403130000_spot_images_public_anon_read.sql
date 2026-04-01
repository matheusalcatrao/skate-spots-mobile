-- Public object URLs are served to browsers/clients without a JWT (anon).
-- If SELECT was only for role "public" in some projects, unauthenticated GET can 403.
update storage.buckets
set public = true
where id = 'spot-images';

drop policy if exists "Public read spot images" on storage.objects;
create policy "Public read spot images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'spot-images');
