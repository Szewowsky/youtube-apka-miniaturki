// Kontrakt komunikatów do tła Wtyczki (Aplikacja i Przycisk pobierania → service worker).
// Odpowiedź to WynikPobrania z rdzenia, wysyłana dopiero po faktycznym zapisie pliku.

export type ZleceniePobrania = { typ: 'pobierz'; id: string };

export function jestZleceniemPobrania(wiadomosc: unknown): wiadomosc is ZleceniePobrania {
  if (typeof wiadomosc !== 'object' || wiadomosc === null) return false;
  const rekord = wiadomosc as Record<string, unknown>;
  return rekord.typ === 'pobierz' && typeof rekord.id === 'string';
}
