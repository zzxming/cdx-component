import type { InjectionKey, Ref } from 'vue';

export interface ResizeInjectionContext {
  contentRef: Ref<HTMLElement | undefined>;
};

export const RESIZE_INJECTION_KEY: InjectionKey<ResizeInjectionContext> = Symbol('resize_inject');
export const resizeValidDirection = ['top', 'right', 'bottom', 'left'] as const;
export type Direction = typeof resizeValidDirection[number];
