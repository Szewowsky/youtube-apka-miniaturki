# Pomiary natywnych przycisków YouTube (makieta, ticket #15)

**Data:** 2026-10-29
**Strony:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ` (rząd pod Filmem), `https://www.youtube.com/` (karty Filmów)
**Narzędzie:** ego-browser (Ego Lite, Chromium), interfejs PL, profil zalogowany (Premium), aktywne inne wtyczki: vidIQ, LanguageTool.
**Okno:** prawdziwe okno 1481×884 CSS px (zoom strony 110%, DPR 2,2). Pomiary i zrzuty robione z emulacją widoku 1920×1000, co daje `innerWidth` = 1745 CSS px. Przy 1481 px "Zapisz" chowa się do menu "…", przy 1745 px jest w rzędzie.
**Metoda:** `getComputedStyle` + `getBoundingClientRect`, hover przez prawdziwe najechanie kursorem (`page.hover`), zrzuty ekranu przycięte (1 px zrzutu ≈ 1 CSS px).

## Motyw: jak przełączano

- **Stan na start:** menu awatara → "Wygląd: **tryb urządzenia**" (system ciemny, więc YouTube ciemny). Ciasteczko `PREF=f6=40000080…`.
- YouTube w podmenu "Wygląd" pisze wprost: "Ustawienie dotyczy tylko tej przeglądarki". To nie jest ustawienie konta, więc przełączono na **"Tryb jasny"** na czas pomiaru (`f6=40080080`).
- **Na koniec przywrócono "Użyj trybu urządzenia"**; `PREF` znowu `f6=40000080`, strona ciemna (`html[dark]`, tło `rgb(15,15,15)`).
- Oba motywy zmierzone na **prawdziwym** przełączeniu. Najpierw próbowano symulacji (atrybut `light` na `<html>`): wartości przycisków wyszły takie same, ale zrzut był niespójny (część strony została ciemna), więc do zrzutów jej nie używano.

## 1. Rząd przycisków pod Filmem

Rząd (od lewej): Lubię (z licznikiem "19 mln") | Nie lubię, Udostępnij, **Miniaturka (nasz)**, Zapisz, Pobierz (Premium), Więcej działań (…).
**"Udostępnij", "Zapisz", "Pobierz" i "…" to same ikony (40×40, bez napisu)**, klasa `ytSpecButtonShapeNextIconButton`. Napis ma tylko Lubię (licznik).

### Wartości (natywne)

