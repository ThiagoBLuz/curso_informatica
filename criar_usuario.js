const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

/**
 * Cria um novo usuário no banco de dados com senha criptografada.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function criarUsuario() {
  // Cria um pool de conexões com o banco de dados
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0102',
    database: 'curso',
  });

  const usuario = 'juliana';
  const senha = '010203';

  // Gera o hash da senha usando bcrypt
  const hashSenha = await bcrypt.hash(senha, 10);

  try {
    /**
     * Executa o comando SQL para inserir o usuário.
     * A senha armazenada é o hash gerado.
     */
    await pool.execute(
      'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
      [usuario, hashSenha]
    );
    console.log('Usuário criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
  } finally {
    // Encerra o pool de conexões
    await pool.end();
  }
}

// Executa a função de criação de usuário
criarUsuario();
