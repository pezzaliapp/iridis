import { renderOnboarding } from './views/onboarding.mjs';
import { renderCalibration } from './views/calibration.mjs';
import { renderTest } from './views/test.mjs';
import { renderHistory, renderHistoryDetail } from './views/history.mjs';
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

  if (hash === '#/') {
    await renderOnboarding(root);
  } else if (hash === '#/calibrazione') {
    await renderCalibration(root);
  } else if (hash === '#/test') {
    await renderTest(root);
  } else if (hash === '#/cronologia') {
    await renderHistory(root);
  } else if (hash.startsWith('#/cronologia/')) {
    const id = Number(hash.slice('#/cronologia/'.length));
    if (Number.isInteger(id) && id > 0) {
      await renderHistoryDetail(root, id);
    } else {
      placeholder('sconosciuta');
    }
  } else {
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
