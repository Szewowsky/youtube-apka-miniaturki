# Prompt startowy do nowej sesji (wdrożenie)

Skopiuj całość poniżej i wklej jako pierwszą wiadomość w nowej sesji Claude Code otwartej w folderze `miniaturki-appka-live`.

---

Kontynuujemy wdrożenie Wtyczki do pobierania miniaturek YouTube. Plan jest gotowy i zaakceptowany, nie wracaj do pytań projektowych.

Kontekst, który masz przeczytać przed czymkolwiek innym:
1. `AGENTS.md`, `GLOSSARY.md`, `docs/adr/0001-aplikacja-jako-karta-wtyczki.md`, `docs/agents/*.md`.
2. Specyfikacja: GitHub issue #1 w `Szewowsky/youtube-apka-miniaturki` (`gh issue view 1`).
3. Tickety: issues #2-#8 (T1-T7), podzadania #1, z zależnościami "blocked by" ustawionymi natywnie w GitHubie. Każdy ma sekcję "Definition of Done".

Kolejność: #2 (T1) → #3 (T2) → #4 (T3) → potem #5, #6, #7 równolegle lub po kolei → #8 (T7) na końcu. Zaczynamy od #2.

Jak pracujemy:
- Ja (Robert) nie programuję. Każdy ticket kończysz nietechnicznym podsumowaniem: co się zmieniło, jak zaktualizować Wtyczkę w przeglądarce, które punkty `docs/lista-kontrolna.md` mam przeklikać. Komendy dla mnie podajesz dosłownie do skopiowania, w osobnych blokach.
- Protokół checkpointów: przed kodem rozpisz dla ticketu punkty kontrolne K1..Kn z obiektywnym testem zaliczenia, pokaż listę i czekaj na moje "start". Po każdym punkcie raportuj PASS/FAIL z dowodem (output komendy, liczba testów). Zatrzymaj się przed pushem.
- Używaj słownictwa z `GLOSSARY.md` (Film, Miniaturka, Wtyczka, Aplikacja, Przycisk pobierania, Ikona Wtyczki, Jakość).
- Testy rdzenia w Vitest (TDD tam, gdzie jest czysta funkcja). Selektory DOM YouTube sprawdzasz na żywej stronie przez skill `ego-browser` przed kodowaniem.
- Bramka przed oddaniem: `npm run typecheck && npm run test && npm run build` zielona. Manifest bez `tabs` i bez `<all_urls>`.
- Każdy ticket na osobnym branchu `t1-szkielet`, `t2-rozpoznawanie` itd., commit po zaliczeniu checkpointów, PR do `main` z odwołaniem `Closes #N`. Nie zamykaj issue #1.
- Odpowiadasz po polsku.

Zacznij: `/mattpocock-skills:implement 2`, a jeśli skill nie zadziała, przeczytaj `gh issue view 2` i zrób to samo ręcznie.
