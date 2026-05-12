import { renderOnboarding } from './views/onboarding.mjs';
import { renderCalibration } from './views/calibration.mjs';
import { renderTest } from './views/test.mjs';
import { store } from './store.mjs';

// Esposto per ispezione manuale da DevTools Console (prototipo).
// Vedi docs/visione/decisions.md — rimosso a stabilizzazione modulo.
window.iv = store;

const root = document.getElementById('root');

function placeholder(name) {
  root.innerHTML = `<h1>Iridis Visione</h1><p>Schermata "${name}" — disponibile in un commit successivo.</p>`;
}

async function render() {
  const hash = location.hash || '#/';
  switch (hash) {
    case '#/':
      await renderOnboarding(root);
      break;
    case '#/calibrazione':
      await renderCalibration(root);
      break;
    case '#/test':
      await renderTest(root);
      break;
    case '#/cronologia':
      root.innerHTML = `<p class="lead">Cronologia in arrivo — la sessione di oggi è già stata salvata.</p>`;
      break;
    default:
      placeholder('sconosciuta');
  }
}

function handleRender() {
  render().catch(err => console.error('[Iridis Visione] errore di render', err));
}

if (!root) {
  console.error('[Iridis Visione] #root mancante in index.html');
} else {
  store.open().then(() => {
    console.log('[Iridis Visione] ready');
    window.addEventListener('hashchange', handleRender);
    handleRender();
  }).catch(err => {
    console.error('[Iridis Visione] init store fallito', err);
  });
}
