/**
 * Destaca no menu o link da seção que está na tela.
 *
 * Funciona com todos os menus ao mesmo tempo (cabeçalho, barra compacta e
 * menu do celular), porque todos usam a classe .nav__link.
 */
export function initScrollSpy() {
  // Só os links internos (#quem-somos, #frota...), não o do WhatsApp.
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];

  // Os mesmos links aparecem em 3 menus; o Set remove os repetidos.
  const sectionIds = [...new Set(links.map((link) => link.getAttribute('href').slice(1)))];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  function setActiveLink(activeId) {
    for (const link of links) {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  // Guarda quais seções estão cruzando o meio da tela agora.
  const sectionsInMiddle = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          sectionsInMiddle.add(entry.target.id);
        } else {
          sectionsInMiddle.delete(entry.target.id);
        }
      }
      // A primeira seção (na ordem da página) que está no meio da tela.
      const current = sections.find((section) => sectionsInMiddle.has(section.id));
      setActiveLink(current?.id);
    },
    // Encolhe a "área observada" para uma faixa no meio da tela
    // (corta 45% de cima e 50% de baixo).
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}
