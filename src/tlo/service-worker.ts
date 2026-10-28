// Tło Wtyczki: kliknięcie Ikony Wtyczki otwiera Aplikację w nowej karcie,
// zlecenia { typ: 'pobierz', id } zapisują Miniaturkę przez rdzeń.
// chrome.tabs.create działa bez uprawnienia `tabs`.

import { ADRES_APLIKACJI } from '../adresy';
import { pobierzMetadane } from '../rdzen/metadane';
import { pobierzMiniaturke, type WynikPobrania } from '../rdzen/pobieranie';
import { odczytajJakosc } from '../rdzen/ustawienia';
import { jestZleceniemPobrania } from '../wiadomosci';
import { zapiszPlik } from './zapis';

chrome.action.onClicked.addListener(() => {
  void chrome.tabs.create({ url: chrome.runtime.getURL(ADRES_APLIKACJI) });
});

async function pobierz(id: string): Promise<WynikPobrania> {
  const jakosc = await odczytajJakosc(chrome.storage.sync);
  return pobierzMiniaturke(id, jakosc, {
    fetch: (...argumenty) => fetch(...argumenty),
    download: zapiszPlik,
    metadane: (idFilmu) => pobierzMetadane(idFilmu, { fetch: (...argumenty) => fetch(...argumenty) }),
  });
}

chrome.runtime.onMessage.addListener((wiadomosc, _nadawca, odpowiedz) => {
  if (!jestZleceniemPobrania(wiadomosc)) return false;
  void pobierz(wiadomosc.id).then(odpowiedz);
  // true = odpowiedź przyjdzie asynchronicznie, kanał zostaje otwarty.
  return true;
});
