import { renderOnboarding } from './views/onboarding.mjs';
import { renderCalibration } from './views/calibration.mjs';
import { renderTest } from './views/test.mjs';

const root = document.getElementById('root');

function placeholder(name) {
  root.innerHTML = `<h1>Iridis Visione</h1><p>Schermata "${name}" — disponibile in un commit successivo.</p>`;
}

function render() {
  const hash = location.hash || '#/';
  switch (hash) {
    case '#/':
      renderOnboarding(root);
      break;
    case '#/calibrazione':
      renderCalibration(root);
      break;
    case '#/test':
      renderTest(root);
      break;
    case '#/cronologia':
      placeholder('cronologia');
      break;
    default:
      placeholder('sconosciuta');
  }
}

if (!root) {
  console.error('[Iridis Visione] #root mancante in index.html');
} else {
  console.log('[Iridis Visione] ready');
  window.addEventListener('hashchange', render);
  render();
}
