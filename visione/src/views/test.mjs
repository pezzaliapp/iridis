import { loadCalibration } from '../calibration.mjs';
import { renderAmslerGrid } from '../grid.mjs';

export async function renderTest(container) {
  const calibration = await loadCalibration();
  if (!calibration) {
    location.hash = '#/calibrazione';
    return;
  }

  container.innerHTML = `
    <p class="test-preamble">Anteprima della griglia di Amsler calibrata sul tuo schermo. Il test interattivo (segnare le alterazioni che vedi) verrà aggiunto nel prossimo passaggio.</p>
    <div class="grid-stage">
      <canvas id="amsler-grid"></canvas>
    </div>
  `;

  const canvas = container.querySelector('#amsler-grid');
  renderAmslerGrid(canvas, calibration.pixelsPerMm);
}
