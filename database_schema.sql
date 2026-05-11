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
  external_url text, -- Link para plataforma externa (ex: Selpics)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.albums enable row level security;

-- Políticas de Segurança (RLS) para Álbuns
-- Acesso público direto removido para garantir a privacidade total prometida.
-- O cliente agora acessará OBRIGATORIAMENTE via código na função RPC get_album_by_code.

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

-- 2.5 Tabela de Subpastas
create table public.subfolders (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subfolders enable row level security;

-- Acesso público direto removido. (Leitura apenas via RPC do cliente)

create policy "Admins podem gerenciar subpastas" on public.subfolders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Tabela de Fotos
create table public.photos (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  subfolder_id uuid references public.subfolders(id) on delete set null,
  image_url text not null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.photos enable row level security;

-- Políticas de Segurança (RLS) para Fotos
-- Acesso público direto removido. (Leitura apenas via RPC do cliente)

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

-- Função segura para buscar subpastas de um álbum específico (Usado pela Área do Cliente)
create or replace function get_subfolders_by_album_id(p_album_id uuid)
returns setof subfolders
language sql
security definer
as $$
  select * from subfolders where album_id = p_album_id;
$$;

-- 5. Tabela de Configurações da HomePage
create table public.homepage_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.homepage_settings enable row level security;

create policy "Configurações da home são visíveis publicamente" on public.homepage_settings
  for select using (true);

create policy "Admins podem inserir configurações da home" on public.homepage_settings
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins podem atualizar configurações da home" on public.homepage_settings
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ==============================================================================
-- CONFIGURAÇÃO DO STORAGE (BUCKETS)
-- ==============================================================================

-- Insere o bucket 'portfolio' para as imagens da página inicial
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Políticas do Storage para o bucket 'portfolio'
create policy "Imagens do portfolio são públicas"
  on storage.objects for select using ( bucket_id = 'portfolio' );

create policy "Admins podem fazer upload de imagens no portfolio"
  on storage.objects for insert with check ( bucket_id = 'portfolio' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins podem deletar imagens do portfolio"
  on storage.objects for delete using ( bucket_id = 'portfolio' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins podem atualizar imagens do portfolio"
  on storage.objects for update using ( bucket_id = 'portfolio' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- ==============================================================================
-- STORAGE PARA ÁLBUNS DE CLIENTES (ÁREA PRIVADA)
-- ==============================================================================
insert into storage.buckets (id, name, public) values ('albums', 'albums', true)
on conflict (id) do nothing;

create policy "Admins podem gerenciar todas as imagens dos clientes"
  on storage.objects for all using ( bucket_id = 'albums' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Leitura pública permitida apenas com URL conhecida"
  on storage.objects for select using ( bucket_id = 'albums' );