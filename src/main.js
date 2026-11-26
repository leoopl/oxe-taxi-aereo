/**
 * Ponto de entrada do site: carrega fontes, estilos e liga cada comportamento.
 * Cada arquivo em src/js/ cuida de UMA coisa e exporta uma função initAlgo().
 */

// Fontes (baixadas junto com o site, sem depender do Google Fonts).
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';

// Todos os estilos.
import './styles/main.css';

import { initCompactBar } from './js/compact-bar.js';
import { initCurrentYear } from './js/current-year.js';
import { initLightbox } from './js/lightbox.js';
import { initMobileMenu } from './js/mobile-menu.js';
import { initQuoteForm } from './js/quote-form.js';
import { initReveal } from './js/reveal.js';
import { initScrollSpy } from './js/scroll-spy.js';
import { initWhatsappFloat } from './js/whatsapp-float.js';

initReveal();
initCompactBar();
initMobileMenu();
initQuoteForm();
initLightbox();
initScrollSpy();
initWhatsappFloat();
initCurrentYear();
