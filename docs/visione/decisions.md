# Iridis Visione — Decisioni di prodotto e implementative

> Snapshot delle scelte chiave prese durante la sessione di costruzione (commit `0dfe688` → `454b925`).
> Riferimento per chi modifica il modulo. Documento NON normativo — vedi
> `research.md` per il razionale clinico e `CLAUDE.md` per le regole regolatorie vincolanti.
> Lavori rimandati: `roadmap-visione.md`.

---

## 0 · Stella polare e tono

Tutte le decisioni di questo documento rispondono a una sola domanda:

> **Sopravvive allo sguardo di un oftalmologo italiano scettico
> e di un divulgatore scientifico aggressivo?**

Target reale: paziente AMD anziano (ipotesi di lavoro: 87 anni, in trattamento per maculopatia),
iPad come device primario, iPhone secondario. Quando una scelta è in tensione fra "comodità sviluppo"
e "credibilità clinica", vince clinica.

Otto regole non negoziabili emerse durante la sessione (codici **B.1..B.8**):

| Codice | Regola | Implementata in |
|---|---|---|
| **B.1** | Sequenza monoculare forzata dal flow (dx → sx hardcoded) | `views/test.mjs` |
| **B.2** | Onestà esplicita su ciò che non misuriamo (distanza, luce, luminosità) | onboarding "Cosa non misuriamo" |
| **B.3** | Proporzioni standard griglia di Amsler (10×10 cm, 20×20 caselle, 0.5 mm linee, punto fissazione 3 mm) | `grid.mjs` costanti |
| **B.4** | Nessun verdetto neppure implicito post-test (no "OK", no score, no triage) | `test.mjs` "Sessione registrata" copy fisso |
| **B.5** | Fonti scientifiche cliccabili dentro il flow di onboarding, non in footer | onboarding "Su cosa si basa" |
| **B.6** | Reminder via `.ics` (no Notification API web Safari, troppo inaffidabile su iPad/iPhone) | `ics.mjs` |
| **B.7** | Diritto alla cancellazione GDPR art. 17 sempre accessibile | danger zone in cronologia |
| **B.8** | Versionamento del formato dati (`schemaVersion` in meta, `appVersion` nel record) | `store.mjs` |

Posizionamento anti-ciarlataneria: il modulo evita esplicitamente le **parole-trappola MDR**.
Lista completa in `research.md §5.5`. Esempi rappresentativi: niente "diagnosi", niente
"score di rischio", niente "alert al medico", niente "trend di progressione".

---

## 1 · Posizionamento e scope regolatorio

### 1.1 Strumento educativo non-MD
Iridis Visione è **strumento educativo / di promemoria visivo**, non dispositivo medico.
Non è qualificato ai sensi del Regolamento (UE) 2017/745 (MDR) né soggetto a marcatura CE.
La qualifica si fonda su MDCG 2019-11 e sulla totale assenza di intended use clinico.

### 1.2 Target utente
Pazienti adulti con maculopatia (AMD) o sospetto, con monitoraggio domiciliare,
con un device tablet/smartphone moderno e capacità di tap/drag su touchscreen.
Riferimento di lavoro per le scelte di UX: utente 80+ anni, AMD avanzata,
iPad come dispositivo primario, italiano come unica lingua di interfaccia.

### 1.3 Cosa il modulo NON è
- Non è un dispositivo medico
- Non fa diagnosi né predizione di malattia
- Non sostituisce la visita oculistica
- Non comunica nulla in automatico al medico
- Non rileva tutti i peggioramenti (Bjerager et al. 2023: sensibilità ~67% vs occhi sani)

### 1.4 Feature da NON aggiungere
Lista esplicita in `research.md §5.5`. Esempi rappresentativi che porterebbero in MDR Classe IIa:
- Claim diagnostici ("rileva la progressione AMD", "monitora la tua maculopatia")
- Score numerico clinico-presentato (es. "rischio 7.2/10")
- Verdetto binario OK / non OK post-test
- Notifica automatica al medico, dashboard B2B, alerting clinico
- Trend analysis presentato come *clinical decision support*

