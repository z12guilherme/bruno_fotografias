# Plano de Desenvolvimento - Área do Cliente

Este arquivo descreve os passos para criar a funcionalidade completa da área do cliente, desde o login administrativo até a visualização das galerias pelos clientes.

---

### Fase 1: Estrutura e Interface (Frontend)

O objetivo desta fase é ter todas as telas (páginas HTML) necessárias, mesmo que ainda não tenham funcionalidade.

- [x] **Página de Gestão de Álbuns (`admin.html`)**: Painel para o admin criar novos álbuns e subir fotos.
- [x] **Página de Login do Cliente (`cliente-login.html`)**: Formulário para o cliente inserir sua senha de acesso.
- [x] **Página de Login do Administrador (`admin-login.html`)**: Uma página de login segura para que apenas você possa acessar o painel `admin.html`.
- [x] **Página de Visualização da Galeria (`galeria-cliente.html`)**: Uma página modelo, bonita e funcional, para exibir as fotos de um cliente específico.
- [x] **Adicionar Link na `index.html`**: Colocar um link "Área do Cliente" no menu ou rodapé da página principal para direcionar ao `cliente-login.html`.

---

### Fase 2: Lógica de Simulação (Backend Falso com JavaScript)

Nesta fase, vamos simular o comportamento do servidor e do banco de dados usando apenas JavaScript no navegador. **Isso é apenas para testes e não é seguro para produção.**

- [x] **Criar "Banco de Dados" Falso**: Criar um arquivo `database.js` que conterá um objeto JavaScript com os dados dos clientes (nome, senha, lista de fotos).
- [x] **Script de Login do Admin**: Em `admin-login.html`, criar um script que verifica se a senha digitada é a senha mestra definida no `database.js` e redireciona para `admin.html` em caso de sucesso.
- [x] **Script de Criação de Álbuns**: Em `admin.html`, fazer o formulário "salvar" um novo cliente e suas fotos no nosso banco de dados falso.
- [x] **Script de Login do Cliente**: Em `cliente-login.html`, o script irá verificar a senha digitada contra as senhas no `database.js`. Se encontrar, redireciona para a `galeria-cliente.html` passando alguma identificação do cliente (ex: `galeria-cliente.html?cliente=joao_silva`).
- [x] **Script de Exibição da Galeria**: Em `galeria-cliente.html`, o script irá ler qual cliente foi passado na URL, buscar suas fotos no `database.js` e exibi-las dinamicamente na página.

---

### Fase 3: Refinamento e Estilo

- [x] **Estilizar a Galeria**: Tornar a `galeria-cliente.html` visualmente incrível. Podemos usar um layout em grid e adicionar um efeito de "lightbox" (quando clica na foto, ela amplia na tela).
- [x] **Melhorar Feedback**: Adicionar mensagens de erro (ex: "Senha incorreta") e sucesso nos formulários.

---

### Fase 4: Backend com Node.js (Rumo à Produção)

- [x] **Escolher Tecnologia de Backend**: Node.js com o framework Express.js.
- [x] **Configurar Ambiente Node.js**: Criar o diretório `server/` e o arquivo `server.js` com Express.
- [x] **Integrar Banco de Dados**: Configurar um banco de dados simples (SQLite) para armazenar os dados dos clientes.
- [ ] **Criar Rotas da API (Endpoints)**:
    - [x] `POST /api/admin/login`: Para autenticar o administrador.
    - [ ] `POST /api/clients/login`: Para autenticar o cliente.
    - [ ] `GET /api/galleries/:clientId`: Para buscar as fotos de um cliente (rota protegida).
    - [ ] `POST /api/clients`: Para criar um novo cliente/álbum (rota protegida).
- [x] **Implementar Upload de Arquivos**: Usar uma biblioteca como `multer` para fazer o upload das fotos para uma pasta no servidor.
- [x] **Segurança**: Implementar hashing de senhas com `bcrypt` e autenticação com JWT (JSON Web Tokens) para proteger as rotas.
- [x] **Conectar Frontend ao Backend**: Modificar os arquivos HTML para fazer requisições (`fetch`) para a nossa nova API em vez de usar o `database.js`.
- [x] **Criar Página de Gerenciamento de Álbum**: `gerenciar-album.html` para adicionar/deletar fotos de um álbum específico.
- [x] **Corrigir Bugs**: JWT_SECRET ausente, estrutura de dados de fotos incorreta para deleção.
