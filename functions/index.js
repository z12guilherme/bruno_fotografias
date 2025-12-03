const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function para criar um usuário no Firebase Authentication e um
 * documento de álbum correspondente no Firestore.
 * Apenas administradores autenticados podem chamar esta função.
 */
exports.createAlbumAndUser = functions
  .region("southamerica-east1") // Garante que a função está na mesma região
  .https.onRequest((req, res) => {
    // Habilita o CORS para permitir chamadas do seu site
    cors(req, res, async () => {
      // As funções onRequest não validam o token automaticamente, faremos isso manualmente.
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "Unauthorized: No token provided." });
      }

      try {
        // 1. Verifica se o token pertence a um administrador válido
        // Aqui, estamos assumindo que qualquer usuário logado no admin é um admin.
        // Para maior segurança, você poderia adicionar 'custom claims'.
        await admin.auth().verifyIdToken(idToken);

        // 2. Valida os dados recebidos do formulário
        const { clientName, clientEmail, clientPassword, driveLink } = req.body;
        if (!clientName || !clientEmail || !clientPassword || !driveLink) {
          return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        // 3. Cria o novo usuário no Firebase Authentication
        const userRecord = await admin.auth().createUser({
          email: clientEmail,
          password: clientPassword,
          displayName: clientName,
        });

        // 4. Cria o documento do álbum no Firestore, usando o UID do usuário como ID
        await db.collection("clients").doc(userRecord.uid).set({
          name: clientName,
          email: clientEmail,
          driveLink: driveLink,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(201).json({
          message: `Usuário e álbum para ${clientName} criados com sucesso!`,
        });

      } catch (error) {
        console.error("Erro ao criar usuário e álbum:", error);

        // Retorna mensagens de erro mais amigáveis
        if (error.code === "auth/email-already-exists") {
          return res.status(409).json({ error: "O e-mail fornecido já está em uso." });
        }
        if (error.code === "auth/invalid-password") {
          return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." });
        }
        if (error.code === "auth/argument-error") {
            return res.status(401).json({ error: "Unauthorized: Invalid token." });
        }

        return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
      }
    });
  });