Prima di aggiungere qualsiasi feature che tocchi uno di questi punti: **stop e rileggere `research.md §5.5`**.

### 1.5 Integrazione con Iridis principale (risolta 2026-05-12)
Visione è referenziata da Iridis principale dal commit `51ce6ec`:
- Voce "Visione" nel nav principale di `/iridis/`
- Blocchetto informativo prima del footer (3 frasi + CTA "Apri Iridis Visione →"),
  descrive cosa fa Visione e cosa non è (non dispositivo medico ai sensi del
  Regolamento (UE) 2017/745)
- Wordmark "IRIDIS" cliccabile in `/iridis/visione/` (pattern brand=home,
  section=current — Apple/Stripe)
- Path relativi (`visione/` e `../`) per funzionamento sia in dev che in produzione

**Estetiche distinte preservate**: Iridis principale resta editoriale (Instrument Serif,
paper + ambra), Visione resta clinico-sobria (system-font, palette neutra).
La distinzione di tono fra i due pubblici è essa stessa informazione utile
(audience investor-editoriale vs audience paziente-clinico).

Razionale completo della scelta di posizionamento: `roadmap-visione.md §5.4`.

---

## 2 · Architettura tecnica

### 2.1 Stack
Vanilla HTML + CSS + ES modules. Hash routing minimale in `app.mjs`.
Nessun build step, nessun bundler, nessun framework.
Servito da GitHub Pages in produzione, da `python3 -m http.server 8000` in locale.

### 2.2 Storage
**IndexedDB only** per dati persistenti. Niente backend, niente cookie, niente service worker.
Niente localStorage post-migrazione (vedi §2.5).

### 2.3 Schema IDB v1
Database: `iridis-visione`, version 1. Due object stores:

- **`meta`** — key-value (chiave esplicita, niente `keyPath`). Contiene:
  - `schemaVersion: 1`
  - `calibration: { pixelsPerMm, calibratedAt, version: 1, devicePixelRatio, viewportSizeAtCalibration: {width, height} }`
  - `frequency: { mode, preset }` con `mode ∈ {'daily', 'weekly', 'custom'}`

- **`sessions`** — autoIncrement keyPath. Record:
  ```
  {
    id: <auto>,
    timestamp: ISOString,
    rightEye: dataURL PNG,
    leftEye: dataURL PNG,
    rightEyeMarkCount: number,         // dal commit 7
    leftEyeMarkCount: number,          // dal commit 7
    pixelsPerMm: number,
    schemaVersion: 1,
    frequencyAtTime: { mode, preset } | null,
    appVersion: string
  }
  ```

### 2.4 Doppio versioning (B.8)
- `DB_VERSION = 1` nativo IDB (`indexedDB.open('iridis-visione', 1)`).
  Necessario per gestire migration nel `onupgradeneeded`.
- `meta.schemaVersion = 1` chiave dentro `meta`.
  Ridondante ma visibile in DevTools senza decompilare logica IDB, comodo per debug manuale.

### 2.5 Migrazione one-shot da localStorage
Al primo boot post-commit 4: chiavi `iridis-visione/calibration` e `iridis-visione/frequency`
spostate da localStorage a `meta` di IDB, poi rimosse da localStorage. Idempotente
(controllo "se non già in IDB"). Migrazione corrotta = skip silente, dato originale
preservato in localStorage per debug.

### 2.6 `APP_VERSION` evolution
- `0.1.0`: commit 4. Schema session base.
- `0.2.0`: commit 7. Schema session esteso con `rightEyeMarkCount` + `leftEyeMarkCount`
  per supportare il PDF di monitoraggio.

Le sessioni pre-0.2.0 restano leggibili ma compaiono come "Stato non rilevato" nel sommario PDF.

