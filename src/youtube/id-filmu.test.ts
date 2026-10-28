import { describe, expect, it } from 'vitest';
import { idFilmuZLinku, idOgladanegoFilmu, jestStronaShorta } from './id-filmu';

const ID = 'dQw4w9WgXcQ';

describe('idOgladanegoFilmu', () => {
  it('czyta ID z adresu strony Filmu', () => {
    expect(idOgladanegoFilmu(`https://www.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  it('ignoruje dodatkowe parametry', () => {
    expect(idOgladanegoFilmu(`https://www.youtube.com/watch?v=${ID}&list=PL1&t=42s`)).toBe(ID);
  });

  it('poza stroną Filmu zwraca brak', () => {
    expect(idOgladanegoFilmu('https://www.youtube.com/')).toBeUndefined();
    expect(idOgladanegoFilmu(`https://www.youtube.com/shorts/${ID}`)).toBeUndefined();
    expect(idOgladanegoFilmu('https://www.youtube.com/results?search_query=v')).toBeUndefined();
  });

  it('odrzuca ID o złym formacie', () => {
    expect(idOgladanegoFilmu('https://www.youtube.com/watch?v=krotkie')).toBeUndefined();
  });
});

describe('idFilmuZLinku', () => {
  it('czyta ID z linku karty z doklejonym parametrem pp', () => {
    expect(idFilmuZLinku(`https://www.youtube.com/watch?v=${ID}&pp=ygUEbG9maQ%3D%3D`)).toBe(ID);
  });

  it('nie uznaje linku do Shorta ani pustego linku', () => {
    expect(idFilmuZLinku(`https://www.youtube.com/shorts/${ID}`)).toBeUndefined();
    expect(idFilmuZLinku(undefined)).toBeUndefined();
    expect(idFilmuZLinku('')).toBeUndefined();
  });
});

describe('jestStronaShorta', () => {
  it('rozpoznaje stronę Shorta po ścieżce', () => {
    expect(jestStronaShorta(`/shorts/${ID}`)).toBe(true);
    expect(jestStronaShorta('/watch')).toBe(false);
  });
});
