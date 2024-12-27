import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const menuItemProps = buildProps({
  type: {
    values: ['item', 'break'],
    default: 'item',
  },
} as const);
export type MenuItemProps = ExtractPropTypes<typeof menuItemProps>;

export const menuItemEmits = {};
export type MenuItemEmits = typeof menuItemEmits;

export interface MenuItemSlots {
  default: () => any;
  children?: () => any;
}