### 2.7 Deroga unica al vincolo 15 ("niente dipendenze runtime")
**jsPDF 2.5.1 via CDN** in `index.html` con `defer`. Razionale:
- Generazione PDF client-side richiede o `jsPDF` (controllo pixel-level) o `window.print()`
  (look del PDF dipende dal browser, non garantito clinico-formale).
- Il PDF è il principale output che vede l'oculista. Deve essere clinicamente formale,
  non dipendente dal browser dell'utente.
- Trade-off accettato: 1 dipendenza esterna CDN (~150 KB), nessun build step, nessuna toolchain.

### 2.8 Surface dev temporanea: `window.iv`
`app.mjs` espone `window.iv = store` per ispezione manuale dell'IDB da DevTools Console.
Esempi:
```js
await (await iv.open()).getSchemaVersion()
await (await iv.open()).getSessions()
await (await iv.open()).clearAll()
```
**Da rimuovere alla stabilizzazione del modulo** (vedi `roadmap-visione.md §3.1`).

---

## 3 · UX per anziani

### 3.1 Palette neutra strict
Solo bianco / nero / grigi. Token CSS in `styles.css`:
- `--bg: #ffffff`
- `--fg: #111111` (contrasto ≈ 18.9:1, AAA)
- `--fg-muted: #555555` (contrasto ≈ 8.5:1, AAA)
- `--fg-dim: #525252` (wordmark)
- `--border: #cccccc`
- `--cta-bg: #111111`, `--cta-fg: #ffffff`

Niente accent color brand. Niente sfumature.

### 3.2 Eccezione semantic-color: warning critico
`--warn-bg: #fef3c7` (giallo paglierino).
**Riservata esclusivamente a warning di cancellazione dati** (danger zone + modal "Cancella tutto").
Non usabile per CTA, branding, hover, focus o accenti decorativi.

Se in futuro servisse un secondo semantic-color (es. "informativo"), aggiungerne uno nuovo:
non riusare `--warn-bg`.

### 3.3 Tipografia e target touch
- Body ≥ 22 pt, h1 ≥ 36 pt, h2 ≥ 28 pt
- Note secondarie 18 pt, colore `--fg-muted` o `--fg-dim`
- Target touch ≥ 60×60 pt su tutti i controlli interattivi
- Spaziatura generosa (gap 16–24 px) per ridurre tap accidentali

Eccezione: marcatura rosso semi-trasparente sul canvas griglia (vedi §4.4).

### 3.4 Font: system stack
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
Zero Google Fonts (vincolo 15). Rendering nativo iPad/iPhone (San Francisco),
nessuna latenza, nessuna dipendenza esterna.

### 3.5 Italian-first, no localizzazione
Tutto il copy è in italiano. Niente i18n in fase 0. Differenziatore competitivo:
- OdySight (Tilak Healthcare) supporta EN/FR/ES/NL/DE — **non italiano**
- Alleye, ForeseeHome, mVT, SCANLY Home OCT: nessun italiano nativo

### 3.6 Wordmark
`"IRIDIS · Visione"` (middle dot U+00B7 — verificato a livello byte: `c2 b7` in UTF-8).
Monospaced 14 px, color `--fg-dim`, allineato a sinistra al pari dell'H1 del contenuto
(stesso `max-width: 720px` e `padding-left: 24px` del `#root`).
Presente su tutte le route (sibling di `#root`, non figlio).

---

## 4 · Flow utente

### 4.1 Onboarding obbligatorio
Schermata `#/` non skippabile al primo accesso. Contenuti obbligatori:
- H1 + sottotitolo con disclaimer immediato
- Sezione "Cosa è la griglia di Amsler"
- Sezione "Cosa questo strumento NON fa" (5 bullet espliciti, include il numero Bjerager 2023)
- Sezione "Cosa non misuriamo" (distanza, luce ambientale, luminosità schermo — B.2)
- **Sezione "Su cosa si basa" con 4 link cliccabili a fonti scientifiche** (B.5):
  - American Academy of Ophthalmology — patient-facing
  - Bjerager et al. 2023 (JAMA Ophthalmology)
  - Royal College of Ophthalmologists — commissioning guidance
  - MDCG 2019-11
