import { buildProps } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const loadingProps = buildProps({
    text: {
        type: String,
    },
    fullscreen: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: false,
    },
} as const);
export type LoadingProps = ExtractPropTypes<typeof loadingProps>;
