import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, test } from 'vitest';
import { renderHtml } from '../vite-plugins/html-partials.js';

// Cria uma pasta temporária com arquivos .html de exemplo para cada teste.
let root;
beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'partials-'));
  mkdirSync(path.join(root, 'sections'));
  writeFileSync(path.join(root, 'sections/hello.html'), '<p>Olá</p>');
  writeFileSync(path.join(root, 'sections/outer.html'), '<div><!-- include: sections/hello.html --></div>');
});

describe('renderHtml', () => {
  test('troca o comentário de include pelo conteúdo do arquivo', () => {
    const html = renderHtml('<main><!-- include: sections/hello.html --></main>', { root, variables: {} });
    expect(html).toBe('<main><p>Olá</p></main>');
  });

  test('resolve includes dentro de includes', () => {
    const html = renderHtml('<!-- include: sections/outer.html -->', { root, variables: {} });
    expect(html).toBe('<div><p>Olá</p></div>');
  });

  test('troca {{ variavel }} pelo valor informado', () => {
    const html = renderHtml('<a href="mailto:{{ email }}">{{email}}</a>', {
      root,
      variables: { email: 'a@b.com' },
    });
    expect(html).toBe('<a href="mailto:a@b.com">a@b.com</a>');
  });

  test('avisa com erro claro quando a variável não existe', () => {
    expect(() => renderHtml('{{ telefone }}', { root, variables: {} })).toThrow(/telefone/);
  });

  test('avisa com erro claro quando o arquivo incluído não existe', () => {
    expect(() => renderHtml('<!-- include: sections/nao-existe.html -->', { root, variables: {} })).toThrow(
      /sections\/nao-existe\.html/,
    );
  });
});
