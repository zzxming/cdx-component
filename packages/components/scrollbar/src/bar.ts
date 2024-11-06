import type { ExtractPropTypes } from 'vue';
import type Bar from './bar.vue';
import { buildProps } from '@cdx-component/utils';

export const barProps = buildProps({
  isVertical: {
    type: Boolean,
    default: true,
  },
  size: String,
  ratio: {
    type: Number,
    default: 1,
  },
} as const);
export type BarProps = ExtractPropTypes<typeof barProps>;

export type BarInstance = InstanceType<typeof Bar>;
