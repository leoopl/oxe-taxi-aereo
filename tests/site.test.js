import { describe, expect, test } from 'vitest';
import { htmlVariables, site, whatsappUrl } from '../src/data/site.js';

const DEFAULT_MESSAGE =
  'Olá! Gostaria de solicitar um orçamento de táxi aéreo com a OXE. Poderiam me fornecer mais informações?';

// Lê o texto da mensagem que vai dentro do link do WhatsApp.
function messageFrom(url) {
  return new URL(url).searchParams.get('text');
}

describe('whatsappUrl', () => {
  test('aponta para o número da OXE', () => {
    expect(whatsappUrl()).toMatch(/^https:\/\/wa\.me\/5582991166258\?text=/);
  });

  test('usa a mensagem padrão quando nenhuma é informada', () => {
    expect(messageFrom(whatsappUrl())).toBe(DEFAULT_MESSAGE);
  });

  test('codifica caracteres especiais da mensagem', () => {
    expect(messageFrom(whatsappUrl('Oi & tchau\nlinha 2'))).toBe('Oi & tchau\nlinha 2');
  });
});

describe('htmlVariables', () => {
  test('expõe os dados usados nos arquivos HTML como texto', () => {
    expect(htmlVariables.whatsappUrl).toBe(whatsappUrl());
    expect(htmlVariables.phoneDisplay).toBe('(82) 99116-6258');
    expect(htmlVariables.phoneTel).toBe('+5582991166258');
    expect(htmlVariables.email).toBe(site.email);
    for (const value of Object.values(htmlVariables)) {
      expect(typeof value).toBe('string');
    }
  });
});
