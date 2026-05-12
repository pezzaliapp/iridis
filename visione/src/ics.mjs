import { store } from './store.mjs';

const PRODID = '-//Iridis Visione//IT';
const EVENT_HOUR = 9;
const EVENT_DURATION_MIN = 10;
const SUMMARY = 'Iridis Visione — test di Amsler';
const DESCRIPTION = "Esegui il test della griglia di Amsler con Iridis Visione. Questo strumento non sostituisce la visita oculistica e non e' un dispositivo medico.";

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatIcsDateTime(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function buildRRule(freq) {
  if (!freq || freq.mode === 'daily') return 'FREQ=DAILY';
  if (freq.mode === 'weekly') return 'FREQ=WEEKLY';
  if (freq.mode === 'custom') {
    switch (freq.preset) {
      case 'twice-weekly': return 'FREQ=WEEKLY;BYDAY=MO,TH';
      case 'thrice-weekly': return 'FREQ=WEEKLY;BYDAY=MO,WE,FR';
      case 'every-2-days': return 'FREQ=DAILY;INTERVAL=2';
      default: return 'FREQ=DAILY';
    }
  }
  return 'FREQ=DAILY';
}

function generateUid() {
  return `iridis-visione-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@iridis-visione`;
}

function nextStartDate() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(EVENT_HOUR, 0, 0, 0);
  if (start <= now) {
    start.setDate(start.getDate() + 1);
  }
  return start;
}

export async function exportReminderIcs() {
  const handle = await store.open();
  const frequency = await handle.getFrequency();

  const start = nextStartDate();
  const end = new Date(start.getTime() + EVENT_DURATION_MIN * 60 * 1000);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${generateUid()}`,
    `DTSTAMP:${formatIcsDateTime(new Date())}`,
    `DTSTART:${formatIcsDateTime(start)}`,
    `DTEND:${formatIcsDateTime(end)}`,
    `SUMMARY:${SUMMARY}`,
    `DESCRIPTION:${DESCRIPTION}`,
    `RRULE:${buildRRule(frequency)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const content = lines.join('\r\n') + '\r\n';
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'iridis-visione-promemoria.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
