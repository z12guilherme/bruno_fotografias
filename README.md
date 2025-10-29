# Bruno Nascimento - Portfólio de Fotografia

Este é o repositório do site de portfólio de fotografia de Bruno Nascimento. Um site moderno e elegante, construído com as tecnologias mais recentes para garantir uma experiência de usuário rápida e agradável.

## ✨ Tecnologias Utilizadas

O projeto foi construído utilizando um stack moderno de desenvolvimento web:

-   **[Vite](https://vitejs.dev/)**: Build tool de última geração que oferece um ambiente de desenvolvimento extremamente rápido.
-   **[React](https://react.dev/)**: Biblioteca JavaScript para construir interfaces de usuário.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utility-first para criar designs customizados rapidamente.
-   **[shadcn/ui](https://ui.shadcn.com/)**: Coleção de componentes de UI reutilizáveis.
-   **[React Router](https://reactrouter.com/)**: Para roteamento e navegação entre as páginas.
-   **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones SVG.

## 🚀 Como Executar o Projeto Localmente

Para executar o projeto em sua máquina local, siga os passos abaixo. Você precisará ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) e o [npm](https://www.npmjs.com/) instalados.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/z12guilherme/bruno_fotografias.git
    cd bruno_fotografias
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

    Após iniciar, o site estará disponível em `http://localhost:8080` (ou outra porta, se a 8080 estiver em uso).

## 📂 Estrutura do Projeto

A estrutura de pastas principal do projeto é a seguinte:

```
bruno_fotografias/
├── public/             # Arquivos estáticos que não são processados pelo build
├── src/
│   ├── assets/         # Imagens, fontes e outros recursos
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── ui/         # Componentes base do shadcn/ui
│   │   ├── AboutPage.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── App.tsx         # Componente principal com as rotas
│   ├── index.css       # Estilos globais e configuração do Tailwind
│   └── main.tsx        # Ponto de entrada da aplicação
├── tailwind.config.js  # Configuração do Tailwind CSS
└── vite.config.ts      # Configuração do Vite
```

## ✏️ Como Customizar

### Alterar Imagens do Portfólio

-   **Imagens das categorias (Página Inicial e Portfólio):**
    -   As imagens e títulos das categorias podem ser alterados nos arquivos `src/components/HomePage.tsx` e `src/components/PortfolioCategoriesPage.tsx`.

-   **Imagens da galeria de cada categoria:**
    -   As fotos de cada categoria (casamentos, família, etc.) estão definidas no arquivo `src/components/PortfolioCategoryDetail.tsx`, dentro da função `getCategoryImages`. Substitua as URLs de placeholder pelas suas próprias imagens.

### Alterar Textos

-   **Sobre Mim:** Edite o conteúdo no arquivo `src/components/AboutPage.tsx`.
-   **Contato:** As informações de contato podem ser alteradas em `src/components/Contact.tsx`.
-   **Rodapé:** Altere os links e informações em `src/components/Footer.tsx`.

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Reload.
-   `npm run build`: Gera a versão de produção do site na pasta `dist/`.
-   `npm run preview`: Inicia um servidor local para visualizar a versão de produção.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Isso significa que você tem a liberdade de usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do software, desde que o aviso de copyright e esta permissão sejam incluídos em todas as cópias ou partes substanciais do software.

Para mais detalhes, veja o arquivo [LICENSE](LICENSE).
