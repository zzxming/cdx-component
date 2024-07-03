import { describe, expect, it } from 'vitest';
import { generateRandomColor } from '..'; // 替换为实际的文件路径

describe('test function about color', () => {
  it('should generate a valid rgb color string', () => {
    const color = generateRandomColor();
    const rgbPattern = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    expect(rgbPattern.test(color)).toBe(true);

    const [rStr, gStr, bStr] = color.match(/\d+/g) as string[];
    const r = Number.parseInt(rStr, 10);
    const g = Number.parseInt(gStr, 10);
    const b = Number.parseInt(bStr, 10);

    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(255);
    expect(g).toBeGreaterThanOrEqual(0);
    expect(g).toBeLessThanOrEqual(255);
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThanOrEqual(255);
  });
});
