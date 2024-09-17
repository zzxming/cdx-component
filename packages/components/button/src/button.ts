import { buildProps, useSizeProp } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const buttonTypes = [
  'primary',
  'success',
  'warning',
  'info',
  'danger',
  '',
] as const;
export const buttonProps = buildProps({
  type: {
    type: String,
    values: buttonTypes,
    default: '',
  },
  size: useSizeProp,
  round: Boolean,
  plain: Boolean,
  disabled: Boolean,
  loading: Boolean,
  color: String,
  dark: Boolean,
} as const);
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
