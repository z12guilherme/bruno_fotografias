-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS - BRUNO NASCIMENTO FOTOGRAFIA (TEMPLATE)
-- ==============================================================================
-- Instruções:
-- 1. Crie um novo projeto no Supabase.
-- 2. Vá até o "SQL Editor" no painel do Supabase.
-- 3. Cole o conteúdo deste arquivo e execute (Run).
-- ==============================================================================

-- 1. Tabela de Perfis (Gerencia permissões de Admin)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text not null default 'user' -- 'admin' ou 'user'
);

alter table public.profiles enable row level security;

-- Políticas de Segurança (RLS) para Profiles
create policy "Perfis são visíveis publicamente" on public.profiles
  for select using (true);

create policy "Usuários podem criar seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Apenas Admins podem atualizar perfis" on public.profiles
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. Tabela de Álbuns
create table public.albums (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  cover_image_url text,
  access_code text not null unique, -- Código único para acesso do cliente
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.albums enable row level security;

-- Políticas de Segurança (RLS) para Álbuns
-- Leitura pública permitida (necessário para vitrine). 
-- Para maior privacidade, remova esta política e use apenas as funções RPC.
create policy "Álbuns são visíveis publicamente" on public.albums
  for select using (true);

-- Escrita restrita a Admins
create policy "Admins podem inserir álbuns" on public.albums
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins podem atualizar álbuns" on public.albums
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins podem deletar álbuns" on public.albums
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Tabela de Fotos
create table public.photos (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  image_url text not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.photos enable row level security;

-- Políticas de Segurança (RLS) para Fotos
create policy "Fotos são visíveis publicamente" on public.photos
  for select using (true);

create policy "Admins podem gerenciar fotos" on public.photos
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Funções de Segurança (RPC)
-- Usadas para acesso seguro na Área do Cliente sem expor IDs diretamente

create or replace function get_album_by_code(code_input text)
returns setof albums
language sql
security definer
as $$
  select * from albums where access_code = code_input;
$$;

create or replace function get_photos_by_album_id(p_album_id uuid)
returns setof photos
language sql
security definer
as $$
  select * from photos where album_id = p_album_id;
$$;