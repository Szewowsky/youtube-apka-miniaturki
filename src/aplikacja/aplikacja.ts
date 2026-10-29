import { KOMUNIKATY, TEKSTY_APLIKACJI } from '../rdzen/komunikaty';
import { pobierzMetadane } from '../rdzen/metadane';
import type { WynikPobrania } from '../rdzen/pobieranie';
import { jestJakoscia, odczytajJakosc, zapiszJakosc } from '../rdzen/ustawienia';
import { rozpoznajListe, type Pozycja, type StatusPozycji } from '../rdzen/rozpoznawanie';
import type { ZleceniePobrania } from '../wiadomosci';
import { bladZMetadanych, doPobrania, liczbaFilmowDoPobrania, type PozycjaListy } from './lista';
import { podzielNaglowek, podzielPodsumowanie, ZNAKI_STANU, type StanWiersza } from './wyglad';

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

// Nagłówek: pierwsze słowo na czerwonym markerze (wytyczne, sekcja 2).
const naglowek = podzielNaglowek(TEKSTY_APLIKACJI.naglowek);
const marker = document.createElement('mark');
marker.textContent = naglowek.wyrozniony;
element('naglowek').replaceChildren(marker, naglowek.reszta);
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

type Wiersz = PozycjaListy & {
  pozycja: Pozycja;
  /** Odpowiedź oEmbed dla Filmu; pobieranie na nią czeka, żeby nie ruszać niedostępnych. */
  metadane: Promise<void>;
  li: HTMLLIElement;
  znak: HTMLElement;
  tytul: HTMLElement;
  kanal: HTMLElement;
  status: HTMLElement;
};

let wiersze: Wiersz[] = [];
let trwaPobieranie = false;

function utworzWiersz(pozycja: Pozycja): Wiersz {
  const li = document.createElement('li');
  li.className = 'pozycja';
  const stan: StanWiersza = pozycja.status === 'film' ? 'czeka' : 'pominiety';
  li.dataset.status = stan;

  const znak = document.createElement('span');
  znak.className = 'pozycja-znak';
  znak.innerHTML = ZNAKI_STANU[stan];

  const opis = document.createElement('div');
  opis.className = 'pozycja-opis';
  const tytul = document.createElement('span');
  tytul.className = 'pozycja-tytul';
  const kanal = document.createElement('span');
  kanal.className = 'pozycja-kanal';
  opis.append(tytul, kanal);

  const status = document.createElement('span');
  status.className = 'pozycja-status';
  // Pasek postępu widać tylko w stanie „pobieram” (CSS).
  const pasek = document.createElement('span');
  pasek.className = 'pasek-postepu';
  pasek.setAttribute('aria-hidden', 'true');
  pasek.append(document.createElement('i'));
  const kolumnaStanu = document.createElement('span');
  kolumnaStanu.className = 'pozycja-stan';
  kolumnaStanu.append(status, pasek);

  if (pozycja.status === 'film') {
    tytul.textContent = TEKSTY_APLIKACJI.wczytuje;
    tytul.classList.add('wczytuje');
    kanal.textContent = pozycja.link;
    status.textContent = KOMUNIKATY.czeka;
  } else {
    tytul.textContent = pozycja.link;
    status.textContent = OPIS_STATUSU[pozycja.status];
  }

  li.append(znak, opis, kolumnaStanu);
  lista.append(li);
  return {
    pozycja,
    film: pozycja.status === 'film',
    stan,
    niedostepny: false,
    metadane: Promise.resolve(),
    li,
    znak,
    tytul,
    kanal,
    status,
  };
}

async function uzupelnijMetadane(wiersz: Wiersz): Promise<void> {
  const id = wiersz.pozycja.id ?? '';
  const wynik = await pobierzMetadane(id, { fetch: (...a) => fetch(...a) });
  wiersz.tytul.classList.remove('wczytuje');
  const blad = bladZMetadanych(wynik);
  if (blad !== null) {
    // oEmbed potwierdził, że Filmu nie ma: od razu błąd, bez liczenia i bez pobierania.
    // Wiersz w trakcie pobierania kończy je sam i pokaże wynik pobrania.
    wiersz.niedostepny = true;
    wiersz.tytul.textContent = wiersz.pozycja.link;
    wiersz.kanal.textContent = '';
    if (wiersz.stan === 'czeka') ustawStan(wiersz, 'blad', blad);
    odswiezPodsumowanie();
    odswiezPrzyciski();
  } else if (wynik.ok) {
    wiersz.tytul.textContent = wynik.tytul;
    wiersz.kanal.textContent = wynik.kanal;
  } else {
    // Brak tytułu nie blokuje pobrania: pozycja pokazuje identyfikator i powód.
    wiersz.tytul.textContent = id;
    wiersz.kanal.textContent = wynik.komunikat;
  }
}

function ustawStan(wiersz: Wiersz, stan: StanWiersza, tekst: string): void {
  if (wiersz.stan !== stan) wiersz.znak.innerHTML = ZNAKI_STANU[stan];
  wiersz.stan = stan;
  wiersz.li.dataset.status = stan;
  wiersz.status.textContent = tekst;
}

function odswiezPodsumowanie(): void {
  const filmow = liczbaFilmowDoPobrania(wiersze);
  const pominietych = wiersze.filter((w) => !w.film).length;
  const { wyrozniony, reszta } = podzielPodsumowanie(
    TEKSTY_APLIKACJI.podsumowanieRozpoznania(filmow, pominietych),
    TEKSTY_APLIKACJI.podsumowanieRozpoznania(filmow, 0),
  );
  const pogrubienie = document.createElement('b');
  pogrubienie.textContent = wyrozniony;
  podsumowanie.replaceChildren(pogrubienie, reszta);
}

function odswiezPrzyciski(): void {
  przyciskRozpoznaj.disabled = trwaPobieranie;
  przyciskPobierz.disabled = trwaPobieranie || doPobrania(wiersze).length === 0;
}

function rozpoznaj(): void {
  const pozycje = rozpoznajListe(pole.value);
  lista.replaceChildren();
  wiersze = pozycje.map(utworzWiersz);
  const filmy = wiersze.filter((w) => w.film);

  podsumowanie.hidden = pozycje.length === 0;
  odswiezPodsumowanie();

  odswiezPrzyciski();
  for (const wiersz of filmy) wiersz.metadane = uzupelnijMetadane(wiersz);
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
// więc ponowne kliknięcie dociąga tylko te z błędem. Niedostępne Filmy nie trafiają do kolejki.
async function pobierzWszystkie(): Promise<void> {
  const kolejka = doPobrania(wiersze);
  trwaPobieranie = true;
  odswiezPrzyciski();
  kolejka.forEach((w) => ustawStan(w, 'czeka', KOMUNIKATY.czeka));

  let pobranych = 0;
  for (const wiersz of kolejka) {
    // Kliknięcie mogło wyprzedzić odpowiedź oEmbed: czekamy na nią, niedostępnego Filmu nie pobieramy.
    await wiersz.metadane;
    if (wiersz.niedostepny) continue;
    if (pobranych++ > 0) await czekaj(PRZERWA_MIEDZY_POBRANIAMI_MS);
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
