import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isBoolean } from '@cdx-component/utils';

export const overlayProps = {
    modelValue: {
        type: Boolean,
        default: false,
    },
} as const;

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export const overlayEmits = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export type OverlayEmits = typeof overlayEmits;
