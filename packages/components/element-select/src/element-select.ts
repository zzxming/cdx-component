import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isArray } from '@cdx-component/utils';
import { ExtractPropTypes } from 'vue';

export type ElementSelectValueType = string | number | boolean | undefined;

export interface ElementSelectProps
    extends ExtractPropTypes<{
        modelValue?: ElementSelectValueType[];
        tag?: string;
        max?: number;
        disabled?: boolean;
    }> {}

export const elementSelectEmits = {
    [UPDATE_MODEL_EVENT]: (value: ElementSelectValueType[]) => isArray(value),
    change: (value: ElementSelectValueType[]) => isArray(value),
};
export type ElementSelectEmits = typeof elementSelectEmits;
