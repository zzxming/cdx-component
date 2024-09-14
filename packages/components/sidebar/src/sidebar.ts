import { buildProps } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

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
