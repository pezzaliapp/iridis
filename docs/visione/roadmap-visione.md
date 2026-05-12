# Iridis Visione — Roadmap

> Lavori futuri identificati durante la sessione di costruzione del modulo (commit `0dfe688` → `454b925`).
> Decisioni **rimandate**, non decisioni **fatte**. Per quelle vedi `decisions.md`.
> Documento vivo: aggiornare quando si chiude o si rivede una voce.

---

## 1 · Feature mancanti riconosciute

### 1.1 Voce "Ricalibra" esplicita
Oggi per ricalibrare serve `clearAll()` completo, che perde anche tutte le sessioni
e le impostazioni di frequenza.

Servirebbe una voce "Ricalibra" che azzera **solo** la calibrazione, lasciando intatte
sessioni e frequenza. Probabilmente in una nuova schermata "Impostazioni" o accessibile
dal wordmark / da un'icona discreta.

### 1.2 Filtri data per PDF
Oggi il PDF copre tutte le sessioni in IDB. Dopo 1+ anno di uso quotidiano
(300+ sessioni) il report diventa pesante. Aggiungere:
- Preset "Ultimi 90 giorni" (intervallo tipico tra visite oculistiche)
- Preset "Ultimi 180 giorni"
- Range custom "da X a Y" con date picker semplice

### 1.3 Cancellazione singola sessione
Oggi solo `clearAll()` (wipe completo). Aggiungere "Cancella questa sessione"
in detail view con conferma. Utile se l'utente ha fatto un test accidentalmente o
ha segnato qualcosa per errore che vuole rimuovere dal report.

### 1.4 Sticky disclaimer band durante scroll
Oggi la banda disclaimer è inline e scrolla con il contenuto. Considerare sticky
in alto durante lo scroll.

**Cautele**: sticky su touch iPad può interferire con il momentum-scroll;
testare prima di committare. Se interferisce, mantenere inline.

---

## 2 · Validazione e iterazione utente

### 2.1 Validazione clinica con oculista partner
Identificare un oculista disposto a:
- Esaminare il PDF clinico e dare feedback su layout, copy, fonti citate
- Verificare adeguatezza dei copy patient-facing in onboarding
- Segnalare eventuali claim regolatori involontari
- Validare la sequenza di test (occhi, distanza, copertura)

Output atteso: 1-2 round di feedback con sub-fix mirati nei copy / nel PDF.

### 2.2 Rivalutare punto centrale di fissazione
Decisione attuale (`decisions.md §5.1`): 3 mm di diametro.

Test reale con utente target (87enne con AMD):
- Se la madre del committente lo trova **comodo da fissare**: confermare 3 mm
- Se **trova difficile localizzarlo**: prima provare contrasto migliore, poi valutare riduzione
- Se **lamenta che nasconde le linee centrali**: ridurre a 2 mm
- Se **non riferisce alcuna alterazione visiva pur avendola**: indagare se il punto la nasconde

### 2.3 iPhone usability
Oggi la griglia 10×10 cm eccede il viewport iPhone (~390 CSS px in portrait),
gestita con `.grid-stage { overflow-x: auto }`. UX subottimale: l'utente deve scorrere
orizzontalmente per vedere la griglia intera.

Opzioni da valutare:
- Forzare landscape su iPhone
- Mostrare un'avvertenza "questo modulo è ottimizzato per iPad"
- Griglia ridotta proporzionalmente al viewport (sacrifica fedeltà al 10 cm reale)
- Modalità "split test" su iPhone: prima occhio destro a piena larghezza, poi sinistro

### 2.4 Misurazione tempo di completamento
Dopo test reali, misurare quanto tempo l'utente target impiega per:
- Onboarding completo (prima visita)
- Calibrazione (prima volta)
- Singola sessione di test (entrambi gli occhi)
- Export PDF

Se uno qualsiasi di questi step richiede > 5 minuti, identificare il collo di bottiglia
e ottimizzare.

---

## 3 · Polish tecnico

### 3.1 Rimuovere `window.iv` esposto
Surface dev temporanea in `app.mjs`. Sufficiente per prototipo,
**da rimuovere alla stabilizzazione**. Vedi `decisions.md §2.8`.

Sostituzione possibile: script di debug separato caricato solo con `?debug=1` nell'URL,
oppure rimozione totale e debug via DevTools → Application → IndexedDB direttamente.

