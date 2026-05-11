import { describe, it, expect } from 'vitest';
import { rgbToLab, rgbToHsv } from '../../src/vision/color.mjs';

describe('rgbToLab', () => {
  it('nero → L=0, a=0, b=0', () => {
    const { L, a, b } = rgbToLab(0, 0, 0);
    expect(L).toBeCloseTo(0, 1);
    expect(a).toBeCloseTo(0, 1);
    expect(b).toBeCloseTo(0, 1);
  });

  it('bianco → L=100, a=0, b=0', () => {
    const { L, a, b } = rgbToLab(255, 255, 255);
    expect(L).toBeCloseTo(100, 1);
    expect(a).toBeCloseTo(0, 1);
    expect(b).toBeCloseTo(0, 1);
  });

  it('rosso puro → L≈53.24, a positivo grande, b positivo grande', () => {
    const { L, a, b } = rgbToLab(255, 0, 0);
    expect(L).toBeCloseTo(53.24, 1);
    expect(a).toBeCloseTo(80.13, 1);
    expect(b).toBeCloseTo(67.22, 1);
  });

  it('giallo → L alto, a leggermente negativo, b molto positivo', () => {
    const { L, a, b } = rgbToLab(255, 255, 0);
    expect(L).toBeCloseTo(97.15, 1);
    expect(a).toBeCloseTo(-21.56, 1);
    expect(b).toBeCloseTo(94.48, 1);
  });
});

describe('rgbToHsv', () => {
  it('nero → h=0, s=0, v=0', () => {
    const { h, s, v } = rgbToHsv(0, 0, 0);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(v).toBe(0);
  });

  it('bianco → h=0, s=0, v=1', () => {
    const { h, s, v } = rgbToHsv(255, 255, 255);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(v).toBe(1);
  });

  it('rosso puro → h=0, s=1, v=1', () => {
    const { h, s, v } = rgbToHsv(255, 0, 0);
    expect(h).toBe(0);
    expect(s).toBe(1);
    expect(v).toBe(1);
  });

  it('giallo → h=60, s=1, v=1', () => {
    const { h, s, v } = rgbToHsv(255, 255, 0);
    expect(h).toBe(60);
    expect(s).toBe(1);
    expect(v).toBe(1);
  });
});