| Właściwość | Jasny | Ciemny |
|---|---|---|
| height | 40px | 40px |
| border-radius | 20px (ikona/pigułka); Lubię `20px 0 0 20px`, Nie lubię `0 20px 20px 0` | jw. |
| padding | `0 16px` (też w wariancie z napisem: Lubię ma 16/16) | jw. |
| szerokość przycisku-ikony | 40px | 40px |
| font-family | Roboto, Arial, sans-serif | jw. |
| font-size / weight / line-height | 14px / 500 / 40px | jw. |
| letter-spacing | normal | normal |
| tło (zwykłe) | `rgba(0, 0, 0, 0.05)` | `rgba(255, 255, 255, 0.1)` |
| tło (:hover) | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.2)` |
| kolor tekstu/ikony | `rgb(15, 15, 15)` #0f0f0f | `rgb(241, 241, 241)` #f1f1f1 |
| border / box-shadow | 0 / none | 0 / none |
| ikona | 24×24, `fill: currentColor` | jw. |
| odstęp ikona-napis | 6px (`margin-right: 6px` na `.ytSpecButtonShapeNextIcon`) | jw. |
| odstęp między przyciskami | 8px (`margin-left: 8px` na hostach); Lubię/Nie lubię sklejone (0) | jw. |
| separator Lubię/Nie lubię | `::after` 1×24px, top 8px, kolor nie zmierzony | `rgba(255,255,255,0.2)` |
| transition | `all` | `all` |
| tło strony (`ytd-app`) | `rgb(255, 255, 255)` | `rgb(15, 15, 15)` |

**Efekt "szkła" (nowy, tylko Udostępnij/Zapisz/Pobierz/…, nie Lubię/Nie lubię):** wewnątrz przycisku jest `yt-light-shape`:
- obwódka `::before` 0,5px (maska), gradient z góry: jasny `linear-gradient(rgba(0,0,0,0.05), transparent 75%)`, ciemny `linear-gradient(rgba(255,255,255,0.1), transparent 75%)`;
- rozmyta poświata `.contribYtLightShapeStaticWashLight`: `filter: blur(10px)`, przesunięta (top −20px, bottom 20px), jasny `rgba(255,255,255,0.2)`, ciemny `rgba(255,255,255,0.05)`.
Wizualnie to bardzo subtelny połysk u góry przycisku.

### Nasz przycisk "Miniaturka" w rzędzie

| Właściwość | Nasz (oba motywy) | Natywny | Zgodne? |
|---|---|---|---|
| height | 40px | 40px | tak |
| border-radius | 20px | 20px | tak |
| padding | `0 16px 0 12px` | `0 16px` | **nie** (lewy 12 vs 16) |
| szerokość | 125px (ikona + "Miniaturka") | 40px (ikony) | inna z natury (jedyny przycisk z napisem obok Lubię) |
| font | Roboto 14px / 500 / 40px | jw. | tak |
| tło jasny / ciemny | `rgba(0,0,0,0.05)` / `rgba(255,255,255,0.1)` | jw. | tak |
| hover jasny / ciemny | `rgba(0,0,0,0.1)` / `rgba(255,255,255,0.2)` | jw. | tak |
| kolor | #0f0f0f / #f1f1f1 | jw. | tak |
| ikona | 24×24 | 24×24 | tak |
| odstęp ikona-napis | 6px (`gap`) | 6px | tak |
| odstęp od sąsiadów | `margin-left: 8px`, następny ma 8px | 8px | tak |
| efekt szkła (`yt-light-shape`) | brak | jest na Udostępnij/Zapisz | **nie** (drobne) |
| transition | `background-color .15s, opacity .15s` | `all` | kosmetyczne |

Zrzuty: `youtube-film-jasny.png`, `youtube-film-ciemny.png` (stan zwykły, kursor poza rzędem).

## 2. Karta Filmu (strona główna, `yt-lockup-view-model`)

Miniaturka: 475×267 px, `border-radius: 12px`, `overflow: hidden`.

### Znaczek czasu trwania (`yt-thumbnail-badge-view-model > badge-shape`)

| Właściwość | Jasny | Ciemny |
|---|---|---|
| pozycja | prawy dolny róg, 8px od prawej i 8px od dołu | jw. |
| height | 20px (line-height 18 + padding 1+1) | jw. |
| padding | `1px 4px` | jw. |
| border-radius | 4px | jw. |
| tło | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.6)` |
| kolor | `rgb(255, 255, 255)` | jw. |
| font | Roboto 12px / 500 / line-height 18px | jw. |
| backdrop-filter / shadow | none / none | jw. |
| ikona w znaczku (wariant muzyczny "♪") | 12×12, `margin-right: 4px` | (karta w ciemnym bez ikony) |
| kontener odznak | pasek 28px wys., `padding-right: 8px` | jw. |

Znaczek wygląda tak samo w obu motywach (nie zależy od motywu).

### Nakładki po najechaniu

- Tło całej karty po najechaniu: `ytSpecTouchFeedbackShapeHoverEffect`, radius 16px, kolor **wyliczany z Miniaturki** (np. `rgba(201, 96, 70, 0.13)`), wystaje 12px poza Miniaturkę.
- Po ok. 0,5-1,5 s startuje **podgląd wideo** (`#inline-preview-player`, 479×269, przykrywa Miniaturkę). Jego przyciski: "Wyłącz wyciszenie" 48×48 i "Napisy" 48×48 w **prawym górnym rogu** (ok. 4px od prawej i góry, jeden pod drugim), na dole pasek postępu, a znaczek czasu odlicza (np. "0:00" → "4:28"). Przyciski mają przezroczyste tło (sama biała ikona).
- Okrągły przycisk 36×36, `rgba(0,0,0,0.7)`, `border-radius: 9999px` po prawej na wysokości ok. 40% to **vidIQ** (inna wtyczka), nie YouTube.
- Starych nakładek YouTube ("Obejrzyj później", "Dodaj do kolejki") w nowym układzie kart nie ma.

### Nasz przycisk na karcie

