// Logika listy Filmów w Aplikacji, bez strony: co pobierać, co liczyć, jak oznaczyć
// Film, którego według oEmbed nie ma.

import type { WynikMetadanych } from '../rdzen/metadane';
import type { StanWiersza } from './wyglad';

export type PozycjaListy = {
  /** Rozpoznany link do Filmu (nie Short, nie duplikat, nie ponad limit). */
  film: boolean;
  stan: StanWiersza;
  /** oEmbed potwierdził, że Filmu nie ma: nie liczymy go i nie pobieramy. */
  niedostepny: boolean;
};

/** Do pobrania: Filmy, które nie są jeszcze gotowe; błąd pobierania można ponowić. */
export function doPobrania<T extends PozycjaListy>(pozycje: readonly T[]): T[] {
  return pozycje.filter((p) => p.film && !p.niedostepny && p.stan !== 'gotowe');
}

/** Liczba w podsumowaniu „Filmów do pobrania”: rozpoznane Filmy bez niedostępnych. */
export function liczbaFilmowDoPobrania(pozycje: readonly PozycjaListy[]): number {
  return pozycje.filter((p) => p.film && !p.niedostepny).length;
}

/** Gdy oEmbed potwierdza brak Filmu, wiersz od razu przechodzi w błąd z tym komunikatem. */
export function bladZMetadanych(wynik: WynikMetadanych): string | null {
  return !wynik.ok && wynik.powod === 'niedostepny' ? wynik.komunikat : null;
}
