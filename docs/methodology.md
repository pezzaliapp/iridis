# Metodologia algoritmica

Questo documento descrive ogni euristica implementata nel POC. Volutamente trasparente: niente scatole nere.

> ⚠️ Le formule sotto sono **euristiche dimostrative**, non modelli clinici validati.
> Vedi [`science.md`](./science.md) per i paper di riferimento.

---

## Pipeline generale

```
Immagine RGB ──► ROI selezionata dall'utente ──► Campionamento pixel
                                                       │
                                                       ▼
                                          Filtro outlier (L troppo alto/basso)
                                                       │
                                                       ▼
                                   Conversione spazio colore (Lab o HSV)
                                                       │
                                                       ▼
                                          Statistiche aggregate (mean, std)
                                                       │
                                                       ▼
                                          Mapping → score 0–100 + verdict
```

Ogni passaggio è puro (input → output deterministico). Nessuno stato condiviso. Testabile in isolamento.

---

## 1 · Conversione colore

### RGB → CIE Lab

Implementata in `rgbToLab(r, g, b)`. Catena:

1. **sRGB → linear RGB** (gamma decoding):
   - se canale > 0.04045: `((c + 0.055) / 1.055) ^ 2.4`
   - altrimenti: `c / 12.92`

2. **Linear RGB → XYZ** (matrice CIE standard, illuminante D65):
   ```
   X = 0.4124·R + 0.3576·G + 0.1805·B
   Y = 0.2126·R + 0.7152·G + 0.0722·B
   Z = 0.0193·R + 0.1192·G + 0.9505·B
   ```

3. **Normalizzazione su white point D65**: divisione per (0.95047, 1.00000, 1.08883)

4. **XYZ → Lab** (funzione `f(t)`):
   - se t > 0.008856: `t^(1/3)`
   - altrimenti: `7.787·t + 16/116`

5. **Componenti finali**:
   ```
   L* = 116·f(Y) - 16
   a* = 500·(f(X) - f(Y))
   b* = 200·(f(Y) - f(Z))
   ```

Range tipici: `L*` ∈ [0, 100], `a*` ∈ [-128, 127], `b*` ∈ [-128, 127].

### RGB → HSV

Standard. Hue in gradi [0, 360), saturation e value in [0, 1].

---

## 2 · Ittero — analisi sclerale

