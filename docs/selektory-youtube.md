# Selektory DOM YouTube - weryfikacja na żywej stronie

**Data weryfikacji:** 2026-10-28
**Narzędzie:** ego-browser (Ego Lite, Chromium), `www.youtube.com`, interfejs PL, okno ok. 2200 px szerokości.
**Kontekst sesji:** profil przeglądarki był **zalogowany** (YouTube Premium) i miał zainstalowane inne wtyczki (vidIQ, LanguageTool). Konto ma ustawiony **motyw ciemny**. Niczego na koncie nie zmieniano; jasny motyw był symulowany lokalnie (opis w sekcji 1.4).

Dotyczy issue #7 (T6, przycisk pod Filmem) i #8 (T7, przycisk na listach).

---

## Najważniejsze wnioski (TL;DR)

1. **YouTube przeszło na komponenty `*-view-model` z klasami w camelCase** (`ytLockupViewModelContentImage`, `ytSpecButtonShapeNextHost`), a nie w BEM (`yt-lockup-view-model__content-image`). Stare selektory BEM z poradników **nie działają**.
2. **Zmienne `--yt-spec-*` są puste.** Kolory motywu idą przez zahashowane zmienne (`--t7f4f2c6d54836ce0` itp.), które mogą się zmienić przy każdym wdrożeniu YouTube. Nie opieraj stylu na `var(--yt-spec-...)`.
3. **Trusted Types są wymuszone:** `element.innerHTML = "..."` rzuca `TypeError: This document requires 'TrustedHTML' assignment`. Przycisk i ikonę budujemy przez `createElement` / `createElementNS` + `textContent`.
4. **`yt-navigate-finish` działa**, ale w chwili zdarzenia `ytd-watch-flexy[video-id]` ma jeszcze **stare** ID. Bieżące ID bierz z `location.href` (`v=`) albo z `event.detail.endpoint.watchEndpoint.videoId`.
5. **`#top-level-buttons-computed` jest przebudowywany po nawigacji SPA** - wstawiony tam element znika. Trzeba go wstawiać ponownie (po `yt-navigate-finish` + `MutationObserver`).
6. **Na listach podgląd wideo po najechaniu (inline preview) zakrywa Miniaturkę** po ok. 1-2 s, a jego przyciski (wycisz, napisy) zajmują **prawy górny róg**. Przycisk z `position:absolute; z-index` wysokim w **lewym górnym rogu** pozostaje widoczny i klikalny nad podglądem (sprawdzone `elementFromPoint`).
7. Wyszukiwarka nadal używa **starego** `ytd-video-renderer` + `ytd-thumbnail a#thumbnail`; strona główna i kanał - **nowego** `ytd-rich-item-renderer > yt-lockup-view-model`. Moduł musi obsłużyć oba układy.

---

## 1. Strona Filmu (`/watch?v=...`)

Sprawdzone na `https://www.youtube.com/watch?v=dQw4w9WgXcQ` i dwóch kolejnych Filmach otwartych z rekomendacji.

### 1.1 Rząd akcji - struktura

```
ytd-watch-flexy[video-id="dQw4w9WgXcQ"]                 (role=main)
 └ … #below > ytd-watch-metadata.watch-active-metadata
    └ #above-the-fold > #top-row
       ├ #owner                                          (kanał + Subskrybuj)
       └ #actions.item
          └ #actions-inner
             └ #menu
                └ ytd-menu-renderer
                   ├ #top-level-buttons-computed         (display:flex, nowrap)
                   │   ├ segmented-like-dislike-button-view-model   (Lubię/Nie lubię)
                   │   └ yt-button-view-model            (Udostępnij, aria-label="Udostępnij")
                   ├ #flexible-item-buttons
                   │   ├ yt-button-view-model            (aria-label="Zapisz na playliście")
                   │   └ ytd-download-button-renderer    (Pobierz - tylko Premium)
                   ├ yt-icon-button#button               (… "Więcej działań")
                   └ yt-button-shape
```

Przykładowy HTML przycisku "Udostępnij" (SVG skrócone):

