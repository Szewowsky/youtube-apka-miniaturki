# Prompt: testy Wtyczki w nowej sesji

Skopiuj wszystko poniżej linii i wklej jako pierwszą wiadomość w nowej sesji Claude Code (model Opus) otwartej w folderze `miniaturki-appka-live`.

---

Przetestuj Wtyczkę do pobierania Miniaturek YouTube według listy kontrolnej i przygotuj raport. Nie piszesz kodu i niczego nie naprawiasz: tylko testujesz i raportujesz.

## Kontekst do przeczytania najpierw

1. `GLOSSARY.md` (słownictwo: Film, Short, Miniaturka, Wtyczka, Aplikacja, Przycisk pobierania, Ikona Wtyczki, Jakość).
2. `README.md` (instalacja i użycie).
3. `docs/lista-kontrolna.md` - 22 punkty, każdy z krokiem i oczekiwanym wynikiem. To jest Twój scenariusz testów.
4. `docs/selektory-youtube.md` - jak wygląda DOM YouTube (przydatne, gdy coś nie działa i trzeba opisać dlaczego).

## Przygotowanie

1. Zbuduj aktualną Wtyczkę z gałęzi `main`:
   `git checkout main && git pull && npm install && npm run build`
   i zapisz wynik bramki: `npm run typecheck && npm run test && npm run build` (liczba testów do raportu).
2. Przeglądarka: skill `ego-browser` (najpierw wywołaj skill i postępuj według jego instrukcji). To przeglądarka Roberta z zalogowanym YouTube, więc nadaje się do punktów wymagających konta (strona główna, motyw ciemny/jasny).
3. Zainstaluj Wtyczkę w ego-browser: `chrome://extensions` → włącz Tryb dewelopera → „Załaduj rozpakowane” → folder `dist` w tym repo (pełna ścieżka: `pwd` + `/dist`). Okno wyboru folderu jest natywnym oknem macOS: użyj skilla `jev-pilot` albo computer use (Cmd+Shift+G, wklej ścieżkę, Enter, „Wybierz”). Jeśli Wtyczka już jest zainstalowana, kliknij „Odśwież” na jej kafelku.
4. Pobrane pliki sprawdzaj w folderze pobierania przeglądarki (zwykle `~/Downloads`): `ls -lt ~/Downloads | head`, wymiary: `sips -g pixelWidth -g pixelHeight "<plik>"`.

### Gdy ego-browser nie da się użyć do Wtyczki

Jeśli ego-browser nie pozwala załadować rozpakowanej Wtyczki, testuj w Chrome for Testing przez `playwright-core` (skrypt w folderze tymczasowym, nie w repo), uruchamiając przeglądarkę z flagami `--disable-extensions-except=<dist>` i `--load-extension=<dist>` (`launchPersistentContext`, `headless: false`, żeby Robert widział). Uwagi z poprzednich testów:
- Playwright podmienia nazwy pobranych plików na identyfikatory. Żeby zobaczyć nazwę nadaną przez Wtyczkę, w service workerze Wtyczki (`context.serviceWorkers()[0].evaluate`) owiń `chrome.downloads.download` i zapisuj argumenty.
- YouTube bez logowania pokazuje okno zgody na cookies: kliknij przycisk z napisem „Odrzuć wszystko” (szukaj po tekście, nie po roli: jego aria-label to inny tekst).
- Bez logowania strona główna YouTube jest pusta, a motyw jest zawsze jasny. Punkty 12 i 17 oznacz wtedy jako „NIE SPRAWDZONO - wymaga zalogowanego profilu” zamiast FAIL.

## Zasady

- Idź po kolei przez wszystkie 22 punkty `docs/lista-kontrolna.md`. Każdy punkt: wykonaj krok, porównaj z oczekiwanym wynikiem, zapisz PASS / FAIL / NIE SPRAWDZONO z dowodem (zrzut ekranu, nazwa i wymiary pliku, tekst ze strony).
- Nie zmieniaj niczego w `src/`, `manifest.config.ts`, `package.json` ani w `docs/lista-kontrolna.md`. Nie commituj, nie pushuj, nie przełączaj gałęzi po kroku przygotowania.
- Nie usuwaj żadnych plików z folderu Pobrane (to folder Roberta); w raporcie wypisz pliki, które powstały podczas testów.
- Nie zmieniaj ustawień konta YouTube poza przełączeniem motywu w punkcie 12 (i przywróć motyw, który był na początku). Nie subskrybuj, nie lajkuj, nie komentuj.
- Okna zgody na cookies: zawsze opcja najbardziej prywatna („Odrzuć wszystko”).
- Przy FAIL: opisz dokładnie kroki, co widać, czego oczekiwano, zrzut ekranu i - jeśli umiesz wskazać - prawdopodobną przyczynę (plik i selektor). Nie naprawiaj.
- Punkt 8 (druga przeglądarka) i punkt 10 (zamknięcie całej przeglądarki): wykonaj, jeśli możesz bez zamykania przeglądarki, w której Robert pracuje; inaczej oznacz NIE SPRAWDZONO z powodem.

## Raport

Zapisz `docs/raport-testow.md` (zrzuty do `docs/raport-testow/`, nazwy `NN-krotki-opis.png`):

1. Nagłówek: data, gałąź i commit (`git rev-parse --short HEAD`), przeglądarka i jej wersja, zalogowany czy nie, wynik bramki (liczba testów).
2. Tabela: nr punktu | nazwa | wynik (PASS / FAIL / NIE SPRAWDZONO) | dowód (1 zdanie + link do zrzutu).
3. Sekcja „Błędy” - każdy FAIL osobno: kroki, oczekiwane, faktyczne, zrzut, prawdopodobna przyczyna, waga (blokuje używanie / przeszkadza / kosmetyka).
4. Sekcja „Uwagi” - rzeczy, które działają, ale są dziwne albo mylące dla użytkownika.
5. Lista plików pobranych podczas testów.
6. Na końcu 3-5 zdań po polsku dla Roberta (nie programuje): czy Wtyczka nadaje się do codziennego używania i co jest do poprawy w pierwszej kolejności.

Odpowiadasz po polsku. Na koniec sesji pokaż Robertowi podsumowanie z punktu 6 i ścieżkę do raportu.
