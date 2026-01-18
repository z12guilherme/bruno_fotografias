-- 1. Adicionar coluna de código de acesso na tabela de álbuns
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS access_code text;

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_albums_access_code ON public.albums(access_code);

-- 2. Função segura para buscar álbum pelo código (Bypassing RLS)
-- SECURITY DEFINER permite que a função rode com permissões de admin,
-- permitindo que usuários anônimos (clientes) leiam o álbum se tiverem o código correto.
CREATE OR REPLACE FUNCTION public.get_album_by_code(code_input text)
RETURNS SETOF public.albums
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.albums
  WHERE access_code = code_input
  LIMIT 1;
END;
$$;

-- 3. Função segura para buscar fotos de um álbum específico
-- Também usa SECURITY DEFINER para permitir leitura sem estar logado,
-- desde que o frontend tenha obtido o ID do álbum validado anteriormente.
CREATE OR REPLACE FUNCTION public.get_photos_by_album_id(p_album_id uuid)
RETURNS SETOF public.photos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.photos
  WHERE album_id = p_album_id
  ORDER BY created_at DESC;
END;
$$;