-- =============================================================
-- Naidrahiqa Portfolio — Projects: subject (mapel) + media gallery
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

-- ---------- PROJECTS: tambah kolom subject (mapel) ----------
alter table public.projects
  add column if not exists subject text not null default '';

-- Sederhanakan class_level: hanya x / xi / xii
alter table public.projects
  drop constraint if exists projects_class_level_check;

-- Backfill data lama: tjkn/kj/asj adalah spesialisasi kelas XII
update public.projects
  set class_level = 'xii'
  where class_level in ('tjkn', 'kj', 'asj');

alter table public.projects
  add constraint projects_class_level_check
  check (class_level in ('', 'x', 'xi', 'xii'));

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

-- ---------- RLS ----------
alter table public.project_media enable row level security;

create policy "public read project_media" on public.project_media
  for select using (true);

create policy "admin write project_media" on public.project_media
  for all to authenticated using (true) with check (true);
