-- =============================================================
-- Naidrahiqa — Atomic media replace RPC
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

create or replace function public.replace_project_media(
  p_project_id uuid,
  p_items jsonb
)
returns void
language plpgsql
security invoker
as $$
begin
  delete from public.project_media where project_id = p_project_id;

  if jsonb_array_length(p_items) > 0 then
    insert into public.project_media (project_id, media_type, url, caption, sort_order)
    select
      p_project_id,
      (item->>'media_type')::text,
      (item->>'url')::text,
      coalesce((item->>'caption')::text, ''),
      (item->>'sort_order')::int
    from jsonb_array_elements(p_items) as item;
  end if;
end;
$$;