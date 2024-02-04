import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { definePropType, isBoolean } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export type Directive = 'left' | 'right' | 'top' | 'bottom';
export const drawerProps = {
    modelValue: {
        type: Boolean,
        default: false,
    },
    direction: {
        type: definePropType<Directive>(String),
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
};
export type DrawerProps = ExtractPropTypes<typeof drawerProps>;

export const drawerEmits = {
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export type DrawerEmits = typeof drawerEmits;
