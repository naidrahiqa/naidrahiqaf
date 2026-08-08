-- =============================================================
-- Naidrahiqa — Tighten RLS: write policies restricted to admin email
-- Jalankan di Supabase Dashboard > SQL Editor
-- GANTI email di bawah dengan ADMIN_EMAIL milikmu bila berbeda
-- =============================================================

-- ---------- HELPERS ----------
-- Single admin email gate used by all write policies
-- (email dari JWT Supabase Auth)

-- ---------- PROFILES ----------
drop policy if exists "admin write profiles" on public.profiles;
create policy "admin write profiles" on public.profiles
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- ABOUT SECTIONS ----------
drop policy if exists "admin write about_sections" on public.about_sections;
create policy "admin write about_sections" on public.about_sections
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- CONTACTS ----------
drop policy if exists "admin write contacts" on public.contacts;
create policy "admin write contacts" on public.contacts
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- POSTS ----------
drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- PROJECTS ----------
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- PROJECT MEDIA ----------
drop policy if exists "admin write project_media" on public.project_media;
create policy "admin write project_media" on public.project_media
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- ACHIEVEMENTS ----------
drop policy if exists "admin write achievements" on public.achievements;
create policy "admin write achievements" on public.achievements
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- ---------- STORAGE: media bucket ----------
-- Insert/update/delete hanya admin
drop policy if exists "admin insert media" on storage.objects;
create policy "admin insert media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev')
  with check (bucket_id = 'media' and auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and auth.jwt() ->> 'email' = 'naidrahiqa@naidra.dev');

-- Public read remains unchanged