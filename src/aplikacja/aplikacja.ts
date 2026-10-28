import { KOMUNIKATY, TEKSTY_APLIKACJI } from '../rdzen/komunikaty';
import { pobierzMetadane } from '../rdzen/metadane';
import { rozpoznajListe, type Pozycja, type StatusPozycji } from '../rdzen/rozpoznawanie';

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

const OPIS_STATUSU: Record<Exclude<StatusPozycji, 'film'>, string> = {
  short: KOMUNIKATY.short,
  nieprawidlowy: KOMUNIKATY.nieprawidlowyLink,
  duplikat: KOMUNIKATY.duplikat,
  ponadLimit: KOMUNIKATY.ponadLimit,
};

type Wiersz = { pozycja: Pozycja; tytul: HTMLElement; kanal: HTMLElement; status: HTMLElement };

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
  return { pozycja, tytul, kanal, status };
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

function rozpoznaj(): void {
  const pozycje = rozpoznajListe(pole.value);
  lista.replaceChildren();
  const wiersze = pozycje.map(utworzWiersz);
  const filmy = wiersze.filter((w) => w.pozycja.status === 'film');

  podsumowanie.hidden = pozycje.length === 0;
  podsumowanie.textContent = TEKSTY_APLIKACJI.podsumowanieRozpoznania(
    filmy.length,
    pozycje.length - filmy.length,
  );

  void Promise.all(filmy.map(uzupelnijMetadane));
}

przyciskRozpoznaj.addEventListener('click', rozpoznaj);
