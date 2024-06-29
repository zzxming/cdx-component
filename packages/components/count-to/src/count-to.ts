import { CHANGE_EVENT } from '@cdx-component/constants';
import { buildProps, isNumber } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const countToProps = buildProps({
  startValue: {
    type: Number,
    default: 0,
  },
  endValue: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  decimal: {
    type: Number,
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
  animation: {
    type: Boolean,
    default: false,
  },
  animationDuration: {
    type: Number,
    default: 2000,
  },
} as const);
export type CountToProps = ExtractPropTypes<typeof countToProps>;

export const countToEmits = {
  finish: () => true,
  [CHANGE_EVENT]: (value: number) => isNumber(value),
};
export type CountToEmits = typeof countToEmits;
