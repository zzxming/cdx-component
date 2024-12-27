import type { InjectionKey, Ref } from 'vue';

export interface MenuContext {
  width: Ref<string | number>;
  menuItemRef: Ref<HTMLElement | undefined>;
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('menuContextKey');
