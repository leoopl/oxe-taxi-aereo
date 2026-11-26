/**
 * Formulário "Planeje seu voo".
 *
 * Ao enviar: confere os campos, mostra mensagens de erro claras e, se estiver
 * tudo certo, abre o WhatsApp com a mensagem de cotação já escrita.
 *
 * As funções pequenas (todayISO, formatDateBR, buildQuoteMessage, validateQuote)
 * não mexem na página, por isso têm testes em tests/quote-form.test.js.
 */
import { whatsappUrl } from '../data/site.js';

// Nomes dos campos (atributo "name" no HTML), na ordem em que aparecem.
const FIELDS = ['origin', 'destination', 'date', 'passengers'];

const ERROR_MESSAGES = {
  origin: 'Informe a cidade de origem.',
  destination: 'Informe a cidade ou aeroporto de destino.',
  date: 'Escolha uma data a partir de hoje.',
  passengers: 'Selecione o número de passageiros.',
};

/**
 * Data de hoje no formato que o <input type="date"> usa.
 * @param {Date} [now]
 * @returns {string} Ex.: "2026-01-05"
 */
export function todayISO(now = new Date()) {
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
export function formatDateBR(isoDate) {
  if (!isoDate) return 'a definir';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Monta o texto que vai para o WhatsApp.
 * @param {{ origin: string, destination: string, date: string, passengers: string }} values
 * @returns {string}
 */
export function buildQuoteMessage({ origin, destination, date, passengers }) {
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
 * @param {{ origin: string, destination: string, date: string, passengers: string }} values
 * @param {string} today Data de hoje no formato "AAAA-MM-DD".
 * @returns {Record<string, string>} Erros por campo. Objeto vazio = tudo certo.
 */
export function validateQuote(values, today) {
  const errors = {};

  if (!values.origin.trim()) errors.origin = ERROR_MESSAGES.origin;
  if (!values.destination.trim()) errors.destination = ERROR_MESSAGES.destination;
  // Datas "AAAA-MM-DD" podem ser comparadas como texto: "2026-11-25" < "2026-11-26".
  if (values.date && values.date < today) errors.date = ERROR_MESSAGES.date;
  if (!values.passengers) errors.passengers = ERROR_MESSAGES.passengers;

  return errors;
}

/* ---------- A partir daqui: código que mexe na página ---------- */

/** Lê os valores do formulário como texto. */
function readValues(form) {
  const data = new FormData(form);
  return Object.fromEntries(FIELDS.map((name) => [name, String(data.get(name) ?? '')]));
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

export function initQuoteForm() {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;

  // Desliga os balões de erro padrão do navegador: usamos as nossas mensagens.
  form.noValidate = true;

  // Não deixa escolher uma data que já passou no calendário.
  form.elements.date.min = todayISO();

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // não recarrega a página

    const values = readValues(form);
    const errors = validateQuote(values, todayISO());

    FIELDS.forEach((name) => setFieldError(form.elements[name], errors[name]));

    const firstInvalidField = FIELDS.find((name) => errors[name]);
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
