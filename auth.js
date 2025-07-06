
const db = require('./db');

async function buscarUsuarioPorLogin(usuario) {
  const [linhas] = await db.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
  return linhas[0];
}

module.exports = { buscarUsuarioPorLogin };
