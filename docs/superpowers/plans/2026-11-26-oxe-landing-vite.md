# OXE Landing (Vite) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recriar `Site_Oxe_Taxi_Aereo (9).html` como projeto Vite + JS puro organizado, leve e legível para júnior, com as melhorias de UX aprovadas.

**Architecture:** `index.html` lista partials (`<!-- include: ... -->`) que um plugin Vite próprio junta em build/dev, trocando `{{ variavel }}` por dados de `src/data/site.js`. CSS em `@import`s por responsabilidade; JS em módulos `initX()` chamados por `src/main.js`. Imagens otimizadas por `npm run images` (sharp) para `src/assets/images/*.webp`.

**Tech Stack:** Vite 8, JavaScript (ESM), sharp, Vitest, Prettier, ESLint 10, @fontsource-variable (Manrope, DM Sans).

**Spec:** `docs/superpowers/specs/2026-11-26-oxe-landing-vite-design.md`

## Global Constraints

- Textos, ordem das seções, cores (`#0F233F`, `#1D4385`, `#A7DC70`, `#F6F8F5`, `#4b5b70`, `#dbe3dc`) e fontes (Manrope 700/800 títulos, DM Sans 400/600/700 corpo) idênticos ao original.
- IDs de âncora mantidos: `inicio, quem-somos, por-que, frota, executivo, destinos, seguranca, galeria, faq, onde-estamos, contato`.
- Telefone `5582991166258`, exibição `(82) 99116-6258`, e-mail `oxetaxiaereo@gmail.com`, Instagram `https://www.instagram.com/oxetaxiaereo/` — só em `src/data/site.js`.
- Mensagem padrão do WhatsApp (verbatim): `Olá! Gostaria de solicitar um orçamento de táxi aéreo com a OXE. Poderiam me fornecer mais informações?`
- Comentários e README em português; classes em inglês (BEM simples, estados com `is-`).
- Nada de conteúdo renderizado por JS; animações só com `html.js` e sem `prefers-reduced-motion`.
- Sem rolagem horizontal de 320 px a 1920 px.
- Projeto não é repositório git: não há passos de commit.

## Review Focus

1. Clique num link do menu → título da seção não pode ficar escondido sob a barra compacta (verificado no script Playwright da Task 7).
2. JS desligado → todo conteúdo visível e todos os links de WhatsApp funcionam (hrefs estáticos) (Task 7).
3. Menu mobile aberto e janela redimensionada para desktop → menu fecha e rolagem do body volta (Task 3, `matchMedia` change).
4. Data digitada manualmente no passado ou campo de data vazio → mensagem clara / "a definir" (testes da Task 5).
5. Celular de 320 px → header (logo + ☰), chips, formulário e galeria sem estourar a largura (Task 7).

---

### Task 1: Scaffold, plugin de partials e dados do site

**Files:**

- Create: `package.json`, `vite.config.js`, `vite-plugins/html-partials.js`, `src/data/site.js`, `.prettierrc.json`, `.prettierignore`, `eslint.config.js`, `.editorconfig`, `.gitignore`
- Test: `tests/html-partials.test.js`, `tests/site.test.js`

**Interfaces:**

- Produces: `renderHtml(html: string, { root: string, variables: Record<string,string> }): string`; `htmlPartials({ root, variables }): VitePlugin` (hook `transformIndexHtml`, `order: 'pre'`); `site` (objeto com `name, legalName, cnpj, phone, phoneDisplay, email, instagramUrl, instagramHandle, address{street,district,city,state,zip}, boardingPlace, mapsUrl, whatsappMessage`); `whatsappUrl(message = site.whatsappMessage): string`; `htmlVariables: Record<string,string>` (chaves usadas nos partials: `whatsappUrl, phoneDisplay, phoneTel, email, instagramUrl, instagramHandle, mapsUrl, addressLine, legalName, cnpj, currentYear`).
- Scripts npm: `dev`, `build`, `preview`, `test`, `lint`, `format`, `images`.

- [ ] **Step 1: Testes** — `tests/html-partials.test.js`: (a) `<!-- include: a.html -->` vira conteúdo de `a.html` (fixture em dir temporário); (b) include aninhado funciona; (c) `{{ email }}` → valor; (d) variável inexistente lança erro contendo o nome; (e) arquivo inexistente lança erro contendo o caminho. `tests/site.test.js`: `whatsappUrl()` começa com `https://wa.me/5582991166258?text=` e decodifica para a mensagem padrão verbatim; `whatsappUrl('Oi & tchau')` decodifica para `Oi & tchau`.
- [ ] **Step 2:** `npm test` → FAIL (módulos não existem).
- [ ] **Step 3:** Implementar plugin (regex `<!--\s*include:\s*(.+?)\s*-->`, caminhos relativos a `src/`, recursivo; depois `\{\{\s*(\w+)\s*\}\}`), `site.js` e `vite.config.js`. Instalar deps.
- [ ] **Step 4:** `npm test` → PASS; `npx vite build` com `index.html` mínimo → OK.

