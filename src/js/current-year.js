/**
 * Atualiza o ano do rodapé ("© 2026 ...") com o ano atual.
 * O HTML já vem com o ano em que o site foi publicado; aqui garantimos
 * que ele continua certo nos anos seguintes, sem precisar publicar de novo.
 */
export function initCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = year;
  });
}