```html
<yt-button-view-model class="ytd-menu-renderer">
  <button-view-model class="ytSpecButtonViewModelHost style-scope ytd-menu-renderer">
    <button class="ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono
                   ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextIconButton
                   ytSpecButtonShapeNextEnableBackdropFilterExperiment
                   ytSpecButtonShapeNextMainstageIconSize ytSpecButtonShapeNextMainstagePadding"
            title="" aria-label="Udostępnij" aria-disabled="false">
      <div aria-hidden="true" class="ytSpecButtonShapeNextIcon ytSpecButtonShapeNextElevatedContent">
        <span class="ytIconWrapperHost" style="width:24px;height:24px">…<svg viewBox="0 0 24 24">…</svg>…</span>
      </div>
      <yt-touch-feedback-shape …></yt-touch-feedback-shape>
      <yt-light-shape …></yt-light-shape>
    </button>
  </button-view-model>
</yt-button-view-model>
```

**Uwaga:** w tej wersji layoutu ("watch-metadata-refresh") "Udostępnij", "Zapisz" i "Pobierz" są **samymi ikonami** (klasa `ytSpecButtonShapeNextIconButton`, 40×40 px, bez tekstu). Tekst przy przycisku pojawia się tylko przy polubieniach ("19 mln"). Nie należy więc szukać przycisku po tekście "Udostępnij" w `innerText` - tylko po `aria-label`. `aria-label` jest zlokalizowany (PL: "Udostępnij", EN: "Share").

### 1.2 Gdzie wstawić własny przycisk

- **Rekomendacja:** zaraz za hostem "Udostępnij": `shareHost.after(nasz)` w `ytd-watch-metadata #top-level-buttons-computed`. Wizualnie ląduje między "Udostępnij" a "Zapisz" (zrzut `10-…`). Hosty sąsiednich przycisków mają `margin-left: 8px`, więc nasz też dostaje `margin-left: 8px`.
- Gdy "Udostępnij" nie zostanie znaleziony po `aria-label`, wstawiamy jako ostatnie dziecko `#top-level-buttons-computed`.
- **Kruchość:** po nawigacji SPA do innego Filmu zawartość `#top-level-buttons-computed` jest renderowana od nowa - testowy znacznik wstawiony tam **zniknął**, natomiast znacznik w `#actions-inner` **przetrwał**, a sam węzeł `ytd-watch-metadata` jest ten sam (nie tworzony od nowa). Wniosek: po każdym `yt-navigate-finish` i w `MutationObserver` sprawdzać, czy nasz przycisk jest w DOM, i wstawiać ponownie (idempotentnie, po klasie z prefiksem).
- Istnieje od razu? **Nie** - rząd akcji pojawia się po wyrenderowaniu strony przez Polymer (po pełnym załadowaniu ok. 1-3 s). W momencie `yt-navigate-finish` przycisk "Udostępnij" **już był** w DOM (sprawdzone), ale bezpieczniej czekać `MutationObserver`em.
- `ytd-watch-flexy` ma atrybut `hidden-action-button-target-ids="[]"` - przy wąskim oknie YouTube chowa część przycisków do menu "…". Nasz przycisk może wtedy wypychać inne lub się zawijać (`flex-wrap: nowrap`) - do sprawdzenia przy wąskim oknie (niezweryfikowane).

### 1.3 Style przycisku "Udostępnij" (computed)

