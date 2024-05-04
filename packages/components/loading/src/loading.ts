import { buildProps } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

let HTMLElement: any;
if (typeof window !== 'undefined') {
    HTMLElement = window.HTMLElement;
}
export const loadingProps = buildProps({
    text: {
        type: String,
    },
    background: {
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
    target: {
        type: [String, HTMLElement],
    },
    lock: {
        type: Boolean,
        default: true,
    },
} as const);
export type LoadingProps = ExtractPropTypes<typeof loadingProps>;
