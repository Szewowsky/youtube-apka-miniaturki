// Rozpoznawanie linków do Filmów YouTube wklejonych do Aplikacji.

export const LIMIT_FILMOW = 50;

export type Rozpoznanie =
  | { rodzaj: 'film'; id: string }
  | { rodzaj: 'short'; id: string }
  | { rodzaj: 'nieprawidlowy' };

export type StatusPozycji = 'film' | 'short' | 'nieprawidlowy' | 'duplikat' | 'ponadLimit';

export type Pozycja = { link: string; status: StatusPozycji; id?: string };

const WZOR_ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTY_YOUTUBE = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

function jakoAdres(tekst: string): URL | undefined {
  const zProtokolem = /^https?:\/\//i.test(tekst) ? tekst : `https://${tekst}`;
  try {
    return new URL(zProtokolem);
  } catch {
    return undefined;
  }
}

function poprawneId(id: string | null | undefined): string | undefined {
  return id && WZOR_ID.test(id) ? id : undefined;
}

export function rozpoznajLink(tekst: string): Rozpoznanie {
  const nieprawidlowy: Rozpoznanie = { rodzaj: 'nieprawidlowy' };
  const przyciety = tekst.trim();
  // Goły identyfikator nie jest linkiem; adres musi zawierać host.
  if (!przyciety.includes('.')) return nieprawidlowy;

  const adres = jakoAdres(przyciety);
  if (!adres) return nieprawidlowy;

  const host = adres.hostname.toLowerCase();
  const segmenty = adres.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    const id = poprawneId(segmenty[0]);
    return id ? { rodzaj: 'film', id } : nieprawidlowy;
  }

  if (!HOSTY_YOUTUBE.has(host)) return nieprawidlowy;

  if (segmenty[0] === 'watch') {
    const id = poprawneId(adres.searchParams.get('v'));
    return id ? { rodzaj: 'film', id } : nieprawidlowy;
  }
  if (segmenty[0] === 'embed') {
    const id = poprawneId(segmenty[1]);
    return id ? { rodzaj: 'film', id } : nieprawidlowy;
  }
  if (segmenty[0] === 'shorts') {
    const id = poprawneId(segmenty[1]);
    return id ? { rodzaj: 'short', id } : nieprawidlowy;
  }
  return nieprawidlowy;
}

// Dzieli wklejony tekst na linie i nadaje każdej pozycji status:
// duplikaty po identyfikatorze, limit liczony tylko dla unikalnych Filmów.
export function rozpoznajListe(tekst: string): Pozycja[] {
  const widziane = new Set<string>();
  let filmow = 0;

  return tekst
    .split(/\r?\n/)
    .map((linia) => linia.trim())
    .filter((linia) => linia.length > 0)
    .map((link): Pozycja => {
      const wynik = rozpoznajLink(link);
      if (wynik.rodzaj === 'nieprawidlowy') return { link, status: 'nieprawidlowy' };
      if (widziane.has(wynik.id)) return { link, status: 'duplikat', id: wynik.id };
      widziane.add(wynik.id);
      if (wynik.rodzaj === 'short') return { link, status: 'short', id: wynik.id };
      filmow += 1;
      return { link, status: filmow > LIMIT_FILMOW ? 'ponadLimit' : 'film', id: wynik.id };
    });
}
