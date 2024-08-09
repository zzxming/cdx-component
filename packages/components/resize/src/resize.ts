import { buildProps, definePropType } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';
import type { Direction } from './constants';
import { validDirection } from './constants';

export const resizeProps = buildProps({
  directions: {
    type: definePropType<Direction[]>(Array),
    default: () => [],
    validator: (val: Direction[]): val is Direction[] => {
      return val.every(item => validDirection.includes(item));
    },
  },
  size: {
    type: Number,
    default: 8,
  },
} as const);
export type ResizeProps = ExtractPropTypes<typeof resizeProps>;
