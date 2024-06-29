import type { ExtractPropTypes } from 'vue';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, definePropType, isBoolean, isNumber, isString } from '@cdx-component/utils';
import type { ElementSelectValueType } from './element-select';
import { elementSelectValueType } from './element-select';

export const elementSelectItemProps = buildProps({
  modelValue: {
    type: definePropType<ElementSelectValueType>(elementSelectValueType),
  },
  trueValue: {
    type: definePropType<ElementSelectValueType>(elementSelectValueType),
    default: true,
  },
  falseValue: {
    type: definePropType<ElementSelectValueType>(elementSelectValueType),
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const);
export type ElementSelectItemProps = ExtractPropTypes<typeof elementSelectItemProps>;

export const elementSelectItemEmits = {
  [UPDATE_MODEL_EVENT]: (value: ElementSelectValueType) => isBoolean(value) || isNumber(value) || isString(value),
  [CHANGE_EVENT]: (value: ElementSelectValueType) => isBoolean(value) || isNumber(value) || isString(value),
};
export type ElementSelectItemEmits = typeof elementSelectItemEmits;
