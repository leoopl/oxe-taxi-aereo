/**
 * Dados da empresa — ÚNICO lugar para trocar telefone, e-mail, endereço etc.
 *
 * Este arquivo é usado em dois lugares:
 *  1. No `vite.config.js`, para preencher os `{{ variaveis }}` dos arquivos HTML.
 *  2. No JavaScript do navegador (ex.: formulário de cotação).
 *
 * Por isso ele não pode usar nada específico do navegador (window, document...).
 */

export const site = {
  name: 'OXE Táxi Aéreo',
  legalName: 'OXE Táxi Aéreo LTDA',
  cnpj: '59.596.078/0001-63',

  // Telefone no formato internacional, só números (usado no link do WhatsApp).
  phone: '5582991166258',
  // Telefone do jeito que aparece para o usuário.
  phoneDisplay: '(82) 99116-6258',

  email: 'oxetaxiaereo@gmail.com',
  instagramUrl: 'https://www.instagram.com/oxetaxiaereo/',
  instagramHandle: '@oxetaxiaereo',

  address: {
    street: 'Rua Itararé, 10',
    district: 'Santa Lúcia',
    city: 'Maceió',
    state: 'AL',
    zip: '57082-020',
  },

  // Link do Google Maps para o local de embarque.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Aeroclube+de+Alagoas%2C+Macei%C3%B3+-+AL',

  // Mensagem que já vem escrita quando o cliente clica em "Solicitar Cotação".
  whatsappMessage:
    'Olá! Gostaria de solicitar um orçamento de táxi aéreo com a OXE. Poderiam me fornecer mais informações?',
};

/**
 * Monta o link do WhatsApp com uma mensagem pronta.
 * @param {string} [message] Texto da mensagem (usa a mensagem padrão se não informado).
 * @returns {string} Ex.: "https://wa.me/5582991166258?text=Ol%C3%A1..."
 */
export function whatsappUrl(message = site.whatsappMessage) {
  return `https://wa.me/${site.phone}?text=${encodeURIComponent(message)}`;
}

const { street, district, city, state, zip } = site.address;

/**
 * Valores disponíveis nos arquivos HTML como `{{ nome }}`.
 * Ex.: <a href="{{ whatsappUrl }}">  →  <a href="https://wa.me/...">
 */
export const htmlVariables = {
  siteName: site.name,
  legalName: site.legalName,
  cnpj: site.cnpj,
  whatsappUrl: whatsappUrl(),
  phoneDisplay: site.phoneDisplay,
  phoneTel: `+${site.phone}`,
  email: site.email,
  instagramUrl: site.instagramUrl,
  instagramHandle: site.instagramHandle,
  mapsUrl: site.mapsUrl,
  addressStreet: street,
  addressDistrict: district,
  addressCity: city,
  addressState: state,
  addressZip: zip,
  // Ex.: "Rua Itararé, 10 – Santa Lúcia, Maceió – AL, 57082-020"
  // O hífen do CEP vira um hífen "inseparável" (‑) para o CEP não quebrar em duas linhas.
  addressLine: `${street} – ${district}, ${city} – ${state}, ${zip.replace('-', '‑')}`,
  currentYear: String(new Date().getFullYear()),
};
