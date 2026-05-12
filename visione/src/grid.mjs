const GRID_SIZE_MM = 100;
const CELL_MM = 5;
const NUM_CELLS = GRID_SIZE_MM / CELL_MM;
const LINE_MM = 0.5;
const DOT_RADIUS_MM = 1.5;
const MARK_RADIUS_MM = 2;
const MARK_COLOR = 'rgba(220, 38, 38, 0.35)';

export function renderAmslerGrid(canvas, pixelsPerMm) {
  const dpr = window.devicePixelRatio || 1;
  const sizeCss = GRID_SIZE_MM * pixelsPerMm;

  canvas.style.width = `${sizeCss}px`;
  canvas.style.height = `${sizeCss}px`;
  canvas.width = Math.round(sizeCss * dpr);
  canvas.height = Math.round(sizeCss * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sizeCss, sizeCss);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.min(4, Math.max(1, LINE_MM * pixelsPerMm));

  ctx.beginPath();
  for (let i = 0; i <= NUM_CELLS; i++) {
    const offset = i * CELL_MM * pixelsPerMm;
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, sizeCss);
    ctx.moveTo(0, offset);
    ctx.lineTo(sizeCss, offset);
  }
  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(sizeCss / 2, sizeCss / 2, DOT_RADIUS_MM * pixelsPerMm, 0, Math.PI * 2);
  ctx.fill();
}

export function renderAnnotations(canvas, pixelsPerMm, strokes, currentStroke) {
  const ctx = canvas.getContext('2d');
  const radius = MARK_RADIUS_MM * pixelsPerMm;

  ctx.lineWidth = radius * 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = MARK_COLOR;
  ctx.strokeStyle = MARK_COLOR;

  const all = currentStroke && currentStroke.length > 0
    ? [...strokes, currentStroke]
    : strokes;

  for (const stroke of all) {
    if (stroke.length === 1) {
      ctx.beginPath();
      ctx.arc(stroke[0].x, stroke[0].y, radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (stroke.length > 1) {
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }
}
