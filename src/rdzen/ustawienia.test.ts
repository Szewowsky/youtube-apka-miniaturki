import { describe, expect, it } from 'vitest';
import { KLUCZ_JAKOSCI, odczytajJakosc, zapiszJakosc, type MagazynUstawien } from './ustawienia';

function magazynWPamieci(poczatek: Record<string, unknown> = {}): MagazynUstawien & { dane: Record<string, unknown> } {
  const dane = { ...poczatek };
  return {
    dane,
    get: async (klucz) => (klucz in dane ? { [klucz]: dane[klucz] } : {}),
    set: async (nowe) => {
      Object.assign(dane, nowe);
    },
  };
}

describe('ustawienia Jakości', () => {
  it('bez zapisanego wyboru zwraca Najwyższą', async () => {
    expect(await odczytajJakosc(magazynWPamieci())).toBe('max');
  });

  it('zwraca zapisaną Jakość', async () => {
    expect(await odczytajJakosc(magazynWPamieci({ [KLUCZ_JAKOSCI]: 'sd' }))).toBe('sd');
  });

  it('nieznana wartość w magazynie daje Najwyższą', async () => {
    expect(await odczytajJakosc(magazynWPamieci({ [KLUCZ_JAKOSCI]: 'ultra' }))).toBe('max');
  });

  it('błąd magazynu daje Najwyższą zamiast wyjątku', async () => {
    const zepsuty: MagazynUstawien = {
      get: async () => {
        throw new Error('brak dostępu');
      },
      set: async () => undefined,
    };
    expect(await odczytajJakosc(zepsuty)).toBe('max');
  });

  it('zapisany wybór jest potem odczytywany', async () => {
    const magazyn = magazynWPamieci();
    await zapiszJakosc(magazyn, 'hq');
    expect(await odczytajJakosc(magazyn)).toBe('hq');
  });
});
