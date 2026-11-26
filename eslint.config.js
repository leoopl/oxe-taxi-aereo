import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  {
    // Código que roda no navegador.
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Código que roda no Node (configs, scripts, plugin e testes).
    files: ['*.js', 'scripts/**/*.js', 'vite-plugins/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.node },
  },
];