| Właściwość | Ciemny (zweryfikowany) | Jasny (symulowany, patrz 1.4) |
|---|---|---|
| height | 40px | 40px |
| border-radius | 20px | 20px |
| padding | 0 16px (wariant z tekstem); przycisk-ikona ma 40×40 | jw. |
| font-family | Roboto, Arial, sans-serif | jw. |
| font-size | 14px | 14px |
| font-weight | 500 | 500 |
| line-height | 40px | 40px |
| background-color | `rgba(255, 255, 255, 0.1)` | `rgba(0, 0, 0, 0.05)` |
| background (hover) | `rgba(255, 255, 255, 0.2)` | `rgba(0, 0, 0, 0.1)` |
| color | `rgb(241, 241, 241)` (#f1f1f1) | `rgb(15, 15, 15)` (#0f0f0f) |
| border | 0 | 0 |
| display | flex | flex |
| ikona | 24×24 px, `fill: currentColor` | jw. |
| odstęp między przyciskami | `margin-left: 8px` na hoście | jw. |
| tło strony (`ytd-app`) | `rgb(15, 15, 15)` | `rgb(255, 255, 255)` |

Kolory pochodzą z reguły `.ytSpecButtonShapeNextMono.ytSpecButtonShapeNextTonal { background: var(--t7f4f2c6d54836ce0) }` (hover: `--t416e5931fc464589`). Te nazwy zmiennych są generowane i niestabilne.

**Dwie drogi stylowania (sprawdzone na żywo):**

- **A) Pożyczenie klas YouTube** (zrzuty `10-…`, `11-…`): `<button class="<prefiks>-pobierz ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextIconLeading">` z `<div class="ytSpecButtonShapeNextIcon">` (svg 24×24) i `<div class="ytSpecButtonShapeNextButtonTextContent">Miniaturka</div>`. Wynik: identyczne wymiary, kolory w obu motywach i hover za darmo. Ryzyko: zmiana nazw klas przez YouTube = przycisk "goły" (nadal działa, tylko brzydki).
- **B) Własny CSS z prefiksem**, kolory na sztywno z tabeli, przełączane `html[dark] .<prefiks>-pobierz { … }`. Odporne na zmianę klas, ale może się "rozjechać" z wyglądem YouTube przy redesignie.
- Rekomendacja: **B jako baza + A jako dodatkowe klasy** (nasze reguły ustawiają wszystko, co ważne; klasy YouTube tylko poprawiają zgodność). Albo samo B, jeśli zależy nam na przewidywalności.

### 1.4 Jak rozpoznać ciemny motyw

Na `<html>` w motywie ciemnym:

```
<html dark="" darker-dark-theme="" darker-dark-theme-deprecate="" data-theme="dark" lang="pl-PL" system-icons="" typography="" …>
```

- **Główny:** `document.documentElement.hasAttribute('dark')` (CSS: `html[dark]`). YouTube sam używa selektorów `html[dark]` i `[dark]`.
- **Zapasowy:** `ytd-watch-flexy[is-dark-theme]` (tylko na stronie Filmu), `getComputedStyle(ytd-app).backgroundColor === 'rgb(15, 15, 15)'`.
- `data-theme="dark"` na `<html>` też był obecny, ale **mógł być dodany przez inną wtyczkę** w tym profilu (np. LanguageTool, `data-lt-installed`) - nie polegać.
- **Jasny motyw nie był sprawdzony na prawdziwym ustawieniu** (zmiana motywu to zmiana ustawień konta). Symulacja: dodanie atrybutu `light` do `<html>` przełącza zmienne kolorów (reguła `[light]` ma 136 zmiennych, `[dark]` 117), co dało wartości z kolumny "Jasny". Samo usunięcie `dark` **nie** przełącza kolorów, bo arkusz motywu ciemnego definiuje też zmienne na `:root`. Przed oddaniem T6 Robert powinien przełączyć motyw w YouTube (awatar → Wygląd → Jasny) i potwierdzić zrzutem.

---

## 2. ID bieżącego Filmu i nawigacja SPA

Test: listener na `document` dla `yt-navigate-start`, `yt-navigate-finish`, `yt-page-data-updated`, potem kliknięcie rekomendacji w `#secondary` (Rick Astley → `MdmRadVnVlw`).

Zarejestrowane zdarzenia (w tej kolejności):

| Zdarzenie | `location.href` | `ytd-watch-flexy[video-id]` | `detail.endpoint.watchEndpoint.videoId` |
|---|---|---|---|
| `yt-navigate-start` | już nowy (`v=MdmRadVnVlw`) | **stary** (`dQw4w9WgXcQ`) | `MdmRadVnVlw` |
| `yt-navigate-finish` (+1,3 s) | nowy | **stary** (`dQw4w9WgXcQ`) | `MdmRadVnVlw` |
| `yt-page-data-updated` (+0,6 s) | nowy | stary w chwili zdarzenia | - |

Po ok. 5 s `video-id` na `ytd-watch-flexy` = nowe ID.

