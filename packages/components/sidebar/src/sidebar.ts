import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const sidebarProps = buildProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [Number, String],
    default: '300px',
  },
  direction: {
    type: String,
    values: ['left', 'right', 'top', 'bottom'],
    default: 'left',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: false,
  },
} as const);
export type SidebarProps = ExtractPropTypes<typeof sidebarProps>;
