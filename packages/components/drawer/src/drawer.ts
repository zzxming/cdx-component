import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isBoolean } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const drawerProps = buildProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    direction: {
        type: String,
        values: ['left', 'right', 'top', 'bottom'],
        default: 'left',
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    slide: {
        type: Boolean,
        default: true,
    },
    clickModelCose: {
        type: Boolean,
        default: true,
    },
    breakBoundart: {
        type: Number,
        default: 16,
    },
    size: {
        type: [Number, String],
        default: '68%',
    },
    bodySlide: {
        type: Boolean,
        default: true,
    },
} as const);
export type DrawerProps = ExtractPropTypes<typeof drawerProps>;

export const drawerEmits = {
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export type DrawerEmits = typeof drawerEmits;
