-- =============================================================
-- Naidrahiqa — Project detail layout option
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

alter table public.projects
  add column if not exists layout text not null default 'video-focus'
  check (layout in ('text-first', 'gallery-first', 'cover-hero', 'masonry', 'video-focus'));