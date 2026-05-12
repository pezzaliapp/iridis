import { store } from '../store.mjs';
import { exportMonitoringReport } from '../pdf.mjs';
import { exportReminderIcs } from '../ics.mjs';

const DISCLAIMER = 'Questo strumento non sostituisce la visita oculistica e non è un dispositivo medico.';

const WEEKDAYS_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS_IT = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function formatItalianDate(isoString) {
  const d = new Date(isoString);
  const weekday = WEEKDAYS_IT[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_IT[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${weekday} ${day} ${month} ${year}, ${hh}:${mm}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function dangerZoneHtml() {
  return `
    <section class="danger-zone">
      <h2>Cancellazione dati</h2>
      <p>Puoi cancellare tutti i dati salvati sul tuo dispositivo (sessioni, calibrazione, impostazioni). L'operazione non è reversibile.</p>
      <button type="button" class="warn-btn" id="clear-btn">Cancella tutti i miei dati</button>
    </section>
    <dialog id="clear-dialog" class="confirm-dialog" aria-labelledby="clear-dialog-title">
      <h2 id="clear-dialog-title">Cancellare tutti i dati?</h2>
      <p>Questa azione rimuoverà definitivamente tutte le sessioni di test salvate sul tuo dispositivo, insieme alla calibrazione e alle impostazioni di frequenza.</p>
      <p>La prossima volta che userai l'app dovrai rifare onboarding e calibrazione.</p>
      <p>L'operazione non può essere annullata.</p>
      <div class="dialog-actions">
        <button type="button" class="secondary-btn" id="cancel-clear">Annulla</button>
        <button type="button" class="warn-btn" id="confirm-clear">Cancella tutto</button>
      </div>
    </dialog>
  `;
}

function wireClearHandlers(container) {
  const dialog = container.querySelector('#clear-dialog');
  const clearBtn = container.querySelector('#clear-btn');
  const cancelBtn = container.querySelector('#cancel-clear');
  const confirmBtn = container.querySelector('#confirm-clear');

  clearBtn.addEventListener('click', () => dialog.showModal());
  cancelBtn.addEventListener('click', () => dialog.close());

  confirmBtn.addEventListener('click', async () => {
    const originalLabel = confirmBtn.textContent;
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.textContent = 'Cancellazione in corso…';
    try {
      const handle = await store.open();
      await handle.clearAll();
      dialog.close();
      location.hash = '#/';
    } catch (err) {
      console.error('[Iridis Visione] clearAll fallito', err);
      confirmBtn.textContent = originalLabel;
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      window.alert('Cancellazione fallita. Riprova.');
    }
  });
}

function wireExportButton(btn, exportFn, label) {
  if (!btn) return;
  const originalLabel = btn.textContent;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Generazione in corso…';
    try {
      await exportFn();
    } catch (err) {
      console.error(`[Iridis Visione] export ${label} fallito`, err);
      window.alert(`Impossibile generare ${label}. Riprova o ricarica la pagina.`);
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

export async function renderHistory(container) {
  const handle = await store.open();
  const sessions = await handle.getSessions();

  if (sessions.length === 0) {
    container.innerHTML = `
      <h1>Cronologia</h1>
      <p class="disclaimer-band">${DISCLAIMER}</p>
      <p>Non hai ancora completato un test. La cronologia mostrerà qui le tue sessioni passate. Le potrai esportare in PDF da portare al tuo oculista.</p>
      <button type="button" class="cta" id="start-btn">Inizia un test</button>
      ${dangerZoneHtml()}
    `;
    container.querySelector('#start-btn').addEventListener('click', () => {
      location.hash = '#/test';
    });
    wireClearHandlers(container);
    return;
  }

  sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const cards = sessions.map(s => `
    <a class="session-card" href="#/cronologia/${s.id}">
      <span class="session-date">${escapeHtml(formatItalianDate(s.timestamp))}</span>
      <span class="session-thumbs">
        <img src="${s.rightEye}" alt="Griglia annotata occhio destro" class="session-thumb">
        <img src="${s.leftEye}" alt="Griglia annotata occhio sinistro" class="session-thumb">
      </span>
    </a>
  `).join('');

  container.innerHTML = `
    <h1>Cronologia</h1>
    <p class="disclaimer-band">${DISCLAIMER}</p>
    <div class="cronologia-actions">
      <button type="button" class="cta" id="export-pdf-btn">Esporta report di monitoraggio</button>
      <button type="button" class="secondary-btn" id="export-ics-btn">Esporta promemoria nel calendario</button>
    </div>
    <div class="session-list">
      ${cards}
    </div>
    ${dangerZoneHtml()}
  `;

  wireExportButton(container.querySelector('#export-pdf-btn'), exportMonitoringReport, 'il PDF');
  wireExportButton(container.querySelector('#export-ics-btn'), exportReminderIcs, 'il promemoria');
  wireClearHandlers(container);
}

export async function renderHistoryDetail(container, id) {
  const handle = await store.open();
  const session = await handle.getSession(id);

  if (!session) {
    container.innerHTML = `
      <p class="back-link"><a href="#/cronologia">Indietro</a></p>
      <h1>Sessione non trovata</h1>
      <p>La sessione richiesta non esiste più.</p>
    `;
    return;
  }

  container.innerHTML = `
    <p class="back-link"><a href="#/cronologia">Indietro</a></p>
    <h1>Sessione</h1>
    <p class="lead">${escapeHtml(formatItalianDate(session.timestamp))}</p>
    <p class="disclaimer-band">${DISCLAIMER}</p>

    <h2 class="eye-label">Occhio destro</h2>
    <div class="grid-stage">
      <img src="${session.rightEye}" alt="Griglia annotata occhio destro" class="session-grid">
    </div>

    <h2 class="eye-label">Occhio sinistro</h2>
    <div class="grid-stage">
      <img src="${session.leftEye}" alt="Griglia annotata occhio sinistro" class="session-grid">
    </div>
  `;
}
