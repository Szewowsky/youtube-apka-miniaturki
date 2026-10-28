// Content script na www.youtube.com: dodaje Przycisk pobierania pod oglądanym Filmem.
// YouTube nie przeładowuje strony przy przejściu do innego Filmu i przerysowuje rząd
// akcji, więc wstawiamy przycisk ponownie po każdej nawigacji i zmianie w DOM.

import './przycisk.css';
import { idOgladanegoFilmu, jestStronaShorta } from './id-filmu';
import { PREFIKS, utworzPrzycisk } from './przycisk';
import { SELEKTORY } from './selektory';

function wstawPodFilmem(): void {
  if (jestStronaShorta(location.pathname) || location.pathname !== '/watch') return;
  const rzad = document.querySelector(SELEKTORY.rzadAkcji);
  if (!rzad || rzad.querySelector(`.${PREFIKS}-przycisk-film`)) return;

  const przycisk = utworzPrzycisk('film', () => idOgladanegoFilmu(location.href));
  const udostepnij = rzad.querySelector(SELEKTORY.przyciskUdostepnij)?.closest(SELEKTORY.hostPrzyciskuYT);
  if (udostepnij && udostepnij.parentElement === rzad) udostepnij.after(przycisk);
  else rzad.append(przycisk);
}

function odswiez(): void {
  wstawPodFilmem();
}

// Zbijamy serię zmian DOM w jedno odświeżenie na klatkę.
let zaplanowane = false;
function zaplanuj(): void {
  if (zaplanowane) return;
  zaplanowane = true;
  requestAnimationFrame(() => {
    zaplanowane = false;
    odswiez();
  });
}

document.addEventListener(SELEKTORY.zdarzenieNawigacji, zaplanuj);
new MutationObserver(zaplanuj).observe(document.documentElement, { childList: true, subtree: true });
zaplanuj();
