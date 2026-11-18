-- Jalankan sekali di Supabase: SQL Editor > New query > tempel > Run

-- 1) Bucket foto (publik; nama file acak sehingga tidak bisa ditebak,
--    dan daftar isi bucket TIDAK bisa dilihat publik)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

drop policy if exists "anon upload photos" on storage.objects;
create policy "anon upload photos"
  on storage.objects for insert to anon
  with check (bucket_id = 'photos');

-- 2) Tabel pencatat pilihan gaya (untuk rekomendasi)
create table if not exists public.style_picks (
  id bigint generated always as identity primary key,
  style_id text not null,
  created_at timestamptz not null default now()
);

alter table public.style_picks enable row level security;

drop policy if exists "anon insert picks" on public.style_picks;
create policy "anon insert picks"
  on public.style_picks for insert to anon
  with check (true);

-- 3) Fungsi hitung popularitas (tabel sendiri tidak bisa dibaca langsung oleh publik)
create or replace function public.style_counts()
returns table (style_id text, total bigint)
language sql
security definer
set search_path = public
as $$
  select style_id, count(*) as total from public.style_picks group by style_id
$$;

grant execute on function public.style_counts() to anon;
