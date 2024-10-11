import type { ExtractPropTypes } from 'vue';
import { buildProps, definePropType } from '@cdx-component/utils';

export const textHighlightProps = buildProps({
  texts: {
    type: definePropType<string | string[]>([Array, String]),
  },
  content: {
    type: String,
    required: true,
  },
  ignoreCase: {
    type: Boolean,
    default: false,
  },
  highlightTag: {
    type: String,
    default: 'span',
  },
  highlightClass: {
    type: String,
    default: '',
  },
} as const);

export type TextHighlightProps = ExtractPropTypes<typeof textHighlightProps>;
