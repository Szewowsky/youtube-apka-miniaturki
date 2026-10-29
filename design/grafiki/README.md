# Grafiki (D6, #16)

## Wynik: Ikona Wtyczki

**Wygrała wersja wektorowa v2** (`wektor-v2.svg`): kwadrat i obrys z makiety D5 plus pełna, blokowa strzałka podpatrzona w wariantach z Higgsfield. Pliki dla wdrożenia (T8) są w `ikona/`: `ikona.svg` i `ikona-16.png`, `ikona-32.png`, `ikona-48.png`, `ikona-128.png` (przezroczyste tło). Ticket wdrożeniowy przenosi je do `ikony/`.

## Co wygenerowano i ile kosztowało

Zgoda Roberta na 11 kredytów (2026-10-29). Saldo przed: 479,5, po: 468,5, czyli wydane 11.

| Plik | Model | Koszt |
|---|---|---|
| `higgsfield/recraft-1.svg` … `recraft-4.svg` | Recraft V4.1, `model_type: vector`, 1k, 1:1 | 10 kredytów (4 warianty) |
| `higgsfield/gpt-1.png` … `gpt-4.png` | GPT Image 2.5, 1:1, 1024×1024 | 1 kredyt (4 warianty) |

Pierwsza próba GPT Image odbiła się na limicie zapytań (429) i nic nie kosztowała; druga przeszła.

## Test czytelności w 16 px

Strona testu: `test-16px.html` (opublikowana: https://claude.ai/artifact/MkikHVNgCmjQnac3NrUipM). Każdy kandydat w 128, 48, 32 i 16 px na jasnym i ciemnym pasku przeglądarki. Dodatkowo symulacja: render do 16 px i powiększenie, żeby ocenić, co zostaje z kształtu.

| Kandydat | 16 px | Uwagi |
|---|---|---|
| Wektor z makiety (`wektor.svg`) | Strzałka z kresek rozmywa się w grot | Przezroczyste tło, wypełnia całe pole |
| **Wektor v2** (`wektor-v2.svg`) | **Wyraźna strzałka i kreska** | **Przezroczyste tło, wypełnia całe pole** |
| Recraft 2 i 3 | Wyraźna strzałka | Ok. 15% pustego marginesu z każdej strony, więc w 16 px ikona jest mniejsza; białe tło do usunięcia |
| Recraft 1 | Gorzej | Czarny obrys wokół strzałki robi szum w małym rozmiarze |
| Recraft 4 | Najsłabiej | Cienka strzałka znika w 16 px |
| GPT 1-4 (prawie identyczne) | Wyraźna strzałka | PNG bez przezroczystości: na ciemnym pasku widać biały kwadrat; do tego margines jak w Recraft |

Wniosek: kształt strzałki z Higgsfield (pełny blok zamiast kresek) jest czytelniejszy w 16 px, ale same wygenerowane pliki przegrywają przez biały margines i brak przezroczystości. Dlatego ten kształt przeniosłem do wersji wektorowej.
