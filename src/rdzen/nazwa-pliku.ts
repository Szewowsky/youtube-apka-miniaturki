/** Maksymalna długość części bazowej nazwy pliku (bez `.jpg`), liczona w punktach kodowych. */
export const MAKS_DLUGOSC_NAZWY = 120;

/** Minimum znaków tytułu, którego bronimy przed bardzo długą nazwą kanału. */
const MIN_DLUGOSC_TYTULU = 20;
const SEPARATOR = ' - ';
const ROZSZERZENIE = '.jpg';

// Znaki zakazane w nazwach plików na Windows/macOS oraz znaki kontrolne.
// eslint-disable-next-line no-control-regex
const ZAKAZANE = /[/\\:*?"<>|\u0000-\u001F\u007F]/gu;
const KONCE = /^[.\s-]+|[.\s-]+$/gu;
const KONIEC = /[.\s-]+$/u;

function przytnijKonce(tekst: string): string {
  return tekst.replace(KONCE, '');
}

function wyczysc(tekst: string | undefined): string {
  if (tekst === undefined) return '';
  return przytnijKonce(
    tekst
      .replace(ZAKAZANE, '-')
      .replace(/ {2,}/gu, ' ')
      .replace(/-{2,}/gu, '-')
      // "Vlog: dzień 1" → "Vlog - dzień 1": myślnik przy spacji dostaje spacje z obu stron.
      .replace(/ ?-(?= )| -/gu, ' - ')
      .replace(/ {2,}/gu, ' '),
  );
}

function dlugosc(tekst: string): number {
  return Array.from(tekst).length;
}

/** Skraca do `limit` punktów kodowych (bez rozcinania par surogatów) i usuwa kropki/spacje/myślniki z końca. */
function skroc(tekst: string, limit: number): string {
  const znaki = Array.from(tekst);
  if (znaki.length <= limit) return tekst;
  return znaki.slice(0, Math.max(0, limit)).join('').replace(KONIEC, '');
}

/**
 * Buduje bezpieczną nazwę pliku Miniaturki: `Tytuł - Kanał.jpg`.
 * Pusty tytuł → `ID.jpg`; pusty kanał → `Tytuł.jpg`.
 * Za długą nazwę skraca najpierw tytuł; kanał skraca dopiero wtedy,
 * gdy tytułowi zostałoby mniej niż 20 znaków (albo mniej niż cały krótszy tytuł).
 */
export function zbudujNazwePliku(tytul: string | undefined, kanal: string | undefined, id: string): string {
  const czystyTytul = wyczysc(tytul);
  if (czystyTytul === '') return `${id}${ROZSZERZENIE}`;

  const czystyKanal = wyczysc(kanal);
  if (czystyKanal === '') return `${skroc(czystyTytul, MAKS_DLUGOSC_NAZWY)}${ROZSZERZENIE}`;

  const miejsceNaTytul = MAKS_DLUGOSC_NAZWY - dlugosc(SEPARATOR) - dlugosc(czystyKanal);
  const minimumTytulu = Math.min(dlugosc(czystyTytul), MIN_DLUGOSC_TYTULU);

  if (miejsceNaTytul >= minimumTytulu) {
    return `${skroc(czystyTytul, miejsceNaTytul)}${SEPARATOR}${czystyKanal}${ROZSZERZENIE}`;
  }

  const krotkiTytul = skroc(czystyTytul, minimumTytulu);
  const miejsceNaKanal = MAKS_DLUGOSC_NAZWY - dlugosc(SEPARATOR) - dlugosc(krotkiTytul);
  const krotkiKanal = skroc(czystyKanal, miejsceNaKanal);
  return `${krotkiTytul}${SEPARATOR}${krotkiKanal}${ROZSZERZENIE}`;
}
