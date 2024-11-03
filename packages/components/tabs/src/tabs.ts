import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, definePropType, isArray } from '@cdx-component/utils';

export interface TabItem {
  label: string;
  value: string | number;
}

export const tabsProps = buildProps({
  modelValue: {
    type: [String, Number],
    default: false,
  },
  tabs: {
    required: true,
    type: definePropType<TabItem[]>(Array),
    validator(val: any[]) {
      if (!isArray(val)) {
        return false;
      }
      return val.every(item => item.value !== undefined);
    },
  },
  router: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
} as const);
export type TabsProps = ExtractPropTypes<typeof tabsProps>;

export const tabsEmits = {
  [UPDATE_MODEL_EVENT]: (value: string | number) => value,
};
export type TabsEmits = typeof tabsEmits;
