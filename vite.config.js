import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { htmlVariables } from './src/data/site.js';
import { htmlPartials } from './vite-plugins/html-partials.js';

// Pasta "src" em caminho absoluto: é de lá que os includes do HTML partem.
const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [htmlPartials({ root: srcDir, variables: htmlVariables })],
  build: {
    // Imagens menores que isso viram texto dentro do CSS/JS. Deixamos 0 para
    // que todas as fotos continuem como arquivos (o navegador guarda em cache).
    assetsInlineLimit: 0,
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
});
