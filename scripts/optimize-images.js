/**
 * Gera as imagens otimizadas do site.
 *
 * Como usar:  npm run images
 *
 * Lê as fotos originais de `images-source/` e cria versões leves em WebP
 * dentro de `src/assets/images/`, em mais de um tamanho. O HTML usa esses
 * tamanhos no atributo `srcset`, e o navegador baixa só o que precisa
 * (celular baixa a versão pequena, tela grande baixa a maior).
 *
 * Também gera os ícones e a imagem de compartilhamento em `public/`.
 *
 * Para adicionar uma foto nova:
 *  1. Coloque o arquivo em `images-source/` (ex.: `fleet-wing.jpeg`).
 *  2. Adicione uma linha na lista IMAGES abaixo.
 *  3. Rode `npm run images` e use `src/assets/images/fleet-wing-640.webp` no HTML.
 */
import { mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'images-source';
const OUTPUT_DIR = 'src/assets/images';
const PUBLIC_DIR = 'public';

// Tamanhos padrão (largura em pixels) para fotos. Se o original for menor
// que 1280px, a versão grande fica com o tamanho do original.
const PHOTO_WIDTHS = [640, 1280];

// Configuração do WebP. quality (0 a 100): 75 é um bom equilíbrio entre peso
// e nitidez. effort 6 = compressão mais demorada, porém arquivos menores.
// alphaQuality só vale para imagens com fundo transparente (logo, enfeite).
const WEBP_OPTIONS = { quality: 75, alphaQuality: 80, effort: 6, smartSubsample: true };

const IMAGES = [
  { file: 'hero.jpeg', widths: PHOTO_WIDTHS },
  { file: 'about-tail-sunset.jpeg', widths: PHOTO_WIDTHS },
  { file: 'fleet-cabin-table.jpeg', widths: PHOTO_WIDTHS },
  { file: 'fleet-apron.jpeg', widths: PHOTO_WIDTHS },
  { file: 'fleet-panel-sunset.jpeg', widths: PHOTO_WIDTHS },
  { file: 'fleet-cabin-seats.jpeg', widths: PHOTO_WIDTHS },
  { file: 'fleet-front-sunset.jpeg', widths: PHOTO_WIDTHS },
  { file: 'executive-orange-sky.jpeg', widths: PHOTO_WIDTHS },
  { file: 'safety-dusk.jpeg', widths: PHOTO_WIDTHS },
  // Fotos do Instagram aparecem pequenas (quadradinhos), 640px basta.
  { file: 'instagram-sunset.jpeg', widths: [640] },
  { file: 'instagram-dusk.jpeg', widths: [640] },
  { file: 'instagram-hangar.jpeg', widths: [640] },
  // Logo: pequeno na barra do topo, médio no rodapé, grande no cabeçalho.
  { file: 'logo.png', widths: [160, 560, 1080] },
  // Enfeite de canto das seções (tem fundo transparente).
  { file: 'section-ornament.png', widths: [320, 640] },
];

/** Tamanho de um arquivo em KB, para o relatório no terminal. */
function sizeInKb(filePath) {
  return (statSync(filePath).size / 1024).toFixed(1);
}

/**
 * Cria as versões WebP de uma imagem da lista.
 * O nome do arquivo leva a largura REAL: se a foto original for menor que a
 * largura pedida, ela não é ampliada (ex.: original de 960px → "foto-960.webp").
 */
async function optimizeImage({ file, widths }) {
  const source = path.join(SOURCE_DIR, file);
  const name = path.parse(file).name; // "hero.jpeg" → "hero"
  const { width: sourceWidth } = await sharp(source).metadata();

  // Ex.: pedidos [640, 1280] com original de 960px → [640, 960]
  const finalWidths = [...new Set(widths.map((width) => Math.min(width, sourceWidth)))];

  for (const width of finalWidths) {
    const output = path.join(OUTPUT_DIR, `${name}-${width}.webp`);
    await sharp(source)
      .rotate() // respeita a orientação da câmera (fotos de celular)
      .resize({ width })
      .webp(WEBP_OPTIONS)
      .toFile(output);
    console.log(`  ${output}  (${sizeInKb(output)} KB)`);
  }
}

/** Ícones da aba do navegador e da tela inicial do iPhone, e a imagem de compartilhamento. */
async function createPublicFiles() {
  const logo = path.join(SOURCE_DIR, 'logo.png');
  const white = { r: 255, g: 255, b: 255, alpha: 1 };

  const favicon = path.join(PUBLIC_DIR, 'favicon-32.png');
  await sharp(logo).resize(32, 32, { fit: 'contain', background: white }).png().toFile(favicon);

  // O iPhone não aceita bem transparência no ícone, então usamos fundo branco.
  const appleIcon = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
  await sharp(logo)
    .resize(152, 152, { fit: 'contain', background: white })
    .extend({ top: 14, bottom: 14, left: 14, right: 14, background: white }) // 180x180
    .flatten({ background: white })
    .png()
    .toFile(appleIcon);

  // Imagem que aparece ao compartilhar o link (WhatsApp, Instagram, Facebook...).
  const ogImage = path.join(PUBLIC_DIR, 'og-image.jpg');
  await sharp(path.join(SOURCE_DIR, 'hero.jpeg'))
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ogImage);

  for (const file of [favicon, appleIcon, ogImage]) {
    console.log(`  ${file}  (${sizeInKb(file)} KB)`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(PUBLIC_DIR, { recursive: true });

console.log('Gerando imagens otimizadas...');
for (const image of IMAGES) {
  await optimizeImage(image);
}
await createPublicFiles();
console.log('Pronto!');
