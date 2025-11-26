const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Em CommonJS, __dirname já existe e aponta para o diretório atual
const dbPath = path.resolve(__dirname, 'main.db');

// Conecta ao arquivo do banco de dados SQLite. O arquivo será criado se não existir.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    initializeDatabase();
  }
});

// Função para criar as tabelas se elas não existirem
const initializeDatabase = () => {
  const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `;

  const createAdminsTable = `
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const createPhotosTable = `
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
    );
  `;

  // db.serialize garante que os comandos sejam executados em ordem
  db.serialize(() => {
    db.run(createClientsTable, (err) => {
      if (err) console.error('Erro ao criar tabela de clientes:', err.message);
    });

    db.run(createAdminsTable, (err) => {
      if (err) {
        console.error('Erro ao criar tabela de administradores:', err.message);
        return;
      }
      // Após criar a tabela, verifica se ela está vazia para adicionar o admin padrão
      const checkAdminSql = `SELECT COUNT(id) as count FROM admins`;
      db.get(checkAdminSql, async (err, row) => {
        if (err) return;
        if (row.count === 0) {
          console.log('Nenhum administrador encontrado. Criando usuário "marcos" padrão...');
          const adminPassword = 'Mg156810$';
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          const insertAdminSql = `INSERT INTO admins (username, password) VALUES (?, ?)`;
          db.run(insertAdminSql, ['marcos', hashedPassword]);
        }
      });
    });

    db.run(createPhotosTable, (err) => {
      if (err) console.error('Erro ao criar tabela de fotos:', err.message);
    });
  });
};

module.exports = db;