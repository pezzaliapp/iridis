import { describe, it, expect } from 'vitest';
import {
  samplePixels,
  analyzeJaundice,
  analyzeAnemia,
  analyzeCataract,
} from '../../src/vision/analyze.mjs';

function makeImageData(width, height, r, g, b) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return { width, height, data };
}

const FULL_BOX = { x: 0, y: 0, w: 20, h: 20 };

describe('samplePixels', () => {
  it('campiona pixel uniformemente su tutta la ROI con stride 2', () => {
    const img = makeImageData(20, 20, 100, 50, 25);
    const px = samplePixels(img, FULL_BOX);
    expect(px.length).toBe(100);
    expect(px[0]).toEqual({ r: 100, g: 50, b: 25 });
    expect(px[99]).toEqual({ r: 100, g: 50, b: 25 });
  });

  it('restituisce array vuoto se imageData o box mancano', () => {
    expect(samplePixels(null, FULL_BOX)).toEqual([]);
    expect(samplePixels(makeImageData(20, 20, 0, 0, 0), null)).toEqual([]);
  });
});

describe('analyzeJaundice', () => {
  it('sclera giallastra (210,190,90) → level alto', () => {
    const img = makeImageData(20, 20, 210, 190, 90);
    const res = analyzeJaundice(img, FULL_BOX);
    expect(res).not.toBeNull();
    expect(res.level).toBe('alto');
  });
});

describe('analyzeAnemia', () => {
  it('congiuntiva rosa ben perfusa (220,140,140) → level normale', () => {
    const img = makeImageData(20, 20, 220, 140, 140);
    const res = analyzeAnemia(img, FULL_BOX);
    expect(res).not.toBeNull();
    expect(res.level).toBe('normale');
  });

  it('congiuntiva rosso pallido (200,180,180) → level alto', () => {
    const img = makeImageData(20, 20, 200, 180, 180);
    const res = analyzeAnemia(img, FULL_BOX);
    expect(res).not.toBeNull();
    expect(res.level).toBe('alto');
  });
});

describe('analyzeCataract', () => {
  it('pupilla nera uniforme → level normale', () => {
    const img = makeImageData(20, 20, 0, 0, 0);
    const res = analyzeCataract(img, FULL_BOX);
    expect(res).not.toBeNull();
    expect(res.level).toBe('normale');
  });

  it('pupilla bianca brillante uniforme → level alto', () => {
    const img = makeImageData(20, 20, 255, 255, 255);
    const res = analyzeCataract(img, FULL_BOX);
    expect(res).not.toBeNull();
    expect(res.level).toBe('alto');
  });
});
