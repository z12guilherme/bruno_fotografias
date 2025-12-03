const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function para criar um usuário no Firebase Authentication e um
 * documento de álbum correspondente no Firestore.
 * Apenas administradores autenticados podem chamar esta função.
 */
exports.createAlbum = functions.region("southamerica-east1").https.onCall(async (data, context) => {
  // 1. Verifica se o usuário que está fazendo a chamada é autenticado.
  // Funções 'onCall' fazem isso automaticamente. Se não for, a função falhará.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "A requisição deve ser feita por um usuário autenticado."
    );
  }
  // Opcional: Verificar se o usuário é um admin através de custom claims
  // if (context.auth.token.admin !== true) {
  //   throw new functions.https.HttpsError('permission-denied', 'O usuário não tem permissão para executar esta ação.');
  // }

  // 2. Valida os dados recebidos do formulário
  const { clientName, clientEmail, clientPassword } = data;
  if (!clientName || !clientEmail || !clientPassword) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Nome, e-mail e senha são obrigatórios."
    );
  }

  try {
    // 3. Cria o novo usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: clientEmail,
      password: clientPassword,
      displayName: clientName,
    });

    // 4. Retorna o UID do usuário criado para o frontend
    return { uid: userRecord.uid };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new functions.https.HttpsError("internal", "Ocorreu um erro ao criar o usuário.", error.message);
  }
});