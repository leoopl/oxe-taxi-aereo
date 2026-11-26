/**
 * Galeria da frota: clicar numa foto abre ela ampliada.
 *
 * - Setas (botões ou teclas ← →) passam para a foto anterior/próxima.
 * - Esc, botão X ou clique no fundo escuro fecham.
 * - Ao fechar, o foco volta para a foto clicada (o <dialog> faz isso sozinho).
 */
export function initLightbox() {
  const dialog = document.querySelector('[data-lightbox]');
  const items = [...document.querySelectorAll('[data-lightbox-item]')];
  if (!dialog || items.length === 0) return;

  const figure = dialog.querySelector('.lightbox__figure');
  const image = dialog.querySelector('[data-lightbox-image]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  let currentIndex = 0;

  function showPhoto(index) {
    // O "%" faz a lista dar a volta: depois da última foto vem a primeira.
    currentIndex = (index + items.length) % items.length;
    const thumbnail = items[currentIndex].querySelector('img');

    // Reaproveitamos a lista de tamanhos (srcset) da miniatura e avisamos que
    // agora a foto ocupa a tela toda (sizes="100vw"). Assim o navegador baixa
    // sozinho a versão grande — e só quando o usuário abre a foto.
    image.srcset = thumbnail.srcset;
    image.sizes = '100vw';
    image.src = thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = thumbnail.alt;
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      showPhoto(index);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => showPhoto(currentIndex - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => showPhoto(currentIndex + 1));
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });

  // Clique fora da foto (no fundo escuro) fecha.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === figure) dialog.close();
  });
}
