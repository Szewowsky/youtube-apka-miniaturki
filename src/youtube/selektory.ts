// Wszystkie punkty zaczepienia na stronie YouTube w jednym miejscu.
// Szczegóły, przykłady HTML i ocena stabilności: docs/selektory-youtube.md.
export const ZWERYFIKOWANO = '2026-10-28';

export const SELEKTORY = {
  // Strona Filmu: rząd akcji pod Filmem i przycisk "Udostępnij" (wstawiamy za jego hostem).
  rzadAkcji: 'ytd-watch-metadata #top-level-buttons-computed',
  przyciskUdostepnij: 'button[aria-label="Udostępnij"], button[aria-label="Share"]',
  hostPrzyciskuYT: 'yt-button-view-model',

  // Listy: nowy układ (strona główna, kanał) i stary (wyszukiwarka).
  kartaFilmu: 'yt-lockup-view-model, ytd-video-renderer',
  linkMiniaturki:
    'a.ytLockupViewModelContentImage[href*="/watch?v="], ytd-thumbnail a#thumbnail[href*="/watch?v="]',
  linkMiniaturkiZapasowy: 'a[href*="/watch?v="]',
  kontenerMiniaturki: 'yt-thumbnail-view-model, ytd-thumbnail',

  // Shorty: pomijamy półki, karty i każdy link /shorts/.
  polkaShortow:
    'ytd-rich-shelf-renderer[is-shorts], grid-shelf-view-model, ytd-reel-shelf-renderer, ytd-rich-grid-renderer[is-shorts-grid]',
  linkShorta: 'a[href^="/shorts/"]',

  zdarzenieNawigacji: 'yt-navigate-finish',
} as const;
