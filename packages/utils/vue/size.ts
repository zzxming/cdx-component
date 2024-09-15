import { buildProp } from './props';

export const componentSizes = ['', 'default', 'small', 'large'] as const;
export type ComponentSize = typeof componentSizes[number];

export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
} as const);
