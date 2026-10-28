// Przycisk pobierania na stronie YouTube. Budowany przez createElement, bo YouTube
// wymusza Trusted Types (innerHTML rzuca błąd). Sam nie pobiera: zleca to tłu Wtyczki.

import { KOMUNIKATY, TEKSTY_PRZYCISKU } from '../rdzen/komunikaty';
import type { WynikPobrania } from '../rdzen/pobieranie';
import type { ZleceniePobrania } from '../wiadomosci';

export const PREFIKS = 'mty';
export type Miejsce = 'film' | 'karta';
type Stan = 'zwykly' | 'pobieram' | 'gotowe' | 'blad';

const CZAS_GOTOWE_MS = 2500;
const CZAS_BLEDU_MS = 4000;
const SVG = 'http://www.w3.org/2000/svg';

function ikonaPobierania(): SVGSVGElement {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add(`${PREFIKS}-ikona`);
  const sciezka = document.createElementNS(SVG, 'path');
  // Strzałka w dół nad podstawką.
  sciezka.setAttribute('d', 'M11 4h2v8.17l3.59-3.58L18 10l-6 6-6-6 1.41-1.41L11 12.17V4zM5 18h14v2H5v-2z');
  svg.append(sciezka);
  return svg;
}

// Stara karta po aktualizacji Wtyczki ma odcięty kontekst: chrome.runtime.id znika.
function kontekstWtyczkiZyje(): boolean {
  try {
    return Boolean(chrome.runtime?.id);
  } catch {
    return false;
  }
}

async function zlecPobranie(id: string): Promise<WynikPobrania> {
  if (!kontekstWtyczkiZyje()) return { status: 'blad', komunikat: KOMUNIKATY.odswiezStrone };
  const zlecenie: ZleceniePobrania = { typ: 'pobierz', id };
  try {
    const wynik = (await chrome.runtime.sendMessage(zlecenie)) as WynikPobrania | undefined;
    return wynik ?? { status: 'blad', komunikat: KOMUNIKATY.brakPolaczenia };
  } catch (blad) {
    const tresc = blad instanceof Error ? blad.message : String(blad);
    const odciety = /context invalidated/i.test(tresc) || !kontekstWtyczkiZyje();
    return { status: 'blad', komunikat: odciety ? KOMUNIKATY.odswiezStrone : KOMUNIKATY.brakPolaczenia };
  }
}

export function utworzPrzycisk(miejsce: Miejsce, odczytajId: () => string | undefined): HTMLButtonElement {
  const przycisk = document.createElement('button');
  przycisk.type = 'button';
  przycisk.className = `${PREFIKS}-przycisk ${PREFIKS}-przycisk-${miejsce}`;
  przycisk.title = TEKSTY_PRZYCISKU.podpowiedz;

  const napis = document.createElement('span');
  napis.className = `${PREFIKS}-napis`;
  // Czytnik ekranu ogłasza zmianę stanu (Pobieram…, Gotowe, komunikat błędu).
  napis.setAttribute('aria-live', 'polite');
  przycisk.append(ikonaPobierania(), napis);

  let powrot: ReturnType<typeof setTimeout> | undefined;
  const ustaw = (stan: Stan, tekst: string) => {
    przycisk.dataset.stan = stan;
    napis.textContent = tekst;
    // Na małych Miniaturkach napis bywa ucięty: pełna treść w dymku.
    przycisk.title = stan === 'zwykly' ? TEKSTY_PRZYCISKU.podpowiedz : tekst;
    // aria-disabled zamiast disabled: przycisk nie traci fokusu klawiatury w trakcie pobierania.
    przycisk.setAttribute('aria-disabled', String(stan === 'pobieram'));
  };
  ustaw('zwykly', TEKSTY_PRZYCISKU.etykieta);

  // Środkowy przycisk myszy na karcie otworzyłby Film w nowej karcie.
  const zablokuj = (zdarzenie: MouseEvent) => {
    zdarzenie.preventDefault();
    zdarzenie.stopPropagation();
  };
  przycisk.addEventListener('auxclick', zablokuj);
  przycisk.addEventListener('mousedown', (zdarzenie) => {
    if (zdarzenie.button === 1) zablokuj(zdarzenie);
  });

  przycisk.addEventListener('click', async (zdarzenie) => {
    // Na kartach przycisk siedzi w linku do Filmu: nie otwieramy Filmu.
    zdarzenie.preventDefault();
    zdarzenie.stopPropagation();
    if (przycisk.dataset.stan === 'pobieram') return;
    clearTimeout(powrot);

    const id = odczytajId();
    if (!id) {
      ustaw('blad', KOMUNIKATY.odswiezStrone);
    } else {
      ustaw('pobieram', KOMUNIKATY.pobieram);
      const wynik = await zlecPobranie(id);
      if (wynik.status === 'gotowe') ustaw('gotowe', KOMUNIKATY.gotowe);
      else ustaw('blad', wynik.komunikat);
    }
    const czas = przycisk.dataset.stan === 'gotowe' ? CZAS_GOTOWE_MS : CZAS_BLEDU_MS;
    powrot = setTimeout(() => ustaw('zwykly', TEKSTY_PRZYCISKU.etykieta), czas);
  });

  return przycisk;
}
