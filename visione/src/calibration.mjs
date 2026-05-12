const CALIBRATION_KEY = 'iridis-visione/calibration';

const CARD_WIDTH_MM = 85.60;
const CARD_HEIGHT_MM = 53.98;

export const CARD_ASPECT = CARD_WIDTH_MM / CARD_HEIGHT_MM;

export function pixelsPerMmFromCardWidth(rectWidthPx) {
  return rectWidthPx / CARD_WIDTH_MM;
}

export function cardWidthFromPixelsPerMm(pixelsPerMm) {
  return pixelsPerMm * CARD_WIDTH_MM;
}

export function loadCalibration() {
  try {
    const raw = localStorage.getItem(CALIBRATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.pixelsPerMm === 'number' && parsed.pixelsPerMm > 0) {
      return parsed;
    }
  } catch (_) {
    // entry corrotta: torniamo a null
  }
  return null;
}

export function saveCalibration(pixelsPerMm) {
  const payload = {
    pixelsPerMm,
    calibratedAt: new Date().toISOString(),
    version: 1
  };
  localStorage.setItem(CALIBRATION_KEY, JSON.stringify(payload));
  return payload;
}
