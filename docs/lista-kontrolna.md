# Lista kontrolna (testy ręczne)

Przechodź ją po każdej zmianie w Wtyczce, w Przycisku pobierania albo w Aplikacji. Każdy punkt ma krok i wynik, którego oczekujesz. Jeśli wynik jest inny, zapisz numer punktu i to, co widzisz.

## Instalacja i Aplikacja

### 1. Instalacja Wtyczki

- **Krok:** Wykonaj instalację z README (`npm run build`, potem `chrome://extensions` → Tryb dewelopera → „Załaduj rozpakowane” → folder `dist`).
- **Oczekiwany wynik:** Na liście rozszerzeń jest kafelek „Miniaturki YouTube” bez czerwonego przycisku „Błędy”. W szczegółach uprawnień są tylko pobieranie plików i dostęp do youtube.com oraz i.ytimg.com.

### 2. Ikona Wtyczki w pasku

- **Krok:** Kliknij ikonę puzzla w pasku przeglądarki i przypnij „Miniaturki YouTube”.
- **Oczekiwany wynik:** W pasku widać czerwoną kwadratową Ikonę Wtyczki z białą ramką i strzałką w dół (nie szary kwadrat z literą). Po najechaniu myszką pojawia się podpis „Otwórz Aplikację Miniaturki YouTube”.

### 3. Otwarcie Aplikacji

- **Krok:** Kliknij Ikonę Wtyczki.
- **Oczekiwany wynik:** Otwiera się nowa karta z Aplikacją: nagłówek „Miniaturki YouTube”, duże pole tekstowe na linki i wyszarzony przycisk „Pobierz wszystkie”, którego nie da się kliknąć. Nie wyskakuje żadne małe okienko pod ikoną.
