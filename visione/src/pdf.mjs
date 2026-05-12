import { store, APP_VERSION } from './store.mjs';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const WEEKDAYS_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS_IT = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

const DISCLAIMER = 'Questo strumento non sostituisce la visita oculistica e non è un dispositivo medico.';

function formatItalianDateFull(date) {
  const weekday = WEEKDAYS_IT[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_IT[date.getMonth()];
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${weekday} ${day} ${month} ${year}, ${hh}:${mm}`;
}

function formatItalianDateShort(date) {
  return `${date.getDate()} ${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateForFilename(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatFrequency(freq) {
  if (!freq) return 'non impostata';
  if (freq.mode === 'daily') return 'giornaliera';
  if (freq.mode === 'weekly') return 'settimanale';
  if (freq.mode === 'custom') {
    const presetLabels = {
      'twice-weekly': '2 volte alla settimana',
      'thrice-weekly': '3 volte alla settimana',
      'every-2-days': 'ogni 2 giorni'
    };
    return `personalizzata (${presetLabels[freq.preset] || 'non specificata'})`;
  }
  return freq.mode;
}

function hasMarkData(s) {
  return typeof s.rightEyeMarkCount === 'number' && typeof s.leftEyeMarkCount === 'number';
}

function isAlteration(s) {
  return hasMarkData(s) && (s.rightEyeMarkCount > 0 || s.leftEyeMarkCount > 0);
}

function buildSummary(sessions) {
  const total = sessions.length;
  const withAlterations = sessions.filter(isAlteration).length;
  const withoutAlterations = sessions.filter(s =>
    hasMarkData(s) && s.rightEyeMarkCount === 0 && s.leftEyeMarkCount === 0
  ).length;
  const unknown = total - withAlterations - withoutAlterations;

  if (total === 0) {
    return { total: 0, withAlterations: 0, withoutAlterations: 0, unknown: 0, first: null, last: null, daysCovered: 0, avgPerWeek: 'nessuna sessione' };
  }

  const timestamps = sessions.map(s => new Date(s.timestamp).getTime());
  const first = new Date(Math.min(...timestamps));
  const last = new Date(Math.max(...timestamps));
  const daysCovered = Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)));

  let avgPerWeek;
  if (total < 2) {
    avgPerWeek = 'sessione singola (non calcolabile)';
  } else {
    const weeks = Math.max(1 / 7, daysCovered / 7);
    avgPerWeek = `${(total / weeks).toFixed(1)} sessioni / settimana`;
  }

  return { total, withAlterations, withoutAlterations, unknown, first, last, daysCovered, avgPerWeek };
}

function drawDisclaimerBand(doc, x, y) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(150);
  const lines = doc.splitTextToSize(DISCLAIMER, CONTENT_W - 8);
  const height = lines.length * 5 + 6;
  doc.roundedRect(x, y, CONTENT_W, height, 2, 2);
  doc.text(lines, x + 4, y + 6);
  return height;
}

function drawFooter(doc, page, totalPages) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(
    `Generato da Iridis Visione v${APP_VERSION} · Pagina ${page} di ${totalPages}`,
    MARGIN,
    PAGE_H - 8
  );
  doc.setTextColor(0);
}

