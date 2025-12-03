const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = admin.firestore();

/**
 * Cloud Function para criar um novo usuário cliente e seu álbum no Firestore.
 * Esta função é chamada pelo painel de administração.
 */
exports.createAlbum = onCall({ region: 'southamerica-east1' }, async (request) => {
  // 1. Verifica se o usuário que está chamando a função é um administrador autenticado.
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "A requisição deve ser feita por um usuário administrador."
    );
  }

  const { clientName, clientEmail, clientPassword, photoUrls } = request.data;

  if (!clientName || !clientEmail || !clientPassword || !photoUrls) {
    throw new HttpsError(
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
      throw new HttpsError(
        "already-exists",
        "Este e-mail já está em uso por outro cliente."
      );
    }
    throw new HttpsError(
      "internal",
      "Ocorreu um erro interno ao criar o álbum.",
      error.message
    );
  }
});

/**
 * Cloud Function para atribuir a um usuário a permissão de administrador.
 * Apenas outro administrador pode chamar esta função.
 */
exports.addAdminRole = onCall({ region: 'southamerica-east1' }, async (request) => {
  // 1. Verifica se o usuário que está chamando a função já é um administrador.
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "Apenas administradores podem adicionar outros administradores."
    );
  }

  const { email } = request.data;
  if (!email) {
    throw new HttpsError(
      "invalid-argument",
      "O campo 'email' é obrigatório."
    );
  }

  try {
    // 2. Busca o usuário pelo e-mail e define a custom claim 'admin'.
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    return {
      success: true,
      message: `Sucesso! ${email} agora é um administrador.`,
    };
  } catch (error) {
    console.error("Erro ao adicionar permissão de admin:", error);
    throw new HttpsError("internal", "Ocorreu um erro ao atribuir a permissão de administrador.", error.message);
  }
});