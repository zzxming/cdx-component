import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const menuProps = buildProps({} as const);
export type MenuProps = ExtractPropTypes<typeof menuProps>;

export const menuEmits = {};
export type MenuEmits = typeof menuEmits;
