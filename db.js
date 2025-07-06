/**
 * Pool de conexões para o banco de dados MySQL.
 * Configurado para conectar ao banco 'curso' no host localhost,
 * usando usuário 'root' e senha '0102'.
 */
const mysql = require('mysql2/promise');

const conexao = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0102',
  database: 'curso'
});

module.exports = conexao;
