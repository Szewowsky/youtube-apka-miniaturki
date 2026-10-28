import { KOMUNIKATY, TEKSTY_APLIKACJI } from '../rdzen/komunikaty';
import { pobierzMetadane } from '../rdzen/metadane';
import type { WynikPobrania } from '../rdzen/pobieranie';
import { jestJakoscia, odczytajJakosc, zapiszJakosc } from '../rdzen/ustawienia';
import { rozpoznajListe, type Pozycja, type StatusPozycji } from '../rdzen/rozpoznawanie';
import type { ZleceniePobrania } from '../wiadomosci';

const PRZERWA_MIEDZY_POBRANIAMI_MS = 300;

function element<T extends HTMLElement>(id: string): T {
  const znaleziony = document.getElementById(id);
  if (!znaleziony) throw new Error(`Brak elementu #${id}`);
  return znaleziony as T;
}

const pole = element<HTMLTextAreaElement>('linki');
const przyciskRozpoznaj = element<HTMLButtonElement>('rozpoznaj');
const przyciskPobierz = element<HTMLButtonElement>('pobierz-wszystkie');
const podsumowanie = element<HTMLParagraphElement>('podsumowanie');
const lista = element<HTMLOListElement>('lista');

element('naglowek').textContent = TEKSTY_APLIKACJI.naglowek;
element('opis').textContent = TEKSTY_APLIKACJI.opis;
element('etykieta-linkow').textContent = TEKSTY_APLIKACJI.poleLinkow;
przyciskRozpoznaj.textContent = TEKSTY_APLIKACJI.rozpoznaj;
przyciskPobierz.textContent = TEKSTY_APLIKACJI.pobierzWszystkie;
element('etykieta-jakosci').textContent = TEKSTY_APLIKACJI.jakosc;

// Przełącznik Jakości: wybór zapisywany w chrome.storage.sync, tło czyta go przy każdym pobraniu.
const opcjeJakosci = [...document.querySelectorAll<HTMLInputElement>('input[name="jakosc"]')];
for (const opcja of opcjeJakosci) {
  const podpis = opcja.nextElementSibling;
  if (podpis && jestJakoscia(opcja.value)) podpis.textContent = TEKSTY_APLIKACJI.jakosci[opcja.value];
  opcja.addEventListener('change', () => {
    if (opcja.checked && jestJakoscia(opcja.value)) void zapiszJakosc(chrome.storage.sync, opcja.value);
  });
}
void odczytajJakosc(chrome.storage.sync).then((jakosc) => {
  for (const opcja of opcjeJakosci) opcja.checked = opcja.value === jakosc;
});

const OPIS_STATUSU: Record<Exclude<StatusPozycji, 'film'>, string> = {
  short: KOMUNIKATY.short,
  nieprawidlowy: KOMUNIKATY.nieprawidlowyLink,
  duplikat: KOMUNIKATY.duplikat,
  ponadLimit: KOMUNIKATY.ponadLimit,
};

type StanWiersza = 'czeka' | 'pobieram' | 'gotowe' | 'blad' | 'pominiety';
type Wiersz = {
  pozycja: Pozycja;
  li: HTMLLIElement;
  tytul: HTMLElement;
  kanal: HTMLElement;
  status: HTMLElement;
};

let wiersze: Wiersz[] = [];
let trwaPobieranie = false;

function utworzWiersz(pozycja: Pozycja): Wiersz {
  const li = document.createElement('li');
  li.className = 'pozycja';
  li.dataset.status = pozycja.status === 'film' ? 'czeka' : 'pominiety';

  const opis = document.createElement('div');
  opis.className = 'pozycja-opis';
  const tytul = document.createElement('span');
  tytul.className = 'pozycja-tytul';
  const kanal = document.createElement('span');
  kanal.className = 'pozycja-kanal';
  opis.append(tytul, kanal);

  const status = document.createElement('span');
  status.className = 'pozycja-status';

  if (pozycja.status === 'film') {
    tytul.textContent = TEKSTY_APLIKACJI.wczytuje;
    kanal.textContent = pozycja.link;
    status.textContent = KOMUNIKATY.czeka;
  } else {
    tytul.textContent = pozycja.link;
    status.textContent = OPIS_STATUSU[pozycja.status];
  }

  li.append(opis, status);
  lista.append(li);
  return { pozycja, li, tytul, kanal, status };
}

