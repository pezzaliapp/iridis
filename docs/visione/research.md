# Ricerca preliminare — modulo Iridis Visione (AMD home monitoring)

> Documento di ricerca, non specifica di prodotto. Ultimo aggiornamento: 2026-05-12.
>
> **Iridis Visione non è — e in questa fase non vuole essere — un dispositivo medico.**
> Vedi §5 per il posizionamento regolatorio proposto.

---

## 0. TL;DR

1. **La griglia di Amsler è uno strumento universalmente diffuso e universalmente
   riconosciuto come poco sensibile.** Una meta-analisi 2023 (JAMA Ophthalmology)
   le attribuisce ~67% di sensibilità contro occhi sani e ~71% vs occhi con dry AMD,
   con specificità che crolla al 63% nel secondo caso. Le linee guida AAO e RCOphth
   raccomandano comunque l'uso domiciliare quotidiano, perché in assenza di alternative
   validate gratuite e accessibili rimane *meglio di niente* tra una visita e l'altra.

2. **Esiste un ecosistema consolidato di app/dispositivi *certificati* per AMD home
   monitoring** — tutti su prescrizione, tutti B2B (medico → paziente), nessuno
   localizzato in italiano:
   - **Alleye** (CE 2017, FDA 510(k)) — hyperacuity di allineamento
   - **OdySight** (CE, prescription-only) — visual acuity + Amsler digitale + symptom tracking
   - **ForeseeHome** (FDA 510(k) 2009) — hardware dedicato, preferential hyperacuity perimetry
   - **myVisionTrack** (FDA cleared) — shape-discrimination hyperacuity
   - **SCANLY Home OCT** (FDA De Novo 2024) — OCT domiciliare self-operated, breakthrough device

3. **Spazio per Iridis Visione**: c'è un buco riconoscibile nella fascia "strumento
   educativo gratuito, in italiano, accessibile a 87 anni, senza prescrizione, che
   il paziente porta in visita come traccia longitudinale". Per restare in questa
   fascia il modulo **deve** rinunciare a (a) claim diagnostici, (b) score
   numerici presentati come clinici, (c) notifiche automatiche al medico. Vedi §5.5
   per la lista esplicita delle frasi/feature da evitare.

---

## 1. Contesto clinico

### 1.1 Cos'è la maculopatia (AMD) e perché serve self-monitoring

La degenerazione maculare legata all'età (AMD, *age-related macular degeneration*)
colpisce la macula, la porzione centrale della retina responsabile della visione
distinta. Esistono due forme: una **secca** (atrofica, evoluzione lenta) e una
**umida o essudativa** (con neovascolarizzazione coroideale — CNV — ed evoluzione
potenzialmente rapida). La conversione dalla forma secca a quella umida è
l'evento clinicamente rilevante: una diagnosi precoce della componente umida
consente terapie intravitreali (anti-VEGF) che possono preservare visione, mentre
un ritardo di settimane peggiora l'outcome funzionale.

Il self-monitoring domiciliare nasce esattamente per coprire la finestra fra le
visite oculistiche programmate (tipicamente trimestrali / semestrali) e
intercettare il sintomo iniziale — quasi sempre **metamorfopsia**: le linee
rette appaiono ondulate.

### 1.2 La griglia di Amsler — principio e storia

La griglia, sviluppata dall'oftalmologo svizzero Marc Amsler negli anni '40, è
un reticolo quadrato (~10×10 cm) con linee equispaziate e un punto di fissazione
al centro. Tenuta a distanza di lettura, un occhio alla volta, con eventuali
occhiali da vicino, segnala alterazioni maculari quando le linee appaiono
**ondulate, distorte, sbiadite, scure o mancanti**.

La sua diffusione si spiega con tre fattori: è gratuita (un foglio stampato),
non richiede competenza tecnica, è interpretabile dal paziente in pochi
secondi. Lo stesso AAO la inserisce nei propri materiali patient-facing
(vedi §3.1).

### 1.3 Cosa il self-monitoring può e non può fare

**Può**: aumentare la probabilità che il paziente noti un cambiamento prima
del prossimo controllo, dargli un linguaggio per descriverlo all'oculista,
mantenere ingaggio con il proprio percorso di cura.

**Non può**: sostituire una visita, dare una "risposta" (OK/non OK),
diagnosticare CNV, distinguere fra AMD attiva e altre cause di metamorfopsia
(es. membrana epiretinica), né — soprattutto con Amsler classico — garantire
sensibilità sufficiente per non perdere una conversione (vedi §4).

---

## 2. Review delle app/dispositivi esistenti

### Tabella sintetica

