import type { Directive, DirectiveBinding } from 'vue';
import { createLoadingInstance } from './service';
import { LOADING_INSTANCE } from './constants';
import { ElementLoading } from './types';

const bindLoadingInstance = (el: ElementLoading, binding: DirectiveBinding<boolean>) => {
    el[LOADING_INSTANCE] = createLoadingInstance({
        target: el,
        text: el.getAttribute('loading-text') || undefined,
        background: el.getAttribute('loading-background') || undefined,
    });
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
        if (binding.value) {
            !el[LOADING_INSTANCE] && bindLoadingInstance(el, binding);
        } else {
            unmounLoadingInstance(el);
        }
    },
    unmounted(el) {
        unmounLoadingInstance(el);
    },
};