Wnioski:
- **`yt-navigate-finish` występuje** i jest dobrym wyzwalaczem (nasłuch na `document`, `window` też zadziała, bo zdarzenie się bąbelkuje).
- **Główne źródło ID:** `new URL(location.href).searchParams.get('v')` na ścieżce `/watch`.
- **Zapasowe:** `event.detail?.endpoint?.watchEndpoint?.videoId`.
- **Nie używać** `ytd-watch-flexy[video-id]` jako źródła w chwili zdarzenia - aktualizuje się z opóźnieniem. Ewentualnie jako trzecia, opóźniona weryfikacja.
- ID trzeba **odczytywać w momencie kliknięcia** przycisku (z URL), a nie zapamiętywać przy wstawianiu - przycisk może przeżyć nawigację (np. gdyby był wstawiony w `#actions-inner`).
- Czy `yt-navigate-finish` odpala też przy pierwszym pełnym załadowaniu strony - **niezweryfikowane** (listener był podpinany po załadowaniu). Content script i tak powinien przy starcie od razu spróbować wstawić przycisk.

Shorts: po wejściu na `/shorts/...` (pełne załadowanie) `ytd-watch-metadata` nie istnieje, jest `ytd-shorts`. Przy przejściu SPA z Filmu na Shorta `ytd-watch-flexy` zostaje w DOM (ukryty), więc **decyzję "czy to Short" podejmować po `location.pathname.startsWith('/shorts/')`**, nie po obecności elementów.

---

## 3. Listy Filmów

### 3.1 Strona główna (`/`) - nowy układ `yt-lockup-view-model`

Liczniki po załadowaniu: 32× `ytd-rich-item-renderer` = 20× `yt-lockup-view-model` (Filmy) + 12× `ytm-shorts-lockup-view-model-v2` (w 2 półkach Shortów).

Struktura karty Filmu:

```
ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer
 └ #content
    └ yt-lockup-view-model.ytd-rich-item-renderer.lockup
       └ div.ytLockupViewModelHost.ytLockupViewModelVertical.content-id-<ID>
          ├ yt-touch-feedback-shape …
          ├ a.ytLockupViewModelContentImage[href="/watch?v=<ID>…"]     ← link z ID
          │  └ yt-thumbnail-view-model.ytThumbnailViewModelHost.ytThumbnailViewModelAspectRatio16By9   ← kontener Miniaturki
          │     ├ div.ytThumbnailViewModelImage > img.ytCoreImageHost (src=i.ytimg.com/vi/<ID>/hq720.jpg…)
          │     └ yt-thumbnail-bottom-overlay-view-model
          │        ├ yt-thumbnail-overlay-progress-bar-view-model     (pasek obejrzenia, jeśli jest)
          │        └ div.ytThumbnailBottomOverlayViewModelBadgeContainer
          │           └ yt-thumbnail-badge-view-model > badge-shape   ← czas trwania ("2:47") / "NA ŻYWO"
          └ div.ytLockupViewModelMetadata
             └ yt-lockup-metadata-view-model …
                ├ h3 > a.ytLockupMetadataViewModelTitle[href="/watch?v=<ID>"]   (tytuł)
                └ div.ytLockupMetadataViewModelMenuButton (⋮)
```

Przykładowy HTML Miniaturki (skrócony):

```html
<a href="/watch?v=x9yop0nYR9g" class="ytLockupViewModelContentImage" tabindex="-1" aria-hidden="true">
  <yt-thumbnail-view-model class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
    <div class="ytThumbnailViewModelImage"><img class="ytCoreImageHost …" src="https://i.ytimg.com/vi/x9yop0nYR9g/hq720.jpg?…"></div>
    <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
      <div class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
        <yt-thumbnail-badge-view-model class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
          <badge-shape class="ytBadgeShapeHost …" role="img" aria-label="2 minuty i 47 sekund">
            <div class="ytBadgeShapeText" aria-hidden="true">2:47</div>
          </badge-shape>
        </yt-thumbnail-badge-view-model>
      </div>
    </yt-thumbnail-bottom-overlay-view-model>
  </yt-thumbnail-view-model>
</a>
```

Geometria (Miniaturka 469×264 px): `yt-thumbnail-view-model` ma `position: relative; border-radius: 12px; overflow: hidden` - dobry rodzic dla przycisku `position:absolute`. Kontener odznak zajmuje pasek 28 px na dole na całej szerokości; sama odznaka czasu jest w **prawym dolnym rogu** (8 px od prawej i od dołu, ok. 48×20 px). `a.ytLockupViewModelContentImage` ma `position: static`.