### Task 2: Imagens otimizadas e arquivos públicos

**Files:**

- Create: `images-source/*` (cópias renomeadas: `hero.jpeg, about-tail-sunset.jpeg, fleet-cabin-table.jpeg, fleet-apron.jpeg, fleet-panel-sunset.jpeg, fleet-cabin-seats.jpeg, fleet-front-sunset.jpeg, executive-orange-sky.jpeg, safety-dusk.jpeg, instagram-sunset.jpeg, instagram-dusk.jpeg, instagram-hangar.jpeg, logo.png, section-ornament.png`), `scripts/optimize-images.js`
- Output: `src/assets/images/<nome>-<largura>.webp`; `public/favicon-32.png`, `public/apple-touch-icon.png` (180), `public/og-image.jpg` (1200×630 do hero), `public/robots.txt`

- [ ] **Step 1:** Copiar originais conforme tabela do spec; ornamento extraído do HTML original.
- [ ] **Step 2:** Script com lista `{ name, widths }` legível: fotos `[640, 1280]`, hero `[640, 1028]`, logo `[160, 560, 1080]`, ornamento `[320, 640]`; nunca ampliar além do original (`withoutEnlargement`); WebP q78 (logo/ornamento com alpha); log com tamanho final.
- [ ] **Step 3:** `npm run images` → todos os arquivos existem; soma de `src/assets/images` < 1 MB.

### Task 3: Base, header grande, barra compacta, menu mobile, rodapé

**Files:**

- Create: `index.html`, `src/main.js`, `src/styles/main.css`, `src/styles/base/{variables,reset,typography,layout}.css`, `src/styles/components/{button,ornament,reveal}.css`, `src/styles/layout/{header,compact-bar,mobile-menu,footer,whatsapp-float}.css`, `src/partials/{header,compact-bar,nav-links,mobile-menu,footer,whatsapp-float}.html`, `src/js/{compact-bar,mobile-menu,scroll-spy,whatsapp-float,current-year}.js`

**Interfaces:**

- Produces: `initCompactBar()`, `initMobileMenu()`, `initScrollSpy()`, `initWhatsappFloat()`, `initCurrentYear()`; CSS vars `--compact-bar-height: 72px`; classes `.container`, `.section`, `.section--tint`, `.split`, `.btn`, `.btn--outline`, `.eyebrow`, `.lead`, `.note`, `.has-ornament`, `.has-ornament--left|--right`; `nav-links.html` com `<a class="nav__link" href="#...">` + CTA `nav__link--cta`.

- [ ] **Step 0:** `main.js` importa `@fontsource-variable/manrope` e `@fontsource-variable/dm-sans` + `main.css`; `index.html` com metas/OG/JSON-LD do original (dados via `{{ }}`), favicon novo, link "Pular para o conteúdo" (`.skip-link` → `#conteudo`).
- [ ] **Step 1:** Header grande: desktop logo `flex: 0 1 530px` à esquerda (sem o hack `left: calc`), menu à direita centralizado verticalmente, fonte 16pt nos links, CTA com texto centralizado; mobile (≤700px) logo centralizado ~170px + botão ☰ (`aria-controls="mobile-menu"`, `aria-expanded`) no canto.
- [ ] **Step 2:** Barra compacta fixa (logo 56px + links/CTA no desktop; logo + ☰ no mobile); `initCompactBar` usa `IntersectionObserver` no `<header>` e alterna `is-visible`; oculta = `visibility:hidden` + `translateY(-100%)`.
- [ ] **Step 3:** Menu mobile: painel único; abre/fecha por qualquer ☰, Esc, clique em link/backdrop; fecha ao passar de 700px (`matchMedia` change); trava rolagem com `body.is-menu-open`.
- [ ] **Step 4:** Scroll-spy (`aria-current="true"` + `.is-active` em todos os `nav__link` da seção visível); botão flutuante oculto enquanto `#quote-form` está visível; ano automático em `[data-current-year]`.
- [ ] **Step 5:** `npm run dev` + Playwright 1440/390: header ≈ original, barra aparece após rolar, menu abre/fecha, sem rolagem horizontal.

### Task 4: Seções (HTML + CSS)

**Files:**

