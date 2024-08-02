import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const tooltipProps = buildProps({
  directive: {
    values: ['top', 'right', 'bottom', 'left'],
    default: 'top',
  },
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
