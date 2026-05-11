import { rgbToLab, rgbToHsv } from './color.mjs';

export function samplePixels(imageData, box) {
  if (!box || !imageData) return [];
  const px = [];
  const x0 = Math.max(0, Math.floor(box.x));
  const y0 = Math.max(0, Math.floor(box.y));
  const x1 = Math.min(imageData.width, Math.floor(box.x + box.w));
  const y1 = Math.min(imageData.height, Math.floor(box.y + box.h));
  const data = imageData.data;
  for (let y = y0; y < y1; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const i = (y * imageData.width + x) * 4;
      px.push({ r: data[i], g: data[i+1], b: data[i+2] });
    }
  }
  return px;
}

export function analyzeJaundice(imageData, box) {
  const px = samplePixels(imageData, box);
  if (!px.length) return null;
  // filter very dark (lashes) and clipped highlights
  const valid = px.map(p => ({ ...p, lab: rgbToLab(p.r, p.g, p.b) }))
                  .filter(p => p.lab.L > 25 && p.lab.L < 92);
  if (valid.length < 10) return null;
  const meanB = valid.reduce((s, p) => s + p.lab.b, 0) / valid.length;
  const meanL = valid.reduce((s, p) => s + p.lab.L, 0) / valid.length;
  // Risk mapping
  let verdict, level;
  if (meanB < 5) { verdict = 'Sclera nei valori cromatici attesi.'; level = 'normale'; }
  else if (meanB < 12) { verdict = 'Lieve viraggio giallastro. Sotto soglia di rilevanza, ripetere la misurazione in condizioni di luce diversa.'; level = 'borderline'; }
  else { verdict = 'Giallo sclerale marcato. Pattern colorimetrico atipico — verificare con un medico.'; level = 'alto'; }
  return { value: meanB.toFixed(1), pct: Math.min(100, Math.max(0, (meanB / 25) * 100)), verdict, level, L: meanL.toFixed(0) };
}

export function analyzeAnemia(imageData, box) {
  const px = samplePixels(imageData, box);
  if (!px.length) return null;
  const valid = px.map(p => ({ ...p, lab: rgbToLab(p.r, p.g, p.b), hsv: rgbToHsv(p.r, p.g, p.b) }))
                  .filter(p => p.lab.L > 20 && p.lab.L < 92);
  if (valid.length < 10) return null;
  const meanA = valid.reduce((s, p) => s + p.lab.a, 0) / valid.length;
  const meanS = valid.reduce((s, p) => s + p.hsv.s, 0) / valid.length;
  // pallor score: lower a* + lower saturation = paler
  // roseo: a*≈25, s≈0.5 → score ≈ 100 ; pallor: a*≈5, s≈0.15 → score ≈ 17
  const score = Math.max(0, Math.min(100, meanA * 2.5 + meanS * 60));
  let verdict, level;
  if (score < 35) { verdict = 'Pallore congiuntivale evidente. Pattern atipico di congiuntiva ben perfusa — verificare con un medico.'; level = 'alto'; }
  else if (score < 60) { verdict = 'Colorito congiuntivale ai limiti inferiori. Borderline.'; level = 'borderline'; }
  else { verdict = 'Congiuntiva ben perfusa. Pallor index entro l\'intervallo atteso.'; level = 'normale'; }
  return { value: score.toFixed(0), pct: score, verdict, level };
}

export function analyzeCataract(imageData, box) {
  const px = samplePixels(imageData, box);
  if (!px.length) return null;
  const vs = px.map(p => rgbToHsv(p.r, p.g, p.b).v);
  const meanV = vs.reduce((s, v) => s + v, 0) / vs.length;
  const variance = Math.sqrt(vs.reduce((s, v) => s + (v - meanV) ** 2, 0) / vs.length);
  // Healthy pupil: dark and uniform → low meanV, low variance
  // Cataract: bright + heterogeneous
  const opacity = Math.min(100, (meanV * 70 + variance * 200));
  let verdict, level;
  if (opacity < 20) { verdict = 'Pupilla scura e omogenea. Aspetto atteso per cristallino trasparente.'; level = 'normale'; }
  else if (opacity < 45) { verdict = 'Leggera luminosità pupillare. Possibili riflessi da illuminazione o opacità iniziale.'; level = 'borderline'; }
  else { verdict = 'Pupilla con riflessi biancastri marcati. Pattern atipico di pupilla trasparente — visita oculistica consigliata.'; level = 'alto'; }
  return { value: opacity.toFixed(0), pct: opacity, verdict, level };
}
