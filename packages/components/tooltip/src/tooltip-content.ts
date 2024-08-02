import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';
import { validDirection } from './constants';

export const tooltipContentProps = buildProps({
  direction: {
    values: validDirection,
    default: 'top',
  },
} as const);
export type TooltipContentProps = ExtractPropTypes<typeof tooltipContentProps>;
