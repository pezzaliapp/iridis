# Roadmap — da POC a CE

Quattro fasi. Ogni fase ha entry criteria, deliverable, exit criteria. Le tempistiche sono indicative.

---

## Fase 0 — POC dimostrativo *(oggi)*

**Stato**: in corso.

### Deliverable
- ✅ `index.html` standalone funzionante
- ✅ Algoritmi euristici trasparenti per 3 biomarcatori
- ✅ UI investor-grade
- ✅ Documentazione scientifica e metodologica
- ✅ Disclaimer regolatorio e privacy esplicitati

### Cosa NON c'è
- Niente dataset reale
- Niente modello ML
- Niente backend
- Niente validazione clinica

### Exit criteria
- Demo riproducibile davanti a investor / clinico
- Feedback iniziale da almeno 2 oftalmologi
- Decisione su funding pre-seed

---

## Fase 1 — Dataset e prima validazione *(6 mesi dopo seed)*

**Obiettivo**: rimpiazzare le euristiche con modelli ML addestrati su dati reali.

### Workstream

#### 1.1 — Raccolta dataset
- Partnership con **2 reparti ospedalieri** (oftalmologia + medicina interna/ematologia)
- Protocollo: foto smartphone standardizzata + esame ematochimico paired entro 24h
- Target: **5'000 immagini paired** stratificate per età, etnia, severità
- Comitato etico locale per ogni centro
- DPIA documentata prima dell'inizio

#### 1.2 — Standardizzazione cattura
- App nativa iOS/Android con:
  - Guide di posizionamento (occhio centrato, distanza target)
  - Flash controllato per cataratta
  - Quality gate (sfocatura, esposizione)
  - Color reference card opzionale (ColorChecker mini)

#### 1.3 — Modelli ML
- Architettura: CNN compatte (**MobileNetV3**, **EfficientNet-Lite**) — deployabili on-device
- Training: PyTorch in `notebooks/`, export ONNX
- Targets:
  - Regressione per bilirubina (mg/dL) e Hb (g/dL)
  - Classificazione binaria per cataratta (presente / assente)
- Cross-validation 5-fold, hold-out test set 20%

### Hire
- 1× ML engineer (computer vision)
- 1× Clinical research coordinator (part-time)

### Budget indicativo
~ €350K (personale + dataset + cloud training)

### Exit criteria
- Modelli con prestazioni superiori alle euristiche del POC su test set
- Pipeline di training riproducibile e versionata (DVC o equivalente)
- Pubblicazione su preprint server (arXiv / medRxiv)

---

## Fase 2 — Studio clinico di validazione *(12–18 mesi)*

**Obiettivo**: prove cliniche per dossier regolatorio.

### Disegno studio
- **Multicentrico**: 3+ siti in EU
- **Prospettico, blinded**: l'algoritmo non vede il ground truth fino alla read-out
- **n ≈ 800** partecipanti, stratificati per condizione
- Endpoint primari:
  - Sensibilità **≥ 85%** per cut-off clinicamente rilevante
  - Specificità **≥ 80%**
- Endpoint secondari:
  - Concordanza con clinici (Cohen's κ)
  - Performance per sottogruppo etnico/età
  - Time-to-result

### Regolatorio in parallelo
- Implementazione **QMS ISO 13485**
- **IEC 62304** software lifecycle
- **IEC 62366** usability engineering
- **ISO 14971** risk management
- Selezione organismo notificato (es. TÜV SÜD, BSI, IMQ)

### Hire
- 1× Regulatory affairs manager
- 1× QA engineer
- 1× Biostatistician (consultant)

### Budget indicativo
~ €1.2M (studio clinico + QMS + consulenze regolatorie)

### Exit criteria
- Risultati clinici sopra endpoint primari
- Manoscritto sottomesso a peer-review (target: JAMA Ophthalmology, npj Digital Medicine)
- Dossier tecnico MDR completo

---

## Fase 3 — Marcatura CE e lancio *(24+ mesi)*

**Obiettivo**: prodotto commerciabile in UE.

### Workstream

#### 3.1 — Certificazione
- Sottomissione dossier MDR **classe IIa** a organismo notificato
- Audit QMS
- Risposta a deficienze (ciclo tipico: 6–12 mesi)
- Ottenimento certificato CE

#### 3.2 — Go-to-market
- Canali iniziali:
  - **B2B**: integrazione in app sanitarie aziendali, telemedicina, farmacie territoriali
  - **B2B2C**: white-label per partner farmaceutici/diagnostici
- Pricing: SaaS per-utilizzo o licenza enterprise
- Lancio prioritario: Italia, Germania, UK (post-Brexit: UKCA marking)

#### 3.3 — Espansione
- Quarto biomarcatore (es. diabetic retinopathy con retinografo smartphone)
- Mercati extra-EU: FDA 510(k) per US, PMDA per Giappone

### Budget indicativo
~ €2M (certificazione + commerciale + nuovi biomarker)

### Exit criteria
- Certificato CE in mano
- Primi 3 clienti enterprise firmati
- Pipeline commerciale ≥ 10 contratti qualificati

---

## Rischi principali

| Rischio | Mitigazione |
|---|---|
| Dataset non sufficientemente diversificato | Recruitment multietnico esplicito; fairness audit pre-CE |
| Performance non replicabile fuori clinica | Studio pragmatic con foto in setting reale (non solo studio controllato) |
| Cambio normativo MDR (es. AI Act overlay) | Monitoraggio continuo + consulenza regolatoria sin dalla fase 1 |
| Competitor con head start (Google Health, ecc.) | Specializzazione su biomarker non in pipeline big tech + canale EU dedicato |
| Difficoltà reclutamento pazienti | Compensation simbolica + partnership con associazioni pazienti |

---

## North star

> Quando un paziente con sospetto ittero in farmacia, un farmacista può scattare una foto, ottenere uno score validato in 5 secondi, e indirizzare al medico se sopra soglia. **Senza laboratorio, senza prelievo, senza attesa.**
>
> Questo è Iridis a regime.
