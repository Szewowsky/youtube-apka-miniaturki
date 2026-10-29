import { describe, expect, it, vi } from 'vitest';
import { KOMUNIKATY } from './komunikaty';
import type { WynikMetadanych } from './metadane';
import {
  adresMiniaturki,
  DOMYSLNA_JAKOSC,
  pobierzMiniaturke,
  type Jakosc,
  type WynikZapisu,
  type ZlecenieZapisu,
} from './pobieranie';

const ID = 'dQw4w9WgXcQ';
const MAX = `https://i.ytimg.com/vi/${ID}/maxresdefault.jpg`;
const SD = `https://i.ytimg.com/vi/${ID}/sddefault.jpg`;
const HQ = `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`;

function odpowiedz(status: number): Response {
  // 404 z YouTube ma treść image/jpeg - liczy się wyłącznie ok.
  return new Response('jpeg', { status, headers: { 'Content-Type': 'image/jpeg' } });
}

function falszywyFetch(statusy: Record<string, number>) {
  return vi.fn(async (adres: RequestInfo | URL) => odpowiedz(statusy[String(adres)] ?? 404));
}

function przygotuj(opcje: {
  statusy?: Record<string, number>;
  fetch?: ReturnType<typeof vi.fn>;
  metadane?: () => Promise<WynikMetadanych>;
  download?: (z: ZlecenieZapisu) => Promise<WynikZapisu>;
}) {
  const fetch = opcje.fetch ?? falszywyFetch(opcje.statusy ?? {});
  const download = vi.fn(opcje.download ?? (async () => ({ ok: true }) as WynikZapisu));
  const metadane = vi.fn(
    opcje.metadane ?? (async (): Promise<WynikMetadanych> => ({ ok: true, tytul: 'Mój film', kanal: 'Kanał' })),
  );
  return { fetch: fetch as unknown as typeof globalThis.fetch, download, metadane, fetchMock: fetch };
}

describe('adresMiniaturki', () => {
  it.each<[Jakosc, string]>([
    ['max', MAX],
    ['sd', SD],
    ['hq', HQ],
  ])('Jakość %s → %s', (jakosc, adres) => {
    expect(adresMiniaturki(ID, jakosc)).toBe(adres);
  });

  it('domyślna Jakość to max', () => {
    expect(DOMYSLNA_JAKOSC).toBe('max');
  });
});

describe('pobierzMiniaturke', () => {
  it('maxres dostępna → pobiera maxres jako "Tytuł - Kanał.jpg"', async () => {
    const deps = przygotuj({ statusy: { [MAX]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'gotowe', nazwa: 'Mój film - Kanał.jpg' });
    expect(deps.download).toHaveBeenCalledWith({
      url: MAX,
      filename: 'Mój film - Kanał.jpg',
      saveAs: false,
      conflictAction: 'uniquify',
    });
  });

  it('maxres 404 → opada do sd', async () => {
    const deps = przygotuj({ statusy: { [SD]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik.status).toBe('gotowe');
    expect(deps.download).toHaveBeenCalledWith(expect.objectContaining({ url: SD }));
  });

  it('maxres i sd 404 → opada do hq', async () => {
    const deps = przygotuj({ statusy: { [HQ]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik.status).toBe('gotowe');
    expect(deps.download).toHaveBeenCalledWith(expect.objectContaining({ url: HQ }));
    expect(deps.fetchMock.mock.calls.map((c) => String(c[0]))).toEqual([MAX, SD, HQ]);
  });

  it('żadna Jakość nie istnieje → Film niedostępny, bez zapisu i bez metadanych', async () => {
    const deps = przygotuj({ statusy: {} });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'blad', komunikat: KOMUNIKATY.filmNiedostepny });
    expect(deps.download).not.toHaveBeenCalled();
    expect(deps.metadane).not.toHaveBeenCalled();
  });

  it('wyjątek sieci przy sprawdzaniu → brak połączenia, bez dalszego opadania', async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    const deps = przygotuj({ fetch });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(deps.download).not.toHaveBeenCalled();
  });

  it('błąd oEmbed (401) przy istniejącej Miniaturce → plik ID.jpg i status gotowe', async () => {
    const deps = przygotuj({
      statusy: { [MAX]: 200 },
      metadane: async () => ({ ok: false, powod: 'niepewny', komunikat: KOMUNIKATY.filmPrywatny }),
    });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'gotowe', nazwa: `${ID}.jpg` });
    expect(deps.download).toHaveBeenCalledWith(expect.objectContaining({ url: MAX, filename: `${ID}.jpg` }));
  });

  it('metadane rzucają wyjątek → plik ID.jpg i status gotowe', async () => {
    const deps = przygotuj({
      statusy: { [MAX]: 200 },
      metadane: async () => {
        throw new Error('boom');
      },
    });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'gotowe', nazwa: `${ID}.jpg` });
  });

  it('Jakość sd bez sddefault → hqdefault (maxres nie sprawdzany)', async () => {
    const deps = przygotuj({ statusy: { [MAX]: 200, [HQ]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'sd', deps);
    expect(wynik.status).toBe('gotowe');
    expect(deps.fetchMock.mock.calls.map((c) => String(c[0]))).toEqual([SD, HQ]);
    expect(deps.download).toHaveBeenCalledWith(expect.objectContaining({ url: HQ }));
  });

  it('Jakość hq → od razu hqdefault (maxres i sd nie sprawdzane)', async () => {
    const deps = przygotuj({ statusy: { [MAX]: 200, [SD]: 200, [HQ]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'hq', deps);
    expect(wynik.status).toBe('gotowe');
    expect(deps.fetchMock.mock.calls.map((c) => String(c[0]))).toEqual([HQ]);
    expect(deps.download).toHaveBeenCalledWith(expect.objectContaining({ url: HQ }));
  });

  it('Jakość hq bez hqdefault → Film niedostępny', async () => {
    const deps = przygotuj({ statusy: { [MAX]: 200 } });
    const wynik = await pobierzMiniaturke(ID, 'hq', deps);
    expect(wynik).toEqual({ status: 'blad', komunikat: KOMUNIKATY.filmNiedostepny });
  });

  it('zapis przerwany → komunikat z adaptera', async () => {
    const deps = przygotuj({
      statusy: { [MAX]: 200 },
      download: async () => ({ ok: false, komunikat: 'Pobieranie przerwane' }),
    });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'blad', komunikat: 'Pobieranie przerwane' });
  });

  it('wyjątek przy zapisie → brak połączenia', async () => {
    const deps = przygotuj({
      statusy: { [MAX]: 200 },
      download: async () => {
        throw new Error('boom');
      },
    });
    const wynik = await pobierzMiniaturke(ID, 'max', deps);
    expect(wynik).toEqual({ status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia });
  });
});
