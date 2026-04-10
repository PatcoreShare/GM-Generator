# GM Generator – Archiwum WFRP

Interaktywne archiwum generatorów do Warhammer Fantasy Roleplay (WFRP).  
Projekt pozwala tworzyć, edytować i używać losowych tabel, notatek oraz kart postaci, z obsługą zagnieżdżonych generatorów i historii wyników.

## Technologie

- **Frontend**: React + TypeScript + Vite
- **UI**: własny zestaw komponentów (`ui/button`, `ui/card` itd.)
- **Stan formularzy**: dedykowane hooki (`useGeneratorForm`, `useGeneratorList`)
- **Backend** (docelowo): Python (FastAPI lub inny framework) + Docker
- **Konteneryzacja**: Docker, docker-compose

## Funkcje

- Logowanie i role użytkowników (`user`, `admin`)
- Tworzenie trzech typów wpisów:
  - tabele losowe (proste i złożone),
  - notatki (tekst + obrazy),
  - karty postaci (2ed / 4ed)
- Zagnieżdżone tabele:
  - opcja w tabeli może wskazywać na inną tabelę,
  - wynik pokazuje nazwę generatora źródłowego.
- Generatory złożone:
  - wiele pól (np. „Warunki”, „Wpływ na podróż”, „Znak na niebie/omen”),
  - każda kolumna jako osobna „mini-tabela”.
- Historia wyników:
  - konfiguracja liczby rzutów,
  - podgląd ostatnich rzutów,
  - rozwijana historia poprzednich wyników.
- Import/eksport generatorów (JSON).
- Tryb „wbudowane” archiwa dla admina oraz możliwość kopiowania ich do własnego konta.

## Struktura projektu (frontend)

Najważniejsze elementy:

```text
src/
├── App.tsx
├── types.ts                # Typy: RandomTable, NoteArchive, CharacterArchive, User
├── components/
│   ├── Auth.tsx
│   ├── ImportExport.tsx
│   ├── GeneratorForm.tsx   # Formularz tworzenia/edycji archiwum
│   ├── GeneratorList.tsx   # Cienki kontener listy
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── sonner.tsx
│       ├── sections/
│       │   ├── CommonFields.tsx
│       │   ├── TableSection.tsx
│       │   ├── NoteSection.tsx
│       │   ├── CharacterSection.tsx
│       │   ├── GeneratorGrid.tsx
│       │   ├── PreviewPanel.tsx
│       │   ├── ResultHistory.tsx
│       │   └── ResultRenderer.tsx
│       ├── hooks/
│       │   ├── useGeneratorForm.ts
│       │   └── useGeneratorList.ts
│       └── utils/
│           └── rollTable.ts
├── main.tsx
├── index.css
└── ...
```

Podział jest podobny do formularza:

- **`GeneratorForm`** – komponent kontener, logika w `useGeneratorForm`, sekcje w `ui/sections`.
- **`GeneratorList`** – komponent kontener, logika w `useGeneratorList`, grid/preview/wyniki rozbite na sekcje.

## Uruchomienie (lokalnie)

### Wymagania

- Node.js (18+)
- npm lub pnpm/yarn
- (Docelowo) Python 3.11+ dla backendu

### Frontend – dev

```bash
# instalacja zależności
npm install

# dev server
npm run dev
```

Domyślnie Vite wystartuje na `http://localhost:5173` (lub innym wolnym porcie).

### Backend (placeholder)

Docelowo backend w Pythonie wystawia API `/api/...` używane przez frontend (logowanie, CRUD generatorów, import/eksport).  
Jeżeli backend jest już przygotowany w folderze `backend/`:

```bash
cd backend
# tworzenie i aktywacja wirtualnego środowiska – przykład
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Front powinien być skonfigurowany tak, aby kierować zapytania na `http://localhost:8000/api`.

## Uruchomienie w Dockerze

Jeśli w repozytorium znajdują się `Dockerfile` i `docker-compose.yml`, można uruchomić całość z kontenerów:

```bash
# budowa i start
docker-compose up --build
```

Typowa konfiguracja:

- `frontend` – serwowany przez nginx na `http://localhost:3000`
- `backend` – API na `http://localhost:8000/api`

## Główne komponenty

### GeneratorForm

Formularz odpowiedzialny za tworzenie i edycję archiwum:

- wspólne pola (`CommonFields`),
- sekcja tabel (`TableSection`) – proste/złożone tabele, opcje, wagi, zagnieżdżenia,
- sekcja notatek (`NoteSection`) – bloki tekst/obraz,
- sekcja postaci (`CharacterSection`) – statystyki, umiejętności, talenty, ekwipunek.

Logika formularza:

- hook `useGeneratorForm`:
  - zarządza stanem pól,
  - obsługuje dodawanie/edycję/usuwanie opcji, wariantów, pól złożonych,
  - obsługuje picker tabeli (`showTablePicker`) i zagnieżdżone losowanie,
  - waliduje i normalizuje dane przy zapisie.

### GeneratorList

Widok listy archiwów i panel losowania:

- lewa strona – `GeneratorGrid`:
  - kafle tabel, notatek i postaci,
  - przyciski edycji, usuwania, kopiowania wbudowanych generatorów,
  - klik na tabelę wykonuje rzut i ustawia podgląd.
- prawa strona – `PreviewPanel`:
  - nagłówek z nazwą archiwum,
  - akcje kopiowania wyników i czyszczenia historii,
  - panel rzutów:
    - konfiguracja liczby rzutów,
    - wybór wariantów tabel,
    - wybór aktywnych pól dla tabel złożonych,
    - przycisk „Losuj”.
  - `ResultHistory`:
    - ostatnie rzuty,
    - rozwijana historia,
    - numeracja „Wynik #X”.
  - render wyników:
    - `ResultRenderer` obsługuje zwykły tekst, notatki, postaci i zagnieżdżone wyniki `{ text, nested, nestedTableName }`.

### rollTable.ts

Czyste funkcje do losowania:

- `performRoll`:
  - wspiera tabele proste oraz złożone (`subType: 'simple' | 'complex'`),
  - uwzględnia wagi opcji,
  - obsługuje zagnieżdżone tabele przez `nestedTableId`,
  - przekazuje w wyniku `nestedTableName`, żeby UI mogło pokazać, z jakiego generatora pochodzi wynik.
- `formatResultForClipboard`:
  - generuje tekstowy zapis wyników (włącznie z nazwami generatorów nested),
  - używany przy „Kopiuj Wszystko”.

## Rozwój projektu

Potencjalne dalsze kroki:

- podpięcie prawdziwej bazy danych (np. PostgreSQL) po stronie backendu,
- uwierzytelnianie z JWT zamiast prostego logowania,
- filtrowanie i wyszukiwanie generatorów wg tagów/edycji/systemu,
- eksport wyników do PDF/Markdown.

## Licencja

Dodaj tu wybraną licencję (np. MIT) jeśli chcesz udostępniać projekt publicznie.