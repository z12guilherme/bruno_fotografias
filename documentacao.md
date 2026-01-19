# Documentação do Sistema - Bruno Nascimento Fotografia

Este documento detalha o escopo funcional, a arquitetura técnica e os termos de uso do sistema desenvolvido para **Bruno Nascimento Fotografia**.

> ⚠️ **AVISO DE PROPRIEDADE E USO RESTRITO**
>
> Este software é uma solução proprietária desenvolvida exclusivamente para **Bruno Nascimento Fotografia**.
> O código-fonte, design e funcionalidades aqui descritos são confidenciais e protegidos por direitos autorais.
> **É estritamente proibida a cópia, distribuição, venda ou engenharia reversa deste sistema sem autorização expressa.**

---

## 1. Escopo do Sistema

O sistema foi projetado para atender a três objetivos principais:
1.  **Vitrine Digital (Portfólio)**: Apresentar o trabalho do fotógrafo com alta qualidade visual.
2.  **Entrega de Material (Área do Cliente)**: Permitir que clientes acessem suas fotos de forma privada e segura.
3.  **Gestão de Conteúdo (Painel Administrativo)**: Dar autonomia total ao fotógrafo para gerenciar o site.

### 1.1. Funcionalidades Públicas (Frontend)
*   **Home Page**: Apresentação impactante com vídeo ou imagem de destaque.
*   **Portfólio**: Galeria de fotos organizada, com visualização em alta resolução.
*   **Sobre Mim**: Seção biográfica com foto do profissional.
*   **Contato**: Formulário para captação de leads (orçamentos).
*   **Design Responsivo**: Adaptação perfeita para celulares, tablets e desktops.

### 1.2. Área do Cliente (Acesso Restrito)
*   **Login Simplificado**: Acesso via código de acesso único (sem necessidade de cadastro de usuário/senha complexos para o cliente).
*   **Galeria Privada**: Visualização das fotos do evento/ensaio específico do cliente.
*   **Redirecionamento Externo**: Suporte para redirecionar o cliente automaticamente para plataformas de seleção externas (ex: Selpics, Google Drive) após o login.
*   **Download**: Opção para baixar as fotos (se habilitado).

### 1.3. Painel Administrativo (Gestão)
*   **Autenticação Segura**: Login exclusivo para o administrador.
*   **Gestão de Álbuns**: Criar, editar e excluir álbuns de clientes.
*   **Upload de Fotos**: Interface "drag-and-drop" para envio de múltiplas fotos simultaneamente.
*   **Gerenciamento de Acessos**: Definição dos códigos de acesso para cada álbum.

---

## 2. Arquitetura Técnica

O sistema utiliza uma arquitetura moderna **Serverless**, focada em performance e baixo custo de manutenção.

### 2.1. Stack Tecnológico
*   **Frontend**: React (v18+), TypeScript, Vite.
*   **Estilização**: Tailwind CSS, shadcn/ui, Framer Motion (animações).
*   **Backend as a Service (BaaS)**: Supabase.
*   **Banco de Dados**: PostgreSQL.
*   **Armazenamento**: Supabase Storage (para fotos em alta resolução).

### 2.2. Fluxo de Dados
1.  O **Frontend** se comunica diretamente com a API do Supabase.
2.  A **Autenticação** do Admin é gerenciada pelo Supabase Auth.
3.  A **Validação de Acesso do Cliente** é feita via *Remote Procedure Calls* (RPC) no banco de dados, garantindo que o cliente só veja o álbum correspondente ao seu código.

---

## 3. Modelo de Dados (Banco de Dados)

O banco de dados PostgreSQL foi estruturado para garantir a integridade e segurança das informações.

### Tabelas Principais

| Tabela | Descrição |
| :--- | :--- |
| `albums` | Armazena os dados dos álbuns (título, data, código de acesso, capa, link externo). |
| `photos` | Armazena as referências das imagens vinculadas a um álbum. |
| `profiles` | Gerencia os perfis de administradores do sistema. |

### Segurança (Row Level Security - RLS)
*   **Leitura Pública**: Permitida apenas para dados marcados como públicos (ex: portfólio geral).
*   **Acesso Cliente**: Restrito via função de banco de dados (`get_album_by_code`) que valida o código de acesso antes de retornar os dados.
*   **Escrita/Edição**: Restrita exclusivamente a usuários autenticados com a role `admin`.

---

## 4. Estrutura do Projeto

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

##  Build

Para gerar o build de produção:
```bash
npm run build
```