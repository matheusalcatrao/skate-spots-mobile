-- Public bucket for spot photos; uploads scoped to auth.uid() as first path segment.
insert into storage.buckets (id, name, public)
values ('spot-images', 'spot-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read spot images" on storage.objects;
create policy "Public read spot images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'spot-images');

drop policy if exists "Authenticated upload spot images" on storage.objects;
create policy "Authenticated upload spot images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'spot-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users update own spot images" on storage.objects;
create policy "Users update own spot images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'spot-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'spot-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users delete own spot images" on storage.objects;
create policy "Users delete own spot images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'spot-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
