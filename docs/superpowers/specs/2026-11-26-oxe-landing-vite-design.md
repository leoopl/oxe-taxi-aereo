# OXE Táxi Aéreo — Landing page em Vite (design)

Data: 2026-11-26 · Status: aprovado em conversa

## Intenção

Transformar o arquivo único `Site_Oxe_Taxi_Aereo (9).html` (~1 MB, CSS/JS/imagens
embutidos em base64) num projeto **Vite + JavaScript puro**, bem organizado e
legível para um dev júnior. O site **continua o mesmo** (conteúdo, cores, fontes,
ordem das seções, identidade visual); entram só **pequenas melhorias de UI/UX** e
polimento (performance, acessibilidade, consistência), com ótima visualização em
desktop e celular.

## Objetivos

- Estrutura de pastas clara: HTML dividido por seção, CSS dividido por
  responsabilidade, JS em módulos pequenos e comentados (comentários e README em
  português; classes/variáveis em inglês, padrão BEM simples).
- Uma única fonte de verdade para dados de contato (telefone, link do WhatsApp,
  e-mail, Instagram, endereço) — hoje o link do WhatsApp está repetido 7×.
- CSS consolidado: remover regras sobrepostas (header redefinido 3×, hacks de
  `left: calc(...)`), usar variáveis (tokens) e nomes legíveis no lugar de
  `.qp`, `.qf`, `.wa`, `.nm`, `.igico`.
- Imagens leves: fotos originais de `img/` convertidas para WebP em 2 tamanhos
  com `srcset`, com `width`/`height` (sem "pulo" de layout).
- Melhorias de UX aprovadas:
  1. Menu ☰ no celular (hoje os links quebram em 2–3 linhas).
  2. **Cabeçalho: logo grande no topo (como hoje) + barra compacta fixa que
     aparece ao rolar** (escolha do usuário). No celular: logo centralizado com
     botão ☰ no canto; ao rolar, a mesma barra compacta com ☰.
  3. Destaque do item do menu da seção visível (scroll-spy).
  4. Galeria da frota: clique abre a foto ampliada (lightbox com `<dialog>`,
     setas, Esc).
  5. Validação do formulário de cotação com mensagens claras em português.
  6. Animações suaves de entrada e abertura animada do FAQ, desligadas com
     `prefers-reduced-motion`.
  7. Link "Pular para o conteúdo", foco visível, `width`/`height` nas imagens.
  8. Ano do rodapé automático.

## Não-objetivos

- Não mudar textos, ordem das seções, paleta de cores, fontes ou o tom visual.
- Não adicionar framework (React/Vue), backend, CMS ou novas seções.
- Não adicionar fotos novas além das 13 já usadas no site.

## Anti-objetivos (seria falha mesmo "funcionando")

- Conteúdo renderizado só via JavaScript (prejudica SEO e quem tem JS lento).
- Conteúdo escondido se o JS falhar (animações de entrada só se aplicam com a
  classe `js` no `<html>`).
- Rolagem horizontal no celular; botão flutuante cobrindo campos do formulário.
- Código "esperto" demais para um júnior seguir.

## Restrições e fatos levantados

- 13 fotos do HTML batem 1:1 com arquivos em `img/` (hash visual, distância ≤ 12):

  | Uso no site                        | id antigo | arquivo em `img/` (WhatsApp Image 2026-11-26 at …)    |
  | ---------------------------------- | --------- | ----------------------------------------------------- |
  | Fundo do hero                      | hero      | 13.28.16.jpeg                                         |
  | Quem somos + 4º bloco do Instagram | dup2      | 13.26.57 (2).jpeg                                     |
  | Frota — cabine com mesa (destaque) | dup3      | 13.26.57 (3).jpeg                                     |
  | Frota — PT-VAT no pátio            | dup4      | 13.28.09 (2).jpeg                                     |
  | Frota — painel ao entardecer       | dup5      | 13.28.10 (1).jpeg                                     |
  | Frota — cabine em couro            | dup6      | 13.26.58 (2).jpeg                                     |
  | Frota — vista frontal              | dup7      | 13.28.08 (1).jpeg                                     |
  | Táxi aéreo executivo               | dup8      | 13.26.57.jpeg                                         |
  | Segurança                          | dup9      | 13.26.59.jpeg                                         |
  | Instagram 1                        | dup10     | 13.26.58 (4).jpeg                                     |
  | Instagram 2                        | dup11     | 13.26.57 (4).jpeg                                     |
  | Instagram 3                        | dup12     | 13.28.17.jpeg                                         |
  | Logo (header e rodapé)             | dup1      | `Downloads/tucano/logo-oxe-tucano.png` (transparente) |

- O ornamento de canto das seções (`--detalhe`, PNG 640×849 com transparência)
  não existe em `img/`: é extraído do HTML original.
