/**
 * Animação de entrada: blocos com o atributo `data-reveal` sobem e aparecem
 * quando entram na tela (o visual fica em src/styles/components/reveal.css).
 */
export function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Anima só uma vez: depois de aparecer, para de observar.
          observer.unobserve(entry.target);
        }
      }
    },
    // Começa a animar um pouco antes do bloco chegar no meio da tela.
    { rootMargin: '0px 0px -10% 0px' },
  );

  elements.forEach((element) => observer.observe(element));
}
