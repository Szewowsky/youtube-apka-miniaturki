// Adapter chrome.downloads: wynik dopiero po faktycznym zapisie pliku (onChanged), nie po starcie.

import { KOMUNIKATY } from '../rdzen/komunikaty';
import type { WynikZapisu, ZlecenieZapisu } from '../rdzen/pobieranie';

type Oczekujace = (wynik: WynikZapisu) => void;

const oczekujace = new Map<number, Oczekujace>();
// Zdarzenia, które przyszły, zanim download() zwrócił identyfikator.
const wczesneWyniki = new Map<number, WynikZapisu>();

function wynikZmiany(zmiana: chrome.downloads.DownloadDelta): WynikZapisu | undefined {
  const stan = zmiana.state?.current;
  if (stan === 'complete') return { ok: true };
  if (stan === 'interrupted') return { ok: false, komunikat: KOMUNIKATY.brakPolaczenia };
  return undefined;
}

chrome.downloads.onChanged.addListener((zmiana) => {
  const wynik = wynikZmiany(zmiana);
  if (!wynik) return;
  const rozwiaz = oczekujace.get(zmiana.id);
  if (rozwiaz) {
    oczekujace.delete(zmiana.id);
    rozwiaz(wynik);
  } else {
    wczesneWyniki.set(zmiana.id, wynik);
  }
});

export async function zapiszPlik(zlecenie: ZlecenieZapisu): Promise<WynikZapisu> {
  let id: number;
  try {
    id = await chrome.downloads.download(zlecenie);
  } catch {
    return { ok: false, komunikat: KOMUNIKATY.brakPolaczenia };
  }
  const wczesny = wczesneWyniki.get(id);
  if (wczesny) {
    wczesneWyniki.delete(id);
    return wczesny;
  }
  return new Promise((rozwiaz) => oczekujace.set(id, rozwiaz));
}
