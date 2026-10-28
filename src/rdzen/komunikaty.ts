// Jedno źródło wszystkich tekstów Wtyczki widocznych dla użytkownika.

export const KOMUNIKATY = {
  short: 'To jest Short - pomijam',
  nieprawidlowyLink: 'To nie jest link do filmu YouTube',
  duplikat: 'Duplikat',
  ponadLimit: 'Ponad limit 50',
  filmNiedostepny: 'Film niedostępny (prywatny lub usunięty)',
  brakPolaczenia: 'Brak połączenia - spróbuj ponownie',
  odswiezStrone: 'Odśwież stronę',
  gotowe: 'Gotowe',
} as const;

export const TEKSTY_APLIKACJI = {
  naglowek: 'Miniaturki YouTube',
  opis: 'Wklej linki do filmów YouTube, jeden pod drugim.',
  poleLinkow: 'Linki do filmów',
  pobierzWszystkie: 'Pobierz wszystkie',
} as const;
