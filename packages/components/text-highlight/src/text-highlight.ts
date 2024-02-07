import { definePropType } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export const textHighlightProps = {
    texts: {
        type: definePropType<string | string[]>([Array, String]),
        default: '',
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
} as const;

export type TextHighlightProps = ExtractPropTypes<typeof textHighlightProps>;