- Create: `src/sections/{hero,quote-form,about,why-oxe,fleet,executive,destinations,safety,gallery,faq,location,contact}.html`, `src/styles/sections/*.css` correspondentes, `src/styles/components/{card,chips,ticks,specs,faq}.css`

- [ ] **Step 1:** Portar cada seção com o texto verbatim, classes legíveis, `<img>` com `srcset`/`sizes`/`width`/`height`/`loading="lazy"` (hero: `<img>` de fundo com `fetchpriority="high"`, sem lazy), ornamento via `.has-ornament--left/right` (mesmo lado do original).
- [ ] **Step 2:** Galeria da frota: itens `<button type="button" class="gallery__item" data-lightbox>`; no mobile a foto de destaque ocupa 2 colunas.
- [ ] **Step 3:** FAQ com `<details>`; animação via `::details-content` + `interpolate-size` (melhoria progressiva).
- [ ] **Step 4:** Playwright 1440/390 lado a lado com o original: mesma ordem, cores e espaçamentos.

### Task 5: Formulário de cotação

**Files:**

- Create: `src/js/quote-form.js`, `src/styles/sections/quote-form.css` (se não criado na Task 4)
- Test: `tests/quote-form.test.js`

**Interfaces:**

- Produces: `todayISO(now = new Date()): string` (`YYYY-MM-DD` local); `formatDateBR(iso: string): string` (`''` → `'a definir'`); `buildQuoteMessage({ origin, destination, date, passengers }): string`; `validateQuote(values, today): Record<field, message>` (vazio = válido); `initQuoteForm()`.

- [ ] **Step 1: Testes** — `todayISO(new Date(2026, 0, 5))` = `'2026-01-05'`; `formatDateBR('2026-12-31')` = `'31/12/2026'`; `formatDateBR('')` = `'a definir'`; `buildQuoteMessage({origin:'Maceió, AL', destination:'Recife', date:'2026-12-31', passengers:'2'})` = `'Olá, Oxe! Gostaria de solicitar uma cotação de táxi aéreo.\n\nOrigem: Maceió, AL\nDestino: Recife\nData desejada: 31/12/2026\nPassageiros: 2'`; `validateQuote` retorna `destination: 'Informe a cidade ou aeroporto de destino.'`, `origin: 'Informe a cidade de origem.'`, `passengers: 'Selecione o número de passageiros.'`, `date: 'Escolha uma data a partir de hoje.'` (data < hoje); campos só com espaços contam como vazios.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar; `initQuoteForm` usa `novalidate`, mostra erro em `<p class="field__error" id="...">` com `aria-invalid`/`aria-describedby`, foca o primeiro campo inválido, limpa erro ao digitar, abre `whatsappUrl(buildQuoteMessage(...))` em nova aba.
- [ ] **Step 4:** `npm test` → PASS; teste manual Playwright: submit vazio mostra 3 erros, submit válido abre popup com a URL esperada.

### Task 6: Lightbox e animações de entrada

**Files:**

- Create: `src/partials/lightbox.html`, `src/js/lightbox.js`, `src/js/reveal.js`, `src/styles/components/lightbox.css`

**Interfaces:**

- Produces: `initLightbox()`, `initReveal()`; elementos animados marcados com `data-reveal`.

- [ ] **Step 1:** Lightbox em `<dialog>`: copia `srcset` + `alt` da miniatura com `sizes="100vw"`, legenda = alt, botões anterior/próxima/fechar, setas ← →, Esc, clique no fundo fecha, foco volta ao item clicado.
- [ ] **Step 2:** Reveal: `html.js` adicionada no `<head>` (inline mínimo); `IntersectionObserver` aplica `is-visible` uma vez; sem animação com `prefers-reduced-motion`.
- [ ] **Step 3:** Playwright: clicar na 1ª foto abre dialog com `currentSrc` contendo `-1280`; Esc fecha.

### Task 7: README, qualidade e verificação final

**Files:**

- Create: `README.md`

- [ ] **Step 1:** README: requisitos, comandos, mapa de pastas, "trocar telefone/mensagem", "adicionar foto", "adicionar seção", convenção de classes.
- [ ] **Step 2:** `npm run lint && npm test && npm run build` → sem erros; tamanho total do `dist/`.
- [ ] **Step 3:** Script Playwright (scratchpad) contra `npm run preview`: larguras 320/390/768/1440/1920 sem rolagem horizontal; cada link do menu leva o `h2` da seção abaixo da barra compacta; todos os `a[href*="wa.me"]` decodificam para a mensagem padrão; com JS desligado todo `[data-reveal]` visível; screenshots finais lado a lado com o original.