### Input
ROI rettangolare sulla sclera (parte bianca dell'occhio).

### Algoritmo

```javascript
function analyzeJaundice(roi) {
  pixels = samplePixels(roi)            // sub-sample 1/4 per performance
    .map(p => ({ ...p, lab: rgbToLab(p) }))
    .filter(p => 25 < p.lab.L < 92)     // esclude ciglia (scuro) e highlights (clipping)

  meanB = mean(pixels.lab.b)             // canale blu→giallo
  meanL = mean(pixels.lab.L)             // luminosità media (per QA)

  return {
    value: meanB,
    pct:   clip(meanB / 25 * 100),
    verdict:
      meanB < 5  ? "normale" :
      meanB < 12 ? "borderline" :
                   "alto"
  }
}
```

### Razionale delle soglie

- **`b* < 5`**: sclera tipicamente neutra in soggetto sano (lievemente bluastra in molti casi)
- **`5 ≤ b* < 12`**: zona ambigua, può essere illuminazione warm o lieve carotenemia
- **`b* ≥ 12`**: viraggio giallo evidente, compatibile con iperbilirubinemia clinicamente rilevante

> Le soglie sono **stime di letteratura, non calibrate su dataset proprietario**. In fase 1 saranno rimpiazzate da regressione su valori ematochimici.

### Robustezza

- ✅ Filtro outlier elimina ciglia e riflessi
- ⚠️ Sensibile a temperatura colore della sorgente luminosa (warm light → falsi positivi)
- ⚠️ Senza color calibration, valori assoluti non confrontabili tra dispositivi

---

## 3 · Anemia — analisi congiuntivale

### Input
ROI sulla congiuntiva palpebrale inferiore (richiede istruzione utente a esporre la palpebra).

### Algoritmo

```javascript
function analyzeAnemia(roi) {
  pixels = samplePixels(roi)
    .map(p => ({ ...p,
                 lab: rgbToLab(p),
                 hsv: rgbToHsv(p) }))
    .filter(p => 20 < p.lab.L < 92)

  meanA = mean(pixels.lab.a)             // rosso→verde
  meanS = mean(pixels.hsv.s)             // saturazione

  // Pallor score: lower a* + lower saturation = pallido
  // Congiuntiva sana ben perfusa: a*≈25, s≈0.5 → score ≈ 100
  // Congiuntiva pallida (anemia): a*≈5, s≈0.15 → score ≈ 17
  score = clip(meanA * 2.5 + meanS * 60, 0, 100)

  return {
    value: score,
    pct:   score,
    verdict:
      score < 35 ? "alto"       :  // pallor evidente
      score < 60 ? "borderline" :
                   "normale"        // ben perfusa
  }
}
```

### Razionale

Combinazione lineare di **`a*` Lab** (rosso assoluto) + **saturazione HSV** (intensità della componente cromatica). Mannino et al. 2018 dimostrano che entrambi correlano con emoglobina, ma in modo complementare: `a*` cattura l'hue, S cattura la "purezza" del colore.

### Robustezza

- ⚠️ Variabilità etnica del baseline congiuntivale non considerata
- ⚠️ Allergie / congiuntivite causano iperemia e falsi negativi
- ✅ Insensibile a piccole variazioni di esposizione (saturazione è invariante)

---

## 4 · Cataratta — analisi pupillare

### Input
ROI rettangolare sulla pupilla (cerchio nero centrale).

### Algoritmo

```javascript
function analyzeCataract(roi) {
  pixels = samplePixels(roi)
  vs = pixels.map(p => rgbToHsv(p).v)    // brightness (HSV V)

  meanV     = mean(vs)
  variance  = std(vs)

  // Pupilla sana: scura (meanV basso) e uniforme (variance bassa)
  // Cataratta: chiara + disomogenea
  opacity = clip(meanV * 70 + variance * 200, 0, 100)

  return {
    value: opacity,
    pct:   opacity,
    verdict:
      opacity < 20 ? "normale"   :
      opacity < 45 ? "borderline" :
                     "alto"
  }
}
```

### Razionale

Due segnali combinati:

1. **Luminosità media (`meanV`)**: pupilla otticamente nera in soggetto sano. Cataratta avanzata riflette luce ambientale.
2. **Varianza (`std`)**: cataratta nucleare o corticale è raramente uniforme — produce pattern eterogeneo.

### Robustezza

- ❌ **Forte dipendenza dall'illuminazione**. È il segnale più fragile del POC.
- ❌ Flash on-axis (smartphone) produce red reflex che maschera l'analisi
- ✅ In condizioni di illuminazione diffusa controllata, segnale pulito
- 🔧 In fase 1: standardizzazione protocollo cattura con flash off-axis e modello CNN dedicato

---

## 5 · Performance e scalabilità

### Costo computazionale

Per ROI di ~100×100 px (sub-sampled 1/4):
- ~2500 pixel processati
- 3 conversioni colore per pixel × 3 ROI = ~22'500 ops
- Tempo tipico desktop: < 5ms
- Tempo tipico mobile: < 20ms

### Bottleneck noti

Nessuno significativo al volume attuale. Se in futuro si processano pipeline batch su molte immagini, considerare:

- WebWorkers per parallelismo
- WASM per conversioni colore
- WebGL/GPU per analisi pixel-wise

---

## 6 · Cosa non c'è (e dovrà esserci in fase 1)

| Mancanza | Impatto | Soluzione fase 1 |
|---|---|---|
| Color calibration | Variabilità tra dispositivi | ColorChecker virtuale o auto-calibration ML |
| ROI automatica | Dipendenza da utente | Detezione anatomica via lightweight CNN |
| Quality control | Foto sfocate accettate | Laplacian variance + face landmark detection |
| Ground truth | Soglie da letteratura, non calibrate | Dataset proprietario con esami ematici paired |
| Multietnico | Bias caucasico nelle soglie | Stratified dataset + fairness audit |

Tutti questi punti sono in [`roadmap.md`](./roadmap.md).
