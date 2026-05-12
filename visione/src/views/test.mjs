import { loadCalibration } from '../calibration.mjs';
import { renderAmslerGrid, renderAnnotations } from '../grid.mjs';
import { store, APP_VERSION } from '../store.mjs';

let calibration = null;
let strokes = { right: [], left: [] };
let canvasDataUrls = { right: null, left: null };

export async function renderTest(container) {
  calibration = await loadCalibration();
  if (!calibration) {
    location.hash = '#/calibrazione';
    return;
  }

  strokes = { right: [], left: [] };
  canvasDataUrls = { right: null, left: null };

  renderPretest(container, 'right');
}

function renderPretest(container, eye) {
  const eyeIt = eye === 'right' ? 'destro' : 'sinistro';
  const otherEyeIt = eye === 'right' ? 'sinistro' : 'destro';

  container.innerHTML = `
    <h1>Test occhio ${eyeIt}</h1>
    <ol>
      <li>Copri il tuo occhio ${otherEyeIt} con la mano.</li>
      <li>Tieni l'iPad alla normale distanza di lettura, fra 30 e 40 cm.</li>
      <li>Se usi occhiali da lettura, indossali.</li>
      <li>Fissa il punto al centro della griglia con l'occhio ${eyeIt}.</li>
    </ol>
    <p>Quando vedi qualcosa di diverso dalla normale griglia — linee ondulate, sbiadite, scure o mancanti — tocca quella zona sullo schermo per segnarla.</p>
    <button type="button" class="cta" id="start-btn">Inizio test occhio ${eyeIt}</button>
  `;

  container.querySelector('#start-btn').addEventListener('click', () => {
    renderTestStage(container, eye);
  });
}

function renderTestStage(container, eye) {
  const eyeIt = eye === 'right' ? 'destro' : 'sinistro';
  const isLast = eye === 'left';
  const ctaLabel = isLast ? 'Fine test' : "Fatto, passa all'occhio sinistro";

  container.innerHTML = `
    <h2 class="eye-label">Occhio ${eyeIt}</h2>
    <div class="grid-stage">
      <canvas id="amsler-grid"></canvas>
    </div>
    <div class="test-controls">
      <button type="button" class="secondary-btn" id="undo-btn" disabled>Annulla ultimo</button>
      <button type="button" class="cta" id="next-btn">${ctaLabel}</button>
    </div>
  `;

  const canvas = container.querySelector('#amsler-grid');
  const undoBtn = container.querySelector('#undo-btn');
  const nextBtn = container.querySelector('#next-btn');

  let currentStroke = null;

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function redraw() {
    renderAmslerGrid(canvas, calibration.pixelsPerMm);
    renderAnnotations(canvas, calibration.pixelsPerMm, strokes[eye], currentStroke);
  }

  function updateUndoBtn() {
    undoBtn.disabled = strokes[eye].length === 0;
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    currentStroke = [pointerPos(e)];
    redraw();
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!currentStroke) return;
    currentStroke.push(pointerPos(e));
    redraw();
  });

  function commit() {
    if (currentStroke && currentStroke.length > 0) {
      strokes[eye].push(currentStroke);
    }
    currentStroke = null;
    updateUndoBtn();
    redraw();
  }

  canvas.addEventListener('pointerup', commit);
  canvas.addEventListener('pointercancel', commit);

  undoBtn.addEventListener('click', () => {
    strokes[eye].pop();
    updateUndoBtn();
    redraw();
  });

  nextBtn.addEventListener('click', () => {
    canvasDataUrls[eye] = canvas.toDataURL('image/png');
    if (isLast) {
      saveAndAdvance(container);
    } else {
      renderPretest(container, 'left');
    }
  });

  redraw();
  updateUndoBtn();
}

async function saveAndAdvance(container) {
  const handle = await store.open();
  const frequency = await handle.getFrequency();

  const record = {
    timestamp: new Date().toISOString(),
    rightEye: canvasDataUrls.right,
    leftEye: canvasDataUrls.left,
    rightEyeMarkCount: strokes.right.length,
    leftEyeMarkCount: strokes.left.length,
    pixelsPerMm: calibration.pixelsPerMm,
    schemaVersion: 1,
    frequencyAtTime: frequency ?? null,
    appVersion: APP_VERSION
  };

  await handle.addSession(record);
  renderDone(container);
}

function renderDone(container) {
  container.innerHTML = `
    <h1>Sessione registrata</h1>
    <p>Hai completato il test per entrambi gli occhi di oggi. Le annotazioni sono salvate sul tuo dispositivo.</p>
    <p>Potrai esportarle in PDF e portarle al tuo oculista alla prossima visita.</p>
    <button type="button" class="cta" id="history-btn">Vai alla cronologia</button>
  `;

  container.querySelector('#history-btn').addEventListener('click', () => {
    location.hash = '#/cronologia';
  });
}
