# OXE Táxi Aéreo — Landing page

Site institucional da **OXE Táxi Aéreo** (Maceió/AL), feito só com **HTML, CSS e JavaScript**.
Não precisa instalar nada: sem Node, sem `npm install`, sem etapa de build.

## Como abrir o site no computador

- **Jeito mais simples:** dê dois cliques no `index.html`. Ele abre no navegador.
- **Com atualização automática (recomendado):** no VS Code, instale a extensão **Live Server**,
  clique com o botão direito no `index.html` → **Open with Live Server**. A página recarrega
  sozinha sempre que você salva um arquivo.

## Como publicar

Envie estes arquivos e pastas para a hospedagem (Hostinger, Netlify, GitHub Pages etc.), do jeito
que estão:

```
index.html   css/   js/   images/   fonts/   favicon-32.png   apple-touch-icon.png   og-image.jpg
```

O site também funciona dentro de uma subpasta (ex.: `meusite.com.br/oxe/`).

> **Dica — GitHub Pages:** no repositório do GitHub, vá em **Settings → Pages**, escolha
> **Deploy from a branch**, branch `main`, pasta `/ (root)`. Em alguns minutos o site fica no ar.

## Estrutura

```
index.html            ← a página inteira, dividida por comentários grandes (CABEÇALHO, HERO...)
css/styles.css        ← todos os estilos, com um sumário numerado no topo
js/script.js          ← todos os comportamentos, uma função por recurso, com sumário no topo
images/               ← fotos em WebP, já otimizadas (cada foto em 2 tamanhos)
fonts/                ← fontes Manrope (títulos) e DM Sans (textos)
favicon-32.png        ← ícone da aba do navegador
apple-touch-icon.png  ← ícone quando o site é salvo na tela inicial do celular
og-image.jpg          ← imagem que aparece quando o link é compartilhado
docs/                 ← documentos de planejamento (não vão para o site)
```

Para achar algo rápido, use **Ctrl+F**:

- no `index.html`, procure o nome da seção em maiúsculas (ex.: `FROTA`);
- no `css/styles.css`, procure o número e o nome da parte (ex.: `17. Cabeçalho`);
- no `js/script.js`, procure o nome da função (ex.: `initQuoteForm`).

## Tarefas comuns

### Trocar telefone ou e-mail

Os dados aparecem várias vezes na página. Use **Localizar e substituir em todos os arquivos**
(VS Code: **Ctrl+Shift+H**):

| O quê                               | Procure por              |
| ----------------------------------- | ------------------------ |
| Número do WhatsApp (links e script) | `5582991166258`          |
| Telefone como aparece no texto      | `(82) 99116-6258`        |
| E-mail                              | `oxetaxiaereo@gmail.com` |

O número também está no topo do `js/script.js` (`WHATSAPP_PHONE`), usado pelo formulário —
a substituição em todos os arquivos já pega esse lugar.

### Trocar a mensagem pronta do WhatsApp

Nos links, a mensagem vem "codificada" depois de `?text=` (ex.: `Ol%C3%A1!%20Gostaria...`).
Para gerar a nova:

1. Abra qualquer página no navegador, aperte **F12** e vá na aba **Console**.
2. Digite `encodeURIComponent('Sua nova mensagem aqui')` e aperte Enter.
3. Copie o resultado e troque o texto depois de `?text=` em todos os links (Ctrl+Shift+H).

A mensagem do **formulário de cotação** fica na função `buildQuoteMessage`, no `js/script.js`.

### Trocar ou adicionar uma foto

1. Abra a foto em [squoosh.app](https://squoosh.app), escolha o formato **WebP**, qualidade
   **75**, e salve duas versões: uma com **640 px** e outra com **1280 px** de largura.
2. Coloque as duas em `images/` com nomes descritivos, ex.: `fleet-wing-640.webp` e
   `fleet-wing-1280.webp`.
3. Use no `index.html` (copie o modelo de uma foto parecida):

   ```html
   <img
     src="images/fleet-wing-640.webp"
     srcset="images/fleet-wing-640.webp 640w, images/fleet-wing-1280.webp 1280w"
     sizes="(max-width: 800px) calc(100vw - 40px), 508px"
     width="1280"
     height="960"
     alt="Descrição da foto para quem não enxerga"
     loading="lazy"
   />
   ```

   - `srcset` lista os tamanhos; `sizes` diz quanto a foto ocupa na tela. Com isso o navegador
     baixa só a versão necessária (o celular baixa a pequena).
   - `width`/`height` são o tamanho da foto grande: evitam que a página "pule" enquanto carrega.
   - Sempre use caminhos **sem barra no começo** (`images/...`, não `/images/...`).

### Mudar cores ou fontes

No `css/styles.css`, parte **2. Variáveis**. Mudando ali, o site inteiro acompanha.

### Adicionar uma seção

1. No `index.html`, copie uma seção parecida (do comentário grande até o `</section>`) e cole na
   posição desejada. Troque o `id` e os textos.
2. Se precisar de estilo próprio, adicione uma nova parte numerada no fim do `css/styles.css`
   (e no sumário do topo).
3. Para aparecer no menu, adicione o link nas **3 listas de links** do `index.html` (cabeçalho,
   barra compacta e menu do celular).

### Depois de mudar o CSS ou o JS: aumente a versão

O navegador dos visitantes guarda o CSS e o JS por um tempo. Para ele baixar a versão nova,
aumente o número no `index.html` sempre que publicar uma mudança nesses arquivos:

```text
href="css/styles.css?v=1"   →   href="css/styles.css?v=2"
src="js/script.js?v=1"      →   src="js/script.js?v=2"
```

## Convenções do código

- **Classes CSS** seguem o padrão BEM simples: `bloco`, `bloco__parte`, `bloco--variacao`
  (ex.: `quote-form`, `quote-form__field`, `btn--outline`).
- **Estados** controlados pelo JavaScript começam com `is-` (ex.: `is-visible`, `is-active`).
- **O JavaScript encontra elementos por atributos `data-`** (ex.: `data-quote-form`), não por
  classes. Assim dá para mudar o visual sem quebrar o comportamento.
- **Animações** respeitam a opção "reduzir movimento" do sistema do usuário.
- Comentários em português; nomes de código em inglês.

## Formatação automática (opcional)

Os arquivos `.editorconfig` e `.prettierrc.json` são lidos pelo VS Code. Com a extensão
**Prettier** instalada e "Format on Save" ligado, o código fica sempre no mesmo padrão — não
precisa instalar nada no projeto.
