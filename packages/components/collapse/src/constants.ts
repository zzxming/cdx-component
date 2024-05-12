import type { InjectionKey, Ref } from 'vue';
import { CollapseModelValueType } from './collapse';

export type CollapseContext = {
    activeNames: Ref<CollapseModelValueType[]>;
    handleItemClick: (value: CollapseModelValueType) => void;
};

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey');
