import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, definePropType, isArray } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export type CollapseModelValueType = string | number;

export const collapseProps = buildProps({
  modelValue: {
    type: definePropType<CollapseModelValueType[]>(Array),
    default: () => [],
  },
} as const);
export type CollapseProps = ExtractPropTypes<typeof collapseProps>;

export const collapseEmits = {
  [UPDATE_MODEL_EVENT]: (value: CollapseModelValueType[]) => isArray(value),
  [CHANGE_EVENT]: (value: CollapseModelValueType[]) => isArray(value),
};
export type CollapseEmits = typeof collapseEmits;
