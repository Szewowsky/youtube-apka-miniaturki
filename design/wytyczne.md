# Wytyczne designu Wtyczki

Jeden plik dla sesji wdrożeniowej (T8, #18). Stosuj go bez dopytywania; gdzie coś jest niejasne, wzorcem jest makieta. Słownictwo z `GLOSSARY.md`.

- Makieta (D5): https://claude.ai/artifact/HVrmYQpRdCKC3bK5Qz7BFL, źródło `design/makieta/index.html`
- Pomiary YouTube: `design/makieta/pomiary-youtube.md`, porównanie: `design/makieta/porownanie-youtube.png`
- Moodboard (D4): https://claude.ai/artifact/Fv3cFL725FuUB94rxBh8iu

## Wybrany kierunek

**E: Okładka w barwach YouTube** (wybór Roberta, 2026-10-29). Hybryda kierunków A (Studio) i C (Okładka): baza z C (obrysy 2 px, gruby nagłówek w wersalikach z markerem), kolory i tekst z YouTube (czerwień jako jedyny akcent, Roboto). Dotyczy **Aplikacji i Ikony Wtyczki**. Przycisk pobierania na YouTube nie bierze kierunku E: kopiuje sąsiednie przyciski YouTube (sekcja „Przycisk pobierania”).

## 1. Tokeny kolorów (Aplikacja)

Gotowy blok do wklejenia na górę `src/aplikacja/aplikacja.css` w miejsce obecnych zmiennych. Nazwy zmiennych zostają polskie, jak w kodzie.

```css
:root {
  --tlo: #ffffff;
  --karta: #ffffff;
  --tekst: #0f0f0f;
  --tekst-pomocniczy: #5b5b5b;
  --obrys: #0f0f0f;            /* obrysy 2 px: pole, przyciski, wiersze, przełącznik */
  --obrys-miekki: #e2e2e2;     /* przycisk wyłączony, wiersz pominięty */
  --akcent: #ff0033;           /* tylko wypełnienia: przycisk główny, aktywna Jakość, marker */
  --na-akcencie: #ffffff;
  --gotowe: #127a3a;
  --blad: #cc0000;             /* tylko obrys, tło wiersza, ikona i napis błędu */
  --blad-tlo: #fdecec;
  --pominiety: #6b6b6b;
  --tor: #f1f1f1;              /* tło paska postępu, łuk „pobieram” */
  --fokus: #ff0033;
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root {
    --tlo: #0f0f0f;
    --karta: #1b1b1b;
    --tekst: #ffffff;
    --tekst-pomocniczy: #b4b4b4;
    --obrys: #ffffff;
    --obrys-miekki: #3a3a3a;
    --gotowe: #4ade80;
    --blad: #ff6b6b;
    --blad-tlo: #2a1414;
    --pominiety: #9a9a9a;
    --tor: #262626;
    color-scheme: dark;
  }
}
```

Motyw Aplikacji idzie za systemem (`prefers-color-scheme`), jak dziś. Akcent i kolor na akcencie są takie same w obu motywach.

**Zasada dwóch czerwieni:** `--akcent` występuje wyłącznie jako wypełnienie (przycisk główny, aktywna Jakość, marker nagłówka). `--blad` występuje wyłącznie jako obrys, jasne tło wiersza, ikona z wykrzyknikiem i napis. Nigdy odwrotnie; wtedy się nie mylą.

## 2. Fonty

| Rola | Krój | Waga | Rozmiar / interlinia | Gdzie |
|---|---|---|---|---|
| Nagłówek Aplikacji | Anton | 400 | 30 px / 1.1, wersaliki, `letter-spacing: 0.01em` | tylko `h1` |
| Tekst | Roboto | 400 | 14 px / 1.45 | całość |
| Tekst pogrubiony | Roboto | 600 | jak wyżej | tytuł Filmu, przyciski, aktywna Jakość, stany Gotowe / Pobieram… / błąd |
| Opis, kanał, podsumowanie | Roboto | 400 | 13 px (opis), 12 px (kanał), 12.5 px (podsumowanie) | |
| Etykiety pól („Linki do filmów”, „Jakość”) | Roboto | 600 | 12.5 px | |
| Pole z linkami, link zamiast tytułu w wierszu pominiętym | Roboto Mono | 400 | 12 px / 1.65 | |

- **Fonty dołączone do Wtyczki**, nie z Google Fonts: pliki `woff2` (Anton 400, Roboto 400/600, Roboto Mono 400) w paczce Wtyczki i `@font-face` z `font-display: swap`. Powód: Aplikacja ma działać bez zapytań do zewnętrznych serwerów, a manifest nie ma i nie dostanie dodatkowych uprawnień. Licencje: Anton - SIL Open Font License 1.1; Roboto i Roboto Mono - Apache 2.0 albo SIL OFL 1.1 zależnie od wydania. Przy pobieraniu plików sprawdź licencję w repozytorium fontu i dołącz jej plik obok fontów.
- Zapas: `Anton, Impact, "Arial Narrow", sans-serif`; `Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; `"Roboto Mono", ui-monospace, Menlo, monospace`.
- Nagłówek: słowo „Miniaturki” w `<mark>` na tle `--akcent`, tekst `--na-akcencie`, `padding: 0 6px`. Tekst nagłówka dalej z `TEKSTY_APLIKACJI.naglowek`; podział na `mark` robi kod (pierwsze słowo), bez nowego tekstu w module komunikatów.

## 3. Odstępy, zaokrąglenia, obrysy

- **Skala odstępów:** 2, 4, 6, 8, 12, 14, 16, 20, 24 px. Odstępy między elementami przez `gap`, nie marginesy.
- Główny kontener: `max-width: 760px`, `gap: 14px`, boczny margines co najmniej 16 px.
- **Zaokrąglenia:** 10 px (pole, przyciski, wiersze listy, tor przełącznika), 6 px (aktywna pigułka przełącznika), 2 px (pasek postępu).
- **Obrysy:** 2 px `--obrys` (pole, przyciski, wiersze, tor przełącznika). Wyłączony przycisk i wiersz pominięty: 2 px `--obrys-miekki`, wiersz pominięty dodatkowo `border-style: dashed`.
- Fokus z klawiatury: `outline: 2px solid var(--fokus); outline-offset: 2px` na wszystkim, co klikalne.

## 4. Aplikacja: elementy

| Element | Wygląd |
|---|---|
| `h1` | Anton 30 px, wersaliki, „Miniaturki” na czerwonym markerze |
| `textarea` | tło `--karta`, obrys 2 px, radius 10 px, `padding: 10px 12px`, Roboto Mono 12 px / 1.65, min. 84 px wysokości |
| Przycisk główny („Pobierz wszystkie”) | tło `--akcent`, tekst `--na-akcencie`, obrys 2 px `--obrys`, radius 10 px, `padding: 7px 14px`, Roboto 13 px / 600 |
| Przycisk drugorzędny („Rozpoznaj”, `.drugorzedny`) | tło przezroczyste, tekst `--tekst`, obrys 2 px `--obrys`, reszta jak główny |
| Przycisk wyłączony (`:disabled`) | tło przezroczyste, tekst `--tekst-pomocniczy`, obrys `--obrys-miekki`, `cursor: not-allowed`; bez `opacity` |
| Przełącznik Jakości (`.przelacznik`) | tor: obrys 2 px `--obrys`, radius 10 px, `padding: 3px`, `gap: 2px`, tło przezroczyste. Opcja: `padding: 5px 11px`, radius 6 px, 12.5 px / 500, `--tekst-pomocniczy`. Zaznaczona (`input:checked + span`): tło `--akcent`, tekst `--na-akcencie`, waga 600 |
| Podsumowanie | 12.5 px `--tekst-pomocniczy`, liczba Filmów do pobrania pogrubiona w `--tekst` |

## 5. Aplikacja: stany wiersza listy

Wspólne dla `.pozycja`: siatka `22px 1fr auto` (ikona stanu, tytuł z kanałem, stan), `gap: 12px`, `padding: 9px 12px`, obrys 2 px `--obrys`, radius 10 px, tło `--karta`. Na wąskim ekranie (< 560 px) stan schodzi pod tytuł. Ikony stanu to inline SVG 20×20 w kolorach z tokenów (wzór: makieta, obiekt `znaki`).

| `data-status` | Ikona stanu | Napis stanu | Wiersz |
|---|---|---|---|
| `czeka` (Film rozpoznany) | przerywane kółko w `--tekst-pomocniczy` | „Czeka”, 12 px / 500, `--tekst-pomocniczy` | zwykły |
| wczytywanie tytułu | jak `czeka` | jak `czeka`; w miejscu tytułu „Wczytuję tytuł…” kursywą w `--tekst-pomocniczy` | zwykły |
| `pobieram` | kółko `--tor` z obracającym się łukiem `--akcent` (0.9 s, liniowo; bez obrotu przy `prefers-reduced-motion`) | „Pobieram…”, 12 px / 600, `--tekst` + pasek postępu 72×4 px pod spodem (tor `--tor`, wypełnienie `--tekst`) | zwykły |
| `gotowe` | pełne kółko `--gotowe` z ptaszkiem w `--karta` | „Gotowe”, 12 px / 600, `--gotowe` | zwykły |
| `blad` | pełne kółko `--blad` z wykrzyknikiem w `--karta` | komunikat błędu, 12 px / 600, `--blad` | obrys `--blad`, tło `--blad-tlo` |
| `pominiety` | przekreślone kółko w `--pominiety` | powód („To jest Short - pomijam”, „To nie jest link do filmu YouTube”, „Duplikat”, „Ponad limit 50”), 12 px / 500, `--tekst-pomocniczy` | obrys przerywany `--obrys-miekki`; zamiast tytułu link w Roboto Mono 12 px / 500 `--tekst-pomocniczy` |

Pasek postępu jest umowny (nie mamy procentów pobrania): animowane wypełnienie 30-84%, bez animacji przy `prefers-reduced-motion`.

Teksty wyłącznie z `src/rdzen/komunikaty.ts`. Nowych tekstów nie dodajemy.

## 6. Przycisk pobierania na YouTube

**Zasada:** kopiuje sąsiednie przyciski YouTube, nie kierunek E. Kolory na sztywno (zmienne YouTube `--yt-spec-*` są puste albo zahashowane, patrz `docs/selektory-youtube.md`). Wszystkie klasy z prefiksem `mty-`. Motyw rozpoznajemy po atrybucie `dark` na `html` YouTube (`html[dark]`), potwierdzone na żywej stronie 2026-10-29.

### Pod Filmem (`.mty-przycisk-film`), zmierzone na żywo 2026-10-29

| | Jasny | Ciemny |
|---|---|---|
| Wysokość / radius | 40 px / 20 px | 40 px / 20 px |
| Odstęp wewnętrzny | **`0 16px`** (dziś `0 16px 0 12px` - poprawić) | `0 16px` |
| Font | Roboto 14 px / 500, `line-height: 40px` | jak jasny |
| Ikona / odstęp ikona-napis / odstęp od sąsiada | 24 px / 6 px / 8 px | jak jasny |
| Zwykły | tło `rgba(0,0,0,0.05)`, tekst `#0f0f0f` | tło `rgba(255,255,255,0.1)`, tekst `#f1f1f1` |
| Najechany | tło `rgba(0,0,0,0.1)` | tło `rgba(255,255,255,0.2)` |
| Pobieram… | jak zwykły, ikona obracającego się łuku, `aria-disabled="true"`, `cursor: progress` | jak jasny |
| Gotowe | tło `#1e8e3e`, tekst `#ffffff`, ikona ptaszka | tło `#81c995`, tekst `#0f0f0f` |
| Błąd | tło `#cc0000`, tekst `#ffffff`, ikona wykrzyknika | tło `#f28b82`, tekst `#0f0f0f` |

Napis „Miniaturka” zostaje, choć „Udostępnij” i „Zapisz” są dziś samymi ikonami: sama strzałka myliłaby się z przyciskiem „Pobierz” z YouTube Premium. Efekt „szkła” na ikonach YouTube (`yt-light-shape`) pomijamy.

### Na karcie Filmu (`.mty-przycisk-karta`)

| | Wartość |
|---|---|
| Pozycja | lewy górny róg Miniaturki, 8 px / 8 px (nie koliduje z czasem trwania, przyciskami podglądu ani vidIQ) |
| Wysokość / radius / odstęp | 32 px / 16 px / `0 10px 0 6px`, ikona 20 px, odstęp ikona-napis 6 px |
| Font | Roboto **12 px** / 500 (dziś 13 px - poprawić), jak znaczek czasu trwania |
| Zwykły | tło **`rgba(0,0,0,0.6)`** (dziś 0.8 - poprawić), tekst `#ffffff`, widoczny po najechaniu na kartę |
| Najechany | tło **`rgba(0,0,0,0.8)`** (dziś `#000` - poprawić) |
| Pobieram… / Gotowe / Błąd | ikony i kolory jak pod Filmem w danym motywie; długi komunikat skraca się z „…” |

Znany błąd (Błąd 1 z `docs/raport-testow.md`): przycisk znika, gdy YouTube odtwarza podgląd wideo. To naprawa działania, nie wyglądu; rekomendacja z pomiaru: sterować klasą `.mty-wskazany` z JS i zdejmować ją dopiero przy wyjściu kursora z karty lub z `#inline-preview-player`. Osobny ticket.

## 7. Ikona Wtyczki

- Gotowe pliki: `design/grafiki/ikona/ikona-16.png`, `ikona-32.png`, `ikona-48.png`, `ikona-128.png` (przezroczyste tło) i `ikona.svg` (źródło).
- **Ticket wdrożeniowy przenosi je do `ikony/`** pod tymi samymi nazwami (manifest już ich szuka: `ikony/ikona-16.png` itd.) i usuwa albo aktualizuje `ikony/generuj.sh`.
- Wygląd: czerwony `#ff0033` zaokrąglony kwadrat z obrysem `#0f0f0f`, biała pełna strzałka w dół nad kreską. Wybór i test czytelności w 16 px: `design/grafiki/README.md`.

## 8. Poza tym plikiem (propozycje działania, nie wyglądu)

- Film niedostępny wykryty już przy „Rozpoznaj” powinien od razu mieć stan `blad` i nie liczyć się do „Filmów do pobrania” (Uwaga 3 z testów).
- Naprawa Błędu 1 (przycisk na karcie podczas podglądu wideo).

Oba do osobnego ticketu albo do T8 po decyzji Roberta.