Dodatkowo na stronie głównej sekcja `ytd-rich-section-renderer > ytd-chips-shelf-with-video-shelf-renderer` zawiera w środku te same `ytd-rich-item-renderer > yt-lockup-view-model` - ogólny selektor je złapie.

### 3.2 Strona kanału (`/@YouTube/videos`)

Taki sam układ jak strona główna: 30× `ytd-rich-item-renderer > yt-lockup-view-model`, wszystkie z `a.ytLockupViewModelContentImage[href*="/watch?v="]`, `yt-thumbnail-view-model` i `yt-thumbnail-badge-view-model` (odznaka czasu 8 px od prawej/dołu, Miniaturka 420×236). Brak Shortów na zakładce "Filmy".

Zakładka `/@YouTube/shorts`: `ytd-rich-grid-renderer[is-shorts-grid]`, 48× `ytd-rich-item-renderer > ytm-shorts-lockup-view-model-v2`, zero `yt-lockup-view-model` - nasz selektor kart Filmów nic tam nie znajdzie, dobrze.

(Na stronie kanału w DOM są też 2 ukryte `ytd-thumbnail a#thumbnail` w odtwarzaczu `ytd-watch-flexy` - pozostałość po stronie Filmu, bez `href`, niewidoczne. Selektor wyszukiwarki musi być zawężony do `ytd-video-renderer`, żeby ich nie łapać.)

### 3.3 Wyniki wyszukiwania (`/results?search_query=lofi`) - stary układ

Liczniki: 21× `ytd-video-renderer`, 0× `yt-lockup-view-model`, 3× `grid-shelf-view-model` (półki Shortów), 20× `ytm-shorts-lockup-view-model-v2`. Inne dzieci sekcji: `ytd-channel-renderer`, `ytd-shelf-renderer`.

```
ytd-section-list-renderer > #contents > ytd-item-section-renderer > #contents
 └ ytd-video-renderer
    └ #dismissible
       ├ ytd-thumbnail (position: relative)                         ← kontener Miniaturki
       │  └ a#thumbnail.yt-simple-endpoint[href="/watch?v=<ID>&pp=…"] (position:absolute, radius 12px, overflow hidden)
       │     ├ yt-image > img.ytCoreImageHost
       │     ├ div#overlays
       │     │  └ ytd-thumbnail-overlay-time-status-renderer        ← czas trwania
       │     │     └ div.thumbnail-overlay-badge-shape > badge-shape > div.ytBadgeShapeText "3:02:29"
       │     ├ div#mouseover-overlay
       │     └ div#hover-overlays (puste po najechaniu w tej wersji)
       └ div.text-wrapper > #meta > #title-wrapper > h3 > a#video-title[href="/watch?v=<ID>"]
```

Czas trwania: prawy dolny róg, 8 px od prawej/dołu, ok. 68×20 px (dla "3:02:29"). Transmisje na żywo nie mają `ytd-thumbnail-overlay-time-status-renderer` (mają `ytd-thumbnail-overlay-now-playing-renderer`) - 20 z 56 kart po przewinięciu, wszystkie "na żywo".

Shorty w wynikach: tylko w `grid-shelf-view-model` z `ytm-shorts-lockup-view-model-v2` i linkami `/shorts/…`; **nie znaleziono** `ytd-video-renderer` z linkiem `/shorts/` (0 z 56), ale filtr po linku i tak zostaje.

### 3.4 Półki i karty Shortów

| Gdzie | Półka | Karta | Link |
|---|---|---|---|
| Strona główna | `ytd-rich-section-renderer > #content > ytd-rich-shelf-renderer[is-shorts]` | `ytd-rich-item-renderer > #content > ytm-shorts-lockup-view-model-v2 > ytm-shorts-lockup-view-model` | `a.shortsLockupViewModelHostEndpoint.reel-item-endpoint[href^="/shorts/"]` |
| Wyszukiwarka | `grid-shelf-view-model` | `ytm-shorts-lockup-view-model-v2` | jw. |
| Kanał, zakładka Shorts | `ytd-rich-grid-renderer[is-shorts-grid]` | `ytm-shorts-lockup-view-model-v2` | jw. |

