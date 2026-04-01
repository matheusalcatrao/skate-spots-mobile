-- Spots (feed + detail) and skaters (profile), with RLS and auth hooks.
-- Apply in Supabase Dashboard → SQL Editor, or: supabase db push (CLI).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.skaters (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  handle text not null unique,
  location_label text,
  est_year integer,
  avatar_url text,
  spots_count integer not null default 0,
  reviews_count integer not null default 0,
  streak_days integer not null default 0,
  rank integer,
  level integer not null default 1,
  xp integer not null default 0,
  xp_to_next_level integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  latitude double precision,
  longitude double precision,
  image_url text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists spots_created_at_desc on public.spots (created_at desc);

create index if not exists spots_lat_lng on public.spots (latitude, longitude)
  where latitude is not null and longitude is not null;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.skaters enable row level security;
alter table public.spots enable row level security;

-- Skaters: public read; users insert/update only their row
drop policy if exists "Skaters are viewable by everyone" on public.skaters;
create policy "Skaters are viewable by everyone"
  on public.skaters
  for select
  using (true);

drop policy if exists "Users can insert own skater profile" on public.skaters;
create policy "Users can insert own skater profile"
  on public.skaters
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own skater profile" on public.skaters;
create policy "Users can update own skater profile"
  on public.skaters
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Spots: public read; authenticated users manage rows they created
drop policy if exists "Spots are viewable by everyone" on public.spots;
create policy "Spots are viewable by everyone"
  on public.spots
  for select
  using (true);

drop policy if exists "Authenticated users insert spots as themselves" on public.spots;
create policy "Authenticated users insert spots as themselves"
  on public.spots
  for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "Users update own spots" on public.spots;
create policy "Users update own spots"
  on public.spots
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "Users delete own spots" on public.spots;
create policy "Users delete own spots"
  on public.spots
  for delete
  to authenticated
  using (created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists skaters_set_updated_at on public.skaters;
create trigger skaters_set_updated_at
  before update on public.skaters
  for each row
  execute function public.set_updated_at();

drop trigger if exists spots_set_updated_at on public.spots;
create trigger spots_set_updated_at
  before update on public.spots
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Create skater row when a new auth user is created
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.skaters (id, display_name, handle)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    'skater_' || replace(new.id::text, '-', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
