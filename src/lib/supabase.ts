import { createClient } from '@supabase/supabase-js';

// Acessa as variáveis de ambiente do Vite
// Certifique-se de criar um arquivo .env na raiz do projeto com essas chaves
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ATENÇÃO: Variáveis de ambiente do Supabase não encontradas. Verifique seu arquivo .env');
}

// Cria uma instância única do cliente para ser usada em toda a aplicação
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);
