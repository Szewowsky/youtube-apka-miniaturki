import { describe, expect, it } from 'vitest';
import { KOMUNIKATY, TEKSTY_APLIKACJI } from './komunikaty';

describe('komunikaty', () => {
  it('zawiera dosłowne komunikaty statusów ze specyfikacji', () => {
    expect(KOMUNIKATY).toEqual({
      short: 'To jest Short - pomijam',
      nieprawidlowyLink: 'To nie jest link do filmu YouTube',
      duplikat: 'Duplikat',
      ponadLimit: 'Ponad limit 50',
      filmNiedostepny: 'Film niedostępny (prywatny lub usunięty)',
      filmPrywatny: 'Film niedostępny (prywatny)',
      filmUsuniety: 'Film niedostępny (usunięty)',
      brakPolaczenia: 'Brak połączenia - spróbuj ponownie',
      odswiezStrone: 'Odśwież stronę',
      gotowe: 'Gotowe',
      czeka: 'Czeka',
      pobieram: 'Pobieram…',
    });
  });

  it('zawiera teksty pustej Aplikacji', () => {
    expect(TEKSTY_APLIKACJI.naglowek).toBe('Miniaturki YouTube');
    expect(TEKSTY_APLIKACJI.pobierzWszystkie).toBe('Pobierz wszystkie');
    expect(TEKSTY_APLIKACJI.poleLinkow.length).toBeGreaterThan(0);
  });
});
