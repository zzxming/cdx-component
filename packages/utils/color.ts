export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
};
export const stringToRGBColor = (color: string, defaultRGBColor: string = 'rgb(0, 0, 0)'): RGB => {
  const span = document.createElement('span');
  span.style.backgroundColor = color;
  const colorString = span.style.backgroundColor || defaultRGBColor;
  const match = colorString.replaceAll(/\s+/g, '').match(/rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)/);
  if (!match) {
    console.warn(`Invalid color input`);
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  const r = Number.parseInt(match[1], 10);
  const g = Number.parseInt(match[2], 10);
  const b = Number.parseInt(match[3], 10);
  const a = match[4] ? Number.parseFloat(match[4]) : 1;
  return { r, g, b, a };
};
export const isDarkColor = (rgb: RGB): boolean => {
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};
export interface HSB {
  h: number;
  s: number;
  b: number;
  a: number;
};
export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
};
const normalizeValue = function (value: number | string, max: number | string) {
  value = Math.min(max as number, Math.max(0, Number.parseFloat(`${value}`)));

  // Handle floating point rounding errors
  if (Math.abs(value - (max as number)) < 0.000_001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return (value % (max as number)) / Number.parseFloat(max as string);
};
export const validateHSB = (hsb: HSB): HSB => {
  return {
    h: Math.min(360, Math.max(0, hsb.h)),
    s: Math.min(100, Math.max(0, hsb.s)),
    b: Math.min(100, Math.max(0, hsb.b)),
    a: Math.min(1, Math.max(0, hsb.a)),
  };
};
export const HEXtoRGB = (hex: string): RGB => {
  hex = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const a = Number((Number.parseInt(hex.slice(6, 8) || 'ff', 16) / 255).toFixed(2));
  return { r, g, b, a };
};
export const RGBtoHSB = (rgb: RGB): HSB => {
  let { r, g, b, a } = rgb;
  r = normalizeValue(r, 255);
  g = normalizeValue(g, 255);
  b = normalizeValue(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  }
  else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      case b: {
        h = (r - g) / d + 4;
        break;
      }
    }
    h! /= 6;
  }

  return { h: h! * 360, s: s * 100, b: v * 100, a };
};
export const HSBtoRGB = (hsb: HSB): RGB => {
  let { h, s, b, a } = hsb;
  h = normalizeValue(h, 360) * 6;
  s = normalizeValue(s, 100);
  b = normalizeValue(b, 100);

  const i = Math.floor(h);
  const f = h - i;
  const p = b * (1 - s);
  const q = b * (1 - f * s);
  const t = b * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [b, q, p, p, t, b][mod];
  const g = [t, b, b, q, p, p][mod];
  const v = [p, p, t, b, b, q][mod];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(v * 255),
    a,
  };
};
export const RGBtoHEX = (rgb: RGB): string => {
  const hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16), Math.round(rgb.a * 255).toString(16)];
  for (const key in hex) {
    if (hex[key].length === 1) {
      hex[key] = `0${hex[key]}`;
    }
  }
  return hex.join('');
};
export const HSBtoHEX = (hsb: HSB): string => RGBtoHEX(HSBtoRGB(hsb));
