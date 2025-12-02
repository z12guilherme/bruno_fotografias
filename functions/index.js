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
 * Cloud Function para criar um novo usuário cliente e seu álbum no Firestore.
 * Esta função é chamada pelo painel de administração.
 */
exports.createAlbum = functions.region('southamerica-east1').https.onRequest((request, response) => {
  // 1. Primeiro, deixe o corsHandler processar a requisição.
  // Ele vai responder automaticamente às requisições OPTIONS e passar para o próximo passo.
  corsHandler(request, response, async () => {
    try {
      // LOG INICIAL: Vamos verificar cabeçalhos e corpo da requisição assim que a função for chamada.
      console.log("Execução iniciada. Cabeçalhos:", JSON.stringify(request.headers));
      console.log("Corpo da requisição:", JSON.stringify(request.body));

      // 2. Verificamos o método.
      if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
      }

      // 3. Extrai e verifica o token de autenticação.
      // O frontend deve enviar o ID Token do admin no cabeçalho Authorization.
      const idToken = request.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        console.error("Erro de autenticação: ID Token não encontrado no cabeçalho 'Authorization'.");
        return response.status(401).send({ error: "A requisição deve ser feita por um usuário autenticado." });
      }
      // Verificamos se o token pertence a um usuário válido (poderia adicionar uma verificação de admin aqui)
      await admin.auth().verifyIdToken(idToken);

      const { clientName, clientEmail, clientPassword, photoUrls } = request.body;

      // Validação mais robusta
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

      // 2. Cria um novo usuário para o cliente no Firebase Authentication.
      const clientUser = await admin.auth().createUser({
        email: clientEmail,
        password: clientPassword,
        displayName: clientName,
      });

      const clientId = clientUser.uid;

      // 3. Salva os dados do álbum no Firestore, usando o UID do cliente como ID do documento.
      await firestore.collection("clients").doc(clientId).set({
        name: clientName,
        email: clientEmail,
        photos: photoUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return response.status(200).send({ success: true, message: "Álbum criado com sucesso!", clientId: clientId });

    } catch (error) {
      console.error("Erro ao criar álbum:", error);

      // Erro específico para e-mail já existente
      if (error.code === "auth/email-already-exists") {
        return response.status(409).send({ error: "Este e-mail já está em uso por outro cliente." });
      }

      // Erro para token de autenticação inválido, expirado ou malformado
      if (error.code?.startsWith('auth/id-token-')) {
        return response.status(401).send({ error: "Token de autenticação inválido ou expirado." });
      }

      // Erro genérico para qualquer outro problema
      return response.status(500).send({ error: "Ocorreu um erro interno ao criar o álbum.", details: error.message });
    }
  });
});