function drawSummaryPage(doc, sessions, currentFrequency) {
  let y = MARGIN + 5;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Iridis Visione', MARGIN, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Report di monitoraggio', MARGIN, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Generato il ${formatItalianDateFull(new Date())}`, MARGIN, y);
  doc.setTextColor(0);
  y += 10;

  const dh = drawDisclaimerBand(doc, MARGIN, y);
  y += dh + 10;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Sommario del periodo', MARGIN, y);
  y += 8;

  const s = buildSummary(sessions);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  if (s.total === 0) {
    doc.text('Nessuna sessione registrata.', MARGIN, y);
    return;
  }

  const dayWord = s.daysCovered === 1 ? 'giorno' : 'giorni';
  doc.text(
    `Periodo coperto: dal ${formatItalianDateShort(s.first)} al ${formatItalianDateShort(s.last)} (${s.daysCovered} ${dayWord})`,
    MARGIN, y
  );
  y += 7;

  doc.text(`Sessioni totali: ${s.total}`, MARGIN, y); y += 7;
  doc.text(`   Senza segnalazioni: ${s.withoutAlterations}`, MARGIN, y); y += 6;
  doc.text(`   Con segnalazioni: ${s.withAlterations}`, MARGIN, y); y += 6;
  if (s.unknown > 0) {
    doc.text(`   Stato non rilevato: ${s.unknown}`, MARGIN, y); y += 6;
  }
  y += 3;

  doc.text(`Frequenza media: ${s.avgPerWeek}`, MARGIN, y); y += 7;
  doc.text(`Regime di sorveglianza attuale: ${formatFrequency(currentFrequency)}`, MARGIN, y);
}

function drawChronologyHeader(doc, y) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Data', MARGIN, y);
  doc.text('Stato', MARGIN + 90, y);
  y += 3;
  doc.setDrawColor(200);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 5;
  return y;
}

function drawChronologyPages(doc, sessions) {
  if (sessions.length === 0) return;

  doc.addPage();
  let y = MARGIN + 5;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cronologia delle sessioni', MARGIN, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Più recenti in alto.', MARGIN, y);
  doc.setTextColor(0);
  y += 8;

  y = drawChronologyHeader(doc, y);

  const sorted = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  for (const session of sorted) {
    if (y > PAGE_H - 20) {
      doc.addPage();
      y = MARGIN + 5;
      y = drawChronologyHeader(doc, y);
    }

    let statusStr;
    let bold = false;
    if (!hasMarkData(session)) {
      statusStr = 'Stato non rilevato';
    } else if (isAlteration(session)) {
      statusStr = 'Con segnalazioni';
      bold = true;
    } else {
      statusStr = 'Senza segnalazioni';
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(formatItalianDateFull(new Date(session.timestamp)), MARGIN, y);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(statusStr, MARGIN + 90, y);
    y += 6;
  }
}

function drawAlterationPages(doc, sessions) {
  const alterations = sessions
    .filter(isAlteration)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (alterations.length === 0) return;

  const GRID_MM = 80;

  for (const session of alterations) {
    doc.addPage();
    let y = MARGIN + 5;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sessione con segnalazioni', MARGIN, y);
    y += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(formatItalianDateFull(new Date(session.timestamp)), MARGIN, y);
    y += 8;

    const dh = drawDisclaimerBand(doc, MARGIN, y);
    y += dh + 6;

    const dxCount = session.rightEyeMarkCount;
    const dxWord = dxCount === 1 ? 'segnalazione' : 'segnalazioni';
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Occhio destro (${dxCount} ${dxWord})`, MARGIN, y);
    y += 4;

    try {
      doc.addImage(session.rightEye, 'PNG', MARGIN, y, GRID_MM, GRID_MM);
    } catch (_) {
      // se la dataURL fallisce, lasciamo lo spazio vuoto
    }
    y += GRID_MM + 6;

    const sxCount = session.leftEyeMarkCount;
    const sxWord = sxCount === 1 ? 'segnalazione' : 'segnalazioni';
    doc.setFont('helvetica', 'bold');
    doc.text(`Occhio sinistro (${sxCount} ${sxWord})`, MARGIN, y);
    y += 4;

    try {
      doc.addImage(session.leftEye, 'PNG', MARGIN, y, GRID_MM, GRID_MM);
    } catch (_) {
      // come sopra
    }
  }
}

function drawSourcesPage(doc) {
  doc.addPage();
  let y = MARGIN + 5;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Fonti scientifiche e contesto', MARGIN, y);
  y += 10;

  const sources = [
    {
      title: 'American Academy of Ophthalmology',
      subtitle: 'All About the Amsler Grid',
      url: 'https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test',
      desc: "Istruzioni patient-facing sull'uso quotidiano della griglia di Amsler."
    },
    {
      title: 'Bjerager J et al. (2023)',
      subtitle: 'Diagnostic Accuracy of the Amsler Grid Test — JAMA Ophthalmology, aprile 2023',
      url: 'https://www.aao.org/eyenet/article/diagnostic-accuracy-of-the-amsler-grid-for-amd',
      desc: 'Meta-analisi: sensibilità 67% vs occhi sani, 71% per distinguere maculopatia umida da secca.'
    },
    {
      title: 'Royal College of Ophthalmologists',
      subtitle: 'AMD Commissioning Guidance, 2021',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9582190/',
      desc: "Riconosce i limiti del test ma non ne scoraggia l'uso fra le visite oculistiche."
    },
    {
      title: 'MDCG 2019-11',
      subtitle: 'Qualificazione e classificazione del software (rev. giugno 2025)',
      url: 'https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf',
      desc: 'Iridis Visione non è qualificato come dispositivo medico ai sensi del Regolamento (UE) 2017/745.'
    }
  ];

  for (const src of sources) {
    if (y > PAGE_H - 50) {
      doc.addPage();
      y = MARGIN + 5;
    }

    doc.setDrawColor(200);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    y += 5;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(src.title, MARGIN, y);
    y += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const subLines = doc.splitTextToSize(src.subtitle, CONTENT_W);
    doc.text(subLines, MARGIN, y);
    y += subLines.length * 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60);
    const urlLines = doc.splitTextToSize(src.url, CONTENT_W);
    doc.text(urlLines, MARGIN, y);
    y += urlLines.length * 4 + 1;
    doc.setTextColor(0);

    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(src.desc, CONTENT_W);
    doc.text(descLines, MARGIN, y);
    y += descLines.length * 5 + 6;
  }
}

export async function exportMonitoringReport() {
  const jsPdfNs = window.jspdf;
  if (!jsPdfNs || !jsPdfNs.jsPDF) {
    throw new Error('jsPDF non caricato');
  }
  const { jsPDF } = jsPdfNs;

  const handle = await store.open();
  const sessions = await handle.getSessions();
  const currentFrequency = await handle.getFrequency();

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  drawSummaryPage(doc, sessions, currentFrequency);
  drawChronologyPages(doc, sessions);
  drawAlterationPages(doc, sessions);
  drawSourcesPage(doc);

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  const filename = `iridis-visione-monitoraggio-${formatDateForFilename(new Date())}.pdf`;
  doc.save(filename);
}