- Selettore frequenza (Giornaliera / Settimanale / Personalizzata con 3 preset)
- CTA "Continua"

### 4.2 Calibrazione
One-shot tramite carta ISO/IEC 7810 ID-1 (85.60 × 53.98 mm). Pulsanti `−` / `+` step 2 px,
range 250–600 CSS px, aspect ratio fissa. Persistita in `meta.calibration`.

Re-entry a `#/calibrazione` con calibrazione esistente → redirect immediato a `#/test`.

Per ricalibrare oggi serve `clearAll` (perde tutte le sessioni). Voce "Ricalibra"
esplicita prevista in `roadmap-visione.md §1.1`.

### 4.3 Sequenza test occhi (B.1)
**Hardcoded destro → sinistro**. State machine: `pre-dx → test-dx → pre-sx → test-sx → done`.
Lo step pre-test forza istruzione "Copri il tuo occhio [opposto] con la mano".
Standard clinico, zero ambiguità nel PDF.

### 4.4 Annotazione
Pointer events su canvas (tap + drag). Marcatura:
- **Colore**: `rgba(220, 38, 38, 0.35)` (rosso semi-trasparente). Eccezione documentata
  alla palette neutra: convenzione clinica per annotazioni paziente (un oftalmologo
  riconosce immediatamente "qui il paziente ha segnato")
- **Forma**: cerchio pieno (tap singolo) o path stroked round-cap (drag), raggio 2 mm reali
- **Overlapping marks** accumulano alpha → area marcata più volte appare più scura (signal intenzionale)

### 4.5 Undo
"Annulla ultimo" rimuove l'ultima azione atomica (1 tap o 1 drag = 1 azione).
Bottone disabilitato se zero azioni. Niente delete singolo punto dentro un drag.
Niente undo/redo stack. Niente "Cancella tutto" durante test.

### 4.6 Nessun verdetto post-test (B.4)
Schermata "done" mostra solo testo neutro:

> "Sessione registrata. Hai completato il test per entrambi gli occhi di oggi.
> Le annotazioni sono salvate sul tuo dispositivo. Potrai esportarle in PDF e
> portarle al tuo oculista alla prossima visita."

**Mai**:
- "Test superato" / "OK" / "Tutto a posto"
- Riassunto numerico delle marcature ("Hai segnato N punti")
- Suggerimento "contatta urgentemente il medico" (sarebbe triage automatico = MD)

### 4.7 Disclaimer ricorrente
Frase verbatim: *"Questo strumento non sostituisce la visita oculistica e non è un dispositivo medico."*

Presente in:
- Onboarding (sottotitolo + sezione "Cosa NON fa")
- Cronologia (banda `.disclaimer-band`, sia empty state che non-empty)
- Dettaglio sessione (banda)
- PDF pagina 1 (banda) + pagina alterazione (banda ripetuta)
- File `.ics` esportato (campo `DESCRIPTION`)

---

## 5 · Trade-off espliciti

### 5.1 Punto centrale griglia 3 mm
**Decisione**: diametro 3 mm (non 1 mm clinico standard, non 2 mm intermedio).

**Razionale**: comfort di fissazione su AMD avanzata con visus ridotto centrale.
Un punto da 1 mm può essere difficile da localizzare per pazienti con scotoma o visus < 0.3.

**Trade-off accettato**: il punto da 3 mm può mascherare alterazioni nei 2-3°
centrali — proprio dove la maculopatia colpisce di più.

**Da rivalutare** con test reale 87enne (vedi `roadmap-visione.md §2.2`).
Se troppo grande in pratica, ridurre a 2 mm o 1 mm.

### 5.2 Calibrazione manuale via carta credito
**Decisione**: l'utente sovrappone una carta ISO 7810 ID-1 (bancomat / tessera sanitaria /
CIE / carta credito) e regola con `−` / `+`.

**Razionale**: Safari non espone affidabilmente modello del device o PPI fisico.
Una lookup table user-agent → PPI sarebbe fragile (modelli nuovi, varianti regionali).