Uwaga: karta Shorta na stronie głównej to **też** `ytd-rich-item-renderer` - dlatego nie wolno używać samego `ytd-rich-item-renderer` jako "karty Filmu". Kartę Filmu wyznacza `yt-lockup-view-model` z linkiem `/watch?v=`.

Przykład (skrócony):

```html
<ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost …">
    <a href="/shorts/Wk_lBnLW7PE" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" …>
      <div class="shortsLockupViewModelHostThumbnailParentContainer …">
        <yt-thumbnail-view-model class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 …">…</yt-thumbnail-view-model>
```

### 3.5 Najechanie myszką - podgląd wideo zakrywa Miniaturkę

Po ok. 1-2 s najechania na Miniaturkę (strona główna **i** wyszukiwarka) YouTube odtwarza podgląd w **osobnym** elemencie poza kartą: `ytd-app > #video-preview > ytd-video-preview-loader > ytd-video-preview` (`#inline-preview-player`). Leży on dokładnie nad Miniaturką:

- `elementFromPoint` w lewym górnym rogu i na środku Miniaturki → `video` z `#inline-preview-player`;
- w prawym górnym rogu → `ytm-mute-button` (wycisz); niżej ikona napisów (CC) i ikona vidIQ.

Test: przycisk wstawiony do `yt-thumbnail-view-model` z `position:absolute; top:8px; left:8px; z-index:9999` **pozostał widoczny i był trafiany przez `elementFromPoint`** podczas aktywnego podglądu (`#video-preview` ma `z-index: auto`, `position: static`). Zrzut `05-…`.

Wniosek: **przycisk w lewym górnym rogu Miniaturki** (prawy górny zajmują kontrolki podglądu, prawy dolny - czas trwania, dół - pasek postępu). Wysoki `z-index`. Ponieważ przycisk jest wewnątrz `<a>`, handler kliknięcia musi robić `preventDefault()` + `stopPropagation()` (inaczej otworzy się Film). Wariant bezpieczniejszy: wstawić przycisk do `div.ytLockupViewModelHost` (rodzic linku) z pozycjonowaniem względem Miniaturki - ale ten div nie ma `position: relative`, więc wymaga własnego stylu; do przetestowania przy implementacji.

---

## 4. Doładowywanie przy przewijaniu

- **Strona główna:** 20 → 116 kart Filmów po 4 przewinięciach. `MutationObserver` na `ytd-rich-grid-renderer > #contents` (`childList`) złapał 96 nowych `ytd-rich-item-renderer`; **wszystkie 96** miały ten sam układ (`yt-lockup-view-model`, `a.ytLockupViewModelContentImage[href*="/watch?v="]`, `yt-thumbnail-view-model`, odznaka). Doszła sekcja `ytd-chips-shelf-with-video-shelf-renderer` (w środku ten sam układ kart). Reklam (`ytd-ad-slot-renderer`) w tym profilu 0 (Premium) - u użytkownika bez Premium pojawią się karty reklamowe, które nie mają linku `/watch?v=` w `yt-lockup-view-model` (niezweryfikowane).
- **Kanał:** 30 → 120 kart, 120/120 z pełnym układem.
- **Wyszukiwarka:** 21 → 56 `ytd-video-renderer` (sekcje `ytd-item-section-renderer` 1 → 4, półki Shortów 3 → 8); wszystkie z `ytd-thumbnail a#thumbnail[href*="/watch?v="]`.
- Wniosek: doładowane karty mają ten sam układ. Obserwować `document.body` (lub `ytd-app`) z `subtree: true`, bo nowe karty trafiają do **nowych** kontenerów (`ytd-item-section-renderer` w wyszukiwarce). Polymer potrafi też **przepiąć dane w istniejącym węźle** (ta sama karta, inny Film) - ID czytać z linku w chwili kliknięcia, a nie zapamiętywać.

---

## Rekomendowany zestaw selektorów (do modułu TS)

