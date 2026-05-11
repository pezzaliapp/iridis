# Iridis

> **Lo schermo come prima visita.**
> Prototipo di screening oculare via fotografia smartphone.

[![Status](https://img.shields.io/badge/status-proof--of--concept-amber)]() [![License](https://img.shields.io/badge/license-MIT-black)]() [![Not a medical device](https://img.shields.io/badge/⚠-NOT_a_medical_device-red)]()

---

## ⚠️ Disclaimer essenziale

**Iridis non è un dispositivo medico. Non produce diagnosi. Non è validato clinicamente.**

È un **prototipo dimostrativo** che esplora la fattibilità di stimare biomarcatori clinicamente noti da una singola fotografia dell'occhio. Qualsiasi output va sempre verificato da un professionista sanitario qualificato.

Vedi [DISCLAIMER.md](./DISCLAIMER.md) per il posizionamento legale completo.

---

## Cosa fa

Da una singola foto dell'occhio Iridis stima tre segnali clinici noti in letteratura:

| Regione | Segnale | Base scientifica |
|---|---|---|
| **Sclera** (parte bianca) | Indice di ittero — colorimetria della bilirubina | [Mariakakis et al., UbiComp 2017 — *BiliScreen*](https://dl.acm.org/doi/10.1145/3132041) |
| **Congiuntiva** (palpebra inferiore) | Indice di pallor — proxy emoglobinico | [Mannino et al., Nature Comm. 2018](https://www.nature.com/articles/s41467-018-07262-2) |
| **Pupilla** | Opacity index — riflesso pupillare | [Munson et al., Science TM 2019 — *CRADLE*](https://www.science.org/doi/10.1126/scitranslmed.aau4061) |

Tutta l'elaborazione avviene **client-side**: le immagini non lasciano mai il browser dell'utente.

## Demo rapida

Il POC è un singolo file HTML, nessuna dipendenza da installare:

```bash
git clone https://github.com/pezzaliapp/iridis.git
cd iridis
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

Oppure servi con un server statico:

```bash
npx serve .
# poi apri http://localhost:3000
```

Deploy pubblico: [alessandropezzali.it/iridis](https://alessandropezzali.it/iridis)

## Come è fatto (POC v0.1)

- Singolo `index.html` standalone
- Tailwind via CDN, vanilla JS
- Canvas API per elaborazione pixel
- Conversioni colore CIE Lab e HSV implementate inline
- Nessun backend, nessuno storage, nessun cookie

Le **euristiche colorimetriche attuali sono trasparenti** (vedi [`docs/methodology.md`](./docs/methodology.md)) — non scatole nere — per dimostrare la fattibilità tecnica prima di passare a modelli ML addestrati su dataset clinici reali.

## Struttura del repo

```
iridis/
├── index.html              # POC standalone — apri in browser
├── docs/
│   ├── science.md          # Riferimenti bibliografici
│   ├── methodology.md      # Algoritmi spiegati
│   └── roadmap.md          # Da POC a CE
├── notebooks/              # Esplorazioni ML (fase 1+)
├── DISCLAIMER.md           # Posizionamento legale
└── CLAUDE.md               # Contesto per Claude Code
```

## Roadmap

| Fase | Tempistica | Cosa |
|---|---|---|
| **0** — Oggi | — | POC con euristiche trasparenti |
| **1** | 6 mesi | Dataset clinico paired + CNN compatte |
| **2** | 12–18 mesi | Studio clinico multicentrico (n≈800) |
| **3** | 24+ mesi | Dossier MDR classe IIa, marcatura CE |

Dettagli: [`docs/roadmap.md`](./docs/roadmap.md).

## Privacy

L'immagine dell'iride è dato biometrico ex art. 9 GDPR. Iridis è progettato fin dal POC con **privacy-by-design**:

- Nessuna immagine inviata a server
- Nessun cookie analytics
- Nessuna identificazione biometrica reversibile

Vedi [DISCLAIMER.md](./DISCLAIMER.md) per dettagli.

## Contribuire

Progetto attualmente in single-developer mode. Issue e discussion sono benvenute per feedback scientifico, segnalazioni di errori, o proposte di miglioramento.

## Licenza

MIT — vedi [LICENSE](./LICENSE).

## Author

[Alessandro Pezzali](https://alessandropezzali.it) — [@pezzaliapp](https://github.com/pezzaliapp)
