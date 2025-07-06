const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

/**
 * Pool de conexões para o banco de dados MySQL.
 * @constant {Object}
 */
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0102',
  database: 'curso',
});

/**
 * Middleware para interpretar dados de formulários urlencoded.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Configuração do middleware de sessão.
 */
app.use(session({
  secret: 'segredo_supersecreto',
  resave: false,
  saveUninitialized: false,
}));

/**
 * Serve arquivos estáticos da pasta "public".
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Middleware de autenticação que protege rotas.
 * Redireciona para a página de login caso não esteja autenticado.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 * @param {Function} next - Função para passar ao próximo middleware.
 */
function autenticar(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

/**
 * Endpoint para retornar o usuário logado via API.
 */
app.get('/api/usuario', autenticar, (req, res) => {
  res.json({ usuario: req.session.usuario });
});

/**
 * Rota para realizar login.
 * Recebe usuário e senha, verifica no banco e cria sessão.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const [linhas] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (linhas.length === 0) {
      return res.status(401).send('Usuário não encontrado!');
    }

    const usuarioEncontrado = linhas[0];
    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

    if (senhaCorreta) {
      req.session.usuario = usuarioEncontrado.usuario;
      res.redirect('/conteudo');
    } else {
      res.status(401).send('Senha incorreta!');
    }
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    res.status(500).send('Erro interno no servidor');
  }
});

/**
 * Rota para exibir a página de conteúdo protegida.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
app.get('/conteudo', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'conteudo.html'));
});

/**
 * Rota para exibir a página de login.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

/**
 * Inicia o servidor HTTP na porta 3000.
 */
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000/login');
  });
}

module.exports = { app };

