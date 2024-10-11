import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const loadingProps = buildProps({
  text: {
    type: String,
  },
  background: {
    type: String,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  lock: {
    type: Boolean,
    default: true,
  },
} as const);
export type LoadingProps = ExtractPropTypes<typeof loadingProps>;
