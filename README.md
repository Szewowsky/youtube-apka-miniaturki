# Miniaturki YouTube

Wtyczka do przeglądarek Chrome, Brave, Arc i Edge, która pobiera Miniaturki filmów YouTube na komputer. Kliknięcie Ikony Wtyczki w pasku przeglądarki otwiera Aplikację: kartę, w którą wklejasz linki do filmów.

> Stan: etap 1 w budowie. Aplikacja się otwiera, ale jeszcze niczego nie pobiera.

## Instalacja (raz)

Potrzebujesz Node.js w wersji 22 (sprawdzisz komendą `node -v`, wynik powinien zaczynać się od `v22`).

1. Otwórz Terminal i wejdź do folderu projektu:

   ```bash
   cd "/Users/robert/Windsurf Projekty/miniaturki-appka-live"
   ```

2. Zainstaluj zależności (tylko za pierwszym razem albo gdy podsumowanie ticketu tak każe):

   ```bash
   npm install
   ```

3. Zbuduj Wtyczkę. Powstanie folder `dist`:

   ```bash
   npm run build
   ```

4. W przeglądarce wpisz w pasek adresu `chrome://extensions` (w Brave `brave://extensions`, w Edge `edge://extensions`, w Arc tak jak w Chrome).
5. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
6. Kliknij **Załaduj rozpakowane** i wskaż folder `dist` w folderze projektu.
7. Przypnij Ikonę Wtyczki: kliknij ikonę puzzla w pasku przeglądarki i pinezkę przy „Miniaturki YouTube”.

## Aktualizacja po każdym tickecie

Zawsze ta sama procedura, gdy dostajesz informację, że jest nowa wersja.

1. Wejdź do folderu projektu:

   ```bash
   cd "/Users/robert/Windsurf Projekty/miniaturki-appka-live"
   ```

2. Pobierz najnowszy kod:

   ```bash
   git checkout main && git pull
   ```

3. Doinstaluj zależności i zbuduj Wtyczkę:

   ```bash
   npm install && npm run build
   ```

4. W `chrome://extensions` kliknij strzałkę **Odśwież** (okrągła strzałka) na kafelku „Miniaturki YouTube”.
5. Odśwież otwarte karty YouTube (Cmd+R). Stare karty nadal mają poprzednią wersję Wtyczki.
6. Przeklikaj punkty z [listy kontrolnej](docs/lista-kontrolna.md), które wskazuje podsumowanie ticketu.

## Dla programisty

- `npm run typecheck` - sprawdzenie typów TypeScript.
- `npm run test` - testy rdzenia (Vitest).
- `npm run build` - zbudowanie Wtyczki do `dist/`.
- Bramka przed każdym oddaniem: `npm run typecheck && npm run test && npm run build`.
- Ikony Wtyczki generuje `ikony/generuj.sh` (wymaga ImageMagick).
- Słownik pojęć: [GLOSSARY.md](GLOSSARY.md). Decyzje: [docs/adr](docs/adr).
