import type { ExtractPropTypes } from 'vue';
import { ElementSelectValueType } from './element-select';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isString, isBoolean, isNumber } from '@cdx-component/utils';

export interface ElementSelectItemProps
    extends ExtractPropTypes<{
        modelValue?: ElementSelectValueType;
        trueValue?: ElementSelectValueType;
        falseValue?: ElementSelectValueType;
        disabled?: boolean;
        checked?: boolean;
    }> {}

export const elementSelectItemEmits = {
    [UPDATE_MODEL_EVENT]: (value: ElementSelectValueType) => isBoolean(value) || isNumber(value) || isString(value),
    change: (value: ElementSelectValueType) => isBoolean(value) || isNumber(value) || isString(value),
};
export type ElementSelectItemEmits = typeof elementSelectItemEmits;
