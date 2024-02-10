import type { ExtractPropTypes } from 'vue';

export const overlayProps = {
    fullscreen: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: false,
    },
} as const;

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export const overlayEmits = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};
export type OverlayEmits = typeof overlayEmits;
