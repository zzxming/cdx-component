import type { ExtractPropTypes } from 'vue';
import { ElementSelectValueType, elementSelectValueType } from './element-select';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isString, isBoolean, isNumber, definePropType, buildProps } from '@cdx-component/utils';

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
    change: (value: ElementSelectValueType) => isBoolean(value) || isNumber(value) || isString(value),
};
export type ElementSelectItemEmits = typeof elementSelectItemEmits;
