import type { ExtractPropTypes } from 'vue';

export const overlayProps = {
    fullscreen: {
        type: Boolean,
        default: false,
    },
} as const;

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;
