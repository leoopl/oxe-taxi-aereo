/**
 * Menu do celular (botão ☰).
 *
 * O menu é um <dialog>. Com .showModal() o navegador já:
 *  - fecha com a tecla Esc;
 *  - mantém o foco do teclado dentro do menu;
 *  - devolve o foco para o botão ☰ ao fechar.
 *
 * Aqui só ligamos os botões e fechamos o menu quando o usuário escolhe um link.
 */

// Acima desta largura o menu normal aparece e o ☰ some (igual ao CSS).
const DESKTOP_QUERY = '(min-width: 901px)';

export function initMobileMenu() {
  const menu = document.querySelector('[data-mobile-menu]');
  const openButtons = document.querySelectorAll('[data-menu-open]');
  if (!menu) return;

  // Informa aos leitores de tela se o menu está aberto ou fechado.
  function setExpanded(isOpen) {
    openButtons.forEach((button) => button.setAttribute('aria-expanded', String(isOpen)));
  }

  function openMenu() {
    menu.showModal();
    setExpanded(true);
  }

  function closeMenu() {
    if (menu.open) menu.close();
  }

  openButtons.forEach((button) => button.addEventListener('click', openMenu));

  // O evento "close" dispara de qualquer jeito que o menu feche (Esc, link, botão X).
  menu.addEventListener('close', () => setExpanded(false));

  menu.addEventListener('click', (event) => {
    // Clique no fundo escuro: o alvo é o próprio <dialog>.
    const clickedBackdrop = event.target === menu;
    // Clique num link do menu ou no botão X.
    const clickedLinkOrClose = event.target.closest('a, [data-menu-close]');

    if (clickedBackdrop || clickedLinkOrClose) closeMenu();
  });

  // Se a janela crescer até o tamanho de desktop com o menu aberto, fecha.
  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}
