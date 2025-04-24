import type { ExtractPropTypes } from 'vue';
import { buildProps } from '@cdx-component/utils';

export const textConvertProps = buildProps({} as const);
export type TextConvertProps = ExtractPropTypes<typeof textConvertProps>;

export const textConvertEmits = {};
export type TextConvertEmits = typeof textConvertEmits;
