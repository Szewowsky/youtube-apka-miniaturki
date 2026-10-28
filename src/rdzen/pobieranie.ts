// Rdzeń pobierania Miniaturki: opadanie Jakości, nazwa pliku, zapis.
// Zależności (fetch, download, metadane) wstrzykiwane - service worker jest cienkim adapterem.

import { KOMUNIKATY } from './komunikaty';
import type { WynikMetadanych } from './metadane';
import { zbudujNazwePliku } from './nazwa-pliku';

export type Jakosc = 'max' | 'sd' | 'hq';

export const DOMYSLNA_JAKOSC: Jakosc = 'max';

const KOLEJNOSC_JAKOSCI: readonly Jakosc[] = ['max', 'sd', 'hq'];

const PLIK_JAKOSCI: Record<Jakosc, string> = {
  max: 'maxresdefault.jpg',
  sd: 'sddefault.jpg',
  hq: 'hqdefault.jpg',
};

export function adresMiniaturki(id: string, jakosc: Jakosc): string {
  return `https://i.ytimg.com/vi/${id}/${PLIK_JAKOSCI[jakosc]}`;
}

export type ZlecenieZapisu = { url: string; filename: string; saveAs: false; conflictAction: 'uniquify' };
export type WynikZapisu = { ok: true } | { ok: false; komunikat: string };
export type WynikPobrania = { status: 'gotowe'; nazwa: string } | { status: 'blad'; komunikat: string };

export type ZaleznosciPobierania = {
  fetch: typeof fetch;
  download: (zlecenie: ZlecenieZapisu) => Promise<WynikZapisu>;
  metadane: (id: string) => Promise<WynikMetadanych>;
};

type WynikSprawdzenia = { rodzaj: 'jest'; url: string } | { rodzaj: 'brak' } | { rodzaj: 'brakSieci' };

// Opadanie od wybranej Jakości w dół; liczy się wyłącznie response.ok
// (404 z YouTube ma treść image/jpeg, więc typ i rozmiar są niewiarygodne).
async function znajdzMiniaturke(id: string, jakosc: Jakosc, pobierz: typeof fetch): Promise<WynikSprawdzenia> {
  const start = Math.max(0, KOLEJNOSC_JAKOSCI.indexOf(jakosc));
  for (const kolejna of KOLEJNOSC_JAKOSCI.slice(start)) {
    const url = adresMiniaturki(id, kolejna);
    try {
      const odpowiedz = await pobierz(url);
      if (odpowiedz.ok) return { rodzaj: 'jest', url };
    } catch {
      return { rodzaj: 'brakSieci' };
    }
  }
  return { rodzaj: 'brak' };
}

async function nazwaPliku(id: string, metadane: ZaleznosciPobierania['metadane']): Promise<string> {
  try {
    const wynik = await metadane(id);
    if (wynik.ok) return zbudujNazwePliku(wynik.tytul, wynik.kanal, id);
  } catch {
    // Błąd metadanych nie jest błędem pobrania - plik dostaje nazwę ID.jpg.
  }
  return zbudujNazwePliku(undefined, undefined, id);
}

export async function pobierzMiniaturke(
  id: string,
  jakosc: Jakosc,
  deps: ZaleznosciPobierania,
): Promise<WynikPobrania> {
  try {
    const miniaturka = await znajdzMiniaturke(id, jakosc, deps.fetch);
    if (miniaturka.rodzaj === 'brakSieci') return { status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia };
    if (miniaturka.rodzaj === 'brak') return { status: 'blad', komunikat: KOMUNIKATY.filmNiedostepny };

    const filename = await nazwaPliku(id, deps.metadane);
    const zapis = await deps.download({
      url: miniaturka.url,
      filename,
      saveAs: false,
      conflictAction: 'uniquify',
    });
    if (!zapis.ok) return { status: 'blad', komunikat: zapis.komunikat };
    return { status: 'gotowe', nazwa: filename };
  } catch {
    return { status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia };
  }
}
