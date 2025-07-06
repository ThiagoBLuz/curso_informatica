/**
 * Inicializa o controle do formulário de login.
 * Adiciona evento para submissão que autentica usuário via fetch POST.
 *
 * @async
 * @function inicializarLogin
 */
export async function inicializarLogin() {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('form-login');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /** @type {string} */
    const usuario = document.getElementById('usuario').value;

    /** @type {string} */
    const senha = document.getElementById('senha').value;

    try {
      /** @type {Response} */
      const resposta = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
      });

      /** @type {string} */
      const texto = await resposta.text();

      if (resposta.redirected) {
        window.location.href = resposta.url;
      } else {
        document.getElementById('mensagem').textContent = texto;
      }
    } catch (erro) {
      console.error('Erro no login:', erro);
      document.getElementById('mensagem').textContent = 'Erro no servidor. Tente novamente.';
    }
  });
}
