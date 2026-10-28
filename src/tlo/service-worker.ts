// Tło Wtyczki: kliknięcie Ikony Wtyczki otwiera Aplikację w nowej karcie.
// chrome.tabs.create działa bez uprawnienia `tabs`.

import { ADRES_APLIKACJI } from '../adresy';

chrome.action.onClicked.addListener(() => {
  void chrome.tabs.create({ url: chrome.runtime.getURL(ADRES_APLIKACJI) });
});
