-- =============================================================
-- 010 — Tambah sort_order ke projects (drag-drop reorder di admin)
-- Jalankan di Supabase Dashboard > SQL Editor (setelah 001..009)
-- =============================================================

alter table public.projects
  add column if not exists sort_order int not null default 0;

-- Backfill: pertahankan urutan lama (berdasarkan created_at)
update public.projects p
set sort_order = sub.rn
from (
  select id, row_number() over (order by created_at) as rn
  from public.projects
) sub
where sub.id = p.id;

create index if not exists projects_sort_order_idx
  on public.projects (sort_order);
