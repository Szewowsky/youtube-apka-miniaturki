# Inspiracje (D1, #11)

Zebrane 2026-10-28 przez `ego-browser`. Zrzuty to podgląd samej grafiki z pinu lub shota, bez
logowania i bez pobierania plików. Miejsca: **Aplikacja** (lista ze statusami), **Przycisk
pobierania**, **Ikona Wtyczki**.

## Format wyszukiwania Dribbble

Działa: `https://dribbble.com/search/<hasło-z-myślnikami>`, np. `dribbble.com/search/chrome-extension-ui`
(spacje jako `%20` też działają). Adres `/search/chrome-extension-download` daje 404, bo Dribbble
zwraca 404 dla tego konkretnego hasła, a nie dlatego, że format jest zły (sprawdzone: `download-button`,
`batch-download-list`, `download-manager-app` i `youtube-thumbnail-downloader` działają).
Po około 10 wyszukiwaniach z rzędu Dribbble pokazuje stronę „Human Verification”. Nie
rozwiązywałem jej. Po kilku minutach strony shotów znowu się otwierały.

Pinterest: `https://pl.pinterest.com/search/pins/?q=<hasło>` działa w profilu ego-browser.

## Pozycje

| Plik | Źródło | Miejsce | Co z niej bierzemy |
|---|---|---|---|
| `dribbble-1.png` | (wcześniejsza próba, `dribbble.com/search/chrome-extension-download`) | brak | To zrzut strony 404 Dribbble, a nie inspiracja. Zostawiony jako dowód, że ten adres nie działa. |
| `02-dribbble.png` | [Download Status UI Design, Ildiko Gaspar](https://dribbble.com/shots/16839400-Download-Status-UI-Design) | Aplikacja | Wiersz listy z ikoną stanu po lewej (zielony ptaszek „gotowe”, kółko postępu „pobieram”, puste kółko „czeka”) i krótkim podpisem stanu pod nazwą. |
| `03-dribbble.png` | [Downloads List, Udara](https://dribbble.com/shots/3512632-Downloads-List) | Aplikacja | Każdy Film to osobny wiersz z cienkim paskiem postępu, procentem i słownym stanem obok, a akcja (ponów/anuluj) stoi przy prawej krawędzi. |
| `04-dribbble.png` | [Batch File Upload – Error Handling UI, Sabri Hakuli](https://dribbble.com/shots/25907037--Batch-File-Upload-Error-Handling-UI) | Aplikacja | Zbiorcze podsumowanie błędów nad listą („7 błędów”) z czerwonym trójkątem przy każdej pozycji. To wzór dla stanów „błąd” i „pominięty + powód”. |
| `05-dribbble.png` | [VidSaver Downloads screens, Dipu Paul](https://dribbble.com/shots/26525397-Downloads-Video-Player-Screens-UI-UX-VidSaver) | Aplikacja, Ikona Wtyczki | Miniaturka Filmu po lewej stronie wiersza, filtry-pigułki „All / Complete / Failed” oraz ikona aplikacji ze strzałką w dół wpisaną w kształt „play”. |
| `06-dribbble.png` | [Slice – Chrome extension, Pat Wasik / Outglow](https://dribbble.com/shots/27556051-Slice-Chrome-extension) | Aplikacja | Spokojne białe karty z zaokrągleniem około 12 px, jeden mocny akcent i komunikaty jako małe karty z ikoną i krzyżykiem. Skala pasuje do Wtyczki. |
| `07-dribbble.png` | [Download Buttons, Aaron Iker](https://dribbble.com/shots/7299868-Download-Buttons) | Przycisk pobierania | Ikona strzałki zmienia się w ptaszek po zakończeniu, a przycisk zmienia kolor na zielony w stanie „Gotowe”. To gotowa sekwencja stanów: zwykły → pobieranie → gotowe. |
| `08-dribbble.png` | [Download button animation, Milan Raring](https://dribbble.com/shots/15508699-Download-button-animation-CodePen) | Przycisk pobierania | Mała strzałka nad kreską jako ikona pobierania obok tekstu. Bierzemy sam kształt ikony, nie kolor ani kształt przycisku (te kopiujemy z YouTube). |
| `09-pinterest.png` | [Chrome Extension Popup Interface Design (AliPal), pin](https://pl.pinterest.com/pin/1078541810817320900/), źródło: [bykreator.com](https://bykreator.com/case-studies/alipal-google-chrome-extension-and-website-design) | Aplikacja, Przycisk pobierania, Ikona Wtyczki | Najbliższy kuzyn naszej Wtyczki: rozszerzenie do pobierania obrazów w czerwieni, lista „Download …” z ikoną pobierania przy prawej krawędzi i prosta ikona-znak w pasku przeglądarki. |
| `10-pinterest.png` | [IDM UI Redesign, pin](https://pl.pinterest.com/pin/640074165813126041/), źródło: [Behance](https://www.behance.net/gallery/179076219/IDM-Internet-Download-Manager-UI-Redesign) | Aplikacja | Tabela pobierania w ciemnym motywie: kolumna „Status” z kolorowym paskiem postępu albo słowem („Complete”, „Paused”), pole „Add Url” na górze. To wzór ciemnej wersji listy. |
| `11-pinterest.png` | [download free icon, pin](https://pl.pinterest.com/pin/676595544022314360/) | Ikona Wtyczki | Gruba strzałka w dół w pełnym kole, dwa kolory, bez detali. Taka forma zostaje czytelna w 16 px. Bazę uzupełniamy o czerwony akcent YouTube. |
| `12-pinterest.png` | [The bulk experience (multi-select), pin](https://pl.pinterest.com/pin/173036810670806772/), źródło: [uxdesign.cc](https://uxdesign.cc/the-bulk-experience-7fcca8080f82) | Aplikacja | Zaznaczone wiersze na delikatnym niebieskim tle, a akcje zbiorcze w pasku nad listą. Podpowiedź dla „Pobierz wszystkie” jako akcji dla całej listy. |

Pokrycie miejsc: Aplikacja: 02, 03, 04, 05, 06, 09, 10, 12. Przycisk pobierania: 07, 08, 09.
Ikona Wtyczki: 05, 09, 11.

## Co nie wyszło

- Dribbble po serii wyszukiwań pokazał „Human Verification” (hasła `download-app-icon`,
  `youtube-extension`, `download-progress-list`). Nie obchodziłem tego, więc nie ma osobnego
  wyszukiwania ikon na Dribbble. Ikonę pokrywają 05, 09 i 11.
- Pinterest serwuje część pinów tylko w małej rozdzielczości (np. 10 ma 404×316 px). Nie ma
  większej wersji.
- Odrzucone po obejrzeniu: shot „YouTube Thumbnail Downloader” (to plakat z napisem, a nie UI ani
  ikona) i piny ze sklepowymi przyciskami „App Store / Google Play” (nie pasują do Przycisku
  pobierania).
