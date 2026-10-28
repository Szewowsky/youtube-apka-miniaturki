import { TEKSTY_APLIKACJI } from '../rdzen/komunikaty';

function wstawTekst(id: string, tekst: string): void {
  const element = document.getElementById(id);
  if (element) element.textContent = tekst;
}

wstawTekst('naglowek', TEKSTY_APLIKACJI.naglowek);
wstawTekst('opis', TEKSTY_APLIKACJI.opis);
wstawTekst('etykieta-linkow', TEKSTY_APLIKACJI.poleLinkow);
wstawTekst('pobierz-wszystkie', TEKSTY_APLIKACJI.pobierzWszystkie);
