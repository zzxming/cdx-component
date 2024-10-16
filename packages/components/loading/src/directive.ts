import type { Directive, DirectiveBinding } from 'vue';
import type { ElementLoading } from './types';
import { LOADING_INSTANCE } from './constants';
import { createLoadingInstance } from './service';

const bindLoadingInstance = (el: ElementLoading, _binding: DirectiveBinding<boolean>) => {
  el[LOADING_INSTANCE] = createLoadingInstance({
    text: el.getAttribute('loading-text') || undefined,
    background: el.getAttribute('loading-background') || undefined,
  }, el);
};
const unmounLoadingInstance = (el: ElementLoading) => {
  if (el[LOADING_INSTANCE]?.instance) {
    el[LOADING_INSTANCE].close();
    delete el[LOADING_INSTANCE];
  }
};
export const vLoading: Directive<ElementLoading, boolean> = {
  mounted(el, binding) {
    if (binding.value) {
      bindLoadingInstance(el, binding);
    }
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    if (binding.value) {
      !el[LOADING_INSTANCE] && bindLoadingInstance(el, binding);
    }
    else {
      unmounLoadingInstance(el);
    }
  },
  unmounted(el) {
    unmounLoadingInstance(el);
  },
};
