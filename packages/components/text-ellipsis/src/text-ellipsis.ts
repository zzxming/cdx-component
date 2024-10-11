import type { ExtractPropTypes } from 'vue';
import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isBoolean } from '@cdx-component/utils';

export const textEllipsisProps = buildProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    required: true,
  },
  lines: {
    type: Number,
    default: 1,
  },
  ellipsisText: {
    type: String,
    default: '...',
  },
  canExpand: {
    type: Boolean,
    default: true,
  },
  expandText: {
    type: String,
    default: '展开',
  },
  collapseText: {
    type: String,
    default: '收起',
  },
} as const);
export type TextEllipsisProps = ExtractPropTypes<typeof textEllipsisProps>;

export const textEllipsisEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export const TextEllipsisEmits = typeof textEllipsisEmits;
