import { buildProps, definePropType, isArray, isString } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export type Direction = 'top' | 'right' | 'bottom' | 'left';
export const resizeProps = buildProps({
  directions: {
    type: definePropType<Direction | Direction[]>([String, Array]),
    validator(val): val is (Direction | Direction[]) {
      if (isString(val)) {
        return ['top', 'right', 'bottom', 'left'].includes(val);
      }
      else if (isArray(val)) {
        return val.every(item => ['top', 'right', 'bottom', 'left'].includes(item));
      }
      else {
        return false;
      }
    },
  },
  size: {
    type: Number,
    default: 8,
  },
} as const);
export type ResizeProps = ExtractPropTypes<typeof resizeProps>;
