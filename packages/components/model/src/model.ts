import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isBoolean } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const modelProps = {
    modelValue: {
        type: Boolean,
    },
    width: {
        type: String,
        default: '50%',
    },
    maskClose: {
        type: Boolean,
        default: true,
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    destroyOnClose: {
        type: Boolean,
        default: true,
    },
} as const;
export type ModelProps = ExtractPropTypes<typeof modelProps>;

export const modelEmits = {
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
    close: () => true,
};
export type ModelEMits = typeof modelEmits;
