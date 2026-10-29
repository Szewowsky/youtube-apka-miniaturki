# Skan bezpieczeństwa - plugin 21st.dev (ticket #13 / D3)

Data: 2026-10-28 | Skaner: skillspector v2.11.2 (NVIDIA) | tryb: pełny (statyka + LLM przez lokalne `claude_cli`, nic nie poszło do NVIDIA) + ręczny przegląd wszystkich plików

Plugin NIE został zainstalowany. Repo sklonowano płytko (`--depth 1`) do katalogu tymczasowego i tylko czytano pliki.

## Wersja

- Repo: https://github.com/21st-dev/claude-code-plugin
- Commit (SHA): `f76b07aec6e65a582abe4b20bf3ec7b0fa64968a` (2026-09-09, "fix: respect hosted AI access in agent skills")
- Wersja pluginu: `0.4.1` (marketplace.json i plugin.json)
- Licencja: Apache-2.0

## Co zawiera plugin

Repo jest małe: 15 plików, około 950 linii tekstu. Nie ma w nim żadnego kodu wykonywalnego.

| Element | Jest? | Szczegóły |
|---|---|---|
| Hooki | **nie** | brak `hooks/`, brak hooków w `plugin.json` |
| Skrypty (.sh/.js/.py) | **nie** | brak |
| Komendy (`commands/`) | **nie** | brak |
| Agenci | nie (dla Claude) | 3 pliki `agents/openai.yaml` to tylko metadane wyświetlania dla Codex/OpenAI (nazwa + domyślny prompt), Claude Code ich nie używa |
| Serwer MCP | **tak, 1** | `21st`, typ `http`, URL `https://21st.dev/api/mcp`, nagłówek `x-api-key: ${API_KEY_21ST}` (klucz ze zmiennej środowiskowej) |
| Skille | **tak, 7** | `21st-cli-use`, `21st-ai`, `21st-registry`, `21st-design-sync`, `21st-ui-build`, `21st-ui-explore`, `21st-ui-review` - same instrukcje Markdown |

### Dokąd łączy się sieciowo

- Serwer MCP: wyłącznie `https://21st.dev/api/mcp` (zdalny, uruchamia się po stronie 21st.dev, nie lokalnie).
- Skille każą Claude'owi używać CLI `npx @21st-dev/cli` (pakiet npm, obecnie 1.18.0). CLI łączy się z 21st.dev, zapisuje token logowania w `~/.config/21st/auth.json`, a `21st add` instaluje komponenty przez shadcn i paczki npm do projektu.
- Wszystkie inne URL-e w plikach to 21st.dev, przykładowe adresy (example.com, cal.com/you, x.com/you) albo licencja Apache.
- Brak ukrytych znaków (zero-width, bidi), brak zakodowanych bloków, brak poleceń typu curl|sh.

## Wynik skanu skill-scan (skillspector)

Zeskanowano: 7 skilli | exit 0 | `max_risk_score` 28 | `risk_recommendation: CAUTION` | `skills_omitted: 0`

Kompletność: `execution_successful: true`, ale `status: partial` (6 z 7 plików przeanalizowano częściowo, coverage 14,29%). Dlatego wszystkie pliki przeczytałem dodatkowo w całości ręcznie (patrz niżej).

| Skill | Werdykt | Risk | Ryzyka (ID reguł) |
|---|---|---|---|
| 21st-ai | ✅ | 3 | SQP-1 (szerokie wyzwalacze) |
| 21st-cli-use | ⚠️ | 23 | SQP-1, RA2, RP1, SDI-1 |
| 21st-design-sync | ✅ | 0 | - |
| 21st-registry | ⚠️ | 28 | SQP-1, P9 x5, SQP-2 x2, SDI-1 |
| 21st-ui-build | ✅ | 2 | SQP-2 |
| 21st-ui-explore | ✅ | 6 | SQP-2 |
| 21st-ui-review | ✅ | 0 | - |

Werdykt łączny skanera: CAUTION (ostrożnie), nic w progu "nie instalować".

### Ocena znalezisk (ręczna weryfikacja)