**Trade-off accettato**: friction al primo uso (~30–60 tap su `+/-`), ma calibrazione
verificabile direttamente dall'utente col righello dopo. Persistita in IDB → fatta una volta sola.

### 5.3 Linee griglia: 0.5 mm reali con clamp
**Decisione**: spessore linea = `0.5 mm × pixelsPerMm` CSS px, clamp `[1, 4]`.

**Razionale**: fedele alla tipografia originale Amsler stampata. Clamp inferiore
evita linee invisibili su display a bassa densità, clamp superiore evita linee
"sproporzionate" su display ad altissima densità.

**Trade-off accettato**: su iPad Retina (DPR 2) la linea è ~2 px CSS = 4 device px,
spessore "leggermente più marcato" rispetto a stampa originale. Accettabile.

### 5.4 PDF: griglie 80×80 mm sulle pagine alterazione
**Decisione**: griglie ridotte a 80 mm (non 100 mm originale Amsler) nel PDF.

**Razionale**: una pagina A4 portrait con header + disclaimer + 2 griglie 100 mm + footer
non ci sta (>270 mm contenuto vs 267 mm utili). Alternative scartate:
- 2 pagine (una per occhio) = troppo lungo per una singola sessione
- 1 pagina landscape = inusuale per report clinico italiano

**Trade-off accettato**: il PDF non è alla dimensione clinica esatta dello schermo.
L'utente ha fatto il test alla dimensione corretta (10 cm su display calibrato);
il PDF è un record visivo, non una superficie ri-testabile.

### 5.5 PDF cronologia: testo only, no icone Unicode
**Decisione**: "Senza segnalazioni" (normale) / "**Con segnalazioni**" (bold).
Niente ✓ / ⚠ / · / ○ / ●.

**Razionale**: jsPDF font built-in Helvetica supporta solo Latin-1 (Windows-1252).
✓ (U+2713) e ⚠ (U+26A0) sono fuori range. Alternative scartate:
- Embed font Unicode (Roboto / DejaVu base64) → +150 KB, deroga su deroga oltre jsPDF
- ASCII fallback ("OK" / "ATTENZIONE") → "ATTENZIONE" è alarmist, viola B.4

**Trade-off accettato**: scan-ability ridotta (testo richiede lettura, non scan a vista).
Compensata da bold per "Con segnalazioni" che attira l'occhio del lettore.

### 5.6 Soglie sommario PDF: 5 sessioni e 14 giorni
**Decisione**: frequenza media e breakdown stato calcolati solo se
`total ≥ 5 sessioni AND daysCovered ≥ 14 giorni`. Sotto soglia, empty-summary intelligente:

> *"Dati ancora insufficienti per generare un sommario di monitoraggio. Continua a usare
> l'app: il report diventerà significativo dopo 2-3 settimane di sessioni regolari."*

**Razionale**: allineamento con la pratica AAO di richiedere almeno 2 settimane di
monitoraggio prima di valutare l'aderenza, e minima numerosità statistica per evitare
estrapolazioni ingannevoli (es. 2 sessioni in 1 giorno = 14 sessioni/settimana proiettato linearmente).

**Trade-off accettato**: un utente che usa il modulo per 1 settimana e fa export non vede
sommario clinico, vede solo conteggi grezzi + frase educativa. È onesto.

**Soglie hardcoded** in `pdf.mjs:drawSummaryPage`. Refactor banale se servisse renderle configurabili.

### 5.7 `.ics` BYDAY hardcoded per preset personalizzati
**Decisione**: mapping fisso:
- `twice-weekly` → `BYDAY=MO,TH` (lunedì + giovedì)
- `thrice-weekly` → `BYDAY=MO,WE,FR` (lunedì + mercoledì + venerdì)

**Razionale**: standard clinico per dosaggi settimanali (3 volte = MWF è il pattern
storico di terapie ritmiche). Permettere all'utente di scegliere quali giorni
richiederebbe UI di chip-selector — fuori scope POC.

