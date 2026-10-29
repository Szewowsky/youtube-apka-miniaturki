// Pobieranie tytułu i nazwy kanału Filmu z publicznego oEmbed YouTube.

import { KOMUNIKATY } from './komunikaty';

// `niedostepny`: YouTube potwierdził, że Filmu nie ma (400 lub 404); Miniaturki też wtedy nie ma.
// `niepewny`: nie wiadomo, czy Miniaturka istnieje. 401/403 dostaje też Film z wyłączonym
// osadzaniem, którego Miniaturkę da się pobrać; brak sieci niczego nie przesądza.
export type PowodBrakuMetadanych = 'niedostepny' | 'niepewny';

export type WynikMetadanych =
  | { ok: true; tytul: string; kanal: string }
  | { ok: false; powod: PowodBrakuMetadanych; komunikat: string };

export function adresOembed(id: string): string {
  return (
    'https://www.youtube.com/oembed?url=' +
    encodeURIComponent(`https://www.youtube.com/watch?v=${id}`) +
    '&format=json'
  );
}

function niepustyTekst(wartosc: unknown): string | null {
  if (typeof wartosc !== 'string') return null;
  const przyciety = wartosc.trim();
  return przyciety === '' ? null : przyciety;
}

const BRAK_POLACZENIA: WynikMetadanych = {
  ok: false,
  powod: 'niepewny',
  komunikat: KOMUNIKATY.brakPolaczenia,
};

export async function pobierzMetadane(
  id: string,
  deps: { fetch: typeof fetch },
): Promise<WynikMetadanych> {
  try {
    const odpowiedz = await deps.fetch(adresOembed(id));
    if (odpowiedz.status === 401 || odpowiedz.status === 403) {
      return { ok: false, powod: 'niepewny', komunikat: KOMUNIKATY.filmPrywatny };
    }
    // YouTube odpowiada 400 dla nieistniejącego identyfikatora, 404 dla usuniętego Filmu.
    if (odpowiedz.status === 400 || odpowiedz.status === 404) {
      return { ok: false, powod: 'niedostepny', komunikat: KOMUNIKATY.filmUsuniety };
    }
    if (odpowiedz.status !== 200) return BRAK_POLACZENIA;

    const dane: unknown = await odpowiedz.json();
    if (typeof dane !== 'object' || dane === null) return BRAK_POLACZENIA;
    const rekord = dane as Record<string, unknown>;
    const tytul = niepustyTekst(rekord.title);
    const kanal = niepustyTekst(rekord.author_name);
    if (tytul === null || kanal === null) return BRAK_POLACZENIA;
    return { ok: true, tytul, kanal };
  } catch {
    return BRAK_POLACZENIA;
  }
}
