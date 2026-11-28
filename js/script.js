/*
 * OXE Táxi Aéreo — comportamentos do site.
 *
 * Cada parte do site tem a sua própria função (initAlgo). Todas são chamadas
 * no FINAL deste arquivo. O <script> é carregado com "defer", então quando
 * este código roda o HTML da página já está todo pronto.
 *
 * Sumário (use Ctrl+F com o nome da função):
 *    1. Configuração ................... WHATSAPP_PHONE, whatsappUrl
 *    2. Barra compacta do topo ......... initCompactBar
 *    3. Menu do celular ................ initMobileMenu
 *    4. Destaque do menu ............... initScrollSpy
 *    5. Formulário de cotação .......... initQuoteForm
 *    6. Foto ampliada (lightbox) ....... initLightbox
 *    7. Animação de entrada ............ initReveal
 *    8. Botão flutuante do WhatsApp .... initWhatsappFloat
 *    9. Ano do rodapé .................. initCurrentYear
 *   10. Inicialização (chama tudo)
 */

/* ======================================================================
   1. Configuração
   ====================================================================== */

// Número do WhatsApp: só números, com 55 (Brasil) + DDD.
// ATENÇÃO: o número também aparece nos links do index.html. Se trocar aqui,
// troque lá também (use "Localizar e substituir", Ctrl+H).
const WHATSAPP_PHONE = '5582991166258';

/**
 * Monta o link do WhatsApp com uma mensagem pronta.
 * @param {string} message Texto da mensagem.
 * @returns {string} Ex.: "https://wa.me/5582991166258?text=Ol%C3%A1..."
 */
function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/* ======================================================================
   2. Barra compacta do topo
   Fica escondida enquanto o cabeçalho grande aparece na tela. Quando o
   usuário rola e o cabeçalho sai da tela, a barra desliza para baixo.
   ====================================================================== */

