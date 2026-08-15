-- =============================================================
-- 011 — Now Playing (daily song, dikelola dari admin panel)
-- Jalankan di Supabase Dashboard > SQL Editor (setelah 001..010)
-- =============================================================

create table if not exists public.now_playing (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  album text not null default '',
  art_url text not null default '',
  link text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.now_playing enable row level security;

create policy "public read now_playing" on public.now_playing
  for select using (true);

create policy "admin write now_playing" on public.now_playing
  for all to authenticated using (true) with check (true);

create index if not exists now_playing_sort_order_idx
  on public.now_playing (sort_order);
