import { describe, expect, it } from 'vitest';
import { KOMUNIKATY } from './komunikaty';
import { adresOembed, pobierzMetadane } from './metadane';

const ID = 'dQw4w9WgXcQ';

function falszywyFetch(odpowiedz: () => Response | Promise<Response>) {
  const wywolania: string[] = [];
  const fetch = (async (wejscie: RequestInfo | URL) => {
    wywolania.push(String(wejscie));
    return odpowiedz();
  }) as typeof globalThis.fetch;
  return { fetch, wywolania };
}

function odpowiedzJson(dane: unknown, status = 200): Response {
  return new Response(JSON.stringify(dane), { status });
}

describe('adresOembed', () => {
  it('buduje adres oEmbed YouTube z zakodowanym linkiem do Filmu', () => {
    expect(adresOembed(ID)).toBe(
      'https://www.youtube.com/oembed?url=' +
        encodeURIComponent(`https://www.youtube.com/watch?v=${ID}`) +
        '&format=json',
    );
  });
});

describe('pobierzMetadane', () => {
  it('pyta fetch o adres oEmbed danego Filmu', async () => {
    const { fetch, wywolania } = falszywyFetch(() =>
      odpowiedzJson({ title: 'Tytuł', author_name: 'Kanał' }),
    );
    await pobierzMetadane(ID, { fetch });
    expect(wywolania).toEqual([adresOembed(ID)]);
  });

  it('przy 200 zwraca tytuł i nazwę kanału', async () => {
    const { fetch } = falszywyFetch(() =>
      odpowiedzJson({ title: '  Mój film  ', author_name: 'Mój kanał' }),
    );
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: true,
      tytul: 'Mój film',
      kanal: 'Mój kanał',
    });
  });

  it('przy 401 zgłasza Film prywatny jako niepewny (może mieć tylko wyłączone osadzanie)', async () => {
    const { fetch } = falszywyFetch(() => new Response('Unauthorized', { status: 401 }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.filmPrywatny,
    });
  });

  it('przy 403 zgłasza Film prywatny jako niepewny', async () => {
    const { fetch } = falszywyFetch(() => new Response('Forbidden', { status: 403 }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.filmPrywatny,
    });
  });

  it('przy 400 (nieistniejący identyfikator) zgłasza Film usunięty jako niedostępny', async () => {
    const { fetch } = falszywyFetch(() => new Response('Bad Request', { status: 400 }));
    expect(await pobierzMetadane('aaaaaaaaaaa', { fetch })).toEqual({
      ok: false,
      powod: 'niedostepny',
      komunikat: KOMUNIKATY.filmUsuniety,
    });
  });

  it('przy 404 zgłasza Film usunięty jako niedostępny', async () => {
    const { fetch } = falszywyFetch(() => new Response('Not Found', { status: 404 }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niedostepny',
      komunikat: KOMUNIKATY.filmUsuniety,
    });
  });

  it('przy 500 zgłasza brak połączenia', async () => {
    const { fetch } = falszywyFetch(() => new Response('Error', { status: 500 }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });

  it('przy wyjątku sieci zgłasza brak połączenia zamiast rzucać', async () => {
    const { fetch } = falszywyFetch(() => {
      throw new TypeError('Failed to fetch');
    });
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });

  it('przy niepoprawnym JSON zgłasza brak połączenia', async () => {
    const { fetch } = falszywyFetch(() => new Response('<html>nie json', { status: 200 }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });

  it('przy braku author_name zgłasza brak połączenia', async () => {
    const { fetch } = falszywyFetch(() => odpowiedzJson({ title: 'Tytuł' }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });

  it('przy pustym tytule zgłasza brak połączenia', async () => {
    const { fetch } = falszywyFetch(() => odpowiedzJson({ title: '   ', author_name: 'Kanał' }));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });

  it('przy JSON innym niż obiekt zgłasza brak połączenia', async () => {
    const { fetch } = falszywyFetch(() => odpowiedzJson(null));
    expect(await pobierzMetadane(ID, { fetch })).toEqual({
      ok: false,
      powod: 'niepewny',
      komunikat: KOMUNIKATY.brakPolaczenia,
    });
  });
});
