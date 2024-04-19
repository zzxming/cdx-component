import { buildProps, definePropType } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export type CheckStatusInfo = {
    success: boolean;
    message: string;
};
export enum CheckStatus {
    success = 'success',
    fail = 'fail',
    none = 'none',
}
export enum CaptchType {
    slider = 'slider',
    pointer = 'pointer',
}
export const captchaProps = buildProps({
    type: {
        type: String,
        values: ['slider', 'pointer'],
        default: CaptchType.slider,
    },
    image: {
        type: String,
        required: true,
    },
    canvasSize: {
        type: definePropType<[number, number]>(Array),
        default: () => [500, 300],
    },
    texts: {
        type: definePropType<string[]>(Array),
        validator: (v: any) =>
            Array.isArray(v) && v.every((item: any) => typeof item === 'string' && item.length === 1),
    },
    fontRate: {
        type: Number,
        default: 0.108,
        validator: (v: any) => typeof v === 'number' && v >= 0 && v <= 1,
    },
    onBeforSuccess: {
        type: definePropType<() => Promise<boolean | CheckStatusInfo> | boolean | CheckStatusInfo>(Function),
    },
    loading: {
        type: Boolean,
        default: false,
    },
    onRefresh: {
        type: definePropType<() => void | Promise<void>>(Function),
    },
    tipDuration: {
        type: Number,
        default: 3000,
    },
} as const);
export type CaptchaProps = ExtractPropTypes<typeof captchaProps>;

export const captchaEmits = {
    success: () => true,
    fail: () => true,
    imgError: () => true,
};
export type CaptchaEmits = typeof captchaEmits;
