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

### 4. Rozpoznawanie linków

- **Krok:** W Aplikacji wklej poniższe linki (każdy w osobnej linii) i kliknij „Rozpoznaj”:
  ```
  https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
  https://youtu.be/jNQXAC9IVRw?si=abc123
  https://m.youtube.com/watch?v=9bZkp7q19f0
  https://www.youtube.com/embed/kJQP7kiw5Fk
  https://www.youtube.com/shorts/RGtFAx8rSJU
  to nie link
  https://youtu.be/dQw4w9WgXcQ
  ```
- **Oczekiwany wynik:** Nad listą „Filmów do pobrania: 4, pominiętych: 3”. Cztery pierwsze pozycje pokazują prawdziwy tytuł i kanał (np. „Me at the zoo” / „jawed”) i status „Czeka”. Short ma status „To jest Short - pomijam”, tekst „to nie link” - „To nie jest link do filmu YouTube”, ostatni link - „Duplikat”.

### 5. Film z dziwnym tytułem (sprawdzasz po T3, gdy działa pobieranie)

- **Krok:** W Aplikacji wklej `https://www.youtube.com/watch?v=9bZkp7q19f0` (tytuł zawiera ukośnik „M/V”), kliknij „Rozpoznaj”, potem „Pobierz wszystkie”.
- **Oczekiwany wynik:** W Pobranych pojawia się plik `PSY - GANGNAM STYLE(강남스타일) M-V - officialpsy.jpg`, który otwiera się w Finderze podglądem (spacja).

### 6. Pobieranie kilku Miniaturek

- **Krok:** W Aplikacji wklej trzy linki: `https://youtu.be/dQw4w9WgXcQ`, `https://youtu.be/jNQXAC9IVRw`, `https://www.youtube.com/watch?v=aaaaaaaaaaa`. Kliknij „Rozpoznaj”, potem „Pobierz wszystkie”.
- **Oczekiwany wynik:** Statusy zmieniają się po kolei: „Czeka” → „Pobieram…” → „Gotowe”. W Pobranych są `Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster) - Rick Astley.jpg` (1280×720) i `Me at the zoo - jawed.jpg` (480×360, stary Film bez wersji HD - to poprawne). Trzecia pozycja: „Film niedostępny (prywatny lub usunięty)”.

### 7. Drugie pobranie tego samego Filmu

- **Krok:** Kliknij jeszcze raz „Rozpoznaj” i „Pobierz wszystkie” z tymi samymi linkami.
- **Oczekiwany wynik:** Poprzednie pliki zostają, nowe mają dopisek ` (1)` w nazwie.

### 8. Druga przeglądarka

- **Krok:** Zainstaluj Wtyczkę z tego samego folderu `dist` w Brave, Arc albo Edge (jak w README) i pobierz jedną Miniaturkę.
- **Oczekiwany wynik:** Plik ląduje w Pobranych tej przeglądarki z poprawną nazwą.

### 9. Przełącznik Jakości

- **Krok:** W Aplikacji wybierz kolejno „Najwyższa”, „Średnia”, „Niska” i za każdym razem pobierz `https://youtu.be/dQw4w9WgXcQ`. W Finderze zaznacz pliki i naciśnij Cmd+I (albo spójrz na kolumnę „Wymiary” w podglądzie).
- **Oczekiwany wynik:** Trzy pliki o wymiarach 1280×720, 640×480 (z czarnymi pasami) i 480×360 (z czarnymi pasami). Dwa kolejne mają dopisek ` (1)`, ` (2)`.

### 10. Zapamiętanie Jakości

- **Krok:** Ustaw „Średnia”, zamknij całą przeglądarkę (Cmd+Q), otwórz ją i kliknij Ikonę Wtyczki.
- **Oczekiwany wynik:** W Aplikacji zaznaczona jest „Średnia”.

## Przycisk pobierania pod Filmem

### 11. Przycisk pod Filmem

- **Krok:** Otwórz `https://www.youtube.com/watch?v=dQw4w9WgXcQ` i kliknij „Miniaturka” w rzędzie pod Filmem.
- **Oczekiwany wynik:** Przycisk „Miniaturka” ze strzałką stoi zaraz za „Udostępnij” i wygląda jak sąsiednie przyciski. Po kliknięciu pokazuje „Pobieram…”, potem zielone „Gotowe”, a w Pobranych jest `Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster) - Rick Astley.jpg`. Po ok. 3 s napis wraca do „Miniaturka”.

### 12. Jasny i ciemny motyw YouTube

- **Krok:** W YouTube kliknij awatar → Wygląd → przełącz Jasny / Ciemny i spójrz na rząd przycisków pod Filmem.
- **Oczekiwany wynik:** W obu motywach „Miniaturka” ma takie samo tło i kolor tekstu jak „Udostępnij”; napis „Gotowe” jest czytelny także, gdy kursor zostaje na przycisku.

### 13. Przejście do innego Filmu bez przeładowania

- **Krok:** Na stronie Filmu kliknij Film z kolumny po prawej. Kliknij „Miniaturka”.
- **Oczekiwany wynik:** Przycisk jest na nowej stronie dokładnie raz; pobrany plik ma tytuł NOWEGO Filmu.

### 14. Strona Shorta

- **Krok:** Otwórz `https://www.youtube.com/shorts` (dowolny Short).
- **Oczekiwany wynik:** Nigdzie nie ma przycisku „Miniaturka”.

### 15. Stara karta po aktualizacji Wtyczki

- **Krok:** Zostaw otwartą kartę z Filmem, w `chrome://extensions` kliknij „Odśwież” przy Wtyczce, wróć do karty (bez odświeżania) i kliknij „Miniaturka”.
- **Oczekiwany wynik:** Przycisk pokazuje „Odśwież stronę”. Po odświeżeniu karty (Cmd+R) pobieranie działa.

### 16. Wyłączenie Wtyczki

- **Krok:** W `chrome://extensions` wyłącz Wtyczkę przełącznikiem i odśwież kartę z Filmem.
- **Oczekiwany wynik:** Pod Filmem nie ma przycisku „Miniaturka” ani żadnych śladów. Włącz Wtyczkę z powrotem.
