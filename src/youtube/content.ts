// Content script na www.youtube.com: dodaje Przycisk pobierania pod oglądanym Filmem
// i na kartach Filmów na listach (strona główna, kanał, wyszukiwarka, kolumna obok Filmu).
// YouTube nie przeładowuje strony przy przejściu do innego Filmu i przerysowuje rząd
// akcji, więc wstawiamy przycisk ponownie po każdej nawigacji i zmianie w DOM.

import './przycisk.css';
import { idFilmuZLinku, idOgladanegoFilmu, jestStronaShorta } from './id-filmu';
import { PREFIKS, utworzPrzycisk } from './przycisk';
import { SELEKTORY } from './selektory';
import { otworzycWarstweListy, wskazanaKarta } from './wskazana-karta';

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

// Widocznością przycisku na karcie steruje skrypt, nie samo :hover z CSS. Podgląd wideo YouTube
// to warstwa poza kartą (docs/selektory-youtube.md, 3.5): gdy rusza (u części kont po <0,3 s),
// karta traci :hover, choć kursor stoi w miejscu. Kartę pod kursorem liczymy więc z
// elementsFromPoint, który widzi też warstwy przykryte podglądem, i trzymamy ją wskazaną,
// dopóki kursor jest nad nią albo nad jej podglądem.
const KLASA_WSKAZANY = `${PREFIKS}-wskazany`;
const KLASA_NAD_PRZYCISKIEM = `${PREFIKS}-nad-przyciskiem`;
const KLASA_OTWARTA_LISTA = `${PREFIKS}-otwarta-lista`;
const SELEKTOR_PRZYCISKU_KARTY = `.${PREFIKS}-przycisk-karta`;
let wskazana: Element | undefined;
let kursor: { x: number; y: number } | undefined;
let sprawdzenieZaplanowane = false;

function idKarty(karta: Element): string | undefined {
  return idFilmuZLinku(linkMiniaturki(karta)?.href);
}

function kartyPodKursorem(stos: readonly Element[]): Element[] {
  const karty = new Set<Element>();
  for (const element of stos) {
    const karta = element.closest(SELEKTORY.kartaFilmu);
    if (karta?.querySelector(SELEKTOR_PRZYCISKU_KARTY)) karty.add(karta);
  }
  return [...karty];
}

function idPodgladuPodKursorem(stos: readonly Element[]): string | null {
  const podglad = stos.find((element) => element.closest(SELEKTORY.podgladAktywny))?.closest(SELEKTORY.podgladAktywny);
  const link = podglad?.querySelector<HTMLAnchorElement>(SELEKTORY.linkPodgladu);
  return idFilmuZLinku(link?.href) ?? null;
}

function ustawWskazana(karta: Element | undefined): void {
  if (karta === wskazana) return;
  wskazana?.querySelector(SELEKTOR_PRZYCISKU_KARTY)?.classList.remove(KLASA_WSKAZANY);
  wskazana = karta;
  wskazana?.querySelector(SELEKTOR_PRZYCISKU_KARTY)?.classList.add(KLASA_WSKAZANY);
  // Karta w wynikach wyszukiwania: na czas wskazania otwieramy ich warstwę, żeby przycisk
  // wyszedł ponad podgląd (przycisk.css, docs/selektory-youtube.md 3.5).
  document.documentElement.classList.toggle(
    KLASA_OTWARTA_LISTA,
    otworzycWarstweListy(wskazana, (k) => Boolean(k.closest(SELEKTORY.zamknietaWarstwaListy))),
  );
}

function sprawdzKursor(): void {
  sprawdzenieZaplanowane = false;
  if (!kursor) return;
  const stos = document.elementsFromPoint(kursor.x, kursor.y);
  ustawWskazana(
    wskazanaKarta({ karty: kartyPodKursorem(stos), idPodgladu: idPodgladuPodKursorem(stos) }, wskazana, idKarty),
  );
  // Kursor nad samym przyciskiem: chowamy podgląd, żeby nie zasłaniał napisu i kliknięcia.
  const nadPrzyciskiem = stos.some((element) => element.closest(SELEKTOR_PRZYCISKU_KARTY));
  document.documentElement.classList.toggle(KLASA_NAD_PRZYCISKIEM, nadPrzyciskiem);
}

function zaplanujSprawdzenie(): void {
  if (sprawdzenieZaplanowane) return;
  sprawdzenieZaplanowane = true;
  requestAnimationFrame(sprawdzKursor);
}

document.addEventListener(
  'mousemove',
  (zdarzenie) => {
    kursor = { x: zdarzenie.clientX, y: zdarzenie.clientY };
    zaplanujSprawdzenie();
  },
  { passive: true },
);
// Przewijanie przesuwa karty pod nieruchomym kursorem, a mousemove wtedy nie przychodzi.
document.addEventListener('scroll', zaplanujSprawdzenie, { passive: true, capture: true });
// Kursor wyszedł poza okno: nic nie jest wskazane.
document.addEventListener('mouseout', (zdarzenie) => {
  if (zdarzenie.relatedTarget) return;
  kursor = undefined;
  ustawWskazana(undefined);
  document.documentElement.classList.remove(KLASA_NAD_PRZYCISKIEM);
});

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
