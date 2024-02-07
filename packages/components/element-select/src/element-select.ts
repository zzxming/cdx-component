import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { definePropType, isArray } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export type ElementSelectValueType = string | number | boolean;
export const elementSelectValueType = [String, Number, Boolean];

export const elementSelectProps = {
    modelValue: {
        type: definePropType<ElementSelectValueType[]>(Array),
        default: () => [],
    },
    tag: {
        type: String,
        default: 'div',
    },
    max: {
        type: Number,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
} as const;
export type ElementSelectProps = ExtractPropTypes<typeof elementSelectProps>;

export const elementSelectEmits = {
    [UPDATE_MODEL_EVENT]: (value: ElementSelectValueType[]) => isArray(value),
    change: (value: ElementSelectValueType[]) => isArray(value),
};
export type ElementSelectEmits = typeof elementSelectEmits;
