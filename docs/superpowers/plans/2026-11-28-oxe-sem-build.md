# OXE sem build — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Converter o projeto Vite em arquivos estáticos sem Node, com o site idêntico.

**Architecture:** Gerar `index.html` uma vez com o `renderHtml` atual; concatenar o CSS; juntar
os módulos JS num script comum; mover imagens/ícones/fontes; apagar o ferramental Node.

**Tech Stack:** HTML, CSS, JavaScript (script comum). Verificação: Playwright (scratchpad).

**Spec:** `docs/superpowers/specs/2026-11-28-oxe-sem-build-design.md`

## Global Constraints

- Saída visual e textual idêntica à versão Vite (`74de5c8`).
- Caminhos relativos (funciona em `file://` e em subpasta de hospedagem).
- Comentários/README em português; `?v=1` nos links de CSS/JS.
- Sem commits até o usuário pedir (branch `sem-build`).

## Review Focus

1. Abrir `index.html` direto do disco → fontes, imagens, menu, lightbox funcionam.
2. Hospedado numa subpasta (ex.: `/site/`) → nenhum caminho absoluto quebra.
3. Fonte trocada sem querer (nome da família diferente) → pixel diff pega.
4. Link do WhatsApp do formulário diferente dos links do HTML → checagem de mensagem.
5. Cache antigo após editar CSS → `?v=` documentado no README.

---

### Task 1: Linha de base (antes de apagar o Vite)

- [ ] `npm run build`, servir `dist/` com servidor estático; screenshots 1440/390 + `innerText`.

### Task 2: index.html

- [ ] Gerar com `renderHtml(index.html, { root: 'src', variables: htmlVariables })`.
- [ ] Trocar `/src/assets/images/` → `images/`, `/favicon-32.png` → `favicon-32.png`,
      `/apple-touch-icon.png` → `apple-touch-icon.png`, `<script type="module">` →
      `<link rel="stylesheet" href="css/styles.css?v=1">` + `<script src="js/script.js?v=1" defer>`.
- [ ] Comentários: remover repetidos, apontar para `js/script.js`, adicionar divisórias de seção.

### Task 3: css/styles.css

- [ ] Concatenar na ordem do `main.css` com sumário; `@font-face` para `fonts/*.woff2`
      (famílias `Manrope` e `DM Sans`); `url()` do ornamento → `../images/...`.

### Task 4: js/script.js

- [ ] Juntar módulos; `WHATSAPP_PHONE` no topo; `init*()` chamados no fim.

### Task 5: Arquivos e limpeza

- [ ] Mover imagens → `images/`, `public/*` → raiz, fontes → `fonts/`; apagar `src/`, `public/`,
      `vite*`, `scripts/`, `tests/`, `images-source/`, `package*.json`, `eslint.config.js`,
      `.prettierignore`, `node_modules/`, `dist/`; `.gitignore` simplificado.

### Task 6: README + verificação

- [ ] README novo (abrir o site, Live Server, trocar telefone, adicionar foto, `?v=`).
- [ ] Servidor estático: suítes header/reveal/form/lightbox/final; pixel diff e `innerText` × linha
      de base; `file://`: fontes carregadas, sem erros, menu e lightbox abrem.