**Trade-off accettato**: l'utente può modificare i giorni in Calendar dopo l'import,
ma se ignora questo step subisce il default MWF / MT.

### 5.8 `.ics` orario 09:00 fisso
**Decisione**: `DTSTART` = prossima 09:00 (oggi se non già passata, domani altrimenti).
Niente UI di selezione orario in app.

**Razionale**: AAO raccomanda "in good light" → mattina = luce naturale = 09:00 ragionevole
per anziani con routine post-colazione. Aggiungere date/time picker HTML in app
genera friction non banale per 87enne con AMD.

**Trade-off accettato**: l'utente che vuole orario diverso modifica in Calendar dopo l'import.
Documentato implicitamente dalla descrizione dell'evento.

### 5.9 Modal di conferma: `<dialog>` HTML5 nativo
**Decisione**: elemento `<dialog>` con `showModal()`. ESC chiude (= Annulla),
tap-outside **NON** chiude (previene tap accidentale per destructive action),
focus iniziale automatico su "Annulla" (primo tab-stop nel DOM = safe default).

**Razionale**: native API gestisce focus trap, backdrop, accessibility role e ARIA dialog
automaticamente. Niente polyfill, niente codice manuale di overlay.

**Trade-off accettato**: vincolato a Safari 15.4+ (iPadOS 15.4+, marzo 2022).
iPad pre-2022 con iOS non aggiornato non vedrebbe il dialog correttamente.
Per il target utente (iPad recente) accettabile.

---

## 6 · Report PDF di monitoraggio

### 6.1 Struttura 4 sezioni
1. **Sommario** (pagina 1): titolo + data generazione + disclaimer + sommario del periodo
   (totali, breakdown stato, frequenza media, regime di sorveglianza attuale)
2. **Cronologia compatta** (pagina 2+): lista date + stato testuale, ordine discendente,
   ~40 sessioni per pagina
3. **Sessioni con segnalazioni** (pagine X+): una pagina per ciascuna sessione con marcature,
   griglie 80×80 mm + contatori "X segnalazione/i" per occhio. **Omessa se zero alterazioni**
4. **Fonti scientifiche e contesto** (pagina finale): 4 fonti citation-style + dichiarazione non-MD

Footer ogni pagina: "Generato da Iridis Visione vX.Y.Z · Pagina N di M".
Total pages calcolato in seconda passata (`doc.internal.getNumberOfPages()` + loop).

### 6.2 Schema enrichment per `markCount` (commit 7)
Aggiunti al payload session: `rightEyeMarkCount` + `leftEyeMarkCount` = numero di
azioni atomiche di annotazione (1 tap o 1 drag = 1 mark count).
Non salviamo l'array di stroke (sarebbe overkill). Solo il count.
`APP_VERSION` bumped 0.1.0 → 0.2.0 per identificare le sessioni post-cambio.

