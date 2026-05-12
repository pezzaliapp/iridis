import {
  CARD_ASPECT,
  loadCalibration,
  saveCalibration,
  pixelsPerMmFromCardWidth
} from '../calibration.mjs';

const DEFAULT_WIDTH = 450;
const MIN_WIDTH = 250;
const MAX_WIDTH = 600;
const STEP = 2;

export async function renderCalibration(container) {
  if (await loadCalibration()) {
    location.hash = '#/test';
    return;
  }

  let width = DEFAULT_WIDTH;

  container.innerHTML = `
    <h1>Calibrazione</h1>
    <p class="lead">Per mostrarti la griglia di Amsler a dimensioni cliniche reali (10 × 10 cm), Iridis Visione deve sapere quanto è grande lo schermo del tuo dispositivo. Lo facciamo una sola volta, usando una carta in formato bancomat come riferimento.</p>

    <section class="section">
      <h2>Come fare</h2>
      <ol>
        <li>Prendi una carta in formato bancomat: ad esempio bancomat, tessera sanitaria, carta d'identità elettronica, o carta di credito. Hanno tutte la stessa dimensione standard.</li>
        <li>Appoggia la carta in orizzontale sopra il rettangolo qui sotto.</li>
        <li>Tocca i pulsanti "−" o "+" finché il bordo del rettangolo combacia con il bordo della carta.</li>
        <li>Tocca "Conferma" per salvare la calibrazione.</li>
      </ol>
    </section>

    <section class="section">
      <p class="calibration-hint">Allinea la carta con questo rettangolo.</p>
      <div class="calibration-stage">
        <div class="calibration-rect" id="calib-rect" role="img" aria-label="Rettangolo da allineare con la carta"></div>
      </div>
      <div class="calibration-controls" role="group" aria-label="Regolazione dimensione rettangolo">
        <button type="button" class="step-btn" id="step-minus" aria-label="Più stretto">−</button>
        <button type="button" class="step-btn" id="step-plus" aria-label="Più largo">+</button>
      </div>
    </section>

    <button type="button" class="cta" id="confirm-btn">Conferma</button>
  `;

  const rect = container.querySelector('#calib-rect');
  const minusBtn = container.querySelector('#step-minus');
  const plusBtn = container.querySelector('#step-plus');
  const confirmBtn = container.querySelector('#confirm-btn');

  function applyWidth() {
    rect.style.width = `${width}px`;
    rect.style.height = `${width / CARD_ASPECT}px`;
    minusBtn.disabled = width <= MIN_WIDTH;
    plusBtn.disabled = width >= MAX_WIDTH;
  }

  minusBtn.addEventListener('click', () => {
    width = Math.max(MIN_WIDTH, width - STEP);
    applyWidth();
  });

  plusBtn.addEventListener('click', () => {
    width = Math.min(MAX_WIDTH, width + STEP);
    applyWidth();
  });

  confirmBtn.addEventListener('click', async () => {
    await saveCalibration(pixelsPerMmFromCardWidth(width));
    location.hash = '#/test';
  });

  applyWidth();
}
