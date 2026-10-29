import { describe, expect, it } from 'vitest';
import { TEKSTY_APLIKACJI } from '../rdzen/komunikaty';
import { podzielNaglowek, podzielPodsumowanie, ZNAKI_STANU, type StanWiersza } from './wyglad';

const STANY: StanWiersza[] = ['czeka', 'pobieram', 'gotowe', 'blad', 'pominiety'];

describe('ikony stanów wiersza', () => {
  it.each(STANY)('stan %s ma ikonę SVG 20×20 ukrytą przed czytnikami ekranu', (stan) => {
    expect(ZNAKI_STANU[stan]).toMatch(/^<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">/);
  });

  it('każdy stan ma inną ikonę', () => {
    expect(new Set(STANY.map((s) => ZNAKI_STANU[s])).size).toBe(STANY.length);
  });

  it('kolory ikon pochodzą wyłącznie z tokenów, bez wartości na sztywno', () => {
    for (const stan of STANY) {
      expect(ZNAKI_STANU[stan]).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(ZNAKI_STANU[stan]).toMatch(/var\(--/);
    }
  });

  it('czerwień akcentu tylko w łuku „pobieram”, czerwień błędu tylko w ikonie błędu', () => {
    expect(STANY.filter((s) => ZNAKI_STANU[s].includes('--akcent'))).toEqual(['pobieram']);
    expect(STANY.filter((s) => ZNAKI_STANU[s].includes('--blad'))).toEqual(['blad']);
  });

  it('obraca się tylko łuk „pobieram”', () => {
    expect(STANY.filter((s) => ZNAKI_STANU[s].includes('class="obrot"'))).toEqual(['pobieram']);
  });
});

describe('podział tekstów do wyróżnienia', () => {
  it('nagłówek: pierwsze słowo na marker, reszta bez zmian', () => {
    const { wyrozniony, reszta } = podzielNaglowek(TEKSTY_APLIKACJI.naglowek);
    expect(wyrozniony).toBe('Miniaturki');
    expect(wyrozniony + reszta).toBe(TEKSTY_APLIKACJI.naglowek);
  });

  it('nagłówek z jednym słowem trafia w całości na marker', () => {
    expect(podzielNaglowek('Miniaturki')).toEqual({ wyrozniony: 'Miniaturki', reszta: '' });
  });

  it('podsumowanie: liczba Filmów pogrubiona, pominięte osobno', () => {
    const pelny = TEKSTY_APLIKACJI.podsumowanieRozpoznania(6, 4);
    const krotki = TEKSTY_APLIKACJI.podsumowanieRozpoznania(6, 0);
    expect(podzielPodsumowanie(pelny, krotki)).toEqual({
      wyrozniony: 'Filmów do pobrania: 6',
      reszta: ', pominiętych: 4',
    });
  });

  it('podsumowanie bez pominiętych jest w całości pogrubione', () => {
    const tekst = TEKSTY_APLIKACJI.podsumowanieRozpoznania(3, 0);
    expect(podzielPodsumowanie(tekst, tekst)).toEqual({ wyrozniony: tekst, reszta: '' });
  });
});
