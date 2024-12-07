export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = `rgb(${r}, ${g}, ${b})`;
  return color;
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
  const hsb = {
    h: 0,
    s: 0,
    b: 0,
    a: rgb.a,
  };
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const delta = max - min;

  hsb.b = max;
  hsb.s = max !== 0 ? (255 * delta) / max : 0;

  if (hsb.s !== 0) {
    if (rgb.r === max) {
      hsb.h = (rgb.g - rgb.b) / delta;
    }
    else if (rgb.g === max) {
      hsb.h = 2 + (rgb.b - rgb.r) / delta;
    }
    else {
      hsb.h = 4 + (rgb.r - rgb.g) / delta;
    }
  }
  else {
    hsb.h = -1;
  }

  hsb.h *= 60;

  if (hsb.h < 0) {
    hsb.h += 360;
  }

  hsb.s *= 100 / 255;
  hsb.b *= 100 / 255;

  return hsb;
};
export const HSBtoRGB = (hsb: HSB): RGB => {
  let rgb: RGB = {
    r: 0,
    g: 0,
    b: 0,
    a: hsb.a,
  };
  let h = Math.round(hsb.h);
  const s = Math.round((hsb.s * 255) / 100);
  const v = Math.round((hsb.b * 255) / 100);

  if (s === 0) {
    rgb = {
      r: v,
      g: v,
      b: v,
      a: rgb.a,
    };
  }
  else {
    const t1 = v;
    const t2 = ((255 - s) * v) / 255;
    const t3 = ((t1 - t2) * (h % 60)) / 60;

    if (h === 360) h = 0;

    if (h < 60) {
      rgb.r = t1;
      rgb.b = t2;
      rgb.g = t2 + t3;
    }
    else if (h < 120) {
      rgb.g = t1;
      rgb.b = t2;
      rgb.r = t1 - t3;
    }
    else if (h < 180) {
      rgb.g = t1;
      rgb.r = t2;
      rgb.b = t2 + t3;
    }
    else if (h < 240) {
      rgb.b = t1;
      rgb.r = t2;
      rgb.g = t1 - t3;
    }
    else if (h < 300) {
      rgb.b = t1;
      rgb.g = t2;
      rgb.r = t2 + t3;
    }
    else if (h < 360) {
      rgb.r = t1;
      rgb.g = t2;
      rgb.b = t1 - t3;
    }
    else {
      rgb.r = 0;
      rgb.g = 0;
      rgb.b = 0;
    }
  }

  return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: hsb.a };
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
