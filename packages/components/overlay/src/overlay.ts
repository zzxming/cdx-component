import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isBoolean } from '@cdx-component/utils';

export const overlayProps = buildProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
} as const);

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export const overlayEmits = {
  click: (event: Event) => event instanceof Event,
  [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export type OverlayEmits = typeof overlayEmits;
