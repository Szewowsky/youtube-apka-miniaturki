// Jedno źródło wszystkich tekstów Wtyczki widocznych dla użytkownika.

export const KOMUNIKATY = {
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
} as const;

export const TEKSTY_APLIKACJI = {
  naglowek: 'Miniaturki YouTube',
  opis: 'Wklej linki do filmów YouTube, jeden pod drugim.',
  poleLinkow: 'Linki do filmów',
  rozpoznaj: 'Rozpoznaj',
  jakosc: 'Jakość',
  jakosci: {
    max: 'Najwyższa (1280×720)',
    sd: 'Średnia (640×480)',
    hq: 'Niska (480×360)',
  },
  pobierzWszystkie: 'Pobierz wszystkie',
  wczytuje: 'Wczytuję tytuł…',
  podsumowanieRozpoznania: (filmow: number, pominietych: number) =>
    `Filmów do pobrania: ${filmow}` + (pominietych ? `, pominiętych: ${pominietych}` : ''),
} as const;

export const TEKSTY_PRZYCISKU = {
  etykieta: 'Miniaturka',
  podpowiedz: 'Pobierz Miniaturkę',
} as const;
