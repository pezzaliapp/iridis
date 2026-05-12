import { store } from './store.mjs';

const CARD_WIDTH_MM = 85.60;
const CARD_HEIGHT_MM = 53.98;

export const CARD_ASPECT = CARD_WIDTH_MM / CARD_HEIGHT_MM;

export function pixelsPerMmFromCardWidth(rectWidthPx) {
  return rectWidthPx / CARD_WIDTH_MM;
}

export function cardWidthFromPixelsPerMm(pixelsPerMm) {
  return pixelsPerMm * CARD_WIDTH_MM;
}

export async function loadCalibration() {
  const handle = await store.open();
  const value = await handle.getCalibration();
  return value ?? null;
}

export async function saveCalibration(pixelsPerMm) {
  const payload = {
    pixelsPerMm,
    calibratedAt: new Date().toISOString(),
    version: 1,
    devicePixelRatio: window.devicePixelRatio || 1,
    viewportSizeAtCalibration: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
  const handle = await store.open();
  await handle.setCalibration(payload);
  return payload;
}
