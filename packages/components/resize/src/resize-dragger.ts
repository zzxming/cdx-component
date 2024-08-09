import { buildProps } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';
import { validDirection } from './constants';

export const resizeDraggerProps = buildProps({
  direction: {
    values: validDirection,
    required: true,
  },
  size: {
    type: Number,
    default: 8,
  },
} as const);
export type ResizeDraggerProps = ExtractPropTypes<typeof resizeDraggerProps>;
