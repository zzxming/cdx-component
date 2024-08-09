import type { InjectionKey, Ref } from 'vue';

export interface ResizeInjectionContext {
  contentRef: Ref<HTMLElement | undefined>;
};
export type Direction = 'top' | 'right' | 'bottom' | 'left';

export const RESIZE_INJECTION_KEY: InjectionKey<ResizeInjectionContext> = Symbol('resize_inject');
export const validDirection = ['top', 'right', 'bottom', 'left'] as const;
