// Ustawienia Wtyczki: jedno pole, Jakość. Magazyn wstrzykiwany (w Wtyczce: chrome.storage.sync).

import { DOMYSLNA_JAKOSC, type Jakosc } from './pobieranie';

export const KLUCZ_JAKOSCI = 'jakosc';

export type MagazynUstawien = {
  get(klucz: string): Promise<Record<string, unknown>>;
  set(dane: Record<string, unknown>): Promise<void>;
};

export function jestJakoscia(wartosc: unknown): wartosc is Jakosc {
  return wartosc === 'max' || wartosc === 'sd' || wartosc === 'hq';
}

export async function odczytajJakosc(magazyn: MagazynUstawien): Promise<Jakosc> {
  try {
    const zapisane = (await magazyn.get(KLUCZ_JAKOSCI))[KLUCZ_JAKOSCI];
    return jestJakoscia(zapisane) ? zapisane : DOMYSLNA_JAKOSC;
  } catch {
    return DOMYSLNA_JAKOSC;
  }
}

export async function zapiszJakosc(magazyn: MagazynUstawien, jakosc: Jakosc): Promise<void> {
  await magazyn.set({ [KLUCZ_JAKOSCI]: jakosc });
}