```ts
// Zweryfikowano na żywo: 2026-10-28 (ego-browser, www.youtube.com, PL, motyw ciemny; jasny symulowany)
export const ZWERYFIKOWANO = '2026-10-28';

export const selektory = {
  // --- Strona Filmu ---
  rzadAkcji: {
    glowny: 'ytd-watch-metadata #top-level-buttons-computed',
    zapasowy: 'ytd-watch-metadata #actions-inner #menu ytd-menu-renderer',
  },
  przyciskUdostepnij: {
    // wstawiamy ZA hostem tego przycisku: btn.closest('yt-button-view-model').after(nasz)
    glowny: 'ytd-watch-metadata #top-level-buttons-computed button[aria-label="Udostępnij"], ' +
            'ytd-watch-metadata #top-level-buttons-computed button[aria-label="Share"]',
    zapasowy: 'ytd-watch-metadata #top-level-buttons-computed > yt-button-view-model:last-of-type',
  },
  hostPrzyciskuYT: 'yt-button-view-model',

  // --- ID Filmu ---
  // glowny: new URL(location.href).searchParams.get('v') gdy location.pathname === '/watch'
  // zapasowy: (e as CustomEvent).detail?.endpoint?.watchEndpoint?.videoId z 'yt-navigate-finish'
  // NIE w chwili zdarzenia: document.querySelector('ytd-watch-flexy')?.getAttribute('video-id') (opóźnione)
  zdarzenieNawigacji: 'yt-navigate-finish',

  // --- Motyw ---
  ciemnyMotyw: {
    glowny: 'html[dark]',
    zapasowy: 'ytd-watch-flexy[is-dark-theme]', // tylko strona Filmu
  },

  // --- Listy: karta Filmu (nowy układ: główna, kanał) ---
  kartaFilmu: {
    glowny: 'yt-lockup-view-model',                 // + filtr: ma linkMiniaturki z /watch?v=
    zapasowy: 'ytd-video-renderer',                 // stary układ: wyszukiwarka
  },
  linkMiniaturki: {
    glowny: 'a.ytLockupViewModelContentImage[href*="/watch?v="]',
    zapasowy: 'ytd-thumbnail a#thumbnail[href*="/watch?v="]',
  },
  kontenerMiniaturki: {
    glowny: 'a.ytLockupViewModelContentImage yt-thumbnail-view-model', // position:relative, overflow:hidden
    zapasowy: 'ytd-thumbnail',                                        // position:relative
  },
  czasTrwania: {
    glowny: 'yt-thumbnail-badge-view-model',                 // prawy dolny róg, 8px od krawędzi
    zapasowy: 'ytd-thumbnail-overlay-time-status-renderer',  // prawy dolny róg, 8px od krawędzi
  },

  // --- Shorty (pomijamy) ---
  polkaShortow: 'ytd-rich-shelf-renderer[is-shorts], grid-shelf-view-model, ytd-reel-shelf-renderer, ytd-rich-grid-renderer[is-shorts-grid]',
  kartaShorta: 'ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model, ytd-reel-item-renderer',
  linkShorta: 'a[href^="/shorts/"]',
} as const;
```

Reguły użycia:
- Karta jest Filmem, gdy: pasuje do `kartaFilmu`, **ma** `linkMiniaturki` z `/watch?v=`, **nie** leży w `polkaShortow` (`closest(...)`) i **nie** zawiera `linkShorta`.
- ID z karty: `new URL(link.href).searchParams.get('v')` (href ma doklejone `&pp=…`, `&t=…s`). Klasa `content-id-<ID>` na `div.ytLockupViewModelHost` to dodatkowe, niezależne źródło do kontroli.
- Strona Shorta: `location.pathname.startsWith('/shorts/')` → nic nie dodajemy.
- Przycisk na liście: lewy górny róg `kontenerMiniaturki`, `position:absolute; top:8px; left:8px; z-index` wysoki; widoczny tylko na `:hover` karty; `preventDefault()` + `stopPropagation()` w kliknięciu.
- Budowa DOM bez `innerHTML` (Trusted Types): `createElement`, `createElementNS('http://www.w3.org/2000/svg', …)`, `textContent`.
- Style kolorów na sztywno, przełączane `html[dark]` (zmienne `--yt-spec-*` są puste).

### Ocena stabilności

