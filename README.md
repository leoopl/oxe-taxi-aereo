# OXE Táxi Aéreo — Landing page

Site institucional da **OXE Táxi Aéreo** (Maceió/AL), feito com [Vite](https://vite.dev) e
JavaScript puro (sem framework).

## Requisitos

- [Node.js](https://nodejs.org) 20.19 ou mais novo

## Comandos

```bash
npm install       # instala as dependências (só na primeira vez)
npm run dev       # abre o site em http://localhost:5173 e atualiza sozinho ao salvar
npm run build     # gera a versão final na pasta dist/ (é ela que vai para a hospedagem)
npm run preview   # abre a versão final (dist/) para conferir antes de publicar
npm test          # roda os testes automáticos
npm run lint      # procura erros comuns no JavaScript
npm run format    # arruma a formatação de todos os arquivos
npm run images    # gera as imagens otimizadas (veja "Como trocar ou adicionar uma foto")
```

## Estrutura de pastas

```
index.html                 ← "sumário" da página: <head> + lista das seções, em ordem
vite.config.js             ← configuração do Vite
vite-plugins/
  html-partials.js         ← junta os arquivos HTML (explicado abaixo)
scripts/
  optimize-images.js       ← cria as versões leves das fotos (npm run images)
images-source/             ← fotos ORIGINAIS (não vão para o site)
public/                    ← arquivos copiados como estão: ícones, imagem de compartilhamento
src/
  main.js                  ← ponto de entrada: carrega fontes, CSS e cada comportamento
  data/site.js             ← telefone, e-mail, endereço, mensagem do WhatsApp...
  partials/                ← pedaços que se repetem ou ficam fora das seções
  │ header.html              cabeçalho grande (logo + menu)
  │ compact-bar.html         barra que aparece no topo ao rolar
  │ nav-links.html           links do menu (usados em 3 lugares)
  │ menu-button.html         botão ☰
  │ mobile-menu.html         menu do celular
  │ footer.html              rodapé
  │ whatsapp-float.html      botão verde flutuante
  │ lightbox.html            foto ampliada da galeria
  sections/                ← uma seção da página por arquivo
  │ hero.html, quote-form.html, about.html, why-oxe.html, fleet.html,
  │ executive.html, destinations.html, safety.html, gallery.html,
  │ faq.html, location.html, contact.html
  styles/
  │ main.css               ← só importa os outros arquivos, na ordem
  │ base/                    variáveis (cores, fontes), reset, textos, layout
  │ components/              peças reutilizáveis: botão, cartão, foto, FAQ...
  │ layout/                  cabeçalho, barra compacta, menu, rodapé...
  │ sections/                estilos específicos de cada seção
  js/                      ← um arquivo por comportamento (cada um exporta initAlgo())
  │ compact-bar.js           mostra a barra do topo ao rolar
  │ mobile-menu.js           abre/fecha o menu do celular
  │ scroll-spy.js            destaca no menu a seção que está na tela
  │ quote-form.js            valida o formulário e abre o WhatsApp
  │ lightbox.js              galeria com foto ampliada
  │ reveal.js                animação de entrada dos blocos
  │ whatsapp-float.js        esconde o botão flutuante perto do formulário
  │ current-year.js          ano do rodapé
  assets/images/           ← fotos otimizadas (geradas por npm run images)
tests/                     ← testes automáticos (Vitest)
```

## Como o HTML é montado

O `index.html` não tem o conteúdo das seções; ele tem comentários como este:

```html
<!-- include: sections/hero.html -->
```

O plugin `vite-plugins/html-partials.js` troca cada um desses comentários pelo conteúdo do
arquivo (o caminho parte da pasta `src/`). O resultado é **uma página HTML normal**: o Google
lê tudo e nada depende de JavaScript para aparecer.

Dentro dos arquivos HTML, `{{ nome }}` é trocado por um valor de `src/data/site.js`:

```html
<a href="{{ whatsappUrl }}">{{ phoneDisplay }}</a>
<!-- vira -->
<a href="https://wa.me/5582991166258?text=...">(82) 99116-6258</a>
```

Se você usar um `{{ nome }}` que não existe, o `npm run dev` mostra um erro dizendo qual é.

## Tarefas comuns

### Trocar telefone, e-mail ou a mensagem do WhatsApp

Edite **só** `src/data/site.js`. Todos os botões, o rodapé, os contatos e o formulário usam os
dados de lá.

### Trocar ou adicionar uma foto

1. Coloque a foto original em `images-source/` com um nome descritivo (ex.: `fleet-wing.jpeg`).
2. Adicione uma linha na lista `IMAGES` em `scripts/optimize-images.js`:
   `{ file: 'fleet-wing.jpeg', widths: PHOTO_WIDTHS },`
3. Rode `npm run images`. Serão criadas `src/assets/images/fleet-wing-640.webp` e
   `fleet-wing-1280.webp` (o número é a largura real em pixels).
4. Use no HTML (veja exemplos em `src/sections/about.html`):
   ```html
   <img
     src="/src/assets/images/fleet-wing-640.webp"
     srcset="/src/assets/images/fleet-wing-640.webp 640w, /src/assets/images/fleet-wing-1280.webp 1280w"
     sizes="(max-width: 800px) calc(100vw - 40px), 508px"
     width="1280"
     height="960"
     alt="Descrição da foto para quem não enxerga"
     loading="lazy"
   />
   ```
   - `srcset` lista os tamanhos; `sizes` diz o tamanho que a foto ocupa na tela. Com isso o
     navegador baixa só a versão necessária (celular baixa a pequena).
   - `width`/`height` são as proporções da foto: evitam que a página "pule" enquanto carrega.

### Adicionar uma seção

1. Crie `src/sections/minha-secao.html` (copie uma seção parecida como modelo).
2. Inclua no `index.html`, na posição desejada: `<!-- include: sections/minha-secao.html -->`.
3. Se precisar de estilo próprio, crie `src/styles/sections/minha-secao.css` e importe no
   `src/styles/main.css`.
4. Para aparecer no menu, adicione o link em `src/partials/nav-links.html`.

### Mudar cores ou fontes

Tudo está em `src/styles/base/variables.css`.

## Convenções do código

- **Classes CSS** seguem o padrão BEM simples: `bloco`, `bloco__parte`, `bloco--variacao`
  (ex.: `quote-form`, `quote-form__field`, `btn--outline`).
- **Estados** controlados pelo JavaScript começam com `is-` (ex.: `is-visible`, `is-active`).
- **O JavaScript encontra elementos por atributos `data-`** (ex.: `data-quote-form`), não por
  classes. Assim dá para mudar o visual sem quebrar o comportamento.
- **Animações** respeitam a opção "reduzir movimento" do sistema do usuário.
- Comentários em português; nomes de código em inglês.

## Publicação

Rode `npm run build` e envie o conteúdo da pasta `dist/` para a hospedagem (qualquer
hospedagem de site estático serve: Netlify, Vercel, Hostinger, etc.).

A imagem de compartilhamento (`og:image`) usa o endereço `https://www.voeoxe.com.br/og-image.jpg`;
ela só aparece nas redes depois que o site estiver publicado nesse domínio.