function initCompactBar() {
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

/* ======================================================================
   3. Menu do celular (botão ☰)
   O menu é um <dialog>. Com .showModal() o navegador já:
    - fecha com a tecla Esc;
    - mantém o foco do teclado dentro do menu;
    - devolve o foco para o botão ☰ ao fechar.
   Aqui só ligamos os botões e fechamos o menu quando o usuário escolhe um link.
   ====================================================================== */

// Acima desta largura o menu normal aparece e o ☰ some (igual ao CSS).
const DESKTOP_QUERY = '(min-width: 901px)';

function initMobileMenu() {
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

/* ======================================================================
   4. Destaque do menu (scroll-spy)
   Destaca no menu o link da seção que está na tela. Funciona com os 3 menus
   ao mesmo tempo (cabeçalho, barra compacta e celular): todos usam .nav__link.
   ====================================================================== */

function initScrollSpy() {
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

/* ======================================================================
   5. Formulário de cotação ("Planeje seu voo")
   Ao enviar: confere os campos, mostra mensagens de erro claras e, se
   estiver tudo certo, abre o WhatsApp com a mensagem já escrita.
   ====================================================================== */

// Nomes dos campos (atributo "name" no HTML), na ordem em que aparecem.
const QUOTE_FIELDS = ['origin', 'destination', 'date', 'passengers'];

const QUOTE_ERROR_MESSAGES = {
  origin: 'Informe a cidade de origem.',
  destination: 'Informe a cidade ou aeroporto de destino.',
  date: 'Escolha uma data a partir de hoje.',
  passengers: 'Selecione o número de passageiros.',
};

/**
 * Data de hoje no formato que o <input type="date"> usa.
 * @returns {string} Ex.: "2026-01-05"
 */
function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() começa em 0
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converte a data do formulário para o formato brasileiro.
 * @param {string} isoDate Ex.: "2026-12-31" (ou "" se não preenchida)
 * @returns {string} Ex.: "31/12/2026" (ou "a definir")
 */
function formatDateBR(isoDate) {
  if (!isoDate) return 'a definir';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/** Monta o texto que vai para o WhatsApp. */
function buildQuoteMessage({ origin, destination, date, passengers }) {
  return [
    'Olá, Oxe! Gostaria de solicitar uma cotação de táxi aéreo.',
    '',
    `Origem: ${origin.trim()}`,
    `Destino: ${destination.trim()}`,
    `Data desejada: ${formatDateBR(date)}`,
    `Passageiros: ${passengers}`,
  ].join('\n');
}

/**
 * Confere os campos do formulário.
 * @returns {Object} Erros por campo. Objeto vazio = tudo certo.
 */
function validateQuote(values, today) {
  const errors = {};

  if (!values.origin.trim()) errors.origin = QUOTE_ERROR_MESSAGES.origin;
  if (!values.destination.trim()) errors.destination = QUOTE_ERROR_MESSAGES.destination;
  // Datas "AAAA-MM-DD" podem ser comparadas como texto: "2026-11-25" < "2026-11-26".
  if (values.date && values.date < today) errors.date = QUOTE_ERROR_MESSAGES.date;
  if (!values.passengers) errors.passengers = QUOTE_ERROR_MESSAGES.passengers;

  return errors;
}

/** Lê os valores do formulário como texto. */
function readQuoteValues(form) {
  const data = new FormData(form);
  return Object.fromEntries(QUOTE_FIELDS.map((name) => [name, String(data.get(name) ?? '')]));
}

/** Mostra (ou esconde) a mensagem de erro de um campo. */
function setFieldError(field, message) {
  const errorElement = document.getElementById(`${field.id}-error`);

  if (message) {
    errorElement.textContent = message;
    errorElement.hidden = false;
    field.setAttribute('aria-invalid', 'true');
    // Faz o leitor de tela ler a mensagem de erro junto com o campo.
    field.setAttribute('aria-describedby', errorElement.id);
  } else {
    errorElement.textContent = '';
    errorElement.hidden = true;
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
}

function initQuoteForm() {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;

  // Desliga os balões de erro padrão do navegador: usamos as nossas mensagens.
  form.noValidate = true;

  // Não deixa escolher uma data que já passou no calendário.
  form.elements.date.min = todayISO();

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // não recarrega a página

    const values = readQuoteValues(form);
    const errors = validateQuote(values, todayISO());

    QUOTE_FIELDS.forEach((name) => setFieldError(form.elements[name], errors[name]));

    const firstInvalidField = QUOTE_FIELDS.find((name) => errors[name]);
    if (firstInvalidField) {
      form.elements[firstInvalidField].focus();
      return;
    }

    window.open(whatsappUrl(buildQuoteMessage(values)), '_blank', 'noopener');
  });

  // Assim que o usuário mexe num campo com erro, a mensagem some.
  form.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') {
      setFieldError(event.target, '');
    }
  });
}

/* ======================================================================
   6. Foto ampliada (lightbox) da galeria da frota
    - Setas (botões ou teclas ← →) passam para a foto anterior/próxima.
    - Esc, botão X ou clique no fundo escuro fecham.
    - Ao fechar, o foco volta para a foto clicada (o <dialog> faz isso sozinho).
   ====================================================================== */

function initLightbox() {
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

/* ======================================================================
   7. Animação de entrada
   Blocos com o atributo data-reveal sobem e aparecem quando entram na tela
   (o visual fica no CSS, parte "14. Animação de entrada").
   ====================================================================== */

function initReveal() {
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

/* ======================================================================
   8. Botão flutuante do WhatsApp
   Some enquanto o formulário de cotação está na tela: o formulário já tem
   o próprio botão, e no celular o botão flutuante cobriria os campos.
   ====================================================================== */

function initWhatsappFloat() {
  const floatButton = document.querySelector('[data-whatsapp-float]');
  const form = document.querySelector('[data-quote-form]');
  if (!floatButton || !form) return;

  const observer = new IntersectionObserver(([entry]) => {
    floatButton.classList.toggle('is-hidden', entry.isIntersecting);
  });

  observer.observe(form);
}

/* ======================================================================
   9. Ano do rodapé ("© 2026 ...")
   Mantém o ano certo nos anos seguintes, sem precisar editar o HTML.
   ====================================================================== */

function initCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = year;
  });
}

/* ======================================================================
   10. Inicialização: liga cada comportamento da página.
   ====================================================================== */

initReveal();
initCompactBar();
initMobileMenu();
initQuoteForm();
initLightbox();
initScrollSpy();
initWhatsappFloat();
initCurrentYear();
