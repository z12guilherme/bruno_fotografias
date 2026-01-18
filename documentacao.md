# Documentação Técnica - Bruno Nascimento Fotografia

Este documento descreve a arquitetura, o modelo de dados e os detalhes de implementação do sistema de portfólio e área do cliente.

## 🏗️ Arquitetura do Sistema

O sistema é uma **Single Page Application (SPA)** construída com React e Vite. A aplicação é "serverless" no sentido de que não mantém um servidor backend tradicional (como Express) rodando constantemente. Em vez disso, utiliza o **Supabase** como uma solução de Backend-as-a-Service (BaaS) para gerenciar banco de dados, autenticação e armazenamento de arquivos.

### Fluxo de Dados
1.  **Frontend (React)**: Interage diretamente com a API do Supabase usando o cliente `@supabase/supabase-js`.
2.  **Autenticação**:
    *   **Admin**: Login via email/senha gerenciado pelo Supabase Auth.
    *   **Cliente**: Acesso via código (senha) simples, validado contra a tabela de álbuns no banco de dados via RPC (Remote Procedure Call) para segurança.
3.  **Banco de Dados (PostgreSQL)**: Armazena informações dos álbuns, fotos e perfis de administrador.
4.  **Storage**: As imagens (upload via painel admin) são armazenadas em buckets do Supabase Storage.

---

## 🗄️ Modelo de Banco de Dados (Supabase)

O banco de dados PostgreSQL possui as seguintes tabelas principais:

### 1. `albums`
Armazena os álbuns criados para os clientes.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | uuid | Identificador único do álbum (PK). |
| `title` | text | Título do álbum ou nome do cliente. |
| `description` | text | Descrição opcional do evento. |
| `cover_image_url` | text | URL da imagem de capa (opcional). |
| `access_code` | text | Código/Senha para o cliente acessar o álbum. |
| `created_at` | timestamp | Data de criação. |

### 2. `photos`
Armazena as referências das fotos pertencentes a um álbum.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | uuid | Identificador único da foto (PK). |
| `album_id` | uuid | Chave estrangeira (FK) referenciando `albums.id`. |
| `image_url` | text | URL pública da imagem no Supabase Storage. |
| `title` | text | Nome original do arquivo ou título da foto. |
| `created_at` | timestamp | Data de upload. |

### 3. `profiles`
Gerencia permissões de usuários do sistema.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | uuid | Referência ao `auth.users.id` do Supabase. |
| `role` | text | Papel do usuário (ex: 'admin'). |

---

## 🔒 Segurança e Políticas (RLS)

O sistema utiliza **Row Level Security (RLS)** do PostgreSQL para garantir a segurança dos dados.

*   **Leitura Pública**: Permitida para fotos e álbuns (necessário para a galeria pública, se houver).
*   **Acesso Restrito (Cliente)**: O acesso à área do cliente é protegido por uma função de banco de dados (RPC) chamada `get_album_by_code`. Isso impede que usuários mal-intencionados listem todos os álbuns tentando adivinhar IDs.
*   **Escrita/Edição**: Permitida apenas para usuários autenticados com a role `admin` na tabela `profiles`.

### Funções RPC Importantes

*   `get_album_by_code(code_input)`: Recebe um código de texto e retorna o álbum correspondente se o código estiver correto.
*   `get_photos_by_album_id(p_album_id)`: Retorna todas as fotos de um álbum específico.

---

## 📂 Estrutura de Pastas (Frontend)

```
src/
├── assets/          # Imagens estáticas, logos, vídeos
├── components/      # Componentes React reutilizáveis
│   ├── ui/          # Componentes base (shadcn/ui) - botões, inputs, cards
│   ├── Header.tsx   # Cabeçalho de navegação
│   ├── Footer.tsx   # Rodapé
│   └── ...          # Outros componentes de seção (Hero, About, etc.)
├── lib/             # Configurações de bibliotecas externas
│   ├── supabase.ts  # Cliente Supabase configurado
│   └── utils.ts     # Funções utilitárias (cn para tailwind)
├── pages/           # Páginas completas da aplicação
│   ├── AdminDashboard.tsx # Painel de controle do fotógrafo
│   ├── AdminLogin.tsx     # Login do administrador
│   └── ...
├── App.tsx          # Configuração de rotas principal
└── main.tsx         # Ponto de entrada da aplicação
```

---

## 🚀 Deploy

O projeto está configurado para deploy no **Firebase Hosting**.

### Comandos de Deploy

1.  **Build**: Gera os arquivos estáticos na pasta `dist`.
    ```bash
    npm run build
    ```
2.  **Deploy**: Envia a pasta `dist` para o Firebase.
    ```bash
    firebase deploy
    ```