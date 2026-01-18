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

### Fase 2: Refinamento e Estilo

- [x] **Estilizar a Galeria**: Tornar a `galeria-cliente.html` visualmente incrível. Podemos usar um layout em grid e adicionar um efeito de "lightbox" (quando clica na foto, ela amplia na tela).
- [x] **Melhorar Feedback**: Adicionar mensagens de erro (ex: "Senha incorreta") e sucesso nos formulários.

---

### Fase 3: Migração para Supabase (Backend)

- [ ] **Configurar Supabase Client**: Inicializar o cliente do Supabase no projeto.
- [ ] **Refatorar Autenticação**: Substituir a autenticação atual pelo Supabase Auth.
- [ ] **Refatorar Upload de Arquivos**: Utilizar o Supabase Storage para o gerenciamento de imagens.
- [ ] **Refatorar Banco de Dados**: Migrar a lógica de dados para o PostgreSQL do Supabase.
- [ ] **Próximos Passos (Frontend)**:
    - [ ] Implementar o login do administrador no frontend usando o SDK do Supabase.
    - [ ] Modificar o formulário de criação de álbum (`admin.html`) para permitir o upload de múltiplos arquivos (`<input type="file" multiple>`).
    - [ ] Ajustar o JavaScript do `admin.html` para enviar os arquivos como `FormData` em vez de JSON.
    - [ ] Criar uma página de login para o cliente no frontend que use o Supabase Auth.
    - [ ] Ajustar a página da galeria (`galeria-cliente.html`) para buscar os dados do Supabase após o login do cliente.
