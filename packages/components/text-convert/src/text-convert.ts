import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isString } from '@cdx-component/utils';

export const textConvertProps = buildProps({
  modelValue: {
    type: String,
    default: '',
  },
} as const);
export type TextConvertProps = ExtractPropTypes<typeof textConvertProps>;

export const textConvertEmits = {
  [UPDATE_MODEL_EVENT]: (val: string) => isString(val),
};
export type TextConvertEmits = typeof textConvertEmits;
