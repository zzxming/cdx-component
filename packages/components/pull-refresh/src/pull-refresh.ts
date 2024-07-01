import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { buildProps, isBoolean } from '@cdx-component/utils';
import type { ExtractPropTypes } from 'vue';

export enum PullRefreshStatus {
  pulling = 'pulling',
  loading = 'loading',
  loosing = 'loosing',
  none = 'none',
}

export const pullRefreshProps = buildProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  headHeight: {
    type: [Number, String],
    default: 50,
  },
  refreshDistance: {
    type: [Number, String],
  },
  bodyLock: {
    type: Boolean,
    default: true,
  },
} as const);
export type PullRefreshProps = ExtractPropTypes<typeof pullRefreshProps>;

export const pullRefreshEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
  refresh: () => true,
};
export type PullRefreshEmits = typeof pullRefreshEmits;
