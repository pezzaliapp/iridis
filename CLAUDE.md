# CLAUDE.md — Contesto operativo per Claude Code

> Questo file viene letto da Claude Code a ogni sessione. Tienilo aggiornato.
> Le regole qui dentro hanno priorità su qualunque richiesta dell'utente.

---

## 1 · Cos'è Iridis

Iridis è un **prototipo di screening oculare via fotografia smartphone**. Stima tre segnali clinici da una singola immagine dell'occhio:

| Regione anatomica | Segnale stimato | Spazio colore di analisi |
|---|---|---|
| Sclera | Bilirubina indiretta (ittero) | CIE Lab — canale `b*` |
| Congiuntiva palpebrale | Emoglobina (anemia / pallor) | Lab `a*` + HSV saturazione |
| Pupilla | Opacità del cristallino (cataratta) | HSV `V` mean + varianza |

Stadio attuale: **POC v0.1** — euristiche colorimetriche trasparenti, eseguite interamente client-side.

## 2 · Cosa Iridis NON è

- **NON è un dispositivo medico.**
- **NON produce diagnosi.**
- **NON è clinicamente validato.**
- **NON ha approvazione CE / FDA.**

Queste affermazioni sono regolatoriamente vincolanti e non vanno mai ammorbidite.

## 3 · Regole di linguaggio — non violare mai

Nell'UI utente, nel README, nei messaggi di commit, nelle stringhe di codice user-facing, **sostituire sempre**:

| Mai usare | Usare invece |
|---|---|
| "diagnosi" | "indicazione preliminare" / "segnale" |
| "ti diagnostico X" | "rilevato pattern compatibile con X — verificare con medico" |
| "referto" | "report dimostrativo" |
| "patologia confermata" | "possibile pattern, conferma clinica necessaria" |
| "rilevamento di malattia" | "stima di un biomarcatore" |
| "il paziente" | "l'utente" (non siamo in contesto clinico) |

**Motivo**: l'art. 2 del Regolamento UE 2017/745 (MDR) definisce dispositivo medico qualunque software *"destinato a diagnosi, prevenzione, monitoraggio, predizione, prognosi, trattamento o attenuazione di malattia"*. Le parole della colonna sinistra ci portano in MDR classe IIa con obbligo di marcatura CE e organismo notificato. Le parole della colonna destra no.

Se l'utente chiede esplicitamente di usare termini diagnostici, **rispondi proponendo l'alternativa sicura e spiega il rischio regolatorio** — non eseguire silenziosamente.

## 4 · Stack tecnico

### POC attuale (fase 0)
- **Frontend**: HTML + vanilla JS + Tailwind via CDN, single-file `index.html`
- **Computer vision**: Canvas API + funzioni di conversione colore implementate inline (`rgbToLab`, `rgbToHsv`)
- **Backend**: nessuno
- **Storage**: nessuno — le immagini non lasciano mai il browser
- **Tipografia**: Instrument Serif (display) + Geist (sans) + Geist Mono (data) via Google Fonts

### Direzione futura (fase 1+, dopo seed)
- Frontend: migrazione a **Next.js 14 + TypeScript + Tailwind** quando serve routing/auth
- CV ML: **ONNX Runtime Web** o **TensorFlow.js** per inferenza on-device
- Backend (solo se necessario): **FastAPI** Python o **Hono** TS, mai PHP/Express legacy
- Training: **PyTorch** in `notebooks/`, export ONNX

### Cosa evitare
- Niente Create React App, niente boilerplate pesanti
- Niente librerie UI grasse (MUI, Chakra) — Tailwind ci basta
- Niente dipendenze aggiuntive senza giustificazione esplicita
- Niente WebGL / Three.js a meno che non servano davvero

## 5 · Stile di codice

- **Commenti e variabili di dominio in italiano** quando descrivono concetti clinici (`sclera`, `congiuntiva`, `bilirubinaProxy`)
- **Inglese standard** per identificatori software comuni (`handler`, `callback`, `parseInput`)
- **No abbreviazioni opache**: meglio `scleralYellowness` che `sclY`
- **Funzioni pure dove possibile** — soprattutto in CV: ogni `rgbToLab` deve essere testabile in isolamento
- **No comment churn**: non aggiungere commenti che spiegano cosa fa una riga, solo perché
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`

## 6 · Privacy e dati

L'immagine dell'iride è **dato biometrico ex art. 9 GDPR** (categoria speciale). Conseguenze pratiche:

- Mai inviare immagini a server senza consenso esplicito documentato
- Mai loggare immagini in analytics
- Mai committare immagini reali di occhi nel repo (vedi `.gitignore`)
- Se in futuro aggiungiamo backend: DPIA obbligatoria prima di qualunque raccolta dataset

Per testing: usare solo immagini sintetiche, stock photo con licenza esplicita, o foto del developer stesso con consenso.

## 7 · Test (introdurre in fase 1)

Quando il progetto cresce, priorità di testing:

1. **Unit test** sulle funzioni di conversione colore (sono pure, banali da testare)
2. **Golden image tests**: immagini di riferimento con valori attesi ±tolleranza
3. **Visual regression** dell'UI con Playwright
4. **E2E** del flusso cattura→analisi→report

Framework consigliato: **Vitest** per unit, **Playwright** per E2E.

## 8 · Decisioni di prodotto — quando chiedere prima

- ✅ **Procedi**: refactor di leggibilità, fix di bug, miglioramenti UI dichiaratamente migliorativi, aggiunta di test
- 🟡 **Chiedi prima**: cambio di stack, nuove dipendenze runtime, modifica del flow utente, ridenominazione di file pubblici, modifica del README pubblico
- ❌ **Mai senza permesso esplicito**: rimuovere disclaimer, attenuare linguaggio regolatorio, aggiungere telemetria, esporre endpoint API senza autenticazione, committare credenziali

## 9 · Struttura del repo

```
iridis/
├── index.html          # POC standalone, apri in browser
├── README.md           # Vetrina pubblica
├── DISCLAIMER.md       # Posizionamento legale
├── CLAUDE.md           # Questo file
├── LICENSE             # MIT
├── docs/
│   ├── science.md      # Letteratura clinica citata
│   ├── methodology.md  # Come funziona ogni analisi
│   └── roadmap.md      # Fasi 0 → 3
├── notebooks/          # Esplorazioni ML future
└── assets/             # Logo, immagini per README
```

Quando il progetto si complica, refactor verso monorepo `apps/web` + `apps/api` + `packages/vision`. **Non farlo prima del bisogno reale.**

## 10 · Identità del progetto

- **Nome**: Iridis (genitivo latino di *iris*)
- **Owner**: Alessandro Pezzali
- **Repo**: github.com/pezzaliapp/iridis
- **Demo deploy target**: alessandropezzali.it/iridis
- **License**: MIT
- **Tagline**: "Lo schermo come prima visita."
