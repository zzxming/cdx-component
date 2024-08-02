import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';
import { tooltipContentProps } from './tooltip-content';

export const tooltipProps = buildProps({
  ...tooltipContentProps,
  text: {
    type: String,
    default: '',
  },
  hideDelay: {
    type: Number,
    default: 200,
  },
} as const);
export type TooltipProps = ExtractPropTypes<typeof tooltipProps>;