- O favicon do HTML é o **logo antigo em 3D**; passa a ser gerado do logo atual.
- `logo-oxe-tucano.svg` foi avaliado: é vetorização automática, com bordas
  irregulares no "oxe" em tamanho grande — usamos o PNG (convertido em WebP).
- Node 24, Vite 8. Playwright/Chromium disponível para comparar screenshots.

## Abordagens consideradas

1. **HTML estático dividido em "partials" + plugin Vite próprio (~40 linhas)**
   — escolhida. O `index.html` inclui arquivos de seção via
   `<!-- include: sections/hero.html -->` e troca `{{ variavel }}` por dados de
   `src/data/site.js`. O HTML final continua estático (SEO bom), sem
   dependência extra, e o plugin é curto e comentado.
2. Seções montadas por JavaScript (template strings) — descartada: conteúdo
   depende de JS (SEO/performance piores) e é mais difícil para júnior.
3. Framework (React/Vue/Astro) — descartada: exagero para uma página estática,
   curva de aprendizado maior.

## Design

### Estrutura

```
index.html                  ← <head> + lista de includes (o "sumário" da página)
vite.config.js              ← registra o plugin de partials
vite-plugins/html-partials.js
scripts/optimize-images.js  ← `npm run images`: images-source/ → src/assets/images/*.webp
images-source/              ← originais com nomes descritivos (cópias de img/)
public/                     ← favicon, apple-touch-icon, og-image, robots.txt
src/
  main.js                   ← importa fontes + CSS e inicia cada módulo
  data/site.js              ← telefone, mensagem do WhatsApp, e-mail, endereço…
  partials/                 ← header, compact-bar, nav-links, mobile-menu, footer,
                               whatsapp-float, lightbox
  sections/                 ← hero, quote-form, about, why-oxe, fleet, executive,
                               destinations, safety, gallery, faq, location, contact
  styles/
    main.css                ← só @imports, na ordem
    base/                   ← variables, reset, typography, layout (container, section, split)
    components/             ← button, card, chips, ticks, specs, ornament, reveal, faq…
    layout/                 ← header, compact-bar, mobile-menu, footer, whatsapp-float
    sections/               ← estilos específicos de cada seção
  js/                       ← compact-bar, mobile-menu, scroll-spy, quote-form,
                               lightbox, reveal, whatsapp-float, current-year
  assets/images/            ← WebP gerados (Vite aplica hash no build)
```

### Pontos de comportamento

- **Barra compacta**: `IntersectionObserver` observa o `<header>` grande; quando
  ele sai da tela, a barra (`position: fixed`, ~72px) desliza para baixo. Os
  links do menu ficam num partial único (`nav-links.html`) incluído no header,
  na barra e no menu mobile — sem copiar e colar. Barra oculta usa
  `visibility: hidden` (não recebe foco nem é lida por leitor de tela).
- **Menu mobile**: um painel único, aberto pelo ☰ do header ou da barra;
  `aria-expanded`, fecha com Esc, clique em link ou fora.
- **Âncoras**: `scroll-padding-top` = altura da barra compacta + folga.
- **Formulário**: mesma mensagem do original para o WhatsApp; `novalidate` +
  mensagens próprias por campo (`aria-invalid`, `aria-describedby`); data
  mínima = hoje.
- **Lightbox**: `<dialog>` nativo; reaproveita o `srcset` da miniatura com
  `sizes="100vw"` para o navegador baixar a versão grande sozinho.
- **Botão flutuante do WhatsApp**: some enquanto o formulário de cotação está
  visível (não cobre os campos no celular).
- **Fontes**: auto-hospedadas via `@fontsource-variable` (sem requisição ao
  Google Fonts).
- **Animações**: só com `html.js` e sem `prefers-reduced-motion`; FAQ animado via
  `::details-content` (melhoria progressiva — sem suporte, abre instantâneo).

### Qualidade

- Prettier + ESLint (config mínima) com scripts `npm run format` / `npm run lint`.
- README em português: como rodar, estrutura, "como trocar o telefone", "como
  adicionar uma foto", "como adicionar uma seção".
- Verificação: `npm run build` sem erros; screenshots Playwright desktop
  (1440) e mobile (390) comparados com o original; checagem de rolagem
  horizontal, links do WhatsApp, formulário, menu, lightbox.

## Calls que ficaram com o implementador (decisões minhas)

- Nomes de classes em inglês com BEM simples; IDs das âncoras ficam em português
  (`#quem-somos`, `#frota`…) para não quebrar links já compartilhados.
- Tamanhos de imagem: fotos em 640 e 1280 px (limitado ao tamanho do original);
  logo em 160/560/1080; ornamento em 320/640. Qualidade WebP ~78.
- Galeria mobile: a foto de destaque ocupa as 2 colunas (evita a foto "órfã"
  que sobra hoje no grid de 5).
- Botão "Solicitar Cotação" do menu com texto centralizado (hoje fica
  desalinhado para cima).
- `img/` original não é apagado; o projeto usa cópias renomeadas em
  `images-source/`.
