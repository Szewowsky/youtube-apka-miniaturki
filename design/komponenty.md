# Komponenty (D2, #12)

Przegląd z 2026-10-28 (przez `ego-browser`) stron [Watermelon UI](https://ui.watermelon.sh) i
[21st.dev](https://21st.dev) pod kątem pięciu typów komponentów Aplikacji: listy ze statusami,
przełącznika segmentowego (Jakość), pola tekstowego (linki), przycisków i toastu.

Aplikacja jest napisana bez Reacta, więc z każdego kandydata bierzemy **wzorzec wizualny i
wartości CSS** (kształt, odstępy, kolory stanów, zachowanie). Kodu React ani zależności (Tailwind,
framer-motion, lucide-react, radix) nie kopiujemy. Własny CSS piszemy od zera na tokenach z
`src/aplikacja/aplikacja.css`.

Zrzuty leżą w `design/komponenty/`. Watermelon jest w ciemnym motywie strony, a podglądy 21st.dev
w jasnym (`?theme=light`).

## Licencje: kontekst

- **Watermelon UI**: repozytorium [WatermelonCorp/watermelon-platform](https://github.com/WatermelonCorp/watermelon-platform)
  ma licencję **MIT** (GitHub API). Strona [/copyright](https://ui.watermelon.sh/copyright)
  podaje, że wzorują się wizualnie na cudzych projektach i piszą kod od zera, a źródło
  inspiracji podpisują „Inspired By”. Licencja obejmuje wszystkie poniższe kandydatury z
  Watermelon.
- **21st.dev**: każdy komponent ma własnego autora i własną licencję (na stronie komponentu jest
  pole „License” albo tylko „Source”). Według [regulaminu 21st.dev](https://21st.dev/terms) same
  podglądy, dema i zrzuty generowane przez 21st należą do 21st Labs Inc., a ich redystrybucja
  wymaga linku do strony komponentu. **Zrzuty z 21st w `design/komponenty/` służą tylko jako
  wewnętrzna referencja. Nie publikujemy ich (np. w Artifact z moodboardem bez linku źródła ani
  w Chrome Web Store).**

---

## 1. Lista ze statusami (lista Filmów w Aplikacji)

Statusy z `src/rdzen/komunikaty.ts`: „Czeka”, „Pobieram…”, „Gotowe”, błąd, pominięty z powodem.

### 1a. AI Task List (21st.dev, @educalvolpz)
- Link: https://21st.dev/@educalvolpz/components/ai-task-list
- Zrzut: `komponenty/lista-21st-ai-task-list.png`
- Licencja: **MIT** (podana na stronie komponentu).
- Przenosimy: wiersz = ikona stanu 16 px po lewej + nazwa + **szary opis stanu wyrównany do
  prawej** („in progress”, „blocked on tests”). To dokładnie nasz „pominięty + powód”. Wykonane
  pozycje mają zielony ptaszek i przygaszony tekst, błąd czerwony krzyżyk w kwadracie, a wiersz w
  trakcie ma cienką linię postępu pod spodem (zrobimy ją jako `::after` z `width: var(--postep)`).
  Licznik „4/7” w nagłówku karty to nasz licznik gotowych. Karta: ramka 1 px, zaokrąglenie około
  12 px, brak cienia.

### 1b. Google Drive Uploader Toast (21st.dev, @suraj-xd)
- Link: https://21st.dev/@suraj-xd/components/google-drive-uploader-toast
- Zrzut: `komponenty/lista-21st-drive-uploader-toast.png` (jednocześnie widać stany gotowe,
  błąd i w trakcie)
- Licencja: **licencji nie znaleziono** (strona podaje tylko zależność `lucide-react`).
- Przenosimy: ikonę stanu po prawej stronie wiersza (kółko postępu → zielone kółko z ptaszkiem →
  czerwone kółko z krzyżykiem) i nagłówek listy, który mówi, co się dzieje („Uploading 3 items”
  → nasze „Pobieram 3 z 12”). Kolorowa ikona typu pliku po lewej to miejsce na mini-Miniaturkę
  Filmu.

### 1c. DataTable 2 (Watermelon)
- Link: https://ui.watermelon.sh/components/data-table
- Zrzut: `komponenty/lista-watermelon-datatable2.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: gęsty układ tabelowy z kolumną „Status” jako zwykłym słowem w kolorze pomocniczym
  („Paid / Processing / Review / Failed”). Wiersze 44 px z separatorem 1 px. Ten wariant się
  przyda, jeśli lista ma kolumny (Film, Jakość, Status). Słabszy od 1a, bo stan nie ma ikony ani
  koloru.

Odrzucone: Build Pipeline (21st, MIT, `komponenty/lista-21st-build-pipeline.png`), bo dobrze
pokazuje etapy, ale to kafelki w poziomie, a nie lista. Notification 2 (Watermelon,
`komponenty/lista-watermelon-notification2.png`), bo to feed powiadomień, a z niego bierzemy
co najwyżej małe kolorowe etykiety typu „Alert”.

## 2. Przełącznik segmentowy (Jakość: Najwyższa / Średnia / Niska)

### 2a. Tabs 1 (Watermelon)
- Link: https://ui.watermelon.sh/components/tabs
- Zrzut: `komponenty/segment-watermelon-tabs1.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: przytłumiony, w pełni zaokrąglony tor (`background: var(--ramka)`, `padding: 3px`,
  `border-radius: 999px`), w którym aktywna opcja to uniesiona „pigułka” (tło karty, cień
  `0 1px 2px rgb(0 0 0 / .1)`). W HTML zostają nasze `<input type="radio">` + `<span>`, a styl
  idzie na `input:checked + span`. Zielony akcent Watermelon zamieniamy na tekst w kolorze
  `--tekst`.

### 2b. Capsule Tabs (21st.dev, @ruixen.ui)
- Link: https://21st.dev/@ruixen.ui/components/capsule-tabs
- Zrzut: `komponenty/segment-21st-capsule-tabs.png`
- Licencja: **licencji nie znaleziono** (na stronie brak pola License, repozytorium
  `ruixen-ui/ruixen-ui` nie istnieje).
- Przenosimy: segmenty o zaokrągleniu około 8 px zamiast pełnej pigułki, nieaktywne na szarym
  tle `#f5f5f5`, aktywne białe z delikatną ramką. Kropki-paginacja i strzałki odpadają.

### 2c. Toggle Group (21st.dev, @intentui)
- Link: https://21st.dev/@intentui/components/toggle-group (źródło: intentui.com)
- Zrzut: `komponenty/segment-21st-toggle-group.png`
- Licencja: **MIT** (repozytorium [intentui/intentui](https://github.com/intentui/intentui), GitHub API).
- Przenosimy: wariant „obrysowany”: jedna ramka 1 px wokół całej grupy i pionowy separator
  między opcjami, z ikoną przed tekstem. Taki styl jest bardziej neutralny niż pigułka i przyda
  się, gdy przełącznik ma wyglądać jak formularz.

Do obejrzenia na żywo: Continuous Tabs (Watermelon,
`komponenty/segment-watermelon-continuous-tabs.png`). Aktywna pigułka przesuwa się animacją
między opcjami. W CSS da się to zrobić prostym `transition` na pseudo-elemencie, ale spec
dopuszcza tylko proste przejścia, więc to opcja.

## 3. Pole tekstowe (wklejanie linków)

### 3a. Textarea 3 (Watermelon)
- Link: https://ui.watermelon.sh/components/textarea
- Zrzut: `komponenty/pole-watermelon-textarea3.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: etykieta nad polem (pogrubiona, 14 px), pole z ramką 1 px i zaokrągleniem 8 px,
  **mała podpowiedź pod polem wyrównana do prawej**. U nas to miejsce na „Wklej jeden link w
  wierszu” albo licznik rozpoznanych linków. Fokus to miękki pierścień (`box-shadow: 0 0 0 3px`
  w kolorze akcentu z przezroczystością).

### 3b. Textarea 8 (Watermelon), stan błędu
- Link: https://ui.watermelon.sh/components/textarea
- Zrzut: `komponenty/pole-watermelon-textarea8.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: stan błędu, czyli czerwoną ramkę z czerwonym pierścieniem i komunikat walidacji
  pod polem w kolorze błędu. Przyda się, gdy wklejony tekst nie zawiera żadnego linku do Filmu.

### 3c. Textarea with right helper text (21st.dev, @clevision)
- Link: https://21st.dev/@clevision/components/text-area/textarea-with-right-helper-text
- Zrzut: `komponenty/pole-21st-textarea-helper.png`
- Licencja: **licencji nie znaleziono**.
- Przenosimy: ten sam wzorzec co 3a w jasnym motywie. Jasna ramka `#e5e5e5`, zaokrąglenie
  około 10 px i placeholder w kolorze `--tekst-pomocniczy` potwierdzają, że wzór dobrze wygląda
  na białym tle.

## 4. Przyciski („Rozpoznaj linki”, „Pobierz wszystkie”)

### 4a. Button 3 (Watermelon): para główny + drugorzędny
- Link: https://ui.watermelon.sh/components/button
- Zrzut: `komponenty/przyciski-watermelon-button3.png` (oraz `przyciski-watermelon-button5.png`,
  stan wyłączony)
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: obok siebie stoją przycisk główny (pełny kolor akcentu) i drugorzędny (szare tło
  bez ramki), oba wysokie na 32-36 px z zaokrągleniem 8 px. To dokładnie nasza para
  `.drugorzedny` „Rozpoznaj” + główny „Pobierz wszystkie”. Z Button 5 bierzemy stan wyłączony:
  `opacity: .5` plus ikonka zakazu albo sam kursor `not-allowed`.

### 4b. Button – loading (21st.dev, @sean0205 / reui)
- Link: https://21st.dev/@sean0205/components/button-1/loading (źródło: reui.io)
- Zrzut: `komponenty/przyciski-21st-button-loading.png`
- Licencja: **MIT** (podana na stronie komponentu).
- Przenosimy: stan „w trakcie”, czyli spinner 16 px przed tekstem, tekst w formie ciągłej
  („Submitting…” → u nas „Pobieram…”), przycisk wyłączony z `opacity: .6`. Spinner to zwykły
  `border` + `border-top-color: transparent` + `animation: spin`.

### 4c. Button Save (21st.dev, @shadcnspace)
- Link: https://21st.dev/@shadcnspace/components/button-save (źródło: shadcnspace.com)
- Zrzut: `komponenty/przyciski-21st-button-save.png`
- Licencja: **MIT** (repozytorium [shadcnspace/shadcnspace](https://github.com/shadcnspace/shadcnspace), GitHub API).
- Przenosimy: stan sukcesu, czyli zielone tło z podwójnym ptaszkiem przed tekstem. Wzór dla
  chwilowego „Gotowe” na przycisku po pobraniu wszystkiego.

Do obejrzenia na żywo: Run Action Button (Watermelon, animowany,
`komponenty/przyciski-watermelon-run-action.png`). Ma kształt pigułki z ikoną i przechodzi
przez sekwencję bezczynny → ładowanie → sukces. Ten kształt jest najbliższy przyciskom YouTube,
ale dla Przycisku pobierania i tak kopiujemy YouTube 1:1 (spec #10), więc to tylko podpowiedź
do animacji stanów.

## 5. Toast (komunikat po akcji)

### 5a. Sonner 7: promise toast (Watermelon)
- Link: https://ui.watermelon.sh/components/sonner
- Zrzuty: `komponenty/toast-watermelon-sonner7-ladowanie.png`, `komponenty/toast-watermelon-sonner7-wynik.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: **jeden toast, który zmienia treść**: najpierw „Synchronizing…” ze spinnerem,
  potem „Sync Complete” z ptaszkiem w tym samym miejscu. U nas: „Pobieram 12 Miniaturek…” →
  „Gotowe: 11, pominięte: 1”. Toast jest w prawym dolnym rogu, ma ciemną kartę, zaokrąglenie
  12 px i ikonę 16 px przed tekstem.

### 5b. Sonner 12: soft destructive (Watermelon)
- Link: https://ui.watermelon.sh/components/sonner
- Zrzut: `komponenty/toast-watermelon-sonner12.png`
- Licencja: **MIT** (repozytorium Watermelon).
- Przenosimy: wariant błędu, czyli bladoczerwone tło, czerwona ramka 1 px, czerwony tytuł z
  ikoną i zwykły tekst opisu pod spodem. Kolor sygnalizuje błąd, ale nie krzyczy.

### 5c. Promise Toast (21st.dev, @cnippet-dev)
- Link: https://21st.dev/@cnippet-dev/components/promise-toast (źródło: ui.cnippet.dev)
- Zrzuty: `komponenty/toast-21st-promise-ladowanie.png`, `komponenty/toast-21st-promise-wynik.png`
- Licencja: **MIT** (repozytorium [cnippet-dev/cnippet-ui](https://github.com/cnippet-dev/cnippet-ui), GitHub API).
  Na stronie komponentu pola License brak.
- Przenosimy: ten sam wzorzec co 5a, ale w jasnym motywie. Biała karta, ramka `#e5e5e5`,
  miękki cień, tytuł 14 px pogrubiony i opis 13 px szary pod spodem. To dobra referencja dla
  jasnej wersji naszego toastu.

Odrzucone: Basic Toast / toast-variants (21st, @anubra266). Toasty renderowały się poza widokiem
podglądu, więc nie udało się zrobić czytelnego zrzutu.

---

## Rekomendacja: po jednym kandydacie na typ

| Typ | Kandydat | Licencja | Dlaczego |
|---|---|---|---|
| Lista ze statusami | **AI Task List** (21st.dev, @educalvolpz), 1a | MIT | Ikona stanu po lewej i słowny powód po prawej obsługują wszystkie nasze stany, łącznie z „pominięty + powód”, w jednej spokojnej karcie. |
| Przełącznik segmentowy | **Tabs 1** (Watermelon), 2a | MIT | Klasyczny segmentowy tor z uniesioną aktywną pigułką. Aktywną Jakość widać od razu, a styl łatwo przenieść na radio + span. |
| Pole tekstowe | **Textarea 3** (Watermelon) ze stanem błędu z Textarea 8, 3a + 3b | MIT | Etykieta, podpowiedź pod polem i stan błędu z tej samej rodziny, z jednego źródła i na jednej licencji. |
| Przyciski | **Button 3** (Watermelon) ze stanem wyłączonym z Button 5, 4a | MIT | Para główny + drugorzędny odpowiada naszemu „Rozpoznaj” + „Pobierz wszystkie”. Stan „Pobieram…” ze spinnerem dobieramy wg 4b (też MIT). |
| Toast | **Sonner 7 – promise toast** (Watermelon), 5a | MIT | Jeden toast przechodzi z „w trakcie” w wynik, a to pasuje do pobierania wielu Miniaturek naraz. Jasną wersję stylujemy wg 5c. |
