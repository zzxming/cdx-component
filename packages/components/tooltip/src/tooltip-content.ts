import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';
import { tooltipValidDirection } from './constants';

export const tooltipContentProps = buildProps({
  direction: {
    values: tooltipValidDirection,
    default: 'top',
  },
  text: {
    type: String,
    default: '',
  },
} as const);
export type TooltipContentProps = ExtractPropTypes<typeof tooltipContentProps>;
