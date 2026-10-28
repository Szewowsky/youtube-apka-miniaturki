// Content script na www.youtube.com: dodaje Przycisk pobierania pod oglądanym Filmem
// i na kartach Filmów na listach (strona główna, kanał, wyszukiwarka, kolumna obok Filmu).
// YouTube nie przeładowuje strony przy przejściu do innego Filmu i przerysowuje rząd
// akcji, więc wstawiamy przycisk ponownie po każdej nawigacji i zmianie w DOM.

import './przycisk.css';
import { idFilmuZLinku, idOgladanegoFilmu, jestStronaShorta } from './id-filmu';
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

function linkMiniaturki(karta: Element): HTMLAnchorElement | null {
  return (
    karta.querySelector<HTMLAnchorElement>(SELEKTORY.linkMiniaturki) ??
    karta.querySelector<HTMLAnchorElement>(SELEKTORY.linkMiniaturkiZapasowy)
  );
}

function jestKartaShorta(karta: Element): boolean {
  return Boolean(karta.closest(SELEKTORY.polkaShortow) || karta.querySelector(SELEKTORY.linkShorta));
}

function wstawNaKartach(): void {
  if (jestStronaShorta(location.pathname)) return;
  for (const karta of document.querySelectorAll(SELEKTORY.kartaFilmu)) {
    if (jestKartaShorta(karta)) continue;
    const link = linkMiniaturki(karta);
    if (!link || !idFilmuZLinku(link.href)) continue;
    const kontener = link.querySelector(SELEKTORY.kontenerMiniaturki) ?? link.closest(SELEKTORY.kontenerMiniaturki);
    if (!kontener || kontener.querySelector(`:scope > .${PREFIKS}-przycisk-karta`)) continue;
    // Link czytamy przy kliknięciu: YouTube potrafi podpiąć pod tę samą kartę inny Film.
    kontener.append(utworzPrzycisk('karta', () => idFilmuZLinku(linkMiniaturki(karta)?.href)));
  }
}

function odswiez(): void {
  wstawPodFilmem();
  wstawNaKartach();
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

// Podgląd wideo YouTube (po 1-2 s najechania) potrafi leżeć w warstwie nad całą kartą,
// więc żaden z-index nie wyciągnie przycisku wyżej. Gdy kursor jest nad miejscem przycisku,
// chowamy podgląd i pokazujemy przycisk; elementsFromPoint widzi też warstwy przykryte.
const KLASA_WSKAZANY = `${PREFIKS}-wskazany`;
const KLASA_NAD_PRZYCISKIEM = `${PREFIKS}-nad-przyciskiem`;
let wskazany: Element | undefined;
let pozycjaKursora: { x: number; y: number } | undefined;

function sprawdzKursor(): void {
  const punkt = pozycjaKursora;
  pozycjaKursora = undefined;
  if (!punkt) return;
  const pod = document
    .elementsFromPoint(punkt.x, punkt.y)
    .find((element) => element.closest(`.${PREFIKS}-przycisk-karta`))
    ?.closest(`.${PREFIKS}-przycisk-karta`);
  if (pod === wskazany) return;
  wskazany?.classList.remove(KLASA_WSKAZANY);
  wskazany = pod ?? undefined;
  wskazany?.classList.add(KLASA_WSKAZANY);
  document.documentElement.classList.toggle(KLASA_NAD_PRZYCISKIEM, Boolean(wskazany));
}

document.addEventListener(
  'mousemove',
  (zdarzenie) => {
    if (!pozycjaKursora) requestAnimationFrame(sprawdzKursor);
    pozycjaKursora = { x: zdarzenie.clientX, y: zdarzenie.clientY };
  },
  { passive: true },
);

// Reagujemy tylko na nowe elementy: odtwarzacz co chwilę podmienia same teksty (licznik czasu).
function dodanoElementy(zmiany: MutationRecord[]): boolean {
  return zmiany.some((zmiana) =>
    [...zmiana.addedNodes].some(
      (wezel) => wezel instanceof Element && !wezel.classList.contains(`${PREFIKS}-przycisk`),
    ),
  );
}

document.addEventListener(SELEKTORY.zdarzenieNawigacji, zaplanuj);
new MutationObserver((zmiany) => {
  if (dodanoElementy(zmiany)) zaplanuj();
}).observe(document.documentElement, { childList: true, subtree: true });
zaplanuj();
