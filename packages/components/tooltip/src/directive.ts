import { createApp, h, provide, ref } from 'vue';
import type { App, DirectiveBinding, ObjectDirective, Ref } from 'vue';
import { useTimeout } from '@cdx-component/hooks';
import { TOOLTIP_INJECTION_KEY, validDirection } from './constants';
import TooltipContent from './tooltip-content.vue';

export const TOOLTIP_INSTANCE_KEY = Symbol('tooltip-instance');
export const TOOLTIP_DATA_KEY = Symbol('tooltip-data');

type ValidDirection = typeof validDirection[number];
export type TooltipElement = HTMLElement & {
  [TOOLTIP_INSTANCE_KEY]?: App;
  [TOOLTIP_DATA_KEY]?: {
    text: Ref<string>;
    direction: Ref<string>;
  };
};

const isValidDirection = (direction: any): direction is ValidDirection => {
  if (validDirection.includes(direction)) {
    return true;
  }
  return false;
};
const createTooltip = (el: TooltipElement, binding: DirectiveBinding<string>) => {
  const isVisiable = ref(false);
  const text = ref(binding.value);
  const direction = ref<ValidDirection>(isValidDirection(binding.arg) ? binding.arg : 'top');
  const { startTimeout, clearTimeout } = useTimeout();
  const open = () => {
    clearTimeout();
    isVisiable.value = true;
  };
  const close = () => {
    clearTimeout();
    startTimeout(() => {
      isVisiable.value = false;
    }, 200);
  };

  const tooltipContentInstance = createApp({
    setup() {
      const triggerRef = ref<HTMLElement>(el);

      provide(TOOLTIP_INJECTION_KEY, {
        triggerRef,
        isVisiable,
        open,
        close,
      });

      return () => {
        return h(TooltipContent, { direction: direction.value }, { default: () => text.value });
      };
    },
  });
  tooltipContentInstance.mount(document.createElement('div'));
  el[TOOLTIP_INSTANCE_KEY] = tooltipContentInstance;
  el[TOOLTIP_DATA_KEY] = {
    text,
    direction,
  };
  el.addEventListener('mouseenter', open);
  el.addEventListener('mouseleave', close);
};
const updateTooltip = (el: TooltipElement, binding: DirectiveBinding<string>) => {
  const data = el[TOOLTIP_DATA_KEY]!;
  data.text.value = binding.value;
  data.direction.value = isValidDirection(binding.arg) ? binding.arg! : 'top';
};

export const vTooltipDirective: ObjectDirective<TooltipElement> = {
  beforeMount(el, binding) {
    createTooltip(el, binding);
  },
  updated(el, binding) {
    updateTooltip(el, binding);
  },
  unmounted(el) {
    const instance = el[TOOLTIP_INSTANCE_KEY]!;
    instance.unmount();
    delete el[TOOLTIP_INSTANCE_KEY];
  },
};
