/**
 * Plugin do Vite que permite dividir o HTML em vários arquivos.
 *
 * Ele faz duas coisas, nesta ordem:
 *
 *  1. Troca   <!-- include: sections/hero.html -->
 *     pelo conteúdo do arquivo `src/sections/hero.html`.
 *     (Um arquivo incluído também pode incluir outros.)
 *
 *  2. Troca   {{ whatsappUrl }}
 *     pelo valor de `whatsappUrl` no objeto `variables`
 *     (que vem de `src/data/site.js`).
 *
 * O resultado é um HTML estático normal — o Google e o navegador recebem a
 * página completa, sem depender de JavaScript para mostrar o conteúdo.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const INCLUDE_PATTERN = /<!--\s*include:\s*(.+?)\s*-->/g;
const VARIABLE_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

/**
 * Junta os arquivos incluídos e preenche as variáveis.
 * @param {string} html HTML com comentários de include e/ou {{ variaveis }}.
 * @param {{ root: string, variables: Record<string, string> }} options
 *   root: pasta de onde os caminhos dos includes partem (ex.: "src").
 *   variables: valores para os {{ }}.
 * @returns {string} HTML final.
 */
export function renderHtml(html, { root, variables }) {
  const withIncludes = html.replace(INCLUDE_PATTERN, (_comment, file) => {
    const filePath = path.resolve(root, file);
    if (!existsSync(filePath)) {
      throw new Error(`[html-partials] Arquivo não encontrado: ${file} (procurado em ${filePath})`);
    }
    // Chama a si mesma para resolver includes dentro do arquivo incluído.
    return renderHtml(readFileSync(filePath, 'utf-8'), { root, variables });
  });

  return withIncludes.replace(VARIABLE_PATTERN, (_match, name) => {
    if (!(name in variables)) {
      throw new Error(
        `[html-partials] Variável desconhecida: {{ ${name} }}. Adicione-a em src/data/site.js.`,
      );
    }
    return variables[name];
  });
}

/**
 * Cria o plugin para usar no `vite.config.js`.
 * @param {{ root: string, variables: Record<string, string> }} options
 */
export function htmlPartials({ root, variables }) {
  return {
    name: 'html-partials',
    // "pre" = roda antes do Vite processar o HTML, assim as imagens e links
    // dos arquivos incluídos também são otimizados pelo Vite.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => renderHtml(html, { root, variables }),
    },
    // No `npm run dev`: quando um arquivo .html de dentro de src/ muda,
    // manda o navegador recarregar a página para mostrar a alteração.
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (file.startsWith(root) && file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}
