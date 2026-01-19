-- 1. Criar tabela de subpastas
create table if not exists public.subfolders (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  title text not null,
  created_at timestamptz default now()
);

-- 2. Adicionar coluna de referência na tabela de fotos
alter table public.photos add column if not exists subfolder_id uuid references public.subfolders(id) on delete set null;