| Selektor | Stabilność | Uzasadnienie |
|---|---|---|
| `ytd-watch-metadata`, `#top-level-buttons-computed`, `#actions` | wysoka | od lat te same ID, używane przez wiele wtyczek |
| `button[aria-label="Udostępnij"]` | średnia | zależy od języka interfejsu; potrzebny wariant EN i zapas `:last-of-type` |
| `html[dark]` | wysoka | używany przez arkusze YouTube |
| `yt-navigate-finish` | wysoka | nieoficjalne, ale stabilne od lat |
| `yt-lockup-view-model`, `yt-thumbnail-view-model`, `yt-thumbnail-badge-view-model` | średnia | nowe komponenty, nazwy tagów raczej zostaną |
| `a.ytLockupViewModelContentImage` | **niska-średnia** | klasa camelCase; YouTube niedawno zmieniło BEM → camelCase, może zmienić ponownie. Zapas: `yt-lockup-view-model a[href*="/watch?v="]` (pierwszy taki link = Miniaturka) |
| `ytd-video-renderer`, `ytd-thumbnail a#thumbnail` | średnia | stary układ; wyszukiwarka może w każdej chwili przejść na `yt-lockup-view-model` |
| `ytd-rich-shelf-renderer[is-shorts]`, `grid-shelf-view-model`, `ytm-shorts-lockup-view-model-v2` | średnia | sufiks `-v2` sugeruje trwające migracje; dlatego zawsze też filtr po linku `/shorts/` |
| klasy `ytSpecButtonShapeNext*` (do pożyczenia stylu) | niska-średnia | j.w. - camelCase, mogą się zmienić |

---

## Ryzyka i rzeczy niezweryfikowane

- **Jasny motyw** - wartości z symulacji (atrybut `light`), nie z prawdziwego ustawienia konta.
- Profil miał **Premium** (brak reklam, jest przycisk "Pobierz") i **vidIQ** (wstrzykuje `div.vidiq-scope` do Miniaturek i własne przyciski "Remix"/"Analyze" w rzędzie pod Filmem). U Roberta może być podobnie; nasze selektory nie zależą od tych elementów.
- **Wąskie okno** - nie sprawdzono, czy YouTube chowa przyciski do "…" i jak zachowa się wtedy nasz.
- **Pierwsze załadowanie strony** - nie sprawdzono, czy `yt-navigate-finish` odpala przy pełnym załadowaniu; content script powinien próbować wstawić przycisk od razu przy starcie.
- **Inny język interfejsu** - `aria-label` zmienia się z językiem; zapas po pozycji.
- Pasek bocznych rekomendacji na stronie Filmu (`#secondary`) też ma karty `yt-lockup-view-model` - jeśli T7 ma działać tylko na stronie głównej/kanale/wyszukiwarce, ograniczyć po `location.pathname` albo świadomie objąć.

## Zrzuty ekranu

Katalog: `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/` (tymczasowy - przenieść, jeśli mają zostać).

- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/00-start.png` - strona Filmu po załadowaniu
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/01-watch-akcje-ciemny.png` - rząd akcji, motyw ciemny
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/01-watch-light-sim.png` - nieudana symulacja (usunięcie `dark` nie zmienia kolorów)
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/02-watch-akcje-jasny-symulowany.png` - rząd akcji, jasny (atrybut `light`)
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/03-glowna.png` - strona główna
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/04-glowna-hover.png` - najechanie: podgląd wideo z kontrolkami w prawym górnym rogu
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/05-glowna-hover-podglad-zaslania.png` - testowy przycisk "TEST" (lewy górny róg) widoczny nad podglądem
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/06-glowna-po-przewinieciu.png` - po doładowaniu
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/07-kanal-videos.png` - kanał @YouTube, zakładka Filmy
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/08-wyszukiwanie.png` - wyniki "lofi"
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/09-wyszukiwanie-hover.png` - najechanie w wynikach (podgląd)
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/10-watch-testowy-przycisk-ciemny.png` - testowy przycisk "Miniaturka" za "Udostępnij" (klasy YouTube), ciemny
- `/private/tmp/claude-501/-Users-robert-Windsurf-Projekty-miniaturki-appka-live/abb23031-5877-4095-842b-76aea3ff926c/scratchpad/selektory/11-watch-testowy-przycisk-jasny-symulowany.png` - to samo, jasny symulowany

Wszystkie testowe elementy były wstawiane tylko lokalnie w DOM i znikały po przeładowaniu; na koncie niczego nie zmieniano.
