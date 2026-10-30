# Lista kontrolna (testy ręczne)

Przechodź ją po każdej zmianie w Wtyczce, w Przycisku pobierania albo w Aplikacji. Każdy punkt ma krok i wynik, którego oczekujesz. Jeśli wynik jest inny, zapisz numer punktu i to, co widzisz.

## Instalacja i Aplikacja

### 1. Instalacja Wtyczki

- **Krok:** Wykonaj instalację z README (`npm run build`, potem `chrome://extensions` → Tryb dewelopera → „Załaduj rozpakowane” → folder `dist`).
- **Oczekiwany wynik:** Na liście rozszerzeń jest kafelek „Miniaturki YouTube” bez czerwonego przycisku „Błędy”. W szczegółach uprawnień są tylko pobieranie plików i dostęp do youtube.com oraz i.ytimg.com.

### 2. Ikona Wtyczki w pasku

- **Krok:** Kliknij ikonę puzzla w pasku przeglądarki i przypnij „Miniaturki YouTube”.
- **Oczekiwany wynik:** W pasku widać Ikonę Wtyczki: czerwony zaokrąglony kwadrat z ciemnym obrysem i białą pełną strzałką w dół nad kreską (nie szary kwadrat z literą). Strzałka jest czytelna także w małym rozmiarze, w jasnym i ciemnym pasku przeglądarki. Po najechaniu myszką pojawia się podpis „Otwórz Aplikację Miniaturki YouTube”.

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
- **Oczekiwany wynik:** Statusy zmieniają się po kolei: „Czeka” → „Pobieram…” → „Gotowe”. W Pobranych są `Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster) - Rick Astley.jpg` (1280×720) i `Me at the zoo - jawed.jpg` (480×360, stary Film bez wersji HD - to poprawne). Trzecia pozycja (nieistniejący Film) już po „Rozpoznaj” jest czerwona z napisem „Film niedostępny (usunięty)”, nie liczy się do „Filmów do pobrania: 2” i nie jest pobierana.

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

## Przycisk pobierania na listach Filmów

### 17. Strona główna

- **Krok:** Otwórz `https://www.youtube.com/` (zalogowany), najedź myszką na Miniaturkę dowolnego Filmu.
- **Oczekiwany wynik:** W lewym górnym rogu Miniaturki pojawia się czarny przycisk „Miniaturka”; bez najechania go nie widać. Nie zasłania czasu trwania (prawy dolny róg) ani tytułu. Trzymaj kursor nieruchomo na środku Miniaturki: przycisk zostaje widoczny także wtedy, gdy ruszy podgląd wideo (nawet jeśli startuje od razu), i da się go kliknąć bez otwierania Filmu.

### 18. Pobranie z karty bez otwierania Filmu

- **Krok:** Kliknij „Miniaturka” na karcie.
- **Oczekiwany wynik:** Film się NIE otwiera; przycisk pokazuje „Pobieram…”, potem „Gotowe”; w Pobranych jest plik z tytułem tego Filmu (tytuł oryginalny, nie przetłumaczony przez YouTube).

### 19. Kanał, wyszukiwarka i kolumna obok Filmu

- **Krok:** Sprawdź najechanie i jedno pobranie na `https://www.youtube.com/@YouTube/videos`, w wynikach `https://www.youtube.com/results?search_query=lofi` i w kolumnie po prawej na stronie dowolnego Filmu.
- **Oczekiwany wynik:** Wszędzie przycisk działa jak w punkcie 18.

### 20. Przewijanie

- **Krok:** Na stronie kanału przewiń w dół, aż doładują się nowe Filmy, i najedź na jeden z nich.
- **Oczekiwany wynik:** Nowe karty też mają przycisk.

### 21. Shorty na listach

- **Krok:** Na stronie głównej i w wynikach wyszukiwania znajdź półkę Shortów i najedź na Short.
- **Oczekiwany wynik:** Na Shortach nie ma przycisku „Miniaturka”.

### 22. Pięć pobrań z jednego kanału

- **Krok:** Na `https://www.youtube.com/@YouTube/videos` pobierz kolejno 5 Miniaturek z kart.
- **Oczekiwany wynik:** 5 plików w Pobranych, każdy z innym tytułem.

## Wygląd Aplikacji

