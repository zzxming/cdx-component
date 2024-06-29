import type { InjectionKey, Ref } from 'vue';
import type { CollapseModelValueType } from './collapse';

export interface CollapseContext {
  activeNames: Ref<CollapseModelValueType[]>;
  handleItemClick: (value: CollapseModelValueType) => void;
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey');
