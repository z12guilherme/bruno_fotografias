<div align="center">
  <br />
  <h1><b>Bruno Nascimento Fotografia</b></h1>
  <p>✨ Um portfólio web de luxo para fotógrafos, combinando design elegante e tecnologia de ponta para criar uma vitrine digital inesquecível. ✨</p>
  <br />
</div>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/z12guilherme/bruno_fotografias"/>
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/z12guilherme/bruno_fotografias"/>
</p>

## ✨ Visão Geral
 
Este projeto é uma aplicação **full-stack** que transcende o conceito de um simples site. Ele oferece uma experiência digital completa: uma vitrine pública para exibir seu trabalho, uma área de cliente exclusiva para entrega de galerias privadas e um painel de controle intuitivo para gerenciamento total do conteúdo.

## 🎥 Vídeo de Apresentação

Confira o vídeo de apresentação do sistema: [Assistir no YouTube](https://www.youtube.com/watch?v=lI_d72VdcoY)

> **Nota:** Este repositório pode servir como um template completo e robusto para outros fotógrafos ou profissionais criativos que desejam ter uma presença online profissional e autogerenciável.

## 🚀 Funcionalidades Principais

*   🎨 **Galeria de Portfólio**: Exibição de trabalhos com navegação por categorias.
*   👤 **Página "Sobre Mim"**: Espaço com foto e biografia para apresentação do profissional.
*   📧 **Formulário de Contato**: Canal direto para orçamentos e informações.
*   🔐 **Área do Cliente**: Sistema de acesso seguro onde clientes visualizam suas galerias privadas utilizando um código de acesso exclusivo.
*   ⚙️ **Painel Administrativo**: Área restrita para o fotógrafo criar álbuns, gerenciar senhas de acesso e fazer upload de fotos (drag-and-drop).
*   📱 **Design Responsivo**: Experiência de usuário otimizada para desktops, tablets e celulares.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com um stack moderno, separando claramente as responsabilidades entre o frontend e o backend.

### **Frontend**
*   **Framework**: [React](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
*   **Roteamento**: [React Router](https://reactrouter.com/)
*   **Animações**: [Framer Motion](https://www.framer.com/motion/)
*   **Layouts de Galeria**: [React Masonry CSS](https://github.com/paulcollett/react-masonry-css)
*   **Ícones**: [Lucide React](https://lucide.dev/)

### **Backend & Infraestrutura**
*   **BaaS (Backend as a Service)**: [Supabase](https://supabase.com/)
    *   **Banco de Dados**: PostgreSQL
    *   **Autenticação**: Supabase Auth (Gerenciamento de Admin)
    *   **Storage**: Supabase Storage (Hospedagem de imagens)

##  Como Executar o Projeto Localmente

Para executar o projeto completo em sua máquina, siga os passos abaixo. Você precisará ter o Node.js (versão 18 ou superior) e o npm instalados.

### 1. Clonar o Repositório
```bash
git clone https://github.com/z12guilherme/bruno_fotografias.git
cd bruno_fotografias
```

### 2. Configurar o Backend
```bash
# Navegue até a pasta do servidor
cd server

# Instale as dependências do backend
npm install

# (Opcional, mas recomendado) Crie um arquivo .env para suas variáveis de ambiente
# Exemplo: JWT_SECRET=seu_segredo_super_secreto

# Volte para a pasta raiz do projeto
cd ..
```

### 3. Configurar o Frontend
```bash
# Instale as dependências do frontend
npm install
```

### 4. Executar a Aplicação
Para uma melhor experiência de desenvolvimento, inicie o backend e o frontend em terminais separados.

**Terminal 1: Iniciar o Backend**
```bash
# A partir da pasta raiz
cd server
npm start 
# O servidor backend estará rodando em http://localhost:3001 (ou a porta configurada)
```

**Terminal 2: Iniciar o Frontend**
```bash
# A partir da pasta raiz
npm run dev
# O site estará disponível em http://localhost:5173 (ou a porta indicada pelo Vite)
```

## 📄 Licença

Distribuído sob a Licença MIT. Veja o arquivo `LICENSE` para mais informações.
