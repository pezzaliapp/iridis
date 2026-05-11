# Fondamento scientifico

Questo documento raccoglie i riferimenti bibliografici che supportano l'approccio di Iridis. Tutti gli articoli sono peer-reviewed o pubblicati in venue accademiche di alto livello.

---

## 1 · Ittero — Bilirubina da sclera

### Riferimento principale

**BiliScreen: Smartphone-Based Scleral Jaundice Monitoring for Liver and Pancreatic Disorders**
Mariakakis, A., Banks, M.A., Phillipi, L., Yu, L., Taylor, J., Patel, S.N. — *Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT) / UbiComp 2017.*
[DOI: 10.1145/3132041](https://dl.acm.org/doi/10.1145/3132041)

### Risultati chiave

- Pearson r ≈ **0.89** tra colorimetria sclerale via smartphone e bilirubina sierica
- Sensibilità **89.7%** per identificare casi con bilirubina > 12.9 mg/dL
- Validato su 70 partecipanti con condizioni epatiche/pancreatiche

### Meccanismo biofisico

L'iperbilirubinemia provoca deposizione di pigmento bilirubinico nelle fibre elastiche della sclera, visibile cromaticamente come viraggio al giallo. Nello spazio CIE Lab, questo si misura sull'asse **`b*`** (blu→giallo).

### Limitazioni note

- Sensibile all'illuminazione ambientale → BiliScreen originale usa color calibration box o flash
- Variabilità interindividuale del baseline sclerale
- Non distingue tipo di iperbilirubinemia (diretta vs indiretta)

---

## 2 · Anemia — Pallor congiuntivale

### Riferimento principale

**Smartphone app for non-invasive detection of anemia using only patient-sourced photos**
Mannino, R.G., Myers, D.R., Tyburski, E.A., Caruso, C., Boudreaux, J., Leong, T., Lam, W.A. — *Nature Communications, 9, 4924 (2018).*
[DOI: 10.1038/s41467-018-07262-2](https://www.nature.com/articles/s41467-018-07262-2)

### Risultati chiave

- AUC **0.82** vs CBC di laboratorio
- Specificità ~93% per soglia Hb < 11 g/dL
- Dataset di addestramento: 142 partecipanti

### Meccanismo biofisico

La congiuntiva palpebrale è altamente vascolarizzata e priva di pigmentazione propria. Il colore rosso riflette direttamente la concentrazione di emoglobina nei capillari superficiali. Con Hb ridotta, il colorito vira verso il rosa pallido / bianco.

Nello spazio Lab, questo è misurabile come **`a*`** decrescente (rosso→verde) combinato con saturazione HSV ridotta.

### Limitazioni note

- Variabilità etnica del baseline congiuntivale
- Bias da maquillage palpebrale, occhi arrossati per allergie
- Necessità di addestrare l'utente a esporre correttamente la palpebra inferiore

---

## 3 · Cataratta — Riflesso pupillare

### Riferimento principale

**Autonomous early detection of eye disease in childhood photographs**
Munson, M.C., Plewman, D.L., Baumer, K.M., Henning, R., Zahler, C.T., Kietzman, A.T., Beard, A.A., Mukherjee, S., Diener, J., Smith, B.D. — *Science Translational Medicine, 11, 491 (2019).*
[DOI: 10.1126/scitranslmed.aau4061](https://www.science.org/doi/10.1126/scitranslmed.aau4061) — sistema CRADLE

### Risultati chiave

- Identificazione di leucocoria (riflesso pupillare biancastro) su foto smartphone consumer
- Detezione precoce di retinoblastoma, cataratta pediatrica, glaucoma congenito
- Mediana di anticipo diagnostico di 1.3 anni rispetto a diagnosi clinica

### Meccanismo biofisico

In pupilla sana, la luce attraversa cristallino trasparente, viene assorbita dalla retina (o riflessa come red reflex con flash). Con cataratta, il cristallino opacizzato riflette/diffonde la luce, producendo riflesso biancastro o disomogeneo.

Misurabile come **HSV `V` mean elevato** + **varianza alta** nella regione pupillare.

### Limitazioni note

- Forte dipendenza dall'angolazione del flash
- Falsi positivi da artefatti fotografici (flash troppo vicino all'asse ottico)
- Differenziazione cataratta vs altre cause di leucocoria richiede expertise clinica

---

## Letture di contorno

- **Diabetic retinopathy via deep learning**: Gulshan V. et al., *JAMA 2016* — proof of principle che CNN su foto retiniche raggiungono accuratezza oftalmologica. Riferimento per la roadmap di fase 2.
- **Color calibration su smartphone**: studi su ColorChecker e calibrazione automatica via deep learning per ridurre la variabilità di illuminazione.
- **Privacy biometric eye imaging**: WP29 / EDPB guidelines on biometric data, fondamentali per la DPIA di fase 1.

---

## Onestà intellettuale

Le formule attualmente implementate in `index.html` sono **euristiche semplificate** dei principi sopra citati, non riproduzioni fedeli degli algoritmi originali. Il loro scopo è dimostrare la fattibilità tecnica della pipeline, non ottenere prestazioni cliniche.

Le prestazioni clinicamente rilevanti richiederanno:

1. Dataset proprietario paired (immagine + ground truth ematochimico)
2. Training di modelli ML moderni (CNN compatte o transformer visivi)
3. Validation study indipendente su popolazione multietnica
4. Color standardization hardware-aware

Questi passaggi sono descritti in [`roadmap.md`](./roadmap.md).
