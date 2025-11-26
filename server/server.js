// =================================================================
// SERVIDOR BACKEND - NODE.JS + EXPRESS
// =================================================================
const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// --- Configuração do Upload (Multer) ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const app = express();
const PORT = 8080; // Porta que nosso servidor vai usar

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173', // Permite requisições apenas do seu frontend Vite
  })
);
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON
// Corrigido: Usando um caminho absoluto para servir os arquivos estáticos de forma mais robusta.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('Servidor do Bruno Fotografias está no ar!');
});

// --- Middleware de Autenticação ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Se não há token, não autorizado

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Se o token não for válido, acesso proibido
    req.user = user;
    next(); // Passa para a próxima função (a rota em si)
  });
};

// --- ROTAS DA API ---

// Rota para registrar um novo administrador
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO admins (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar administrador. O usuário pode já existir.' });
      }
      res.status(201).json({ message: 'Administrador registrado com sucesso!', adminId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota para login do administrador
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM admins WHERE username = ?`;

  db.get(sql, [username], async (err, admin) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (!admin) return res.status(401).json({ message: 'Usuário ou senha inválidos.' });

    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      const accessToken = jwt.sign({ username: admin.username, id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, accessToken });
    } else {
      res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }
  });
});

// Rota para criar um novo cliente e fazer upload das fotos
app.post('/api/clients', authenticateToken, upload.array('photos'), async (req, res) => {
  const { clientName, clientPassword } = req.body;
  const files = req.files;

  if (!clientName || !clientPassword || !files || files.length === 0) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Criptografa a senha antes de salvar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clientPassword, saltRounds);

    // Insere o novo cliente no banco de dados
    const clientSql = `INSERT INTO clients (name, password) VALUES (?, ?)`;
    db.run(clientSql, [clientName, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar cliente.', error: err.message });
      }

      const clientId = this.lastID; // Pega o ID do cliente recém-criado
      const photoSql = `INSERT INTO photos (client_id, url) VALUES (?, ?)`;
      const photoStmt = db.prepare(photoSql);

      files.forEach((file) => {
        const photoUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
        photoStmt.run(clientId, photoUrl);
      });

      photoStmt.finalize((err) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao salvar fotos.', error: err.message });
        }
        res.status(201).json({ message: 'Álbum criado com sucesso!', clientId });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
});

// Rota para login do cliente
app.post('/api/clients/login', (req, res) => {
  const { password } = req.body;
  // NOTA: Esta abordagem de buscar por senha é insegura e ineficiente.
  // O ideal seria um login com 'nome de usuário' e senha.
  // Mantido assim para seguir o design inicial do frontend.
  const sql = `SELECT * FROM clients`;
  db.all(sql, [], async (err, clients) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });

    for (const client of clients) {
      const match = await bcrypt.compare(password, client.password);
      if (match) {
        return res.json({ success: true, clientId: client.id });
      }
    }

    return res.status(401).json({ success: false, message: 'Senha de acesso incorreta.' });
  });
});

// Rota para buscar uma galeria específica
app.get('/api/galleries/:clientId', (req, res) => {
  const { clientId } = req.params;
  const sql = `SELECT c.name as clientName, p.id as photoId, p.url FROM clients c LEFT JOIN photos p ON c.id = p.client_id WHERE c.id = ?`;
  db.all(sql, [clientId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar galeria.' });
    if (rows.length === 0) return res.status(404).json({ message: 'Galeria não encontrada.' });

    const gallery = {
      clientName: rows[0].clientName,
      // Corrigido: Retorna um objeto com photoId e url, e trata o caso de não haver fotos.
      photos: rows[0].photoId ? rows.map((r) => ({ photoId: r.photoId, url: r.url })) : [],
    };
    res.json(gallery);
  });
});

// Rota para adicionar mais fotos a uma galeria existente
app.post('/api/galleries/:clientId/add-photos', authenticateToken, upload.array('photos'), (req, res) => {
  const { clientId } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Nenhuma foto foi enviada.' });
  }

  const photoSql = `INSERT INTO photos (client_id, url) VALUES (?, ?)`;
  const photoStmt = db.prepare(photoSql);

  files.forEach((file) => {
    const photoUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
    photoStmt.run(clientId, photoUrl);
  });

  photoStmt.finalize((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao salvar fotos.', error: err.message });
    }
    res.status(201).json({ message: 'Fotos adicionadas com sucesso!' });
  });
});

// Rota para deletar uma foto específica
app.delete('/api/photos/:photoId', authenticateToken, (req, res) => {
  const { photoId } = req.params;

  // Primeiro, busca a URL para deletar o arquivo
  db.get(`SELECT url FROM photos WHERE id = ?`, [photoId], (err, photo) => {
    if (err || !photo) return res.status(404).json({ message: 'Foto não encontrada.' });

    // Deleta do banco de dados
    db.run(`DELETE FROM photos WHERE id = ?`, [photoId], function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao deletar foto do banco de dados.' });

      // Deleta o arquivo físico
      const filename = path.basename(photo.url);
      fs.unlink(path.join(uploadDir, filename), () => {}); // Ignora erro se o arquivo não existir
      res.json({ message: 'Foto deletada com sucesso.' });
    });
  });
});

// Rota para deletar um cliente e suas fotos
app.delete('/api/clients/:clientId', authenticateToken, (req, res) => {
  const { clientId } = req.params;

  // Primeiro, buscar as URLs das fotos para poder deletar os arquivos
  const findPhotosSql = `SELECT url FROM photos WHERE client_id = ?`;
  db.all(findPhotosSql, [clientId], (err, photos) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao encontrar fotos para deletar.', error: err.message });
    }

    // Deletar o cliente do banco de dados (o ON DELETE CASCADE cuidará dos registros na tabela 'photos')
    const deleteClientSql = `DELETE FROM clients WHERE id = ?`;
    db.run(deleteClientSql, [clientId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao deletar cliente.', error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Deletar os arquivos físicos do servidor
      photos.forEach(photo => {
        try {
          const filename = path.basename(photo.url);
          const filePath = path.join(__dirname, uploadDir, filename);
          // Corrigido: Usando fs.unlink para não bloquear e ignorar erro se o arquivo não existir.
          fs.unlink(filePath, (err) => { if (err) console.error(`Não foi possível deletar o arquivo: ${filePath}`, err); });
        } catch (fileErr) {
          console.error(`Erro ao deletar o arquivo ${photo.url}:`, fileErr);
        }
      });

      res.json({ message: 'Cliente e suas fotos foram deletados com sucesso.' });
    });
  });
});

// Rota para buscar todos os clientes
app.get('/api/clients', authenticateToken, (req, res) => {
  const sql = `
    SELECT c.id, c.name, COUNT(p.id) AS photoCount
    FROM clients c
    LEFT JOIN photos p ON c.id = p.client_id
    GROUP BY c.id, c.name
    ORDER BY c.name ASC`;
  db.all(sql, [], (err, clients) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar clientes.', error: err.message });
    }
    res.json(clients);
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});