-- =============================================================
-- Naidrahiqa — Transactional contacts swap + misc cleanup
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

-- Swap contacts dalam satu transaksi (delete + insert atomik).
-- SECURITY INVOKER: tetap tunduk pada RLS (hanya admin email bisa jalan).
create or replace function public.swap_contacts(items jsonb)
returns void
language plpgsql
security invoker
as $$
begin
  delete from public.contacts;
  insert into public.contacts (platform, handle, url, sort_order)
  select
    coalesce(item ->> 'platform', 'email'),
    coalesce(item ->> 'handle', ''),
    coalesce(item ->> 'url', ''),
    coalesce((item ->> 'sort_order')::int, 0)
  from jsonb_array_elements(items) as item;
end;
$$;

revoke execute on function public.swap_contacts(jsonb) from public, anon;
grant execute on function public.swap_contacts(jsonb) to authenticated;