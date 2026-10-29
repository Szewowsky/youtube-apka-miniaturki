import { describe, expect, it } from 'vitest';
import { KOMUNIKATY } from '../rdzen/komunikaty';
import { bladZMetadanych, doPobrania, liczbaFilmowDoPobrania, type PozycjaListy } from './lista';

const film = (zmiany: Partial<PozycjaListy> = {}): PozycjaListy => ({
  film: true,
  stan: 'czeka',
  niedostepny: false,
  ...zmiany,
});

const czeka = film();
const gotowy = film({ stan: 'gotowe' });
const bladPobrania = film({ stan: 'blad' });
const niedostepny = film({ stan: 'blad', niedostepny: true });
const pominiety: PozycjaListy = { film: false, stan: 'pominiety', niedostepny: false };

describe('doPobrania', () => {
  it('bierze Film, który czeka', () => {
    expect(doPobrania([czeka])).toEqual([czeka]);
  });

  it('pomija Film już pobrany', () => {
    expect(doPobrania([gotowy])).toEqual([]);
  });

  it('ponawia Film z błędem pobrania', () => {
    expect(doPobrania([bladPobrania])).toEqual([bladPobrania]);
  });

  it('pomija Film niedostępny według oEmbed', () => {
    expect(doPobrania([niedostepny])).toEqual([]);
  });

  it('pomija pozycje, które nie są Filmami', () => {
    expect(doPobrania([pominiety])).toEqual([]);
  });

  it('z mieszanej listy zostawia kolejność i tylko Filmy do pobrania', () => {
    expect(doPobrania([czeka, niedostepny, gotowy, bladPobrania, pominiety])).toEqual([
      czeka,
      bladPobrania,
    ]);
  });
});

describe('liczbaFilmowDoPobrania', () => {
  it('nie liczy niedostępnych Filmów ani pozycji pominiętych', () => {
    expect(liczbaFilmowDoPobrania([czeka, niedostepny, niedostepny, pominiety])).toBe(1);
  });

  it('liczy Filmy w każdym stanie poza niedostępnymi, jak podsumowanie po „Rozpoznaj”', () => {
    expect(liczbaFilmowDoPobrania([czeka, gotowy, bladPobrania])).toBe(3);
  });

  it('daje 0, gdy wszystkie Filmy są niedostępne', () => {
    expect(liczbaFilmowDoPobrania([niedostepny, niedostepny])).toBe(0);
  });
});

describe('bladZMetadanych', () => {
  it('Film usunięty lub nieistniejący daje komunikat błędu', () => {
    expect(
      bladZMetadanych({ ok: false, powod: 'niedostepny', komunikat: KOMUNIKATY.filmUsuniety }),
    ).toBe(KOMUNIKATY.filmUsuniety);
  });

  it('niepewny wynik (prywatny, osadzanie wyłączone, brak sieci) nie zmienia stanu', () => {
    expect(
      bladZMetadanych({ ok: false, powod: 'niepewny', komunikat: KOMUNIKATY.filmPrywatny }),
    ).toBeNull();
    expect(
      bladZMetadanych({ ok: false, powod: 'niepewny', komunikat: KOMUNIKATY.brakPolaczenia }),
    ).toBeNull();
  });

  it('udane metadane nie zmieniają stanu', () => {
    expect(bladZMetadanych({ ok: true, tytul: 'Tytuł', kanal: 'Kanał' })).toBeNull();
  });
});