| Prodotto | Tecnologia | Status regolatorio | Modello | Lingue | Italiano | Note |
|---|---|---|---|---|---|---|
| **Alleye** | Hyperacuity di allineamento | CE 2017 + FDA 510(k) Class II | Prescription, B2B | non documentato pubblicamente | non documentato | Pricing/lingue non pubblici sulla support page; serve contatto vendor |
| **OdySight** | Visual acuity + Amsler digitale + symptom tracking, gamification | CE marked, prescription-only | Prescription, B2B | EN, FR, ES, NL, DE | **no** | Gamification (puzzle) per adherence |
| **ForeseeHome** | Preferential Hyperacuity Perimetry (PHP) | FDA 510(k) 2009 | Hardware dedicato, prescription, Medicare reimbursable | EN | no | Non è app — è dispositivo fisico domiciliare |
| **myVisionTrack** | Shape-Discrimination Hyperacuity (SDH) | FDA cleared | Prescription | EN | no | App + portal clinico HIPAA |
| **SCANLY Home OCT** | OCT spectral-domain self-operated + AI (Notal OCT Analyzer) | FDA De Novo 2024 (breakthrough) | Hardware, prescription | EN | no | Pivotal trial: 97% pazienti acquisiscono immagini con successo |
| **KeepSight** | Reminder system per visite oculistiche (diabete) | n/a — non è dispositivo | Programma nazionale free, Australia | EN | no | **Non è self-test** — vedi §2.6 |
| **amslerapp.com & sim.** | Amsler digitale "consumer" | Non regolamentati | Free, App Store/Play | varie | spesso sì | "High false negative rate" (Retina Today) |

### 2.1 Alleye (Oculocare medical, CH)

Cosa fa: implementa un **alignment hyperacuity task** — il paziente deve
allineare punti su una linea, sfruttando la *Vernier acuity* (precisione di
ordine sub-pixel del sistema visivo, intatta o alterata in base allo stato
maculare). Non è una griglia di Amsler digitalizzata: è un test psicofisico
diverso, pensato per essere più sensibile dell'Amsler.

Status: **CE mark Europa 2017**, **FDA 510(k) clearance** (Class II) annunciata
nel 2019. Distribuito da **Roche/Navify** nel catalogo *digital solutions*.

Evidenze: Faes et al. 2019 (Eye, Nature) e successivi studi di adherence
hanno mostrato concordanza con valutazioni cliniche standard.

Modello: **prescription-only**, paziente accede via codice fornito dall'oculista.

**Gap informativi (flagged)**:
- Pricing al paziente / al medico / sponsor industriale: non pubblicato sulla
  pagina di supporto; canale B2B con quotazioni custom.
- Lingue supportate: non elencate pubblicamente sul sito istituzionale.
- Accessibilità anziani (target touch, voice-over, contrasto): non documentata.