Wzór: makieta `design/makieta/index.html` (https://claude.ai/artifact/HVrmYQpRdCKC3bK5Qz7BFL). Motyw Aplikacji idzie za systemem: przełączasz go w Ustawieniach systemowych → Wygląd → Jasny / Ciemny.

### 23. Pusta Aplikacja w jasnym i ciemnym motywie

- **Krok:** Otwórz Aplikację w jasnym motywie systemu, potem przełącz system na ciemny.
- **Oczekiwany wynik:** Nagłówek „MINIATURKI YOUTUBE” wąskimi wersalikami, słowo „MINIATURKI” na czerwonym tle. Pole na linki, przełącznik Jakości i „Rozpoznaj” mają grube (2 px) obrysy: czarne w jasnym, białe w ciemnym motywie. Aktywna Jakość jest wypełniona czerwienią. „Pobierz wszystkie” jest wyłączony: bez wypełnienia, z jasnoszarym obrysem i szarym napisem (nie przezroczysty czerwony).

### 24. Lista po „Rozpoznaj” i w trakcie pobierania

- **Krok:** Wklej linki z punktu 4, kliknij „Rozpoznaj”, potem „Pobierz wszystkie”.
- **Oczekiwany wynik:** Pod przyciskami „Filmów do pobrania: N” jest pogrubione, „pominiętych: M” zwykłe. Każdy wiersz ma ikonę stanu po lewej: przerywane kółko przy „Czeka” (tytuł chwilę „Wczytuję tytuł…” kursywą), obracający się czerwony łuk i pasek pod napisem przy „Pobieram…”, zielone kółko z ptaszkiem przy „Gotowe”. Wiersze pominięte mają przerywany szary obrys, przekreślone kółko i link pismem maszynowym.

### 25. Wiersz z błędem

- **Krok:** Wyłącz Wi-Fi, kliknij „Pobierz wszystkie” na liście z punktu 24, włącz Wi-Fi.
- **Oczekiwany wynik:** Wiersze z błędem mają czerwony obrys, lekko czerwone tło, czerwone kółko z wykrzyknikiem i czerwony napis „Brak połączenia - spróbuj ponownie”. Czerwień błędu odróżnia się od czerwieni przycisku „Pobierz wszystkie” (błąd to obrys i napis, przycisk to wypełnienie).

### 26. Wąskie okno i klawiatura

- **Krok:** Zwęż okno przeglądarki do ok. 400 px, potem przejdź po Aplikacji klawiszem Tab.
- **Oczekiwany wynik:** Napis stanu schodzi pod tytuł Filmu, przełącznik Jakości zawija się do drugiej linii zamiast wychodzić poza ramkę. Element wybrany klawiszem Tab ma czerwoną obwódkę z małym odstępem.

### 27. Fonty bez internetu

- **Krok:** Wyłącz Wi-Fi i otwórz Aplikację (Ikona Wtyczki).
- **Oczekiwany wynik:** Wygląd jak w punkcie 23: wąski gruby nagłówek, pole z linkami pismem maszynowym. Fonty są w paczce Wtyczki, więc nie zależą od internetu.

### 28. Przycisk pobierania po zmianach wyglądu

- **Krok:** Powtórz punkty 11, 12 i 17.
- **Oczekiwany wynik:** Pod Filmem „Miniaturka” ma po obu stronach równe odstępy, jak „Udostępnij”. Na karcie przycisk jest półprzezroczysty (widać przez niego Miniaturkę), po najechaniu na sam przycisk ciemnieje; napis jest drobny, wielkości znaczka czasu trwania.

## Niedostępne Filmy

### 29. Niedostępny Film rozpoznany od razu

- **Krok:** W Aplikacji wklej `https://youtu.be/dQw4w9WgXcQ`, `https://www.youtube.com/watch?v=aaaaaaaaaaa` i `https://www.youtube.com/watch?v=9bZkp7q5f_w` (dwa ostatnie to identyfikatory, których nie ma na YouTube). Kliknij „Rozpoznaj” i od razu, zanim wczytają się tytuły, „Pobierz wszystkie”.
- **Oczekiwany wynik:** Przez chwilę „Filmów do pobrania: 3”, po wczytaniu tytułów „Filmów do pobrania: 1”. Oba nieistniejące Filmy mają czerwony wiersz z linkiem zamiast tytułu i jeden napis „Film niedostępny (usunięty)”; nie pokazują „Pobieram…”. Pobiera się tylko Rick Astley. Gdy wkleisz same nieistniejące linki, „Pobierz wszystkie” zostaje wyłączony.

### 30. Brak internetu przy „Rozpoznaj” to nie niedostępny Film

- **Krok:** Wyłącz Wi-Fi, wklej `https://youtu.be/dQw4w9WgXcQ` i kliknij „Rozpoznaj”. Włącz Wi-Fi i kliknij „Pobierz wszystkie”.
- **Oczekiwany wynik:** Wiersz po „Rozpoznaj” zostaje „Czeka” (pod spodem „Brak połączenia - spróbuj ponownie”), liczy się do „Filmów do pobrania: 1”, a po włączeniu Wi-Fi pobiera się normalnie.

## Przycisk pobierania a podgląd wideo

### 31. Przejście z karty na kartę i przewijanie

- **Krok:** Na stronie głównej najedź na Miniaturkę, poczekaj, aż ruszy podgląd, i przesuń kursor powoli na sąsiednią kartę (w bok i w dół). Potem zostaw kursor na Miniaturce i przewiń stronę kółkiem myszy. Na koniec wyjedź kursorem poza okno przeglądarki.
- **Oczekiwany wynik:** Przycisk „Miniaturka” widać zawsze tylko na jednej karcie - tej, nad którą jest kursor (także gdy kursor jest na brzegu grającego podglądu). Po przewinięciu przycisk przeskakuje na kartę, która znalazła się pod kursorem. Po wyjściu kursora poza okno żaden przycisk nie zostaje widoczny.

### 32. Przycisk nad podglądem w wynikach wyszukiwania

- **Krok:** Otwórz `https://www.youtube.com/results?search_query=rick+astley+never+gonna+give+you+up`, najedź na Miniaturkę pierwszego Filmu i trzymaj kursor, aż ruszy podgląd wideo. Kliknij „Miniaturka”. Potem przewiń stronę tak, żeby karta weszła pod górny pasek YouTube, i najedź kursorem na pasek nad nią.
- **Oczekiwany wynik:** Przycisk „Miniaturka” jest widoczny nad grającym podglądem i po kliknięciu pokazuje „Pobieram…”, potem „Gotowe”, bez otwierania Filmu. Nad górnym paskiem YouTube przycisk nigdy się nie pokazuje. Dymki podpowiedzi i pasek filtrów nad wynikami wyglądają jak zwykle.
