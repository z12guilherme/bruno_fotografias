const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const firestore = admin.firestore();

// Crie um manipulador de CORS. Para desenvolvimento, permita o localhost.
// Em produção, você deve adicionar a URL do seu site.
const allowedOrigins = [
  'http://localhost:5173', // Para desenvolvimento local
  'https://brunonascimento-fotografia.web.app', // URL padrão do Firebase Hosting
  'https://brunonascimento-fotografia.firebaseapp.com' // URL alternativa do Firebase
  // Adicione aqui seu domínio personalizado se tiver um, ex: 'https://www.seusite.com'
];

const corsHandler = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pela política de CORS'));
    }
  },
  methods: ["POST"]
});

/**
 * (FUNÇÃO UTILITÁRIA - EXECUTAR APENAS UMA VEZ)
 * Adiciona a claim de administrador a um usuário específico.
 * Após o deploy, acesse a URL desta função no navegador para executar.
 * Depois de executar com sucesso, você pode remover este código.
 */
exports.addAdminRole = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
  // !!! SUBSTITUA PELO SEU EMAIL DE ADMIN !!!
  const email = "mguimarcos39@gmail.com";
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return res.send(`Sucesso! O usuário ${email} agora é um administrador.`);
  } catch (error) {
    console.error("Erro ao adicionar claim de admin:", error);
    return res.status(500).send({ error: "Erro ao adicionar claim de admin.", details: error.message });
  }
});

/**
 * Cloud Function para criar um novo usuário cliente e seu álbum no Firestore.
 * Esta função é chamada pelo painel de administração.
 */
exports.createAlbum = functions.region('southamerica-east1').https.onRequest((request, response) => {
  // 1. Primeiro, deixe o corsHandler processar a requisição.
  // Ele vai responder automaticamente às requisições OPTIONS e passar para o próximo passo.
  corsHandler(request, response, async () => {
    try {
      // Etapa 1: Logs de Depuração
      console.log("Execução iniciada. Cabeçalhos:", JSON.stringify(request.headers));
      console.log("Corpo da requisição:", JSON.stringify(request.body));

      // Etapa 2: Validação do Método HTTP
      if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
      }

      // Etapa 3: Verificação de Autenticação e Autorização
      const idToken = request.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        console.error("Erro de autenticação: ID Token não encontrado no cabeçalho 'Authorization'.");
        return response.status(401).send({ error: "A requisição deve ser feita por um usuário autenticado." });
      }

      // Verifica se o token é válido e se o usuário tem a claim de admin
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.admin !== true) {
        console.error(`Acesso negado. Usuário ${decodedToken.email} não é um administrador.`);
        return response.status(403).send({ error: "Acesso negado. Permissão de administrador necessária." });
      }

      // Log de sucesso na autorização
      console.log(`Requisição autorizada para o admin: ${decodedToken.email}`);

      const { clientName, clientEmail, clientPassword, photoUrls } = request.body;
      
      // Etapa 4: Validação dos Dados do Formulário
      if (!clientName || !clientEmail || !clientPassword || !Array.isArray(photoUrls) || photoUrls.length === 0) {
        // Log aprimorado para depuração
        const missingFields = [
          !clientName && "clientName",
          !clientEmail && "clientEmail",
          !clientPassword && "clientPassword",
          (!Array.isArray(photoUrls) || photoUrls.length === 0) && "photoUrls (deve ser um array com pelo menos uma foto)",
        ].filter(Boolean).join(', ');
        console.error(`Validação falhou. Campos ausentes: [${missingFields}]`);
        return response.status(400).send({ error: `Campos obrigatórios ausentes: ${missingFields}` });
      }

      // Etapa 5: Criação do Usuário Cliente
      const clientUser = await admin.auth().createUser({
        email: clientEmail,
        password: clientPassword,
        displayName: clientName,
      });

      const clientId = clientUser.uid;

      // Etapa 6: Criação do Documento no Firestore
      await firestore.collection("clients").doc(clientId).set({
        name: clientName,
        email: clientEmail,
        photos: photoUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Etapa 7: Resposta de Sucesso
      return response.status(200).send({ success: true, message: "Álbum criado com sucesso!", clientId: clientId });

    } catch (error) {
      console.error("Erro ao criar álbum:", error);

      // Erro específico para e-mail já existente
      if (error.code === "auth/email-already-exists") {
        return response.status(409).send({ error: "Este e-mail já está em uso por outro cliente." });
      }

      // Erro para token de autenticação inválido, expirado ou malformado
      if (error.code?.startsWith('auth/id-token-')) {
        console.error("Erro de verificação de token:", error.message);
        return response.status(401).send({ error: "Token de autenticação inválido ou expirado." });
      }

      // Erro genérico para qualquer outro problema
      return response.status(500).send({ error: "Ocorreu um erro interno ao criar o álbum.", details: error.message });
    }
  });
});