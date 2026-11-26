/**
 * Esconde o botão flutuante do WhatsApp enquanto o formulário de cotação
 * está na tela — o formulário já tem o próprio botão, e no celular o
 * botão flutuante cobriria os campos.
 */
export function initWhatsappFloat() {
  const floatButton = document.querySelector('[data-whatsapp-float]');
  const form = document.querySelector('[data-quote-form]');
  if (!floatButton || !form) return;

  const observer = new IntersectionObserver(([entry]) => {
    floatButton.classList.toggle('is-hidden', entry.isIntersecting);
  });

  observer.observe(form);
}