Fonti: [Oculocare press release FDA 510(k)](https://www.prnewswire.com/news-releases/oculocares-alleye-receives-fda-510k-clearance-for-monitoring-eyesight-in-amd-687653341.html),
[Eye/Nature 2019 — Faes et al.](https://www.nature.com/articles/s41433-019-0455-6),
[AccessGUDID device record](https://accessgudid.nlm.nih.gov/devices/EOMA32120),
[Navify marketplace listing](https://navify.roche.com/marketplace/products/alleyeone).

### 2.2 OdySight (Tilak Healthcare, FR)

Cosa fa: app medica **prescription-only** con tre componenti integrati:
**near visual acuity test**, **griglia di Amsler digitale** (su cui il paziente
disegna distorsioni o scotomi con il dito), **symptom tracking** per
metamorfopsie e scotomi. Tutto incapsulato in un **video-puzzle game**: il
paziente sblocca livelli di gioco completando i test, meccanismo esplicito di
*adherence*.

Status: **CE marked** (classe non dichiarata sulla home page; presumibilmente
IIa per Rule 11 visto il claim di monitoraggio di malattia cronica, da verificare).
Test di concordanza con ETDRS: differenza media 0.33 lettere, l'82% delle misure
entro 9 lettere dal gold standard.

Lingue: **EN, FR, ES, NL, DE** — **italiano non disponibile** al 2026-05.

Devices: iOS + Android. Distribuzione tramite codice di prescrizione (SMS/email).

Limiti per anziani: la gamification è efficace su pazienti relativamente
giovani (DME, diabetic retinopathy), meno scontata su 80+ con AMD. La necessità
di codici di attivazione via email/SMS è un attrito non trascurabile.

Fonti: [OdySight site](https://www.odysight.fr/en/),
[Healio 2024 — visual acuity reliability](https://www.healio.com/news/optometry/20240124/odysight-mobile-app-reliably-measures-visual-acuity-in-retina-patients-at-home),
[Ophthalmology Times — TIL002 trial](https://www.ophthalmologytimes.com/view/tilak-healthcare-announces-positive-results-from-til002-clinical-trial-evaluating-odysight-mobile-app),
[Real-life study (ResearchGate)](https://www.researchgate.net/publication/351755759_Home_vision_monitoring_in_patients_with_maculopathy_Real-life_study_of_the_OdySight_application).

### 2.3 ForeseeHome (Notal Vision, US)

Cosa fa: **dispositivo hardware dedicato** (non app) che presenta stimoli di
*preferential hyperacuity perimetry* nei 14° centrali del campo visivo. Il
paziente usa un puntatore per indicare le distorsioni percepite. I dati sono
trasmessi a un *monitoring center* che alerta il medico in caso di cambiamento
significativo.

Status: **FDA 510(k) clearance dicembre 2009** — primo dispositivo home AMD
approvato. Rimborsato da Medicare negli Stati Uniti.

Evidenze: lo studio **AREDS2-HOME** (RCT NIH) ha dimostrato che il rilevamento
precoce della conversione a wet AMD via ForeseeHome correla con outcome visivi
migliori. In real-world data, conversione rilevata a visus ≥ 20/40 nell'81%
dei pazienti.

Limiti: richiede stabilità di fissazione e visus ≥ 20/60. Costo dispositivo +
service fee. Disponibilità geografica limitata (US-centric).

Fonti: [Notal Vision ForeseeHome](https://notalvision.com/services/foreseehome),
[Retina Today 2011](https://retinatoday.com/articles/2011-jan/monitoring-amd-with-the-foreseehome),
[AAO EyeNet — Catching CNV Early](https://www.aao.org/eyenet/article/catching-cnv-early-with-at-home-monitoring),
[PMC — Home monitoring utility for neovascularization](https://pmc.ncbi.nlm.nih.gov/articles/PMC7428765/).

### 2.4 myVisionTrack (Vital Art & Science → Genentech, US)

Cosa fa: test di **shape-discrimination hyperacuity** (SDH) su smartphone.
Il paziente identifica fra tre forme quella che differisce dalle altre, su
soglia psicofisica adattiva. Test ~90 secondi per occhio. Risultati inviati a
portale HIPAA per il medico, con alert automatico in caso di deterioramento.

Status: **FDA 510(k) cleared** (2015 — K143211), prescription-only.

Modello: B2B, il medico abilita il paziente. Vital Art and Science è stata
acquisita / partnered con Genentech (Roche US).

Limiti per il nostro caso: paradigm SDH richiede comprensione di un task
psicofisico non banale ("trova la diversa"); 87 anni con AMD evoluta possono
fare fatica.

Fonti: [FDA 510(k) K143211 summary](https://www.accessdata.fda.gov/cdrh_docs/pdf14/K143211.pdf),
[Retina Today 2017](https://retinatoday.com/articles/2017-may-june/putting-vision-monitoring-in-the-hands-of-patients-with-amd),
[Retina Today 2015 — system description](https://retinatoday.com/articles/2015-july-aug/a-new-self-testing-system-for-patients-with-amd-or-dme).

### 2.5 SCANLY® Home OCT (Notal Vision, US) — novità 2024

Cosa fa: **OCT spectral-domain auto-operato a domicilio**. Acquisisce
volumi 10×10° centrati sulla fissazione in <1 minuto/occhio. L'algoritmo AI
(Notal OCT Analyzer, NOA) segmenta e quantifica gli **spazi ipo-riflettenti
(HRS)**, biomarker di attività neovascolare in wet AMD.

Status: **FDA De Novo authorization maggio 2024**, designato **Breakthrough
Device**. Primo OCT domiciliare con autorizzazione regolatoria.

Performance: in due trial pivotali (>500 pazienti), il 97% degli utenti ha
acquisito immagini con successo, aderenza media 5.9 scan/settimana. Alta
concordanza con OCT clinica per presenza e quantificazione di fluido (2025,
Ophthalmology Science).

Perché è rilevante per Iridis Visione: **alza l'asticella**. Esiste ora uno
strumento domiciliare con evidenze cliniche solide, non confrontabile con
qualunque approccio fototografico o psicofisico. Non è un competitor di Iridis
Visione (target di paziente diverso, costo diverso, prescrizione), ma definisce
il top dello *standard of care* domiciliare e impone onestà comunicativa: un
Amsler digitale non promette mai ciò che promette un OCT.

Fonti: [FDA De Novo press release Notal](https://notalvision.com/assets/press-releases/May-16-2024-FDA-Grants-AI-Powered-Notal-Vision-Home-OCT-22SCANLY22-De-Novo-Marketing-Authorization.pdf),
[FDA DEN230043 review](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN230043.pdf),
[Optometry Times](https://www.optometrytimes.com/view/patient-self-operated-oct-device-receives-fda-de-novo-authorization),
[Pivotal study Ophthalmology Science 2025](https://glance.eyesoneyecare.com/stories/2025-07-16/pivotal-study-validates-scanly-home-oct-device-for-namd-management/).

### 2.6 KeepSight (Diabetes Australia) — perché lo cito comunque

KeepSight **non è un self-test** ed era un'inclusione un po' fuori-bersaglio
nel brief originale. Lo cito perché chiarisce una distinzione utile:

- **Self-monitoring tools** (Alleye, OdySight, mVT, SCANLY): il paziente
  produce un dato funzionale o anatomico.
- **Adherence tools** (KeepSight): il sistema produce promemoria per
  garantire che il paziente rispetti il calendario di visite.

KeepSight è un programma di reminder via SMS/email gestito da Diabetes
Australia, partnership pubblico-privato (Specsavers + Bayer + gov). Oltre
600.000 iscritti, riduce del 90% il rischio di cecità nei pazienti diabetici
aderenti. Non richiede classificazione MD perché non emette dati clinici.

**Implicazione per Iridis Visione**: una *feature reminder* è probabilmente
il single most useful feature che possiamo dare al primo utente
(*"oggi tocca al test, occhio sinistro per primo"*), e ha rischio regolatorio
zero. Da considerare in fase di design.

Fonti: [KeepSight site](https://www.keepsight.org.au/),
[Diabetes Australia — 400k milestone](https://www.diabetesaustralia.com.au/mediarelease/keepsight-program-400000-participants/),
[Vision 2020 Australia](https://www.vision2020australia.org.au/our-work/keepsight/).

### 2.7 La fascia "consumer" non regolamentata

Cercando "Amsler grid" su App Store / Play Store si trovano decine di app
gratuite o freemium che digitalizzano la griglia. Quasi tutte si autodescrivono
come *"educational"*, *"awareness"*, *"reminder"* — formule pensate
esplicitamente per **non** ricadere nella definizione di dispositivo medico
MDR (vedi §5).

Retina Today (2022) sintetizza: queste app sono *"straightforward and easily
understood by patients"* ma con *"high false negative rate"*. Non c'è
validazione clinica pubblica per nessuna di esse.

**Implicazione**: il posizionamento "strumento educativo non-MD" è già occupato
da molti player low-quality. Iridis Visione può differenziarsi su tre assi:
(a) UX onesta e disclaimer-first, (b) accessibilità anziani come prima
priorità, (c) report PDF longitudinale che il paziente porta in visita.

---

## 3. Linee guida ufficiali sull'uso della griglia di Amsler

### 3.1 American Academy of Ophthalmology (AAO)

L'AAO ha materiale **patient-facing pubblico** che indica protocollo e
frequenza in modo prescrittivo:

- **Frequenza**: *"once a day, every day"* — una volta al giorno, tutti i giorni.
- **Distanza**: *"hold the grid 12 to 15 inches away from your face"* (~30–38 cm).
- **Luce**: *"in good light"*.
- **Protocollo monoculare**: *"Cover one eye. Look directly at the center dot
  with your uncovered eye and keep your eye focused on it. While looking
  directly at the center dot, notice in your side vision if all grid lines
  look straight or if any lines or areas look blurry, wavy, dark or blank."*
  Ripetere con l'altro occhio.
- **Occhiali**: usare gli occhiali da lettura abituali, se previsti.
- **Quando contattare il medico**: *"areas of the grid that appear darker,
  wavy, blank or blurry, contact your ophthalmologist right away"* —
  urgenza immediata.

L'AAO **non documenta nei materiali patient-facing** i limiti di sensibilità del
test. Questi sono trattati separatamente in EyeNet (vedi §4).

Fonte: [AAO — All About the Amsler Grid](https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test).

### 3.2 Royal College of Ophthalmologists (RCOphth, UK)

Le **Commissioning Guidelines on AMD (giugno 2021)** del RCOphth, pubblicate
in executive summary su *Eye* (Nature, 2022), sono significativamente più
caute dell'AAO. Estratti rilevanti:

- *"Self-monitoring using Amsler chart is not a sensitive tool."* (statement
  esplicito).
- I dispositivi domiciliari di home monitoring *"are not validated in the NHS yet"*.
- *"OCT is the only sensitive monitoring tool for assessing reactivation"*.
- Ma — e qui è il bilanciamento chiave per noi —: *"in the absence of any
  home monitoring devices and while it is not as sensitive as OCT, its use
  should not be discouraged as this may have a negative impact on patient
  groups affected by the guidance, in particular for patients between
  monitoring visits."*

In sostanza: meglio Amsler che niente, fra le visite. E ai pazienti dimessi va
detto di *"consult their eye-care professional as soon as possible if their
vision changes"*.

Fonte: [RCOphth Commissioning Guidance executive summary — Eye/Nature 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9582190/),
[RCOphth resources page](https://www.rcophth.ac.uk/resources-listing/commissioning-guidance-age-related-macular-degeneration-services/).

### 3.3 Società Oftalmologica Italiana (SOI) e voci italiane

Il **vademecum SOI maculopatia** è **sorprendentemente povero** di indicazioni
operative. L'unico riferimento al test di Amsler è una citazione
descrittiva — *"facilmente diagnosticabile tramite il test di Amsler
(osservando un foglio di carta quadrettato con al centro un piccolo disco di
fissazione si nota una distorsione delle righe)"* — senza protocollo, senza
frequenza, senza istruzioni di follow-up. Non c'è disclaimer esplicito sul
fatto che l'autocontrollo non sostituisce la visita.

In assenza di un equivalente italiano del materiale AAO/RCOphth, i riferimenti
più operativi in lingua italiana sono:

- **Fondazione Italiana Macula ETS** — istruzioni passo-passo per Amsler,
  distanza 30–40 cm, un occhio alla volta, **una volta a settimana o secondo
  raccomandazione dell'oculista**.
- **Comitato Macula** — divulgazione simile, accento su metamorfopsie e
  scotomi come segni di allarme.

Nota di frequenza: il *de facto* italiano (settimanale) è **meno aggressivo**
dello standard AAO (quotidiano). Per Iridis Visione la default proposta è
**quotidiana** in linea con AAO/standard internazionale, ma con la possibilità
che il medico curante imposti una cadenza diversa.

Fonti: [SOI — Vademecum maculopatia](https://www.sedesoi.com/vademecum-maculopatia/),
[SOI — Linee Guida](https://www.sedesoi.com/linee-guida-soi/),
[Fondazione Italiana Macula — Griglia di Amsler](https://www.fondazionemacula.it/griglia-di-amsler/),
[Comitato Macula — Test di Amsler](https://comitatomacula.it/test-della-griglia-di-amsler-semplice-ma-utilissimo/).

### 3.4 Sintesi operativa per il modulo

Cosa diremo all'utente di Iridis Visione, in coerenza con AAO/RCOphth e
adattato all'italiano:

| Parametro | Raccomandazione operativa | Fonte |
|---|---|---|
| Frequenza | 1 volta al giorno (modificabile su indicazione medica) | AAO |
| Distanza | 30–40 cm dal display | AAO + Fond. Macula |
| Illuminazione | Ambiente ben illuminato, niente riflessi sullo schermo | AAO |
| Occhiali | Usare gli occhiali da lettura abituali | AAO |
| Modalità | Monoculare: prima un occhio, poi l'altro | AAO |
| Fissazione | Sguardo fisso sul punto centrale; valutare con visione periferica | AAO |
| Cosa segnalare | Linee ondulate, distorte, sbiadite, scure, mancanti | AAO + Fond. Macula |
| Cosa fare in caso di alterazione | Contattare l'oculista *appena possibile* | AAO + RCOphth |
| Cosa NON fa il test | Non sostituisce la visita, non diagnostica, non garantisce sensibilità | RCOphth + §4 |

---

## 4. Limiti scientifici della griglia di Amsler — onestà intellettuale

Costruire un modulo basato su Amsler senza essere espliciti sui suoi limiti
sarebbe disonesto. La letteratura recente è chiara.

### 4.1 Numeri concreti

La meta-analisi più citata è **Bjerager et al., *JAMA Ophthalmology*, aprile
2023**, ripresa esplicitamente dall'EyeNet AAO. Dati su 10 studi clinici
2003–2015, partecipanti 62–83 anni:

| Confronto | Sensibilità | Specificità |
|---|---|---|
| AMD vs occhi sani | **67%** | **99%** |
| Wet AMD vs dry AMD | **71%** | **63%** |

Citazione testuale dagli autori: *"the Amsler grid test should be used with
caution for detecting neovascular AMD"* e *"may also provide a false sense of
security in others"*.

Conclusione operativa Bjerager: i pazienti devono mantenere *"regular
ophthalmic exams, regardless of their self-assessment results"*.

Fonte: [AAO EyeNet — Diagnostic Accuracy of the Amsler Grid for AMD](https://www.aao.org/eyenet/article/diagnostic-accuracy-of-the-amsler-grid-for-amd),
[StatPearls — Amsler Grid](https://www.ncbi.nlm.nih.gov/books/NBK538141/).

### 4.2 Strumenti più sensibili (e perché Iridis non gioca in quella lega)

| Strumento | Tecnologia | Sensibilità relativa per CNV |
|---|---|---|
| Amsler classico | Reticolo, percezione di distorsione | Baseline (vedi 4.1) |
| Alleye | Hyperacuity di allineamento | Superiore ad Amsler (Faes 2019) |
| PHP / ForeseeHome | Hyperacuity perimetrica nei 14° centrali | Studi: >80% per nuovi CNV |
| SDH / myVisionTrack | Shape-discrimination hyperacuity | Superiore ad Amsler |
| **OCT clinica** | Imaging anatomico | **Gold standard** (RCOphth) |
| **SCANLY Home OCT** | OCT spectral-domain domiciliare + AI | Alta concordanza con OCT clinica (2025) |

Implicazione per il design: Iridis Visione **non deve presentarsi come
alternativa funzionale** a questi strumenti. Si propone su un asse diverso —
accessibilità, gratuità, lingua, semplicità per anziani — coscientemente
accettando di lavorare con uno strumento meno sensibile.

---

## 5. Aspetti regolatori — MDR 2017/745

### 5.1 Quando una griglia di Amsler digitale è dispositivo medico

Il riferimento normativo è il **Regolamento UE 2017/745 (MDR)** + il documento
guida **MDCG 2019-11** *(rev. 1, giugno 2025)* sulla qualifica e
classificazione del software (*Medical Device Software*, MDSW).

Il test di qualifica è all'art. 2(1) MDR: un software è dispositivo medico se
ha una *medical purpose*, cioè è destinato a:

> *"diagnosi, prevenzione, monitoraggio, predizione, prognosi, trattamento o
> attenuazione di malattia"*

**Una griglia di Amsler digitale ricade in MDR se** l'intended use dichiarato
include monitoraggio di AMD, allerta di progressione, supporto a decisioni
cliniche, o se l'app **comunica risultati al medico** in forma strutturata
finalizzata a gestione del paziente.

**Non ricade in MDR se** è chiaramente posizionata come strumento
**educativo / di awareness**, non emette giudizi clinici, non comunica
automaticamente al medico, e il copy lo rende trasparente all'utente.

Fonti: [MDCG 2019-11 (rev. 1, giugno 2025)](https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf),
[Update MDCG 2019-11 rev.1 — Commissione UE](https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en),
[Regolamento (UE) 2017/745 — EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0745).

### 5.2 Rule 11 e classe probabile

Se Iridis Visione fosse qualificato come MDSW, la **Rule 11** lo
classificherebbe per la natura dell'informazione che fornisce. Casi tipici:

- Informazione che guida decisioni terapeutiche su malattia che può causare
  morte / deterioramento irreversibile → **Classe IIb o III**.
- Monitoraggio di malattia cronica con possibile impatto sulla gestione →
  **Classe IIa** (probabile fascia per AMD home monitoring).
- Solo trasferimento, archiviazione, visualizzazione → **Classe I**.

OdySight e Alleye sembrano collocarsi in **Classe IIa**.

Fonti: [Johner Institute — Rule 11](https://blog.johner-institute.com/regulatory-affairs/mdr-rule-11/),
[Revolve Healthcare — Rule 11 SaMD](https://revolve.healthcare/blog/rule-11-mdr),
[NAMSA — MDSW classification](https://namsa.com/resources/blog/eu-mdr-and-ivdr-classifying-medical-device-software-mdsw/).

### 5.3 Casi noti — chi è MD e chi no

| Prodotto | MDR/CE | FDA | Note |
|---|---|---|---|
| Alleye | CE marked 2017 | 510(k) Class II | MD su entrambe le sponde |
| OdySight | CE marked, classe non dichiarata pubblicamente (presumibilmente IIa) | n/a | MD solo EU finora |
| ForeseeHome | n/a (US) | 510(k) Class II | MD US |
| myVisionTrack | n/a | 510(k) cleared | MD US |
| SCANLY Home OCT | n/a | De Novo 2024 + Breakthrough | MD US |
| amslerapp.com & app store consumer | **no** (autodichiarate educational) | **no** | Categoria grigia, alto false negative |

Per il nostro contesto: **il fatto di essere "solo Amsler digitale" non
implica automaticamente non-MD**. Quello che disqualifica come MD è
l'**intended use dichiarato** e il claim pubblicitario.

### 5.4 La zona grigia delle app consumer

Le decine di app gratuite di Amsler grid sugli store si proteggono con frasi
come *"This app is for educational purposes only and is not intended to
diagnose, treat, or prevent any disease"*. Funziona regolatoriamente perché
l'intended use dichiarato è educational; **non funziona clinicamente**
(false negative alti, nessuna validazione). È un equilibrio fragile: una
revisione MDR/MDCG può riqualificare un prodotto se l'uso reale diverge dal
claim.

### 5.5 Posizionamento proposto per Iridis Visione

**Raccomandazione esplicita per la fase POC**: posizionarsi come
**strumento educativo non-MD**, coerente con la postura di Iridis su
biomarker da fotografia (vedi `CLAUDE.md` §2 — *"Iridis NON è dispositivo
medico, NON produce diagnosi"*).

Per restare in questo perimetro:

**Da evitare (porta in MDR)**:
- ❌ Claim diagnostici o di monitoraggio di AMD: *"monitora la tua maculopatia",
  "rileva la progressione", "alert precoce"*.
- ❌ Score numerico unico presentato come clinico: *"oggi il tuo punteggio è 7.2"*.
- ❌ Verdetto OK/non OK: *"test superato / non superato"*.
- ❌ Notifica automatica al medico, integrazione con cartella clinica, dashboard
  medico B2B.
- ❌ Trend analysis presentato come *clinical decision support*.
- ❌ Confronto con norme cliniche di riferimento (cut-off di sensibilità).

**Da fare (resta non-MD)**:
- ✅ Posizionamento educativo: *"un promemoria visivo da discutere con il tuo
  oculista alla prossima visita"*.
- ✅ Disclaimer-first nel copy, in ogni schermata significativa, mai a piè di
  pagina nascosto.
- ✅ Output: un **registro longitudinale locale** + **esportazione PDF** che
  l'utente porta in visita. Niente trasmissione automatica.
- ✅ Reminder come feature primaria (vedi 2.6 — KeepSight pattern, rischio
  zero).
- ✅ Frase ricorrente, in ogni report: *"questo strumento non sostituisce la
  visita oculistica e non è un dispositivo medico"*.

**Opzione futura (fase 1+, fuori scope POC)**: percorso MDR formale (Classe IIa
probabile) con organismo notificato, validazione clinica, sistema qualità ISO
13485. Decisione da rivalutare se e quando: (a) ci sono partner oculistici
disposti a integrare, (b) c'è un dataset di validazione, (c) c'è budget e
tempo per il percorso (12–24 mesi tipici).

---

## 6. Implicazioni di design — take-away operativi

(Bullet sintetici, in attesa di un eventuale `design.md` separato.)

- **Calibrazione fisica**: la griglia deve apparire a dimensione nota in cm
  reali sul display. Su iPad/iPhone questo è fattibile leggendo modello e PPI;
  prevedere fallback "tieni una carta di credito sul lato per calibrare".
- **Distanza dello schermo**: 30–40 cm è la specifica AAO/Fond. Macula. In
  assenza di sensori (ARKit FaceTracking sarebbe over-engineering qui),
  istruzione testuale + esempio visivo.
- **Accessibilità anziani come prima priorità**: target touch ≥ 60×60 pt,
  contrasto AAA (≥ 7:1), font ≥ 22 pt nel copy, VoiceOver supportato,
  niente gesture esoteriche (solo tap), niente timer aggressivi.
- **Modalità di acquisizione**: il paziente segna sulla griglia digitale
  dove vede distorsioni (tap o trascinamento dito). Niente "score": solo
  un'immagine annotata salvata nel registro.
- **Reminder come feature primaria** (vedi §2.6): notifica giornaliera
  configurabile. Rischio regolatorio zero, alto valore percepito.
- **Output PDF longitudinale**: cronologia visiva delle griglie annotate +
  data + note utente, esportabile per visita oculistica. Mai trasmesso
  automaticamente al medico.
- **Disclaimer-first nel copy**: ogni schermo principale ha una riga
  visibile *"non sostituisce la visita oculistica"*. Onboarding accetta
  esplicitamente questo punto prima di abilitare il test.
- **Lingua**: italiano-first. OdySight non lo offre, è un differenziatore.
- **No telemetria, no analytics, no account**: in coerenza con `CLAUDE.md` §6,
  tutto resta sul device. Niente immagine dell'occhio in questo modulo
  (il modulo Visione non usa fotocamera).

---

## 7. Domande aperte / da approfondire

- **Validazione informale**: chiedere a un oculista di fiducia di rivedere
  il copy e il flusso prima del rilascio anche solo familiare.
- **Frequenza italiana vs internazionale**: tenere default quotidiano (AAO) o
  settimanale (Fond. Macula)? Probabilmente quotidiano con possibilità di
  ridurre.
- **Linee guida SOI 2024–2025**: verificare se sono uscite linee guida
  ufficiali aggiornate sulla maculopatia oltre al vademecum (l'elenco linee
  guida SOI andrebbe consultato manualmente).
- **Pricing/lingue Alleye**: gap informativo da chiudere se mai dovessimo
  fare un confronto competitivo dettagliato (oggi non è prioritario).
- **Calibrazione PPI iPad/iPhone**: identificare la libreria/approccio
  affidabile per misurare 1 cm reale sul display in JavaScript / SwiftUI /
  HTML (a seconda dello stack scelto per il modulo).

---

## Fonti — indice completo

### Apps e dispositivi

- [Oculocare press release — Alleye FDA 510(k)](https://www.prnewswire.com/news-releases/oculocares-alleye-receives-fda-510k-clearance-for-monitoring-eyesight-in-amd-687653341.html)
- [Faes et al., *Eye* 2019 — Alleye reliability](https://www.nature.com/articles/s41433-019-0455-6)
- [Alleye support page](https://alleye.io/support)
- [Navify marketplace — AlleyeOne](https://navify.roche.com/marketplace/products/alleyeone)
- [AccessGUDID — Alleye device record EOMA32120](https://accessgudid.nlm.nih.gov/devices/EOMA32120)
- [OdySight site](https://www.odysight.fr/en/)
- [Healio 2024 — OdySight visual acuity reliability](https://www.healio.com/news/optometry/20240124/odysight-mobile-app-reliably-measures-visual-acuity-in-retina-patients-at-home)
- [Ophthalmology Times — TIL002 trial OdySight](https://www.ophthalmologytimes.com/view/tilak-healthcare-announces-positive-results-from-til002-clinical-trial-evaluating-odysight-mobile-app)
- [Novartis — Home app helps patients with vision monitoring](https://www.novartis.com/us-en/stories/home-app-helps-patients-stay-engaged-and-adherent-vision-monitoring-remotely)
- [Notal Vision — ForeseeHome](https://notalvision.com/services/foreseehome)
- [Retina Today 2011 — ForeseeHome](https://retinatoday.com/articles/2011-jan/monitoring-amd-with-the-foreseehome)
- [AAO EyeNet — Catching CNV early with at-home monitoring](https://www.aao.org/eyenet/article/catching-cnv-early-with-at-home-monitoring)
- [PMC — Home monitoring of AMD: utility of ForeseeHome](https://pmc.ncbi.nlm.nih.gov/articles/PMC7428765/)
- [FDA 510(k) K143211 — myVisionTrack summary](https://www.accessdata.fda.gov/cdrh_docs/pdf14/K143211.pdf)
- [Retina Today 2017 — Putting vision monitoring in patient hands](https://retinatoday.com/articles/2017-may-june/putting-vision-monitoring-in-the-hands-of-patients-with-amd)
- [Retina Today 2015 — A new self-testing system](https://retinatoday.com/articles/2015-july-aug/a-new-self-testing-system-for-patients-with-amd-or-dme)
- [Retina Today 2022 — At-home monitoring tools today and tomorrow](https://retinatoday.com/articles/2022-jan-feb/at-home-monitoring-tools-for-today-and-tomorrow)
- [Notal Vision — SCANLY Home OCT De Novo press release (mag 2024)](https://notalvision.com/assets/press-releases/May-16-2024-FDA-Grants-AI-Powered-Notal-Vision-Home-OCT-22SCANLY22-De-Novo-Marketing-Authorization.pdf)
- [FDA DEN230043 — SCANLY review](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN230043.pdf)
- [Optometry Times — SCANLY De Novo authorization](https://www.optometrytimes.com/view/patient-self-operated-oct-device-receives-fda-de-novo-authorization)
- [Pivotal study SCANLY 2025](https://glance.eyesoneyecare.com/stories/2025-07-16/pivotal-study-validates-scanly-home-oct-device-for-namd-management/)
- [KeepSight](https://www.keepsight.org.au/)
- [Diabetes Australia — KeepSight 400k milestone](https://www.diabetesaustralia.com.au/mediarelease/keepsight-program-400000-participants/)

### Linee guida e letteratura clinica

- [AAO — All About the Amsler Grid](https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test)
- [AAO EyeNet — Diagnostic Accuracy of the Amsler Grid for AMD (Bjerager 2023)](https://www.aao.org/eyenet/article/diagnostic-accuracy-of-the-amsler-grid-for-amd)
- [RCOphth Commissioning Guidance AMD — executive summary (Eye/Nature 2022, PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9582190/)
- [RCOphth resources — AMD commissioning guidance landing](https://www.rcophth.ac.uk/resources-listing/commissioning-guidance-age-related-macular-degeneration-services/)
- [SOI — Vademecum maculopatia](https://www.sedesoi.com/vademecum-maculopatia/)
- [SOI — Linee Guida (indice)](https://www.sedesoi.com/linee-guida-soi/)
- [Fondazione Italiana Macula — Griglia di Amsler](https://www.fondazionemacula.it/griglia-di-amsler/)
- [Comitato Macula — Test di Amsler](https://comitatomacula.it/test-della-griglia-di-amsler-semplice-ma-utilissimo/)
- [StatPearls — Amsler Grid (NCBI Bookshelf)](https://www.ncbi.nlm.nih.gov/books/NBK538141/)
- [The Amsler Grid in Everyday Practice — primary care review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12912174/)

### Regolatorio

- [Regolamento (UE) 2017/745 MDR — EUR-Lex full text](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0745)
- [MDCG 2019-11 (rev. 1, giugno 2025) — PDF Commissione UE](https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf)
- [Commissione UE — Update MDCG 2019-11 rev.1 (giugno 2025)](https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en)
- [Emergo by UL — MDCG 2019-11 rev.1 clarifications](https://www.emergobyul.com/news/european-revision-primary-software-guidance-mdcg-2019-11-revision-1-small-changes-meaningful)
- [NAMSA — MDSW classification under MDR/IVDR](https://namsa.com/resources/blog/eu-mdr-and-ivdr-classifying-medical-device-software-mdsw/)
- [Johner Institute — MDR Rule 11 classification nightmare](https://blog.johner-institute.com/regulatory-affairs/mdr-rule-11/)
- [Revolve Healthcare — Rule 11 SaMD](https://revolve.healthcare/blog/rule-11-mdr)
- [Decomplix — MDSW under MDR and IVDR](https://decomplix.com/medical-software-mdr/)
