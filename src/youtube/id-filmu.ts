// Odczyt identyfikatora Filmu na stronie YouTube. Zawsze w chwili kliknięcia,
// bo YouTube podmienia treść strony i kart bez przeładowania.

import { rozpoznajLink } from '../rdzen/rozpoznawanie';

export function idFilmuZLinku(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const wynik = rozpoznajLink(href);
  return wynik.rodzaj === 'film' ? wynik.id : undefined;
}

export function idOgladanegoFilmu(href: string): string | undefined {
  try {
    if (new URL(href).pathname !== '/watch') return undefined;
  } catch {
    return undefined;
  }
  return idFilmuZLinku(href);
}

export function jestStronaShorta(sciezka: string): boolean {
  return sciezka.startsWith('/shorts/');
}
