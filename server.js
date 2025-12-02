// =================================================================
// SERVIDOR BACKEND - NODE.JS + EXPRESS
// =================================================================
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// --- Configuração do Firebase Admin ---
const admin = require("firebase-admin");

// Lê as credenciais da variável de ambiente em produção (Vercel) ou do arquivo local em desenvolvimento
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  : require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "brunonascimento-fotografia.appspot.com",
});

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

// O Multer agora salvará em memória, pois os arquivos irão para o Firebase Storage
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = 8080; // Porta que nosso servidor vai usar

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Permite requisições apenas do seu frontend Vite
  })
);
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('Servidor do Bruno Fotografias está no ar!');
});

// --- Middleware de Autenticação ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Se não há token, não autorizado

  // Agora, vamos verificar o token com o Firebase Admin
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken; // O token decodificado contém infos do usuário (uid, email, etc)
      next(); // Passa para a próxima função (a rota em si)
    })
    .catch(() => {
      res.sendStatus(403); // Se o token não for válido, acesso proibido
    });
};

// --- ROTAS DA API ---

// Rota para registrar um novo administrador
app.post('/api/admin/register', async (req, res) => {
  // ROTA REMOVIDA: O usuário administrador deve ser criado diretamente no painel do Firebase por segurança.
  res.status(403).json({ message: 'A criação de administradores não é permitida via API.' });
});

// Rota para login do administrador
app.post('/api/admin/login', (req, res) => {
  // ROTA REMOVIDA: O login agora é feito no frontend com o SDK do Firebase,
  // que retorna um token a ser usado nas rotas protegidas.
  res.status(501).json({ message: 'Rota de login obsoleta. O login é feito no frontend.' });
});

// Rota para criar um novo cliente e fazer upload das fotos
app.post('/api/clients', authenticateToken, upload.array('photos'), async (req, res) => {
  const { clientName, clientPassword } = req.body;
  const files = req.files;
  
  if (!clientName || !clientPassword || !files || files.length === 0) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // 1. Criar um usuário para o cliente no Firebase Auth
    const clientUser = await admin.auth().createUser({
      email: `${clientName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}@brunofotografias.com`,
      password: clientPassword,
      displayName: clientName,
    });

    const clientId = clientUser.uid;

    // 2. Fazer upload das fotos para o Firebase Storage
    const uploadPromises = files.map(file => {
      const fileName = `galleries/${clientId}/${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      return new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        blobStream.on('error', reject);

        blobStream.on('finish', () => {
          // Torna o arquivo público e retorna a URL
          fileUpload.makePublic().then(() => {
            resolve(fileUpload.publicUrl());
          });
        });

        blobStream.end(file.buffer);
      });
    });

    const photoUrls = await Promise.all(uploadPromises);

    // 3. Salvar os dados no Firestore
    await firestore.collection('clients').doc(clientId).set({
      name: clientName,
      photos: photoUrls,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Álbum criado com sucesso!', clientId });

  } catch (error) {
    console.error("Erro ao criar álbum:", error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
});

// Rota para login do cliente
app.post('/api/clients/login', (req, res) => {
  // Esta rota se torna obsoleta. O login do cliente deve ser feito no frontend
  // usando o SDK do Firebase para obter um token.
  res.status(501).json({ message: 'Rota de login não é mais necessária. O login é feito no frontend.' });
});

// Rota para buscar uma galeria específica
app.get('/api/galleries/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientDoc = await firestore.collection('clients').doc(clientId).get();

    if (!clientDoc.exists) {
      return res.status(404).json({ message: 'Galeria não encontrada.' });
    }

    const clientData = clientDoc.data();
    const gallery = {
      clientName: clientData.name,
      photos: clientData.photos.map((url, index) => ({ photoId: `${clientId}-${index}`, url })),
    };

    res.json(gallery);
  } catch (error) {
    console.error("Erro ao buscar galeria:", error);
    res.status(500).json({ message: 'Erro ao buscar galeria.' });
  }
});

// Rota para buscar todos os clientes
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const snapshot = await firestore.collection('clients').orderBy('createdAt', 'desc').get();
    const clients = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      photoCount: doc.data().photos.length,
    }));
    res.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: 'Erro ao buscar clientes.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});