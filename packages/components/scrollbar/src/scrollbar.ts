import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const scrollbarProps = buildProps({
  minSize: {
    type: Number,
    default: 20,
  },
} as const);
export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>;
