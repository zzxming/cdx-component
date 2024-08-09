import type { InjectionKey, Ref } from 'vue';

export interface TooltipInjectionContext {
  isVisiable: Ref<boolean>;
  triggerRef: Ref<HTMLElement | undefined>;
  open: () => void;
  close: () => void;
};

export const TOOLTIP_INJECTION_KEY: InjectionKey<TooltipInjectionContext> = Symbol('tooltip_inject');
export const tooltipValidDirection = ['top', 'right', 'bottom', 'left'] as const;
