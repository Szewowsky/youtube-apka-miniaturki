import { describe, expect, it } from 'vitest';
import { LIMIT_FILMOW, rozpoznajLink, rozpoznajListe } from './rozpoznawanie';

const ID = 'dQw4w9WgXcQ';
const film = { rodzaj: 'film', id: ID };

describe('rozpoznajLink', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['https://youtube.com/watch?v=dQw4w9WgXcQ'],
    ['http://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['youtube.com/watch?v=dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&index=2'],
    ['https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abcDEF123'],
    ['https://youtu.be/dQw4w9WgXcQ?t=10'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ?start=5'],
    ['  https://youtu.be/dQw4w9WgXcQ  '],
  ])('rozpoznaje Film w linku %s', (link) => {
    expect(rozpoznajLink(link)).toEqual(film);
  });

  it.each([
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ?si=xyz'],
    ['https://m.youtube.com/shorts/dQw4w9WgXcQ'],
  ])('rozpoznaje Short w linku %s', (link) => {
    expect(rozpoznajLink(link)).toEqual({ rodzaj: 'short', id: ID });
  });

  it.each([
    ['https://vimeo.com/123456'],
    ['https://www.youtube.com/@kanal'],
    ['https://www.youtube.com/watch?v=za-krotki'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQQ'],
    ['https://www.youtube.com/'],
    ['https://youtu.be/'],
    ['https://notyoutube.com/watch?v=dQw4w9WgXcQ'],
    ['https://www.youtube.com.evil.pl/watch?v=dQw4w9WgXcQ'],
    ['jakiś tekst'],
    ['dQw4w9WgXcQ'],
  ])('odrzuca %s jako nie link do Filmu', (link) => {
    expect(rozpoznajLink(link)).toEqual({ rodzaj: 'nieprawidlowy' });
  });
});

describe('rozpoznajListe', () => {
  it('pomija puste linie i spacje', () => {
    const wynik = rozpoznajListe(`\n  https://youtu.be/${ID}  \n\n   \n`);
    expect(wynik).toEqual([{ link: `https://youtu.be/${ID}`, status: 'film', id: ID }]);
  });

  it('oznacza Shorty i nieprawidłowe linki', () => {
    const wynik = rozpoznajListe(`https://www.youtube.com/shorts/${ID}\nbzdura`);
    expect(wynik.map((p) => p.status)).toEqual(['short', 'nieprawidlowy']);
  });

  it('ten sam Film w dwóch formatach linku to duplikat, zostaje pierwsze wystąpienie', () => {
    const wynik = rozpoznajListe(
      `https://www.youtube.com/watch?v=${ID}\nhttps://youtu.be/${ID}?si=abc`,
    );
    expect(wynik.map((p) => p.status)).toEqual(['film', 'duplikat']);
    expect(wynik[1]?.id).toBe(ID);
  });

  it('powtórzony Short też jest duplikatem', () => {
    const link = `https://www.youtube.com/shorts/${ID}`;
    expect(rozpoznajListe(`${link}\n${link}`).map((p) => p.status)).toEqual(['short', 'duplikat']);
  });

  it(`przepuszcza ${LIMIT_FILMOW} Filmów, kolejne dostają status ponad limit`, () => {
    const idki = Array.from({ length: 52 }, (_, i) => `film${String(i).padStart(7, '0')}`);
    const tekst = [...idki.map((id) => `https://youtu.be/${id}`), 'bzdura'].join('\n');
    const wynik = rozpoznajListe(tekst);
    expect(wynik.filter((p) => p.status === 'film')).toHaveLength(50);
    expect(wynik.slice(50, 52).map((p) => p.status)).toEqual(['ponadLimit', 'ponadLimit']);
    expect(wynik[52]?.status).toBe('nieprawidlowy');
  });

  it('duplikaty nie zjadają limitu', () => {
    const idki = Array.from({ length: 50 }, (_, i) => `film${String(i).padStart(7, '0')}`);
    const tekst = [`https://youtu.be/${idki[0]}`, ...idki.map((id) => `https://youtu.be/${id}`)].join('\n');
    const wynik = rozpoznajListe(tekst);
    expect(wynik.filter((p) => p.status === 'film')).toHaveLength(50);
    expect(wynik.filter((p) => p.status === 'ponadLimit')).toHaveLength(0);
  });
});
