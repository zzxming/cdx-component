import { UPDATE_MODEL_EVENT } from '@cdx-component/constants';
import { isBoolean } from '@cdx-component/utils';
import { ExtractPropTypes } from 'vue';

export interface DrawerProps
    extends ExtractPropTypes<{
        modelValue: boolean;
        direction?: 'left' | 'right' | 'top' | 'bottom';
        fullscreen?: boolean;
        slide?: boolean;
        clickModelCose?: boolean;
        breakBoundart?: number;
        size?: number | string;
        bodySlide?: boolean;
    }> {}

export const drawerEmits = {
    [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
};
export type DrawerEmits = typeof drawerEmits;
