import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';
import { resizeValidDirection } from './constants';

export const resizeDraggerProps = buildProps({
  direction: {
    values: resizeValidDirection,
    required: true,
  },
  size: {
    type: Number,
    default: 8,
  },
} as const);
export type ResizeDraggerProps = ExtractPropTypes<typeof resizeDraggerProps>;
