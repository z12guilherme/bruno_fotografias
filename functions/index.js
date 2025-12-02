const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = admin.firestore();

/**
 * Cloud Function para criar um novo usuário cliente e seu álbum no Firestore.
 * Esta função é chamada pelo painel de administração.
 */
exports.createAlbum = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  // 1. Verifica se o usuário que está chamando a função é um administrador autenticado.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "A requisição deve ser feita por um usuário autenticado."
    );
  }

  const { clientName, clientEmail, clientPassword, photoUrls } = data;

  if (!clientName || !clientEmail || !clientPassword || !photoUrls) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Todos os campos (clientName, clientEmail, clientPassword, photoUrls) são obrigatórios."
    );
  }

  try {
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

    return {
      success: true,
      message: "Álbum criado com sucesso!",
      clientId: clientId,
    };
  } catch (error) {
    console.error("Erro ao criar álbum:", error);
    // Transforma o erro do Firebase Auth em um erro que o frontend entende.
    if (error.code === "auth/email-already-exists") {
      throw new functions.https.HttpsError(
        "already-exists",
        "Este e-mail já está em uso por outro cliente."
      );
    }
    throw new functions.https.HttpsError(
      "internal",
      "Ocorreu um erro interno ao criar o álbum.",
      error.message
    );
  }
});