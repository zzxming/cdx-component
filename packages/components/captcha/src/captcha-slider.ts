import { buildProps, definePropType, isNumber } from '@cdx-component/utils';

export const captchaSliderProps = buildProps({
  target: {
    type: Number,
    default: 100,
    validator: (value: number) => value >= 0 && value <= 100,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  tolerance: {
    type: Number,
    default: 1,
    validator: (value: number) => value >= 0 && value <= 100,
  },
  onBeforeSuccess: {
    type: definePropType<() => Promise<boolean> | boolean>(Function),
  },
} as const);
export type CaptchaSliderProps = typeof captchaSliderProps;

export const captchaSliderEmits = {
  success: () => true,
  move: (value: number) => isNumber(value),
  fail: () => true,
};
export const CaptchaSliderEmits = typeof captchaSliderEmits;
