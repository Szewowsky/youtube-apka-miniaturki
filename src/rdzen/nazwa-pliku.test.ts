import { describe, expect, it } from 'vitest';
import { MAKS_DLUGOSC_NAZWY, zbudujNazwePliku } from './nazwa-pliku';

const ID = 'dQw4w9WgXcQ';

/** Długość części bazowej (bez `.jpg`) w punktach kodowych. */
function dlugoscBazy(nazwa: string): number {
  expect(nazwa.endsWith('.jpg')).toBe(true);
  return Array.from(nazwa.slice(0, -'.jpg'.length)).length;
}

describe('zbudujNazwePliku - format', () => {
  it('składa nazwę jako "Tytuł - Kanał.jpg"', () => {
    expect(zbudujNazwePliku('Mój film', 'Kanał Roberta', ID)).toBe('Mój film - Kanał Roberta.jpg');
  });

  it('limit części bazowej wynosi 120 znaków', () => {
    expect(MAKS_DLUGOSC_NAZWY).toBe(120);
  });

  it('zostawia emoji i polskie znaki bez zmian', () => {
    expect(zbudujNazwePliku('Zażółć gęślą jaźń 🚀🔥', 'Łódź 🎬', ID)).toBe(
      'Zażółć gęślą jaźń 🚀🔥 - Łódź 🎬.jpg',
    );
  });

  it('tytuł złożony tylko z emoji jest poprawnym tytułem', () => {
    expect(zbudujNazwePliku('🔥🔥🔥', 'Kanał', ID)).toBe('🔥🔥🔥 - Kanał.jpg');
  });
});

describe('zbudujNazwePliku - czyszczenie znaków', () => {
  it('zamienia każdy zakazany znak / \\ : * ? " < > | na myślnik', () => {
    expect(zbudujNazwePliku('a/b\\c:d*e?f"g<h>i|j', 'K', ID)).toBe('a-b-c-d-e-f-g-h-i-j - K.jpg');
  });

  it('ścieżka typu a/b\\c staje się zwykłą nazwą bez separatorów', () => {
    expect(zbudujNazwePliku('a/b\\c', 'Kanał', ID)).toBe('a-b-c - Kanał.jpg');
  });

  it('"Film: część 1?" - dwukropek przed spacją staje się " - ", końcowy znak zapytania znika', () => {
    expect(zbudujNazwePliku('Film: część 1?', 'Kanał', ID)).toBe('Film - część 1 - Kanał.jpg');
  });

  it('zamienia znaki kontrolne (U+0000-U+001F, U+007F) na myślnik', () => {
    expect(zbudujNazwePliku('a\u0000b\u0009c\u001Fd\u007Fe', 'K\u000Aanał', ID)).toBe('a-b-c-d-e - K-anał.jpg');
  });

  it('zbija wielokrotne spacje do jednej', () => {
    expect(zbudujNazwePliku('Dużo    spacji   tu', 'Mój   kanał', ID)).toBe('Dużo spacji tu - Mój kanał.jpg');
  });

  it('zbija wielokrotne myślniki do jednego, także powstałe po zamianie znaków', () => {
    expect(zbudujNazwePliku('a---b', 'K', ID)).toBe('a-b - K.jpg');
    expect(zbudujNazwePliku('a//??b', 'K', ID)).toBe('a-b - K.jpg');
    expect(zbudujNazwePliku('a-/-b', 'K', ID)).toBe('a-b - K.jpg');
  });

  it('usuwa kropki, spacje i myślniki z początku i końca tytułu i kanału', () => {
    expect(zbudujNazwePliku(' ..- Tytuł -.. ', ' - Kanał. ', ID)).toBe('Tytuł - Kanał.jpg');
  });

  it('usuwa kropkę z końca tytułu (Chrome odrzuca nazwy kończące się kropką)', () => {
    expect(zbudujNazwePliku('Koniec zdania.', 'Kanał', ID)).toBe('Koniec zdania - Kanał.jpg');
    expect(zbudujNazwePliku('Czekaj...', undefined, ID)).toBe('Czekaj.jpg');
  });

  it('zachowuje kropki w środku tytułu', () => {
    expect(zbudujNazwePliku('Wersja 2.0 już jest', 'K', ID)).toBe('Wersja 2.0 już jest - K.jpg');
  });
});

describe('zbudujNazwePliku - pusty tytuł lub kanał', () => {
  it('tytuł "." po czyszczeniu jest pusty → ID.jpg', () => {
    expect(zbudujNazwePliku('.', 'Kanał', ID)).toBe(`${ID}.jpg`);
  });

  it('tytuł "..." → ID.jpg (kanał pomijany)', () => {
    expect(zbudujNazwePliku('...', 'Kanał', ID)).toBe(`${ID}.jpg`);
  });

  it('tytuł z samych spacji → ID.jpg', () => {
    expect(zbudujNazwePliku('   ', 'Kanał', ID)).toBe(`${ID}.jpg`);
  });

  it('tytuł z samych zakazanych znaków → ID.jpg', () => {
    expect(zbudujNazwePliku('/?:*|', 'Kanał', ID)).toBe(`${ID}.jpg`);
  });

  it('brak tytułu (undefined) → ID.jpg', () => {
    expect(zbudujNazwePliku(undefined, 'Kanał', ID)).toBe(`${ID}.jpg`);
    expect(zbudujNazwePliku(undefined, undefined, ID)).toBe(`${ID}.jpg`);
  });

  it('pusty kanał po czyszczeniu → Tytuł.jpg bez " - "', () => {
    expect(zbudujNazwePliku('Tytuł', '...', ID)).toBe('Tytuł.jpg');
    expect(zbudujNazwePliku('Tytuł', '  ', ID)).toBe('Tytuł.jpg');
    expect(zbudujNazwePliku('Tytuł', '', ID)).toBe('Tytuł.jpg');
  });

  it('brak kanału (undefined) → Tytuł.jpg', () => {
    expect(zbudujNazwePliku('Tytuł', undefined, ID)).toBe('Tytuł.jpg');
  });
});

