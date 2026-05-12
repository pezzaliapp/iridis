import { store } from '../store.mjs';

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

export async function renderHistory(container) {
  const handle = await store.open();
  const sessions = await handle.getSessions();

  if (sessions.length === 0) {
    container.innerHTML = `
      <h1>Cronologia</h1>
      <p class="disclaimer-band">${DISCLAIMER}</p>
      <p>Non hai ancora completato un test. La cronologia mostrerà qui le tue sessioni passate. Le potrai esportare in PDF da portare al tuo oculista.</p>
      <button type="button" class="cta" id="start-btn">Inizia un test</button>
    `;
    container.querySelector('#start-btn').addEventListener('click', () => {
      location.hash = '#/test';
    });
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
    <div class="session-list">
      ${cards}
    </div>
  `;
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
