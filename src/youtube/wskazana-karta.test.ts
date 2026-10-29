import { describe, expect, it } from 'vitest';
import { wskazanaKarta } from './wskazana-karta';

type Karta = { id: string };
const a: Karta = { id: 'aaaaaaaaaaa' };
const b: Karta = { id: 'bbbbbbbbbbb' };
const idKarty = (k: Karta) => k.id;

describe('wskazanaKarta', () => {
  it('kursor nad kartą wskazuje tę kartę', () => {
    expect(wskazanaKarta({ karty: [a], idPodgladu: null }, undefined, idKarty)).toBe(a);
  });

  it('karta przykryta grającym podglądem dalej jest wskazana', () => {
    expect(wskazanaKarta({ karty: [a], idPodgladu: a.id }, a, idKarty)).toBe(a);
  });

  it('kursor na marginesie podglądu tej samej karty zostawia ją wskazaną', () => {
    expect(wskazanaKarta({ karty: [], idPodgladu: a.id }, a, idKarty)).toBe(a);
  });

  it('podgląd innego Filmu nie zostawia poprzedniej karty wskazanej', () => {
    expect(wskazanaKarta({ karty: [], idPodgladu: b.id }, a, idKarty)).toBeUndefined();
  });

  it('podgląd bez wcześniej wskazanej karty niczego nie wskazuje', () => {
    expect(wskazanaKarta({ karty: [], idPodgladu: a.id }, undefined, idKarty)).toBeUndefined();
  });

  it('kursor poza kartą i podglądem zdejmuje wskazanie', () => {
    expect(wskazanaKarta({ karty: [], idPodgladu: null }, a, idKarty)).toBeUndefined();
  });

  it('przejście na inną kartę przenosi wskazanie', () => {
    expect(wskazanaKarta({ karty: [b], idPodgladu: null }, a, idKarty)).toBe(b);
  });

  it('brzeg podglądu karty A zachodzący na kartę B zostawia wskazaną kartę A', () => {
    expect(wskazanaKarta({ karty: [b], idPodgladu: a.id }, a, idKarty)).toBe(a);
  });

  it('pod podglądem wybiera kartę z tym samym ID, a nie pierwszą z brzegu', () => {
    expect(wskazanaKarta({ karty: [b, a], idPodgladu: a.id }, undefined, idKarty)).toBe(a);
  });

  it('podgląd Filmu spoza kart pod kursorem nie przeszkadza w wyborze karty', () => {
    expect(wskazanaKarta({ karty: [b], idPodgladu: 'ccccccccccc' }, a, idKarty)).toBe(b);
  });

  it('karta bez rozpoznanego ID nie zostaje wskazana przez podgląd', () => {
    expect(
      wskazanaKarta({ karty: [], idPodgladu: a.id }, a, () => undefined),
    ).toBeUndefined();
  });
});