async function uzupelnijMetadane(wiersz: Wiersz): Promise<void> {
  const id = wiersz.pozycja.id ?? '';
  const wynik = await pobierzMetadane(id, { fetch: (...a) => fetch(...a) });
  if (wynik.ok) {
    wiersz.tytul.textContent = wynik.tytul;
    wiersz.kanal.textContent = wynik.kanal;
  } else {
    // Brak tytułu nie blokuje pobrania: pozycja pokazuje identyfikator i powód.
    wiersz.tytul.textContent = id;
    wiersz.kanal.textContent = wynik.komunikat;
  }
}

function ustawStan(wiersz: Wiersz, stan: StanWiersza, tekst: string): void {
  wiersz.li.dataset.status = stan;
  wiersz.status.textContent = tekst;
}

function doPobrania(): Wiersz[] {
  return wiersze.filter(
    (w) => w.pozycja.status === 'film' && w.li.dataset.status !== 'gotowe',
  );
}

function odswiezPrzyciski(): void {
  przyciskRozpoznaj.disabled = trwaPobieranie;
  przyciskPobierz.disabled = trwaPobieranie || doPobrania().length === 0;
}

function rozpoznaj(): void {
  const pozycje = rozpoznajListe(pole.value);
  lista.replaceChildren();
  wiersze = pozycje.map(utworzWiersz);
  const filmy = wiersze.filter((w) => w.pozycja.status === 'film');

  podsumowanie.hidden = pozycje.length === 0;
  podsumowanie.textContent = TEKSTY_APLIKACJI.podsumowanieRozpoznania(
    filmy.length,
    pozycje.length - filmy.length,
  );

  odswiezPrzyciski();
  void Promise.all(filmy.map(uzupelnijMetadane));
}

async function pobierzJeden(id: string): Promise<WynikPobrania> {
  const zlecenie: ZleceniePobrania = { typ: 'pobierz', id };
  try {
    const wynik = (await chrome.runtime.sendMessage(zlecenie)) as WynikPobrania | undefined;
    return wynik ?? { status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia };
  } catch {
    return { status: 'blad', komunikat: KOMUNIKATY.odswiezStrone };
  }
}

const czekaj = (ms: number) => new Promise((rozwiaz) => setTimeout(rozwiaz, ms));

// Po kolei, z przerwą, żeby nie zalać serwerów YouTube. Pobrane już pozycje są pomijane,
// więc ponowne kliknięcie dociąga tylko te z błędem.
async function pobierzWszystkie(): Promise<void> {
  const kolejka = doPobrania();
  trwaPobieranie = true;
  odswiezPrzyciski();
  kolejka.forEach((w) => ustawStan(w, 'czeka', KOMUNIKATY.czeka));

  for (const [numer, wiersz] of kolejka.entries()) {
    if (numer > 0) await czekaj(PRZERWA_MIEDZY_POBRANIAMI_MS);
    ustawStan(wiersz, 'pobieram', KOMUNIKATY.pobieram);
    const wynik = await pobierzJeden(wiersz.pozycja.id ?? '');
    if (wynik.status === 'gotowe') ustawStan(wiersz, 'gotowe', KOMUNIKATY.gotowe);
    else ustawStan(wiersz, 'blad', wynik.komunikat);
  }

  trwaPobieranie = false;
  odswiezPrzyciski();
}

przyciskRozpoznaj.addEventListener('click', rozpoznaj);
przyciskPobierz.addEventListener('click', () => void pobierzWszystkie());
