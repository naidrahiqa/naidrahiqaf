-- =============================================================
-- Naidrahiqa Portfolio — Schema + RLS
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- PROFILES (single row) ----------
create table if not exists public.profiles (
  id serial primary key,
  name text not null default 'Faqih Ardian Syah',
  nickname text not null default 'Naidrahiqa',
  tagline text not null default 'TKJ Student | Kernel Developer | IoT Builder | CyberSecurity Enthusiast',
  hero_description text not null default '',
  profile_image text,
  updated_at timestamptz not null default now()
);

-- ---------- ABOUT SECTIONS ----------
create table if not exists public.about_sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  heading text not null,
  content text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- CONTACTS ----------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  platform text unique not null,
  handle text not null default '',
  url text not null default '',
  sort_order int not null default 0
);

-- ---------- BLOG POSTS ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  video_url text,
  video_type text not null default 'none'
    check (video_type in ('none', 'youtube', 'drive', 'storage')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'school'
    check (category in ('school', 'personal')),
  class_level text not null default ''
    check (class_level in ('', 'x', 'xi', 'xii')),
  subject text not null default '',
  description text not null default '',
  content text not null default '',
  cover_image text,
  video_url text,
  video_type text not null default 'none'
    check (video_type in ('none', 'youtube', 'drive', 'storage')),
  link text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PROJECT MEDIA (galeri foto/video per showcase) ----------
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null
    check (media_type in ('image', 'youtube', 'drive', 'storage')),
  url text not null,
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_media_project_idx
  on public.project_media (project_id, sort_order);

-- ---------- ACHIEVEMENTS ----------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event text not null default '',
  category text not null default 'competition'
    check (category in ('competition', 'training', 'seminar')),
  year text not null default '',
  description text not null default '',
  certificate_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- STORAGE: media bucket ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.profiles enable row level security;
alter table public.about_sections enable row level security;
alter table public.contacts enable row level security;
alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.achievements enable row level security;

-- Publik boleh baca semua
create policy "public read profiles" on public.profiles for select using (true);
create policy "public read about_sections" on public.about_sections for select using (true);
create policy "public read contacts" on public.contacts for select using (true);
create policy "public read posts" on public.posts for select using (true);
create policy "public read projects" on public.projects for select using (true);
create policy "public read project_media" on public.project_media for select using (true);
create policy "public read achievements" on public.achievements for select using (true);

-- Hanya user yang login (admin) yang bisa menulis
create policy "admin write profiles" on public.profiles
  for all to authenticated using (true) with check (true);
create policy "admin write about_sections" on public.about_sections
  for all to authenticated using (true) with check (true);
create policy "admin write contacts" on public.contacts
  for all to authenticated using (true) with check (true);
create policy "admin write posts" on public.posts
  for all to authenticated using (true) with check (true);
create policy "admin write projects" on public.projects
  for all to authenticated using (true) with check (true);
create policy "admin write project_media" on public.project_media
  for all to authenticated using (true) with check (true);
create policy "admin write achievements" on public.achievements
  for all to authenticated using (true) with check (true);

-- Storage: publik bisa baca, authenticated bisa upload/delete
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin insert media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
