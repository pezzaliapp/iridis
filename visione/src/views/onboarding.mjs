const FREQ_KEY = 'iridis-visione/frequency';

const CUSTOM_PRESETS = [
  { id: 'twice-weekly', label: '2 volte alla settimana' },
  { id: 'thrice-weekly', label: '3 volte alla settimana' },
  { id: 'every-2-days', label: 'Ogni 2 giorni' }
];

function loadFrequency() {
  try {
    const raw = localStorage.getItem(FREQ_KEY);
    if (!raw) return { mode: 'daily', preset: null };
    const parsed = JSON.parse(raw);
    if (parsed && ['daily', 'weekly', 'custom'].includes(parsed.mode)) {
      return { mode: parsed.mode, preset: parsed.preset ?? null };
    }
  } catch (_) {
    // entry corrotta: usiamo il default
  }
  return { mode: 'daily', preset: null };
}

function saveFrequency(state) {
  localStorage.setItem(FREQ_KEY, JSON.stringify(state));
}

export function renderOnboarding(container) {
  const state = loadFrequency();

  container.innerHTML = `
    <h1>Iridis Visione</h1>
    <p class="lead">Strumento di promemoria visivo per il test di Amsler. Non è un dispositivo medico, non sostituisce la visita oculistica.</p>

    <section class="section">
      <h2>Cos'è la griglia di Amsler</h2>
      <p>La griglia di Amsler è un reticolo quadrato con un punto al centro, in uso clinico dagli anni '40. Aiuta a notare a casa, fra una visita oculistica e l'altra, eventuali alterazioni della visione centrale: linee ondulate, sbiadite, scure o mancanti. Sono segnali che vale la pena riportare al tuo oculista alla prossima visita. Iridis Visione la digitalizza sullo schermo e ti permette di segnare ciò che vedi; le tue annotazioni restano sul tuo dispositivo.</p>
    </section>

    <section class="section">
      <h2>Cosa questo strumento NON fa</h2>
      <ul>
        <li>Non è un dispositivo medico.</li>
        <li>Non fa diagnosi.</li>
        <li>Non sostituisce la visita oculistica.</li>
        <li>Non rileva tutti i peggioramenti: secondo gli studi scientifici, in circa 3 casi su 10 una progressione può non comparire sulla griglia. Per questo il test è un aiuto, non un sostituto della visita. (Fonte: Bjerager et al., <em>JAMA Ophthalmology</em>, 2023)</li>
        <li>Non comunica nulla al tuo medico in automatico: sarai tu a portare il report alla prossima visita.</li>
      </ul>
    </section>

    <section class="section">
      <h2>Cosa non misuriamo</h2>
      <p>Il browser non ha accesso ai sensori che servirebbero. Quindi tocca a te:</p>
      <ul>
        <li><strong>Distanza dallo schermo</strong>: tieni l'iPad alla normale distanza di lettura, fra 30 e 40 cm.</li>
        <li><strong>Luce ambientale</strong>: usalo in un ambiente ben illuminato, senza riflessi diretti sullo schermo.</li>
        <li><strong>Luminosità del dispositivo</strong>: impostala su un livello confortevole per i tuoi occhi.</li>
      </ul>
    </section>

    <section class="section">
      <h2>Su cosa si basa</h2>
      <p>Iridis Visione segue le indicazioni delle principali società oftalmologiche e cita esplicitamente le fonti scientifiche che ne riconoscono limiti e utilità.</p>
      <ul>
        <li><a href="https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test" target="_blank" rel="noopener"><strong>American Academy of Ophthalmology — istruzioni patient-facing</strong></a> — uso quotidiano della griglia: distanza, luce, occhiali, cosa segnalare al medico.</li>
        <li><a href="https://www.aao.org/eyenet/article/diagnostic-accuracy-of-the-amsler-grid-for-amd" target="_blank" rel="noopener"><strong>Bjerager et al., <em>JAMA Ophthalmology</em>, 2023 — accuratezza diagnostica</strong></a> — meta-analisi sulla sensibilità e specificità del test (i numeri citati sopra).</li>
        <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9582190/" target="_blank" rel="noopener"><strong>Royal College of Ophthalmologists — <em>AMD commissioning guidance</em>, 2021</strong></a> — riconosce i limiti del test ma non ne scoraggia l'uso fra le visite oculistiche.</li>
        <li><a href="https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf" target="_blank" rel="noopener"><strong>MDCG 2019-11 — qualifica del software come dispositivo medico nell'UE</strong></a> — Iridis Visione non è qualificato come dispositivo medico ai sensi del Regolamento (UE) 2017/745.</li>
      </ul>
    </section>

    <section class="section">
      <h2 id="freq-heading">Quanto spesso vuoi essere avvisato di fare il test?</h2>
      <div class="frequency-group" role="radiogroup" aria-labelledby="freq-heading">
        <label class="frequency-option">
          <input type="radio" name="frequency" value="daily" ${state.mode === 'daily' ? 'checked' : ''}>
          <span class="frequency-option-label">
            <strong>Giornaliera</strong>
            <span class="frequency-option-note">consigliata dall'American Academy of Ophthalmology</span>
          </span>
        </label>
        <label class="frequency-option">
          <input type="radio" name="frequency" value="weekly" ${state.mode === 'weekly' ? 'checked' : ''}>
          <span class="frequency-option-label">
            <strong>Settimanale</strong>
            <span class="frequency-option-note">alternativa indicata dalla Fondazione Italiana Macula</span>
          </span>
        </label>
        <label class="frequency-option">
          <input type="radio" name="frequency" value="custom" ${state.mode === 'custom' ? 'checked' : ''}>
          <span class="frequency-option-label">
            <strong>Personalizzata</strong>
          </span>
        </label>
        <div class="frequency-presets ${state.mode === 'custom' ? 'is-visible' : ''}" role="radiogroup" aria-label="Preset frequenza personalizzata">
          ${CUSTOM_PRESETS.map(p => `
            <label class="frequency-option">
              <input type="radio" name="frequency-preset" value="${p.id}" ${state.preset === p.id ? 'checked' : ''}>
              <span class="frequency-option-label">${p.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <p class="frequency-note">Il tuo oculista può consigliarti una frequenza diversa. In quel caso, scegli "personalizzata" e impostala come ti ha indicato.</p>
    </section>

    <button type="button" class="cta" id="continue-btn">Continua</button>
  `;

  const ctaBtn = container.querySelector('#continue-btn');
  const presetsContainer = container.querySelector('.frequency-presets');

  function currentState() {
    const modeInput = container.querySelector('input[name="frequency"]:checked');
    const presetInput = container.querySelector('input[name="frequency-preset"]:checked');
    return {
      mode: modeInput ? modeInput.value : 'daily',
      preset: presetInput ? presetInput.value : null
    };
  }

  function updateUi() {
    const s = currentState();
    if (s.mode === 'custom') {
      presetsContainer.classList.add('is-visible');
      ctaBtn.disabled = s.preset === null;
    } else {
      presetsContainer.classList.remove('is-visible');
      ctaBtn.disabled = false;
    }
    saveFrequency(s);
  }

  container.querySelectorAll('input[name="frequency"], input[name="frequency-preset"]').forEach(input => {
    input.addEventListener('change', updateUi);
  });

  ctaBtn.addEventListener('click', () => {
    saveFrequency(currentState());
    location.hash = '#/calibrazione';
  });

  updateUi();
}