### 3.2 PWA installabile (Add to Home Screen)
Add to Home Screen su iOS per:
- Funzionamento offline (cache statica)
- Notifiche push native iOS (potrebbero sostituire l'export `.ics`, vedi B.6)
- App-like fullscreen, niente Safari chrome

Richiede:
- `manifest.json` con metadata
- Service Worker per cache offline
- Icone aggiuntive (192 / 512 px, possibilmente la favicon Amsler scalata)

**Cautele**: PWA notification iOS sono storicamente limitate. Verificare reliability
su iPadOS 17+ prima di sostituire `.ics`. Da considerare in fase 1+.

### 3.3 Accessibilità VoiceOver completa
Audit completo del modulo con VoiceOver attivo su iPad reale.
Oggi: `aria-label` su elementi critici (canvas, radio group, dialog).

Manca:
- Navigazione completa solo-screen-reader
- Role landmarks su tutte le sezioni
- Eventuale sequenza alternativa text-only del test per utenti con visus residuo molto basso
- Verifica reading order corretto su lista cronologia e card

### 3.4 Embed Unicode font in jsPDF (opzionale)
Se in futuro fosse importante avere icone nel PDF di monitoraggio (es. ✓ / ⚠),
considerare l'embed di un font Unicode (Roboto, DejaVu Sans) come blob base64.

Costo: ~150 KB aggiuntivi nel modulo. `decisions.md §5.5` spiega perché oggi
abbiamo scelto testo-only.

---

## 4 · Decisioni di prodotto da rivisitare

### 4.1 `BYDAY` del `.ics` personalizzato
Oggi hardcoded `MO,TH` (2/sett) e `MO,WE,FR` (3/sett) — vedi `decisions.md §5.7`.

Permettere all'utente di scegliere quali giorni della settimana per i preset
personalizzati. UI candidata: chip selezionabili (Lun Mar Mer Gio Ven Sab Dom)
nell'onboarding (sotto la selezione "Personalizzata") o nelle impostazioni future.
Refactor minore in `ics.mjs`.

### 4.2 Orario default `.ics`
Oggi 09:00 fisso (`decisions.md §5.8`). Se telemetria futura mostrasse che gli utenti
modificano sistematicamente l'orario dopo l'import in Calendar, valutare se chiedere
l'orario al primo export.

Cautela UX: l'utente target è 80+ anni. Date/time picker HTML può essere ostico.

### 4.3 Soglie sommario PDF
Oggi `total ≥ 5 sessioni AND daysCovered ≥ 14 giorni` (`decisions.md §5.6`).

Se la pratica clinica AAO / RCOphth aggiorna le sue raccomandazioni di monitoraggio
(es. nuova guideline che richiede meno giorni per valutare aderenza), riallineare.

### 4.4 Punto centrale griglia
Vedi §2.2 sopra. Decisione attuale 3 mm può cambiare dopo test reale.

---

## 5 · Aree fuori scope POC ma rilevanti

### 5.1 Multi-utente sullo stesso device
Oggi: 1 IDB = 1 utente. Se più persone in famiglia condividono lo stesso iPad,
i dati si mescolano.

Soluzioni possibili:
- PIN o passphrase per profilo (semplice, no backend)
- Profili separati con switcher
- Sync con cloud (implica backend → MDR scoping)

Da non fare prima di sapere se il caso d'uso è reale.

### 5.2 Internazionalizzazione (i18n)
Oggi italiano-first, no altre lingue. Se in futuro il modulo si estende oltre Italia:
inglese, francese, spagnolo.

Costruire un livello i18n minimal (file JSON di stringhe + funzione `t(key)`).

**Attenzione**: tradurre i copy clinici richiede validazione con specialisti madrelingua.
Una traduzione automatica di un disclaimer regolatorio è rischio legale.

### 5.3 Validazione clinica formale e percorso MDR (fase 1+)
Vedi `research.md §5.5 "Opzione B — Percorso MDR"`.

Decisione concorde di sessione: **NON ora**. Da rivalutare se:
- Ci sono partner oculistici disposti a integrare
- C'è un dataset di validazione (≥100 pazienti reali, ground truth via OCT)
- C'è budget e tempo per il percorso (12-24 mesi tipici per Classe IIa)

Se si decide di andare in MDR: ritornare su `research.md §5.5` per la lista delle feature
che cambiano qualifica e ricostruire il piano.
