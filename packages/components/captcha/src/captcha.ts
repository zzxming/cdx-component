import { definePropType, isBoolean } from '@cdx-component/utils';
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
export const captchaProps = {
    image: {
        type: String,
        required: true,
    },
    canvasSize: {
        type: definePropType<[number, number]>(Array),
        default: () => [500, 300],
    },
    texts: {
        type: definePropType<string>(Array),
        required: true,
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
    refresh: {
        type: definePropType<() => any | Promise<any>>(Function),
    },
    tipDuration: {
        type: Number,
        default: 3000,
    },
} as const;
export type CaptchaProps = ExtractPropTypes<typeof captchaProps>;

export const captchaEmits = {
    'update:loading': (value: boolean) => isBoolean(value),
    success: () => true,
    fail: () => true,
    error: () => true,
};
export type CaptchaEmits = typeof captchaEmits;