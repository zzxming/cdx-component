import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isString } from '@cdx-component/utils';

export const colorPickerProps = buildProps({
  modelValue: {
    type: String,
    default: 'ff0000',
  },
  selectOnly: {
    type: Boolean,
    default: false,
  },
} as const);
export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>;

export const colorPickerEmits = {
  [UPDATE_MODEL_EVENT]: (val: string) => isString(val),
  change: (val: string) => isString(val),
};
export type ColorPickerEmits = typeof colorPickerEmits;