describe('zbudujNazwePliku - limit długości', () => {
  it('nazwa dokładnie na limicie nie jest skracana', () => {
    const tytul = 'a'.repeat(120 - ' - K'.length);
    expect(zbudujNazwePliku(tytul, 'K', ID)).toBe(`${tytul} - K.jpg`);
  });

  it('tytuł 200 znaków jest skracany, kanał zostaje w całości, baza ma 120 znaków', () => {
    const tytul = 'x'.repeat(200);
    const wynik = zbudujNazwePliku(tytul, 'Kanał Roberta', ID);
    expect(wynik).toBe(`${'x'.repeat(120 - ' - Kanał Roberta'.length)} - Kanał Roberta.jpg`);
    expect(dlugoscBazy(wynik)).toBe(120);
  });

  it('tytuł 200 znaków bez kanału jest skracany do 120', () => {
    const wynik = zbudujNazwePliku('y'.repeat(200), undefined, ID);
    expect(wynik).toBe(`${'y'.repeat(120)}.jpg`);
  });

  it('po skróceniu usuwa kropki, spacje i myślniki z końca tytułu', () => {
    // miejsce na tytuł: 120 - " - K".length = 116; cięcie wypada tuż po "... -"
    const tytul = `${'a'.repeat(113)} - . bbbbbbbbbb`;
    const wynik = zbudujNazwePliku(tytul, 'K', ID);
    expect(wynik).toBe(`${'a'.repeat(113)} - K.jpg`);
  });

  it('liczy długość w punktach kodowych i nie rozcina emoji', () => {
    const tytul = '😀'.repeat(200);
    const wynik = zbudujNazwePliku(tytul, 'K', ID);
    expect(wynik).toBe(`${'😀'.repeat(116)} - K.jpg`);
    expect(dlugoscBazy(wynik)).toBe(120);
    expect(wynik).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/u);
  });

  it('kanał dłuższy niż 120: kanał też jest skracany, tytuł dostaje co najmniej 20 znaków', () => {
    const tytul = 'T'.repeat(50);
    const kanal = 'K'.repeat(150);
    const wynik = zbudujNazwePliku(tytul, kanal, ID);
    expect(wynik).toBe(`${'T'.repeat(20)} - ${'K'.repeat(120 - 20 - 3)}.jpg`);
    expect(dlugoscBazy(wynik)).toBe(120);
  });

  it('kanał dłuższy niż 120 i tytuł krótszy niż 20: tytuł zostaje cały, kanał wypełnia resztę', () => {
    const wynik = zbudujNazwePliku('Krótki', 'K'.repeat(150), ID);
    expect(wynik).toBe(`Krótki - ${'K'.repeat(120 - 'Krótki - '.length)}.jpg`);
    expect(dlugoscBazy(wynik)).toBe(120);
  });

  it('długi kanał (ale < 120), który zostawiłby tytułowi mniej niż 20 znaków, też jest skracany', () => {
    const kanal = 'K'.repeat(110);
    const wynik = zbudujNazwePliku('T'.repeat(40), kanal, ID);
    expect(wynik).toBe(`${'T'.repeat(20)} - ${'K'.repeat(97)}.jpg`);
  });

  it('kanał zostaje w całości, gdy tytułowi zostaje co najmniej 20 znaków', () => {
    const kanal = 'K'.repeat(97);
    const wynik = zbudujNazwePliku('T'.repeat(40), kanal, ID);
    expect(wynik).toBe(`${'T'.repeat(20)} - ${kanal}.jpg`);
  });

  it('skrócony kanał nie kończy się kropką ani spacją', () => {
    const kanal = `${'K'.repeat(96)}. ${'Z'.repeat(30)}`;
    const wynik = zbudujNazwePliku('T'.repeat(40), kanal, ID);
    expect(wynik).toBe(`${'T'.repeat(20)} - ${'K'.repeat(96)}.jpg`);
  });

  it('prawdziwy tytuł z ukośnikiem: "M/V" staje się "M-V"', () => {
    expect(zbudujNazwePliku('PSY - GANGNAM STYLE(강남스타일) M/V', 'officialpsy', ID)).toBe(
      'PSY - GANGNAM STYLE(강남스타일) M-V - officialpsy.jpg',
    );
  });

  it('dwukropek i ukośnik otoczone spacjami dają czytelne " - "', () => {
    expect(zbudujNazwePliku('Vlog: dzień 1 / część 2?', 'Kanał', ID)).toBe('Vlog - dzień 1 - część 2 - Kanał.jpg');
  });
});
