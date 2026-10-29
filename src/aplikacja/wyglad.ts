// Elementy wyglądu Aplikacji liczone w kodzie: ikony stanów wiersza i podział tekstów
// na część wyróżnioną i resztę. Teksty dalej pochodzą wyłącznie z modułu komunikatów.

export type StanWiersza = 'czeka' | 'pobieram' | 'gotowe' | 'blad' | 'pominiety';

const svg = (wnetrze: string) =>
  `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">${wnetrze}</svg>`;

// Wzór: obiekt `znaki` w design/makieta/index.html. Kolory tylko z tokenów aplikacja.css.
export const ZNAKI_STANU: Record<StanWiersza, string> = {
  czeka: svg(
    '<circle cx="10" cy="10" r="7.8" fill="none" stroke="var(--tekst-pomocniczy)" stroke-width="1.9" stroke-dasharray="2.8 2.6"/>',
  ),
  pobieram: svg(
    '<circle cx="10" cy="10" r="7.6" fill="none" stroke="var(--tor)" stroke-width="2.6"/>' +
      '<g class="obrot"><path d="M10 2.4a7.6 7.6 0 0 1 7.6 7.6" fill="none" stroke="var(--akcent)" stroke-width="2.6" stroke-linecap="round"/></g>',
  ),
  gotowe: svg(
    '<circle cx="10" cy="10" r="9" fill="var(--gotowe)"/>' +
      '<path d="M5.8 10.3l2.7 2.7 5.6-5.6" fill="none" stroke="var(--karta)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  ),
  blad: svg(
    '<circle cx="10" cy="10" r="9" fill="var(--blad)"/>' +
      '<path d="M10 5.4v5.6" stroke="var(--karta)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="10" cy="14.4" r="1.25" fill="var(--karta)"/>',
  ),
  pominiety: svg(
    '<circle cx="10" cy="10" r="7.8" fill="none" stroke="var(--pominiety)" stroke-width="1.9"/>' +
      '<path d="M6.2 13.8l7.6-7.6" stroke="var(--pominiety)" stroke-width="1.9" stroke-linecap="round"/>',
  ),
};

/** Nagłówek „Miniaturki YouTube”: pierwsze słowo idzie na czerwony marker. */
export function podzielNaglowek(tekst: string): { wyrozniony: string; reszta: string } {
  const spacja = tekst.indexOf(' ');
  if (spacja < 0) return { wyrozniony: tekst, reszta: '' };
  return { wyrozniony: tekst.slice(0, spacja), reszta: tekst.slice(spacja) };
}

/** Podsumowanie: część z liczbą Filmów do pobrania jest pogrubiona, reszta (pominięte) nie. */
export function podzielPodsumowanie(
  pelny: string,
  bezPominietych: string,
): { wyrozniony: string; reszta: string } {
  if (!pelny.startsWith(bezPominietych)) return { wyrozniony: pelny, reszta: '' };
  return { wyrozniony: bezPominietych, reszta: pelny.slice(bezPominietych.length) };
}
