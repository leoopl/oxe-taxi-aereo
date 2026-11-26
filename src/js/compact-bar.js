/**
 * Barra compacta do topo.
 *
 * Fica escondida enquanto o cabeçalho grande aparece na tela. Quando o
 * usuário rola e o cabeçalho sai da tela, a barra desliza para baixo.
 */
export function initCompactBar() {
  const header = document.querySelector('[data-site-header]');
  const bar = document.querySelector('[data-compact-bar]');
  if (!header || !bar) return;

  // O IntersectionObserver avisa sempre que o cabeçalho entra ou sai da tela.
  const observer = new IntersectionObserver(([entry]) => {
    const headerIsOnScreen = entry.isIntersecting;
    bar.classList.toggle('is-visible', !headerIsOnScreen);
  });

  observer.observe(header);
}
