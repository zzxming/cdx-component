import type { ExtractPropTypes } from 'vue';
import type { CollapseModelValueType } from './collapse';
import { buildProps, definePropType, isBoolean } from '@cdx-component/utils';

export const collapseItemProps = buildProps({
  name: {
    type: definePropType<CollapseModelValueType>([String, Number]),
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
  expend: {
    type: Boolean,
    default: true,
  },
} as const);
export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>;

export const collapseItemEmits = {
  'update:expend': (value: boolean) => isBoolean(value),
};
export type CollapseItemEmits = typeof collapseItemEmits;