| Właściwość | Nasz | Natywny wzorzec (znaczek czasu) |
|---|---|---|
| pozycja | lewy górny, 8px/8px | prawy dolny, 8px/8px |
| height | 32px | 20px |
| padding | `0 10px 0 6px` | `1px 4px` |
| border-radius | 16px (pigułka) | 4px |
| tło | `rgba(0,0,0,0.8)`, hover `#000` | `rgba(0,0,0,0.6)` |
| kolor | #fff | #fff |
| font | Roboto 13px / 500 / 32px | Roboto 12px / 500 / 18px |
| ikona | 20×20, odstęp 6px | 12×12, odstęp 4px |
| widoczność | `opacity: 0`, 1 po najechaniu na kartę | zawsze |

**Zachowanie zaobserwowane:** nasz przycisk pojawia się po najechaniu na kartę, ale **znika (opacity 0), gdy startuje podgląd wideo**, mimo że kursor dalej jest nad kartą. `elementFromPoint` pokazuje wtedy `VIDEO.html5-main-video` spoza `yt-lockup-view-model`, więc `:hover` karty gaśnie. W jednym przebiegu przycisk był widoczny do ok. 1,4 s, w kolejnych (podgląd już w pamięci podręcznej) bywał niewidoczny już po 0,15-0,7 s. Po najechaniu wprost na nasz przycisk jest widoczny (`:hover` na nim, `html.mty-nad-przyciskiem` chowa podgląd).

Zrzuty: `youtube-karta-jasny.png`, `youtube-karta-ciemny.png`, oba z kursorem na naszym przycisku (stan hover: tło `#000`, podgląd ukryty). Zrzut "kursor na karcie bez przycisku" nie pokazał naszego przycisku z powodu opisanego wyżej.

## 3. Różnice nasz vs natywny i rekomendacje

1. **Padding pod Filmem:** nasz `0 16px 0 12px`, YouTube teraz `0 16px` (klasa `MainstagePadding`, także przy ikonie z napisem). Zmienić na `padding: 0 16px`. Przycisk urośnie o 4px (125 → 129px).
2. **Efekt szkła** (`yt-light-shape`) na sąsiednich ikonach: subtelny, opcjonalnie odtworzyć `::before` z gradientem 0,5px (jasny `rgba(0,0,0,.05)`, ciemny `rgba(255,255,255,.1)` → transparent 75%). Niski priorytet: Lubię/Nie lubię też go nie mają.
3. **Na karcie: znikanie przy podglądzie wideo.** Rekomendacja: sterować widocznością z JS (`mouseenter` na karcie dodaje `.mty-wskazany`, zdejmować dopiero przy `mouseleave` z karty **lub** z `#inline-preview-player`/`ytd-video-preview`), albo pokazywać przycisk, gdy podgląd leży nad tą kartą.
4. **Styl na karcie** bliżej YouTube: tło `rgba(0,0,0,0.6)` (hover `rgba(0,0,0,0.8)`), font 12px/500. Kształt: albo jak znaczek czasu (radius 4px, wys. 20-24px), albo zostawić pigułkę 32px (to bliżej przycisków podglądu, a cel kliknięcia jest większy). Pozycja lewy górny 8/8 jest dobra: nie koliduje ze znaczkiem (prawy dolny), przyciskami podglądu (prawy górny) ani vidIQ (prawy środek).
5. Kolory, wysokość, radius, font, ikona, odstępy pod Filmem: **zgodne**, bez zmian.

## Czego nie dało się zmierzyć

- Kolor separatora Lubię/Nie lubię w jasnym motywie (ciemny zmierzony).
- Czas `transition` natywnych przycisków (computed: `all`, czas nie odczytany).
- Stan `:active` (wciśnięcie): nie klikano.
- Wąskie okno: przy 1481 px "Zapisz" chowa się do "…". Nie da się stwierdzić, czy wypycha go nasz przycisk: ukrycie naszego przycisku bez przeładowania nie przywróciło "Zapisz".
- Nakładki strony kanału i wyszukiwarki (`ytd-video-renderer`): nie mierzone tym razem, tylko strona główna (selektory: `docs/selektory-youtube.md`).
- Konto zalogowane z Premium: widoczny przycisk "Pobierz", którego zwykły użytkownik nie ma.
