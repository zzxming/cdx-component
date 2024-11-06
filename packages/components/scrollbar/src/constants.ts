import type { InjectionKey, Ref } from 'vue';

export interface ScrollbarContext {
  wrapperRef: Ref<HTMLElement | null>;
  scrollbarRef: Ref<HTMLElement | null>;
};

export const scrollbarContextKey: InjectionKey<ScrollbarContext> = Symbol('scrollbarContextKey');

export const scrollbarGap = 4;
