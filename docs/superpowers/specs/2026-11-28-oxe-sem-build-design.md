# OXE Táxi Aéreo — versão sem Node e sem build (design)

Data: 2026-11-28 · Status: aprovado em conversa

## Intenção

Simplificar ao máximo o projeto: tirar Node, Vite e qualquer etapa de build, e deixar o
código mais fácil de seguir. O site publicado continua **idêntico** (mesmo HTML, CSS,
comportamento e imagens) ao da versão Vite (commit `74de5c8`).

## Abordagens consideradas

1. Um `index.html`, mantendo o Vite — descartada: o usuário quer tirar Node/build.
2. **Arquivos estáticos sem build** (`index.html` + `css/styles.css` + `js/script.js` +
   `images/` + `fonts/`) — **escolhida**.
3. Um único arquivo com CSS/JS embutidos — descartada: é o problema do HTML original
   (arquivo gigante, difícil para júnior).

## Design

```
index.html, css/styles.css, js/script.js, images/ (26 WebP), fonts/ (2 woff2),
favicon-32.png, apple-touch-icon.png, og-image.jpg, README.md, .editorconfig, .prettierrc.json
```

- `index.html`: gerado uma única vez a partir dos partials atuais (mesma marcação), com
  comentários grandes separando as seções; caminhos relativos (`images/...`) para funcionar
  aberto direto do disco (`file://`, testado) e em qualquer hospedagem.
- `css/styles.css`: todos os arquivos CSS na ordem do `main.css`, com sumário numerado;
  fontes via `@font-face` apontando para `fonts/` (sem Google Fonts).
- `js/script.js`: script comum (não módulo — módulos não rodam via `file://`), carregado
  com `defer`; uma função `initAlgo()` por comportamento, chamadas no fim do arquivo.
- Cache: `?v=1` nos links do CSS/JS; README explica quando aumentar.

## Perdas aceitas

- Telefone/link do WhatsApp repetidos no `index.html` (~10×) e 1× no `script.js`.
- Fotos novas precisam ser convertidas para WebP manualmente (ex.: squoosh.app).
- Sem testes automáticos, lint ou hash de arquivos.

## Verificação

- Screenshots de página inteira (1440 e 390 px) da versão Vite × versão nova: diferença de
  pixels ~0.
- Texto visível (`innerText`) idêntico.
- Mesmas verificações de navegador da versão Vite (menu, barra compacta, formulário,
  lightbox, animações, sem rolagem horizontal), servidas por servidor estático e via
  `file://`.