- **P9 "whitespace padding" (21st-registry L119-129)** - fałszywy alarm. To wyrównana spacjami tabela Markdown z flagami CLI; przeczytałem ją całą, nic nie jest ukryte.
- **RA2 "persistence" (21st-cli-use L17)** - fałszywy alarm w sensie ataku: chodzi o zapis tokenu logowania CLI do `~/.config/21st/auth.json`, standard dla CLI.
- **RP1 (21st-cli-use L96)** - prawdziwe: `npx @21st-dev/cli` bez przypiętej wersji. Każde wywołanie pobiera najnowszą wersję z npm, więc bezpieczeństwo zależy od tego, czy paczka 21st.dev nie zostanie kiedyś przejęta.
- **SQP-1** - prawdziwe: `21st-cli-use` ma się włączać sam, gdy projekt ma `components.json` (każdy projekt shadcn), a `21st-registry` reaguje też na ogólne frazy "share with team" / "make this reusable".
- **SQP-2 / SDI-1** - prawdziwe, ale umiarkowane: domyślna widoczność publikacji to "published" (publiczne), `21st delete --type template --yes` jest nieodwracalne, `21st init --client ... --write` i `21st install-skill` zmieniają globalną konfigurację agentów, `--context auto` wysyła kontekst designu projektu do 21st.dev.
- Brak prompt injection, złośliwego kodu, sekretów zaszytych w plikach, poleceń wykradających dane.

## Ryzyka

| # | Ryzyko | Ważność |
|---|---|---|
| 1 | Skille każą uruchamiać `npx @21st-dev/cli` bez przypiętej wersji - realny kod wykonuje się z npm, nie z tego repo, i może się zmienić w każdej chwili | ŚREDNIA |
| 2 | Publikacja domyślnie publiczna + szerokie wyzwalacze ("share with team", "make this reusable") - ryzyko, że Claude opublikuje komponent/temat na 21st.dev bez wyraźnej intencji | ŚREDNIA |
| 3 | Auto-aktywacja w każdym projekcie z `components.json` i `--context auto` - opisy UI i kontekst designu projektu trafiają do zewnętrznego serwisu 21st.dev | ŚREDNIA |
| 4 | `21st init --write` / `21st install-skill` modyfikują globalną konfigurację MCP i skilli poza projektem | NISKA |
| 5 | Klucz `API_KEY_21ST` w zmiennej środowiskowej jest wysyłany do 21st.dev (zgodnie z przeznaczeniem); niektóre operacje są płatne (kredyty AI) | NISKA |
| 6 | Skan automatyczny częściowy (coverage 14%) - uzupełniony pełnym ręcznym przeglądem | INFO |

## Werdykt: **bezpieczny z zastrzeżeniami**

Sam plugin nie zawiera żadnego programu ani automatu uruchamianego na Twoim komputerze - to tylko instrukcje tekstowe dla Claude'a i adres zdalnego serwera 21st.dev, a skaner nie znalazł niczego złośliwego. Zastrzeżenia dotyczą tego, co Claude będzie robił z tymi instrukcjami: pobiera narzędzie 21st z internetu za każdym razem w najnowszej wersji i potrafi publikować Twoje komponenty publicznie oraz wysyłać opisy designu na 21st.dev. Instaluj, ale pilnuj, żeby Claude niczego nie publikował bez Twojego wyraźnego "tak", i nie odpalaj skilli 21st w projektach z poufnym designem.

## Komendy dla Roberta (wpisz sam w Claude Code)

Nazwy zweryfikowane w repo: marketplace `21st` (`.claude-plugin/marketplace.json`), plugin `21st` (`plugins/21st`).

Najpierw ustaw klucz API z https://21st.dev/settings/api-keys w powłoce, z której startuje Claude Code (`export API_KEY_21ST="..."`), potem:

```
/plugin marketplace add 21st-dev/claude-code-plugin
/plugin install 21st@21st
```

Po instalacji zrestartuj Claude Code i sprawdź `/mcp`, czy serwer `21st` jest połączony.