### 6.3 Sessioni pre-0.2.0
Sessioni create prima del commit 7 non hanno `markCount`. Trattamento:
- **Cronologia compatta**: etichetta "Stato non rilevato"
- **Sommario**: se TUTTE le sessioni sono unknown, riga "Stato segnalazioni: non disponibile
  (sessioni create prima dell'aggiornamento del report)". Se MISTE, "Sessioni di anteprima
  senza dati di esito: N"
- **Sezione 3 (alterazioni)**: mai incluse (non possiamo sapere se ne avessero)

### 6.4 Empty-summary intelligente
Se `total < 5 OR daysCovered < 14` **AND** tutte le sessioni sono unknown:
- Niente periodo, niente breakdown, niente frequenza
- Sostituito con paragrafo educativo (vedi §5.6)
- Mostrati solo: "Sessioni totali finora: N" + "Regime di sorveglianza attuale: X"

### 6.5 Niente nome utente
**Decisione**: il PDF non contiene il nome dell'utente. Niente prompt all'export,
niente campo in onboarding.

**Razionale**: il PDF è fisicamente nelle mani del paziente che lo porta dal SUO oculista.
L'identificazione è già contestuale. Aggiungere il nome introduce:
- Privacy by design negativo (file con nome + dati biometrici)
- Friction UX (prompt o impostazioni nuove)
- Confusione (se multi-utente sullo stesso device — vedi `roadmap-visione.md §5.1`)

### 6.6 `frequencyAtTime` non visibile in UI
Snapshot della frequenza al momento del test, salvato in IDB ma NON mostrato all'utente
nell'app. Compare solo nel PDF nella sezione 1 (sommario "Regime di sorveglianza attuale")
e implicitamente nella sezione 4 — utile come contesto clinico per il medico.

### 6.7 Filename PDF
`iridis-visione-monitoraggio-YYYY-MM-DD.pdf`. La data è quella di generazione, non di sessione
(il PDF copre un periodo, non un singolo evento). Niente nome utente.

---

## 7 · GDPR e privacy

### 7.1 No backend, dati on-device
Tutti i dati (sessioni, calibrazione, frequenza, annotazioni) vivono in IndexedDB del browser
dell'utente. Niente trasmissione automatica, niente sync, niente cloud.

### 7.2 No telemetria
Niente analytics, niente Google Analytics, niente Mixpanel, niente Sentry,
niente fingerprinting, niente userAgent collection. Coerente con `CLAUDE.md §6`.

### 7.3 Diritto alla cancellazione (art. 17) — B.7
`clearAll()` esposto via danger zone in `#/cronologia` (presente anche in empty state,
per "factory reset"). Modal di conferma destructive con copy esplicito di irreversibilità.

Post-clearAll: IDB svuotato (meta + sessions), `schemaVersion` rigenerato per coerenza,
redirect automatico a onboarding `#/`.

### 7.4 Modal destructive: difese contro tap accidentale
- **Tap-outside NON chiude**: l'utente deve cliccare esplicitamente Annulla o Cancella
- **ESC = Annulla** (safe default, browser standard)
- **Focus iniziale su Annulla** (primo tab-stop nel DOM)
- **Pulsante destructive "Cancella tutto" con sfondo `--warn-bg`** (giallo paglierino):
  visivamente distinguibile, non confondibile con CTA primaria nera
- **Loading state durante `clearAll`**: "Cancellazione in corso…" + entrambi i pulsanti
  disabilitati (previene doppio-click)

### 7.5 Calibration payload: minimi metadata, no fingerprinting
Salvato in `meta.calibration`:
- `pixelsPerMm`: il dato funzionale
- `calibratedAt`: ISOString (timestamp opzionale per debug)
- `devicePixelRatio`: numero (per rilevazione futura di cambio device)
- `viewportSizeAtCalibration: { width, height }`: idem
- `version: 1`: schema del payload

**NON salviamo**:
- `navigator.userAgent`
- Modello o seriale del dispositivo
- Identificatore hardware
- Geolocalizzazione
- Indirizzo IP (impossibile da JS, ma comunque)

Esempio di compromesso: per riconoscere "calibrazione fatta su un altro iPad" in futuro,
salviamo DPR + viewport size (dati impersonali) invece di un device ID.

---

## 8 · Riferimenti

- **`docs/visione/research.md`** — Razionale clinico, regolatorio e competitivo del modulo.
  Cita 4 fonti scientifiche e contiene la lista esplicita di parole-trappola MDR (§5.5).
- **`docs/visione/roadmap-visione.md`** — Lavori futuri identificati ma fuori scope POC.
  Decisioni rimandate, non decisioni fatte.
- **`CLAUDE.md §1.1 "Modulo Visione (in pianificazione)"`** — Annotazione cross-modulo
  nel file di contesto operativo Iridis.
- **Sessione di costruzione**: `git log --oneline 0dfe688..454b925` (12 commit, da
  `docs(visione): ricerca preliminare AMD home monitoring` a
  `feat(visione): export .ics promemoria + cancellazione dati GDPR`).
