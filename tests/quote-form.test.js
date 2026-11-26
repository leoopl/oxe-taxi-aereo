import { describe, expect, test } from 'vitest';
import { buildQuoteMessage, formatDateBR, todayISO, validateQuote } from '../src/js/quote-form.js';

describe('todayISO', () => {
  test('devolve a data local no formato AAAA-MM-DD, com zero à esquerda', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatDateBR', () => {
  test('converte AAAA-MM-DD para DD/MM/AAAA', () => {
    expect(formatDateBR('2026-12-31')).toBe('31/12/2026');
  });

  test('sem data, devolve "a definir"', () => {
    expect(formatDateBR('')).toBe('a definir');
  });
});

describe('buildQuoteMessage', () => {
  test('monta a mensagem do WhatsApp igual à do site original', () => {
    const message = buildQuoteMessage({
      origin: 'Maceió, AL',
      destination: 'Recife',
      date: '2026-12-31',
      passengers: '2',
    });
    expect(message).toBe(
      'Olá, Oxe! Gostaria de solicitar uma cotação de táxi aéreo.\n\n' +
        'Origem: Maceió, AL\nDestino: Recife\nData desejada: 31/12/2026\nPassageiros: 2',
    );
  });

  test('remove espaços sobrando nas pontas dos campos', () => {
    const message = buildQuoteMessage({
      origin: '  Maceió ',
      destination: ' Natal  ',
      date: '',
      passengers: '1',
    });
    expect(message).toContain('Origem: Maceió\nDestino: Natal\nData desejada: a definir\n');
  });
});

describe('validateQuote', () => {
  const today = '2026-11-26';
  const valid = { origin: 'Maceió, AL', destination: 'Recife', date: '', passengers: '2' };

  test('formulário completo não tem erros', () => {
    expect(validateQuote(valid, today)).toEqual({});
  });

  test('campos obrigatórios vazios (ou só com espaços) geram mensagens claras', () => {
    const errors = validateQuote({ origin: '   ', destination: '', date: '', passengers: '' }, today);
    expect(errors).toEqual({
      origin: 'Informe a cidade de origem.',
      destination: 'Informe a cidade ou aeroporto de destino.',
      passengers: 'Selecione o número de passageiros.',
    });
  });

  test('data no passado é recusada', () => {
    expect(validateQuote({ ...valid, date: '2026-11-25' }, today)).toEqual({
      date: 'Escolha uma data a partir de hoje.',
    });
  });

  test('data de hoje é aceita', () => {
    expect(validateQuote({ ...valid, date: today }, today)).toEqual({});
  });
});
