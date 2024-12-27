import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const menuProps = buildProps({
  visible: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [Number, String],
    default: 200,
  },
  contextmenu: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
} as const);
export type MenuProps = ExtractPropTypes<typeof menuProps>;

export const menuEmits = {};
export type MenuEmits = typeof menuEmits;
