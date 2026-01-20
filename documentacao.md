# Documentação do Sistema - Bruno Nascimento Fotografia

Este documento detalha o escopo funcional, a arquitetura técnica, o guia de desenvolvimento e os procedimentos para gerar o aplicativo móvel.

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
*   **Download do App**: Seção inteligente que oferece o APK para Android ou instruções PWA para iOS.
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
*   **Mobile**: Capacitor (Android).
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
│   ├── DownloadApp.tsx # Componente de download do APK
│   ├── Footer.tsx   # Rodapé
│   └── ...          # Outros componentes de seção (Hero, About, etc.)
├── lib/             # Configurações de bibliotecas externas
│   ├── supabase.ts  # Cliente Supabase configurado
│   └── utils.ts     # Funções utilitárias (cn para tailwind)
├── pages/           # Páginas completas da aplicação
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   └── ...
├── App.tsx          # Configuração de rotas principal
└── main.tsx         # Ponto de entrada da aplicação
├── android/         # Projeto nativo Android (Gerado pelo Capacitor)
└── public/          # Arquivos estáticos públicos (incluindo o .apk)
```

---

## 5. Guia de Instalação e Desenvolvimento

### 5.1. Pré-requisitos
*   **Node.js** (versão 18 ou superior).
*   **Android Studio** (necessário apenas para compilar o App Android).

### 5.2. Instalação
1.  Clone o repositório ou extraia os arquivos.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz com as chaves do Supabase:
    ```env
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    ```

### 5.3. Executar Localmente
Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 6. Aplicativo Móvel (Android)

O projeto utiliza **Capacitor** para converter a aplicação web em um aplicativo nativo Android.

### 6.1. Comandos Principais

| Comando | Descrição |
| :--- | :--- |
| `npm run generate:assets` | Gera ícones e splash screen a partir da pasta `assets/`. |
| `npm run build:apk` | Compila o site, sincroniza com o Android e gera o arquivo APK. |

### 6.2. Passo a Passo para Gerar o APK

1.  **Atualizar Ícones (Opcional)**:
    *   Substitua `assets/icon.png` (1024x1024px) pelo logo desejado.
    *   Substitua `assets/splash.png` (2732x2732px) pela tela de abertura desejada.
    *   Execute: `npm run generate:assets`

2.  **Compilar e Gerar APK**:
    *   Execute: `npm run build:apk`
    *   O processo fará o build do React, atualizará o projeto Android e compilará o binário.

3.  **Localização do Arquivo**:
    *   O APK gerado será copiado automaticamente para: `public/bruno-fotografias.apk`.
    *   Este arquivo pode ser baixado diretamente pelo site ou instalado via USB.

### 6.3. Solução de Problemas (Build Android)
*   **Erro de JAVA_HOME**: O projeto já está configurado (`gradle.properties`) para usar o JDK embutido no Android Studio. Se falhar, verifique se o caminho em `android/gradle.properties` corresponde à sua instalação.
*   **Caracteres Especiais no Caminho**: O projeto está configurado para ignorar verificações de caminho (`android.overridePathCheck=true`), permitindo pastas de usuário com acentos (ex: "Padrão").

---

## 7. Deploy (Web)

Para colocar o site no ar (Vercel, Netlify, etc.):

1.  Execute o build de produção:
    ```bash
    npm run build
    ```
2.  Faça o upload da pasta `dist/` gerada para o seu provedor de hospedagem.