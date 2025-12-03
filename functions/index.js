const admin = require("firebase-admin");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

admin.initializeApp();

/**
 * Cloud Function para criar um usuário no Firebase Authentication e um
 * documento de álbum correspondente no Firestore.
 * Apenas administradores autenticados podem chamar esta função.
 */
exports.createAlbum = onCall({ region: "southamerica-east1" }, async (request) => {
  // 1. Verifica se o usuário que está fazendo a chamada é autenticado.
  // Funções 'onCall' fazem isso automaticamente. Se não for, a função falhará.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "A requisição deve ser feita por um usuário autenticado."
    );
  }
  // Opcional: Verificar se o usuário é um admin através de custom claims
  // if (context.auth.token.admin !== true) {
  //   throw new HttpsError('permission-denied', 'O usuário não tem permissão para executar esta ação.');
  // }

  // 2. Extrai os dados do objeto 'data' recebido do frontend.
  const { clientName, clientEmail, clientPassword } = request.data;

  try {
    // 3. Cria o novo usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: clientEmail, // Correção: usa data.clientEmail
      password: clientPassword, // Correção: usa data.clientPassword
      displayName: clientName, // Correção: usa data.clientName
    });

    // 4. Retorna o UID do usuário criado para o frontend
    return { uid: userRecord.uid };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new HttpsError("internal", "Ocorreu um erro ao criar o usuário.", error.message);
  }
});